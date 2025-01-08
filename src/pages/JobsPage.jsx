import React, { useEffect, useState } from 'react';
import { getAllJobs } from '../services/jobService';
import { getProposalsByFreelancer, createProposal } from '../services/proposalService';
import { useAuth } from '../context/FirebaseAuthContext';
import { formatDistanceToNow } from 'date-fns';

const JobsPage = () => {
  const { currentUser, userData } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchJobsAndProposals = async () => {
      try {
        if (!currentUser) return;
        
        const fetchedJobs = await getAllJobs();
        const fetchedProposals = await getProposalsByFreelancer(currentUser.uid);
        
        setJobs(fetchedJobs);
        setProposals(fetchedProposals);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobsAndProposals();
  }, [currentUser]);

  const formatDate = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) {
      return 'Date not available';
    }
    try {
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const handleApply = async (jobId) => {
    try {
      if (!currentUser || !userData) {
        setError('You need to be logged in to apply for jobs.');
        return;
      }

      const proposal = {
        jobId,
        freelancerId: currentUser.uid,
        freelancerName: userData.fullName || 'Unknown Freelancer',
        status: 'pending',
        submittedAt: new Date(),
      };

      await createProposal(proposal);
      setProposals((prev) => [...prev, { jobId, ...proposal }]);
      setSuccessMessage('Proposal submitted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error applying for job:', err);
      setError('Failed to apply for the job. Please try again.');
    }
  };

  const hasAppliedForJob = (jobId) => {
    return proposals.some((proposal) => proposal.jobId === jobId);
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-purple-600 mb-6">Available Jobs</h2>

      {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

      <div className="w-full max-w-4xl space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
            <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
            <p className="text-gray-600 mt-2">{job.description}</p>
            <p className="text-gray-800 mt-4">
              <span className="font-bold">Budget:</span> ${job.budget}
            </p>
            <p className="text-gray-800">
              <span className="font-bold">Client:</span> {job.clientName}
            </p>
            <p className="text-gray-800 mt-2">
              <span className="font-bold">Deadline:</span> {job.deadline}
            </p>
            <p className="text-gray-800 mt-2">
              <span className="font-bold">Technologies Required:</span> {job.technologiesRequired?.join(', ')}
            </p>
            <div className="text-gray-600 text-sm">
              Posted {formatDate(job.postedAt || job.createdAt || job.datePosted)}
            </div>
            {hasAppliedForJob(job.id) ? (
              <button
                disabled
                className="mt-4 bg-gray-500 text-white py-2 px-4 rounded cursor-not-allowed"
              >
                Already Applied
              </button>
            ) : (
              <button
                onClick={() => handleApply(job.id)}
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
              >
                Apply
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsPage;