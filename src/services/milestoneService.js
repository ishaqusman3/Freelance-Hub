import { db } from '../firebase/firebaseConfig';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  addDoc,
  increment,
} from 'firebase/firestore';
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
  const clientWalletRef = doc(db, 'wallets', clientId);
  const freelancerWalletRef = doc(db, 'wallets', freelancerId);
  const milestoneRef = doc(db, `jobs/${jobId}/milestones/${milestoneId}`);

  const clientWalletSnapshot = await getDoc(clientWalletRef);
  const freelancerWalletSnapshot = await getDoc(freelancerWalletRef);

  if (!clientWalletSnapshot.exists()) throw new Error('Client wallet not found.');
  if (!freelancerWalletSnapshot.exists()) throw new Error('Freelancer wallet not found.');

  const clientWallet = clientWalletSnapshot.data();
  if (clientWallet.balance < paymentAmount) {
    throw new Error('Insufficient balance in client wallet.');
  }

  // Update wallet balances
  await updateDoc(clientWalletRef, { balance: increment(-paymentAmount) });
  await updateDoc(freelancerWalletRef, { balance: increment(paymentAmount) });

  // Mark the milestone as paid
  await updateDoc(milestoneRef, { isPaid: true });
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
