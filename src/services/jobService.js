// import { db } from '../firebase/firebaseConfig';
// import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';

// // Create a new job
// export const createJob = async (jobData) => {
//   const jobRef = collection(db, 'jobs');
//   const jobDoc = await addDoc(jobRef, jobData);
//   return jobDoc.id; // Return the document ID of the new job
// };

// // Get all jobs
// export const getAllJobs = async () => {
//   const jobRef = collection(db, 'jobs');
//   const jobSnapshot = await getDocs(jobRef);
//   return jobSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// };

// // Delete a job
// export const deleteJob = async (jobId) => {
//   const jobRef = doc(db, 'jobs', jobId);
//   await deleteDoc(jobRef);
// };

// import { db } from '../firebase/firebaseConfig';
// import { collection, addDoc, getDocs, doc, deleteDoc, getDoc, query, where } from 'firebase/firestore';

// /**
//  * Create a new job in Firestore.
//  * @param {object} jobData - The job data to store.
//  * @returns {string} - The document ID of the new job.
//  */
// export const createJob = async (jobData) => {
//   const jobRef = collection(db, 'jobs');
//   const jobDoc = await addDoc(jobRef, jobData);
//   return jobDoc.id; // Return the document ID of the new job
// };

// /**
//  * Get all jobs from Firestore.
//  * @returns {array} - An array of all job documents.
//  */
// export const getAllJobs = async () => {
//   const jobRef = collection(db, 'jobs');
//   const jobSnapshot = await getDocs(jobRef);
//   return jobSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// };

// /**
//  * Delete a job from Firestore.
//  * @param {string} jobId - The ID of the job to delete.
//  */
// export const deleteJob = async (jobId) => {
//   const jobRef = doc(db, 'jobs', jobId);
//   await deleteDoc(jobRef);
// };

// /**
//  * Fetch jobs posted by a specific client.
//  * @param {string} clientId - The ID of the client.
//  * @returns {array} - An array of jobs posted by the client.
//  */
// export const getJobsByClient = async (clientId) => {
//   const jobsRef = collection(db, 'jobs');
//   const q = query(jobsRef, where('clientId', '==', clientId));
//   const jobSnapshot = await getDocs(q);
//   return jobSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// };

// /**
//  * Fetch a job by its ID.
//  * @param {string} jobId - The ID of the job to fetch.
//  * @returns {object} - The job data.
//  */
// export const getJobById = async (jobId) => {
//   const jobRef = doc(db, 'jobs', jobId);
//   const jobDoc = await getDoc(jobRef);
//   if (!jobDoc.exists()) {
//     throw new Error('Job not found');
//   }
//   return { id: jobDoc.id, ...jobDoc.data() };
// };
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, getDocs, doc, deleteDoc, getDoc, query, where } from 'firebase/firestore';

/**
 * Create a new job in Firestore.
 * @param {object} jobData - The job data to store.
 * @returns {string} - The document ID of the new job.
 */
export const createJob = async (jobData) => {
  const jobRef = collection(db, 'jobs');
  const jobDoc = await addDoc(jobRef, jobData);
  return jobDoc.id; // Return the document ID of the new job
};

/**
 * Get all jobs from Firestore.
 * @returns {array} - An array of all job documents.
 */
export const getAllJobs = async () => {
  const jobRef = collection(db, 'jobs');
  const jobSnapshot = await getDocs(jobRef);
  return jobSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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
