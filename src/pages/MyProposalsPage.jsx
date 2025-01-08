import React, { useEffect, useState } from 'react';
import { getProposalsByFreelancer } from '../services/proposalService';
import { getAllJobs } from '../services/jobService';
import { useAuth } from '../context/FirebaseAuthContext';
import { Link } from 'react-router-dom';
import { FaStar, FaMoneyBillWave, FaClock, FaTasks } from 'react-icons/fa';

const MyProposalsPage = () => {
  const { currentUser } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [jobs, setJobs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        if (!currentUser) return;

        const fetchedProposals = await getProposalsByFreelancer(currentUser.uid);
        const allJobs = await getAllJobs();
        const jobMap = allJobs.reduce((acc, job) => {
          acc[job.id] = job;
          return acc;
        }, {});

        setJobs(jobMap);
        setProposals(fetchedProposals);
      } catch (err) {
        setError('Failed to fetch proposals');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [currentUser]);

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-purple-700">My Proposals</h2>

      {proposals.length === 0 ? (
        <p className="text-center text-gray-700">No proposals found. Start by applying for jobs!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {proposals.map((proposal) => {
            const job = jobs[proposal.jobId];

            return (
              <div
                key={proposal.id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">{job?.title || 'Job Title'}</h3>
                <p className="text-gray-700 mb-4">{job?.description || 'Job description not available.'}</p>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <FaMoneyBillWave className="text-green-500 mr-2" />
                    <span className="font-semibold">${job?.budget || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="text-blue-500 mr-2" />
                    <span>{proposal.duration || 'N/A'} days</span>
                  </div>
                </div>
                <p className="text-gray-800 mb-2">
                  <span className="font-semibold">Client:</span> {job?.clientName || 'N/A'}
                </p>
                <p className="text-gray-700 mb-4">
                  <span className="font-semibold">Proposal Status:</span>{' '}
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-white ${
                      proposal.status === 'pending'
                        ? 'bg-yellow-500'
                        : proposal.status === 'accepted'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}
                  >
                    {proposal.status}
                  </span>
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Submitted on:{' '}
                  {proposal.submittedAt
                    ? new Date(proposal.submittedAt.seconds * 1000).toLocaleDateString()
                    : 'Unknown'}
                </p>
                {proposal.status === 'accepted' && (
                  <Link
                    to={`/jobs/${proposal.jobId}/milestones`}
                    className="flex items-center justify-center bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition duration-300"
                  >
                    <FaTasks className="mr-2" />
                    View Milestones
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyProposalsPage;