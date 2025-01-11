import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, getDocs, doc, deleteDoc, getDoc, query, where, updateDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Create a new job in Firestore.
 * @param {object} jobData - The job data to store.
 * @returns {string} - The document ID of the new job.
 */
// export const createJob = async (jobData) => {
//   const jobRef = collection(db, 'jobs');
//   const jobDoc = await addDoc(jobRef, {
//     ...jobData,
//     status: 'open',
//     createdAt: serverTimestamp(),
//     postedAt: serverTimestamp(),
//     datePosted: serverTimestamp(),
//     updatedAt: serverTimestamp()
//   });
//   return jobDoc.id;
// };
export const createJob = async (jobData) => {
  if (!Array.isArray(jobData.technologiesRequired)) {
    jobData.technologiesRequired = []; // Default to empty array if not provided
  }

  const jobRef = collection(db, 'jobs');
  const jobDoc = await addDoc(jobRef, {
    ...jobData,
    status: 'open',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return jobDoc.id;
};


/**
 * Get all jobs from Firestore.
 * @returns {array} - An array of all job documents.
 */
export const getAllJobs = async () => {
  try {
    const jobRef = collection(db, 'jobs');
    const jobSnapshot = await getDocs(jobRef);
    
    // Map through jobs and format dates
    const jobs = jobSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Fix: Handle both array and string formats for technologies
        technologiesRequired: Array.isArray(data.technologiesRequired) 
          ? data.technologiesRequired 
          : data.technologiesRequired?.split(',').map(tech => tech.trim()) || [],
        // Fix: Properly handle timestamp conversions
        createdAt: data.createdAt?.toDate(),
        postedAt: data.postedAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        assignedAt: data.assignedAt?.toDate(),
        // Ensure these fields are always present
        status: data.status || 'open',
        freelancerName: data.freelancerName || 'Not Assigned',
        freelancerId: data.freelancerId || null,
        // Ensure budget is a number
        budget: parseFloat(data.budget) || 0
      };
    });

    // Sort jobs by posted date (newest first)
    return jobs.sort((a, b) => {
      const dateA = a.postedAt || a.createdAt;
      const dateB = b.postedAt || b.createdAt;
      return (dateB || 0) - (dateA || 0);
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error; // Changed to throw error instead of returning empty array
  }
};

/**
 * Delete a job from Firestore.
 * @param {string} jobId - The ID of the job to delete.
 */
export const deleteJob = async (jobId) => {
  const jobRef = doc(db, 'jobs', jobId);
  await deleteDoc(jobRef);
};

/**
 * Fetch jobs posted by a specific client.
 * @param {string} clientId - The ID of the client.
 * @returns {array} - An array of jobs posted by the client.
 */
export const getJobsByClient = async (clientId) => {
  const jobsRef = collection(db, 'jobs');
  const q = query(jobsRef, where('clientId', '==', clientId));
  const jobSnapshot = await getDocs(q);
  return jobSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * Fetch a job by its ID.
 * @param {string} jobId - The ID of the job to fetch.
 * @returns {object} - The job data.
 */
export const getJobById = async (jobId) => {
  const jobRef = doc(db, 'jobs', jobId);
  const jobDoc = await getDoc(jobRef);
  if (!jobDoc.exists()) {
    throw new Error('Job not found');
  }
  return { id: jobDoc.id, ...jobDoc.data() };
};

/**
 * Fetch trending skills from job postings.
 * @returns {Array} - List of top trending skills.
 */
export const getTrendingSkills = async () => {
  const jobsRef = collection(db, 'jobs');
  const jobSnapshot = await getDocs(jobsRef);

  // Collect all skills from job postings
  const skillCounts = {};
  jobSnapshot.docs.forEach((doc) => {
    const job = doc.data();
    if (job.skills && Array.isArray(job.skills)) {
      job.skills.forEach((skill) => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1; // Increment skill count
      });
    }
  });

  // Sort skills by count and return the top 5
  return Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
    .slice(0, 5)
    .map(([skill]) => skill); // Extract skill names
};

/**
 * Update a job with freelancer information when proposal is accepted
 */
export const assignFreelancerToJob = async (jobId, freelancerData) => {
  try {
    if (!freelancerData.freelancerId || !freelancerData.freelancerName) {
      throw new Error('Missing freelancer information');
    }

    const jobRef = doc(db, 'jobs', jobId);
    const jobDoc = await getDoc(jobRef);
    
    if (!jobDoc.exists()) {
      throw new Error('Job not found');
    }

    await updateDoc(jobRef, {
      freelancerId: freelancerData.freelancerId,
      freelancerName: freelancerData.freelancerName,
      status: 'in_progress',
      updatedAt: serverTimestamp(),
      assignedAt: serverTimestamp(),
      contractStatus: 'active'
    });

    return true;
  } catch (error) {
    console.error('Error assigning freelancer to job:', error);
    throw error;
  }
};

