import { db } from '../firebase/firebaseConfig';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  addDoc,
  increment,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { completeJob } from './jobService';
import { createActivity } from './activityService';
/**
 * Create milestones for a job.
 */
export const createMilestones = async (jobId, milestones) => {
  const milestonesRef = collection(db, `jobs/${jobId}/milestones`);

  const milestonePromises = milestones.map((milestone) => {
    const milestoneData = {
      ...milestone,
      status: 'pending',
      isPaid: false,
    };
    return addDoc(milestonesRef, milestoneData);
  });

  await Promise.all(milestonePromises);
};
/**
 * Fetch milestones for a specific job.
 * @param {string} jobId - The ID of the job.
 * @returns {Promise<Array>} - List of milestones.
 */
export const getMilestones = async (jobId) => {
  try {
    const milestonesRef = collection(db, `jobs/${jobId}/milestones`);
    const snapshot = await getDocs(milestonesRef);

    // Return empty array instead of throwing error when no milestones exist
    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching milestones:', error);
    throw error;
  }
};

/**
 * Update a milestone's status or other fields.
 * @param {string} jobId - The ID of the job.
 * @param {string} milestoneId - The ID of the milestone.
 * @param {Object} updateData - Data to update (e.g., { status: "completed" }).
 */
export const updateMilestone = async (jobId, milestoneId, updateData) => {
  const milestoneRef = doc(db, `jobs/${jobId}/milestones/${milestoneId}`);
  await updateDoc(milestoneRef, updateData);
};

/**
 * Pay a milestone.
 * @param {string} jobId - The ID of the job.
 * @param {string} milestoneId - The ID of the milestone.
 * @param {string} clientId - The ID of the client.
 * @param {string} freelancerId - The ID of the freelancer.
 * @param {number} paymentAmount - The payment amount for the milestone.
 */
export const payMilestone = async (jobId, milestoneId, clientId, freelancerId, paymentAmount) => {
  try {
    const clientWalletRef = doc(db, 'wallets', clientId);
    const freelancerWalletRef = doc(db, 'wallets', freelancerId);
    const milestoneRef = doc(db, `jobs/${jobId}/milestones/${milestoneId}`);

    await runTransaction(db, async (transaction) => {
      // Get current wallet states
      const clientWallet = await transaction.get(clientWalletRef);
      const freelancerWallet = await transaction.get(freelancerWalletRef);
      const milestone = await transaction.get(milestoneRef);

      if (!clientWallet.exists()) throw new Error('Client wallet not found');
      if (!freelancerWallet.exists()) throw new Error('Freelancer wallet not found');
      if (!milestone.exists()) throw new Error('Milestone not found');

      const clientBalance = clientWallet.data().balance;
      if (clientBalance < paymentAmount) {
        throw new Error('Insufficient balance');
      }

      // Update balances
      transaction.update(clientWalletRef, {
        balance: increment(-paymentAmount),
        updatedAt: serverTimestamp()
      });

      transaction.update(freelancerWalletRef, {
        balance: increment(paymentAmount),
        totalEarnings: increment(paymentAmount),
        updatedAt: serverTimestamp()
      });

      // Mark milestone as paid
      transaction.update(milestoneRef, {
        isPaid: true,
        paidAt: serverTimestamp(),
        status: 'completed'
      });

      // Record transaction
      const transactionRef = doc(collection(db, 'transactions'));
      transaction.set(transactionRef, {
        type: 'milestone_payment',
        fromUserId: clientId,
        toUserId: freelancerId,
        amount: paymentAmount,
        jobId,
        milestoneId,
        status: 'completed',
        createdAt: serverTimestamp(),
        description: `Milestone payment for job ${jobId}`
      });
    });

    // After successful payment, check if all milestones are completed
    await checkJobCompletion(jobId);

    return { success: true };
  } catch (error) {
    console.error('Error paying milestone:', error);
    throw error;
  }
};

/**
 * Add a new milestone to a job.
 * @param {string} jobId - The ID of the job.
 * @param {Object} milestoneData - Milestone details (name, description, dueDate, payment, etc.).
 */
export const addMilestone = async (jobId, milestoneData) => {
  const milestonesRef = collection(db, `jobs/${jobId}/milestones`);
  await addDoc(milestonesRef, milestoneData);
};

export const checkJobCompletion = async (jobId) => {
  try {
    const milestones = await getMilestones(jobId);
    const allCompleted = milestones.every(milestone => 
      milestone.status === 'completed' && milestone.isPaid
    );

    if (allCompleted) {
      const jobRef = doc(db, 'jobs', jobId);
      const jobDoc = await getDoc(jobRef);
      
      if (!jobDoc.exists()) {
        throw new Error('Job not found');
      }

      const jobData = jobDoc.data();

      await runTransaction(db, async (transaction) => {
        // Update job status and add review fields
        transaction.update(jobRef, {
          status: 'completed',
          completedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          pendingReviews: ['client', 'freelancer'], // Track who needs to submit reviews
          reviews: {} // Will store both reviews
        });

        // Create completion activities
        const activitiesRef = collection(db, 'activities');
        
        // Client activity
        transaction.set(doc(activitiesRef), {
          userId: jobData.clientId,
          type: 'job_completed',
          text: `All milestones completed for "${jobData.title}". Please leave a review.`,
          icon: '🎉',
          timestamp: serverTimestamp(),
          jobId
        });

        // Freelancer activity
        transaction.set(doc(activitiesRef), {
          userId: jobData.freelancerId,
          type: 'job_completed',
          text: `Completed all milestones for "${jobData.title}". Please leave a review.`,
          icon: '🎉',
          timestamp: serverTimestamp(),
          jobId
        });
      });

      return true;
    }
    return false;
  } catch (error) {
    console.error('Error checking job completion:', error);
    throw error;
  }
};

// Update submitJobReview to handle transaction reads before writes
export const submitJobReview = async (jobId, reviewerId, reviewData) => {
  try {
    const jobRef = doc(db, 'jobs', jobId);
    
    await runTransaction(db, async (transaction) => {
      // Do all reads first
      const jobDoc = await transaction.get(jobRef);
      if (!jobDoc.exists()) {
        throw new Error('Job not found');
      }

      const jobData = jobDoc.data();
      const reviewerRole = reviewerId === jobData.clientId ? 'client' : 'freelancer';
      const revieweeId = reviewerId === jobData.clientId ? jobData.freelancerId : jobData.clientId;

      // Get user data for rating calculation
      const userRef = doc(db, 'users', revieweeId);
      const userDoc = await transaction.get(userRef);
      const userData = userDoc.data();

      // Calculate new rating
      const currentRating = userData.rating || 0;
      const totalReviews = userData.totalReviews || 0;
      const newRating = ((currentRating * totalReviews) + reviewData.rating) / (totalReviews + 1);

      // After all reads, perform writes
      transaction.update(jobRef, {
        [`reviews.${reviewerRole}`]: {
          rating: reviewData.rating,
          comment: reviewData.comment,
          createdAt: serverTimestamp()
        },
        pendingReviews: jobData.pendingReviews.filter(role => role !== reviewerRole)
      });

      // Update user profile
      transaction.update(userRef, {
        rating: newRating,
        totalReviews: totalReviews + 1,
        updatedAt: serverTimestamp()
      });

      // Create review activity
      const activitiesRef = collection(db, 'activities');
      transaction.set(doc(activitiesRef), {
        userId: revieweeId,
        type: 'review_received',
        text: `Received a ${reviewData.rating}-star review for "${jobData.title}"`,
        icon: '⭐',
        timestamp: serverTimestamp(),
        jobId
      });
    });

    return true;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};
