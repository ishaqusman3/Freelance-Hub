import { collection, query, where, getDocs, addDoc, updateDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { createMilestones } from './milestoneService';
import { assignFreelancerToJob } from './jobService';

/**
 * Fetch proposals for a freelancer.
 * @param {string} freelancerId - The freelancer's ID.
 * @returns {Array} - List of proposals.
 */
export const getProposalsByFreelancer = async (freelancerId) => {
  const proposalsRef = collection(db, 'proposals');
  const q = query(proposalsRef, where('freelancerId', '==', freelancerId));
  const proposalSnap = await getDocs(q);
  return proposalSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * Submit a proposal for a job.
 * @param {object} proposal - Proposal data.
 * @returns {string} - The document ID of the new proposal.
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
 * @param {string} jobId - The job's ID.
 * @returns {Array} - List of proposals.
 */
export const getProposalsByJob = async (jobId) => {
  const proposalsRef = collection(db, 'proposals');
  const q = query(proposalsRef, where('jobId', '==', jobId));
  const proposalSnap = await getDocs(q);
  return proposalSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

/**
 * Decline a proposal.
 * @param {string} proposalId - The proposal's ID.
 */
export const declineProposal = async (proposalId) => {
  const proposalRef = doc(db, 'proposals', proposalId);
  await updateDoc(proposalRef, { status: 'declined' });
};

/**
 * Accept a proposal and update job
 */
export const acceptProposal = async (proposalId, jobId, milestones) => {
  try {
    // Get proposal data first
    const proposalRef = doc(db, 'proposals', proposalId);
    const proposalSnap = await getDoc(proposalRef);
    
    if (!proposalSnap.exists()) {
      throw new Error('Proposal not found');
    }

    const proposalData = proposalSnap.data();

    // Get freelancer data
    const freelancerRef = doc(db, 'users', proposalData.freelancerId);
    const freelancerSnap = await getDoc(freelancerRef);
    
    if (!freelancerSnap.exists()) {
      throw new Error('Freelancer not found');
    }

    const freelancerData = freelancerSnap.data();
    const freelancerName = freelancerData.fullName || freelancerData.displayName;

    // Get job data
    const jobRef = doc(db, 'jobs', jobId);
    const jobDoc = await getDoc(jobRef);
    
    if (!jobDoc.exists()) {
      throw new Error('Job not found');
    }

    const jobData = jobDoc.data();

    // Update proposal status
    await updateDoc(proposalRef, { 
      status: 'accepted',
      acceptedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Update job with freelancer information and status
    await updateDoc(jobRef, {
      freelancerId: proposalData.freelancerId,
      freelancerName: freelancerName,
      status: 'in_progress',
      updatedAt: serverTimestamp(),
      assignedAt: serverTimestamp(),
      contractStatus: 'active'
    });

    // Update other proposals to declined
    const otherProposalsQuery = query(
      collection(db, 'proposals'),
      where('jobId', '==', jobId),
      where('status', '==', 'pending')
    );
    
    const otherProposalsSnap = await getDocs(otherProposalsQuery);
    const updatePromises = otherProposalsSnap.docs
      .filter(doc => doc.id !== proposalId) // Don't decline the accepted proposal
      .map(doc => 
        updateDoc(doc.ref, { 
          status: 'declined',
          updatedAt: serverTimestamp()
        })
      );
    
    await Promise.all(updatePromises);

    // Create contract document
    const contractRef = collection(db, 'contracts');
    await addDoc(contractRef, {
      jobId,
      clientId: jobData.clientId,
      freelancerId: proposalData.freelancerId,
      freelancerName: freelancerName,
      status: 'active',
      createdAt: serverTimestamp(),
      proposalId: proposalId,
      milestones: milestones || [],
      jobTitle: jobData.title,
      budget: jobData.budget,
      updatedAt: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error('Error accepting proposal:', error);
    throw error;
  }
};