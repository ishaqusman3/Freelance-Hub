// // import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
// // import { db } from '../firebase/firebaseConfig';

// // // Fetch proposals for a freelancer
// // export const getProposalsByFreelancer = async (freelancerId) => {
// //   const proposalsRef = collection(db, 'proposals');
// //   const q = query(proposalsRef, where('freelancerId', '==', freelancerId));
// //   const proposalSnap = await getDocs(q);
// //   return proposalSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // };
// // /**
// //  * Submit a proposal for a job.
// //  * @param {object} proposal - Proposal data.
// //  */
// // export const createProposal = async (proposal) => {
// //   const proposalsRef = collection(db, 'proposals');
// //   await addDoc(proposalsRef, proposal);
// // };
// import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
// import { db } from '../firebase/firebaseConfig';

// /**
//  * Fetch proposals for a freelancer.
//  * @param {string} freelancerId - The freelancer's ID.
//  * @returns {Array} - List of proposals.
//  */
// export const getProposalsByFreelancer = async (freelancerId) => {
//   const proposalsRef = collection(db, 'proposals');
//   const q = query(proposalsRef, where('freelancerId', '==', freelancerId));
//   const proposalSnap = await getDocs(q);
//   return proposalSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// };

// /**
//  * Submit a proposal for a job.
//  * @param {object} proposal - Proposal data.
//  * @returns {string} - The document ID of the new proposal.
//  */
// export const createProposal = async (proposal) => {
//   const proposalsRef = collection(db, 'proposals');
//   const proposalDoc = await addDoc(proposalsRef, proposal);
//   return proposalDoc.id;
// };

// /**
//  * Fetch proposals for a specific job.
//  * @param {string} jobId - The job's ID.
//  * @returns {Array} - List of proposals.
//  */
// // export const getProposalsByJob = async (jobId) => {
// //   const proposalsRef = collection(db, 'proposals');
// //   const q = query(proposalsRef, where('jobId', '==', jobId));
// //   const proposalSnap = await getDocs(q);
// //   return proposalSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// // };
// export const getProposalsByJob = async (jobId) => {
//   console.log("Fetching proposals for jobId:", jobId); // Debugging log
//   const proposalsRef = collection(db, 'proposals');
//   const q = query(proposalsRef, where('jobId', '==', jobId));
//   const proposalSnap = await getDocs(q);
//   console.log("Proposals fetched:", proposalSnap.docs.map((doc) => doc.data())); // Debugging log
//   return proposalSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// };

// /**
//  * Accept a proposal.
//  * @param {string} proposalId - The proposal's ID.
//  */
// export const acceptProposal = async (proposalId) => {
//   const proposalRef = doc(db, 'proposals', proposalId);
//   await updateDoc(proposalRef, { status: 'accepted' });
// };

// /**
//  * Decline a proposal.
//  * @param {string} proposalId - The proposal's ID.
//  */
// export const declineProposal = async (proposalId) => {
//   const proposalRef = doc(db, 'proposals', proposalId);
//   await updateDoc(proposalRef, { status: 'declined' });
// };
import { collection, query, where, getDocs, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

/**
 * Fetch proposals for a freelancer.
 */
export const getProposalsByFreelancer = async (freelancerId) => {
  const proposalsRef = collection(db, 'proposals');
  const q = query(proposalsRef, where('freelancerId', '==', freelancerId));
  const proposalSnap = await getDocs(q);
  return proposalSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * Submit a proposal for a job.
 */
export const createProposal = async (proposal) => {
  if (!proposal.freelancerId || !proposal.jobId) {
    throw new Error('Invalid proposal data: freelancerId or jobId is missing.');
  }

  const jobRef = doc(db, 'jobs', proposal.jobId);
  const jobDoc = await getDoc(jobRef);

  if (!jobDoc.exists()) {
    throw new Error('Job does not exist.');
  }

  const jobData = jobDoc.data();

  if (!jobData.clientId) {
    throw new Error('Job is missing clientId.');
  }

  const proposalsRef = collection(db, 'proposals');
  const proposalDoc = await addDoc(proposalsRef, {
    ...proposal,
    clientId: jobData.clientId,
    submittedAt: new Date(),
  });

  return proposalDoc.id;
};

/**
 * Fetch proposals for a specific job.
 */
export const getProposalsByJob = async (jobId) => {
  const proposalsRef = collection(db, 'proposals');
  const q = query(proposalsRef, where('jobId', '==', jobId));
  const proposalSnap = await getDocs(q);
  return proposalSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * Accept a proposal.
 */
export const acceptProposal = async (proposalId) => {
  const proposalRef = doc(db, 'proposals', proposalId);
  await updateDoc(proposalRef, { status: 'accepted' });
};

/**
 * Decline a proposal.
 */
export const declineProposal = async (proposalId) => {
  const proposalRef = doc(db, 'proposals', proposalId);
  await updateDoc(proposalRef, { status: 'declined' });
};
