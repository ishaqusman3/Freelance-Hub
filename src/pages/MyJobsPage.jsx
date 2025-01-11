import React, { useEffect, useState } from 'react';
import { getJobsByClient } from '../services/jobService';
import { getProposalsByJob, acceptProposal } from '../services/proposalService';
import { getOrCreateChat } from '../services/messageService';
import { useAuth } from '../context/FirebaseAuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaTasks } from 'react-icons/fa';
import Loader from '../components/Loader';
import { showNotification } from '../utils/notification';
import { formatDistanceToNow } from 'date-fns';

const MyJobsPage = () => {
  const { currentUser, userData } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [proposals, setProposals] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        if (!currentUser) return;

        const clientJobs = await getJobsByClient(currentUser.uid);
        const sortedJobs = clientJobs.sort((a, b) => 
          (b.postedAt?.seconds || 0) - (a.postedAt?.seconds || 0)
        );
        setJobs(sortedJobs);
      } catch (err) {
        setError('Failed to fetch jobs.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentUser]);

  const handleViewProposals = async (jobId) => {
    try {
      const jobProposals = await getProposalsByJob(jobId);
      setProposals((prev) => ({ ...prev, [jobId]: jobProposals }));
      setSelectedJob(jobId);
    } catch (err) {
      console.error('Error fetching proposals:', err);
    }
  };

  const handleAwardProposal = async (proposalId, jobId) => {
    try {
      await acceptProposal(proposalId, jobId);
      await handleViewProposals(jobId); // Refresh proposals list
      showNotification.success('Job awarded successfully');
    } catch (err) {
      console.error('Error awarding proposal:', err);
      showNotification.error('Failed to award job');
    }
  };

  const handleChatWithFreelancer = async (freelancerId, freelancerName) => {
    try {
      if (!currentUser || !userData) {
        alert('You need to be logged in to start a chat.');
        return;
      }

      const chatId = await getOrCreateChat({
        clientId: currentUser.uid,
        freelancerId: freelancerId,
        clientName: userData.fullName || 'Unknown Client',
        freelancerName: freelancerName || 'Unknown Freelancer'
      });

      if (chatId) {
        navigate(`/chat/${chatId}`);
      } else {
        throw new Error('Failed to create or get chat');
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      alert('Failed to start chat. Please try again.');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U'; // Default to 'U' for "Unknown"
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
    return initials;
  };

  if (loading) return <Loader loading={loading} />;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">My Jobs</h2>

      {jobs.length === 0 ? (
        <p className="text-center text-gray-600">No jobs posted yet.</p>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">{job.title}</h3>
              <p className="text-gray-600 mb-4">{job.description}</p>
              <div className="flex items-center space-x-6 mb-4">
                <div className="flex items-center">
                  <FaMoneyBillWave className="text-green-500 mr-2" />
                  <span className="font-semibold">₦{job.budget}</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="text-blue-500 mr-2" />
                  <span>{job.deadline}</span>
                </div>
              </div>
              <div className="text-gray-600 text-sm mb-4">
                Posted {formatDistanceToNow(job.postedAt?.toDate() || new Date(), { addSuffix: true })}
              </div>
              <div className="flex space-x-4">
                <button
                  className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition duration-300"
                  onClick={() => handleViewProposals(job.id)}
                >
                  View Proposals
                </button>
                {proposals[job.id]?.some((proposal) => proposal.status === 'accepted') && (
                  <Link
                    to={`/jobs/${job.id}/milestones`}
                    className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition duration-300 inline-flex items-center"
                  >
                    <FaTasks className="mr-2" />
                    View Milestones
                  </Link>
                )}
              </div>

              {selectedJob === job.id && proposals[job.id] && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-indigo-600 mb-4">Proposals</h4>
                  {proposals[job.id].length === 0 ? (
                    <p className="text-gray-600">No proposals yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {proposals[job.id].map((proposal) => (
                        <div
                          key={proposal.id}
                          className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center mb-4">
                            {proposal.freelancerProfilePicture ? (
                              <img
                                src={proposal.freelancerProfilePicture}
                                alt={`${proposal.freelancerName}'s Profile`}
                                className="w-12 h-12 rounded-full mr-4 border-2 border-gray-300"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-purple-500 text-white flex items-center justify-center rounded-full text-lg font-bold mr-4">
                                {getInitials(proposal.freelancerName)}
                              </div>
                            )}
                            <div>
                              <h5 className="font-semibold">{proposal.freelancerName}</h5>
                              <div className="flex items-center text-sm text-gray-500">
                                <FaMapMarkerAlt className="mr-1" />
                                <span>
                                  {proposal.freelancerLocation || 'Location not specified'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <FaMoneyBillWave className="text-green-500 mr-2" />
                              <span className="font-semibold">
                                ₦{proposal.proposedAmount || 'N/A'}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <FaClock className="text-blue-500 mr-2" />
                              <span>
                                {proposal.completionDate
                                  ? new Date(proposal.completionDate.seconds * 1000).toLocaleDateString()
                                  : 'No completion date provided'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center mb-4">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span>
                              {proposal.freelancerRating
                                ? `${proposal.freelancerRating.toFixed(1)} / 5.0`
                                : 'No ratings yet'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              Status: <span className="font-semibold">{proposal.status}</span>
                            </span>
                            <div className="space-x-2">
                              {proposal.status === 'pending' && (
                                <button
                                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                                  onClick={() => handleAwardProposal(proposal.id, job.id)}
                                >
                                  Award
                                </button>
                              )}
                              <button
                                className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition duration-300"
                                onClick={() =>
                                  handleChatWithFreelancer(
                                    proposal.freelancerId,
                                    proposal.freelancerName
                                  )
                                }
                              >
                                Chat
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobsPage;
