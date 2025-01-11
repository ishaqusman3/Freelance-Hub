import React, { useEffect, useState } from 'react';
import { getAllJobs } from '../services/jobService';
import { getProposalsByFreelancer, createProposal } from '../services/proposalService';
import { useAuth } from '../context/FirebaseAuthContext';
import { formatDistanceToNow } from 'date-fns';
import Loader from '../components/Loader';
import { showNotification } from '../utils/notification';

const JobsPage = () => {
  const { currentUser, userData } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [proposedAmount, setProposedAmount] = useState('');
  const [proposedDeadline, setProposedDeadline] = useState('');
  const [proposalData, setProposalData] = useState({
    proposedAmount: '',
    proposedDeadline: '',
  });
  const [showFilteredJobs, setShowFilteredJobs] = useState(false);

  useEffect(() => {
    const fetchJobsAndProposals = async () => {
      setLoading(true);
      try {
        if (!currentUser) {
          setLoading(false);
          return;
        }

        const fetchedJobs = await getAllJobs();
        const fetchedProposals = await getProposalsByFreelancer(currentUser.uid);

        setJobs(fetchedJobs);
        setProposals(fetchedProposals);
      } catch (err) {
        setError(err.message);
        showNotification.error('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobsAndProposals();
  }, [currentUser]);

  const getFilteredJobs = () => {
    if (!showFilteredJobs || !userData?.skills) return jobs;
    return jobs.filter(job => 
      job.technologiesRequired?.some(tech => 
        userData.skills.includes(tech)
      )
    );
  };

  const handleApply = async (jobId) => {
    try {
      if (!currentUser || !userData) {
        showNotification.error('You need to be logged in to apply for jobs.');
        return;
      }

      if (!proposedAmount || !proposedDeadline) {
        showNotification.error('Please enter both proposed amount and completion date.');
        return;
      }

      const proposal = {
        jobId,
        freelancerId: currentUser.uid,
        freelancerName: userData.fullName || 'Unknown Freelancer',
        freelancerLocation: userData.location || 'Location not specified',
        proposedAmount: parseFloat(proposedAmount),
        completionDate: new Date(proposedDeadline),
        status: 'pending',
        submittedAt: new Date()
      };

      await createProposal(proposal);
      setProposals((prev) => [...prev, { jobId, ...proposal }]);
      showNotification.success('Proposal submitted successfully!');
      setProposedAmount('');
      setProposedDeadline('');
    } catch (err) {
      console.error('Error applying for job:', err);
      showNotification.error(err.message || 'Failed to apply for the job. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProposalData((prev) => ({ ...prev, [name]: value }));
  };

  const hasAppliedForJob = (jobId) => {
    return proposals.some((proposal) => proposal.jobId === jobId);
  };

  // if (loading) {
  //   return (
  //     <div className="min-h-screen">
  //       <Loader />
  //     </div>
  //   );
  // }
  if (loading) return <Loader loading={loading} />;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-purple-600 mb-6">Available Jobs</h2>

      <div className="mb-6">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showFilteredJobs}
            onChange={(e) => setShowFilteredJobs(e.target.checked)}
            className="form-checkbox h-5 w-5 text-purple-600"
          />
          <span className="ml-2 text-gray-700">Show jobs matching my skills</span>
        </label>
      </div>

      {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

      <div className="w-full max-w-4xl space-y-4">
        {getFilteredJobs().map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
            <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
            <p className="text-gray-600 mt-2 mb-4">{job.description}</p>
            
            <div className="mt-4">
              <p className="text-gray-800">
                <span className="font-bold">Budget:</span> ₦{job.budget}
              </p>
            </div>

            <p className="text-gray-800 mt-4">
              <span className="font-bold">Client:</span> {job.clientName}
            </p>
            <p className="text-gray-800 mt-2">
              <span className="font-bold">Deadline:</span> {job.deadline}
            </p>
            <p className="text-gray-800 mt-2">
              <span className="font-bold">Technologies Required:</span>{' '}
              {job.technologiesRequired ? 
                (Array.isArray(job.technologiesRequired) 
                  ? job.technologiesRequired.join(', ')
                  : typeof job.technologiesRequired === 'string'
                    ? job.technologiesRequired
                    : 'Not specified')
                : 'Not specified'}
            </p>
            <div className="text-gray-600 text-sm">
              Posted {formatDistanceToNow(job.postedAt || job.createdAt || job.datePosted, { addSuffix: true })}
            </div>
            {hasAppliedForJob(job.id) ? (
              <button
                disabled
                className="mt-4 bg-gray-500 text-white py-2 px-4 rounded cursor-not-allowed"
              >
                Already Applied
              </button>
            ) : (
              <div className="mt-4">
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="proposedAmount"
                    placeholder="Proposed Amount"
                    value={proposedAmount}
                    onChange={(e) => setProposedAmount(e.target.value)}
                    className="w-1/2 border rounded p-2"
                  />
                  <input
                    type="date"
                    name="proposedDeadline"
                    placeholder="Proposed Deadline"
                    value={proposedDeadline}
                    onChange={(e) => setProposedDeadline(e.target.value)}
                    className="w-1/2 border rounded p-2"
                  />
                </div>
                <button
                  onClick={() => handleApply(job.id)}
                  className="mt-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsPage;
