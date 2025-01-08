import React, { useEffect, useState } from "react";
import { getJobsByClient } from "../services/jobService";
import { getProposalsByJob, acceptProposal } from "../services/proposalService";
import { getOrCreateChat } from "../services/messageService";
import { useAuth } from "../context/FirebaseAuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaStar, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaTasks } from 'react-icons/fa';

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
        setJobs(clientJobs);
      } catch (err) {
        setError("Failed to fetch jobs.");
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
      console.error("Error fetching proposals:", err);
    }
  };

  const handleAwardProposal = async (proposalId, jobId) => {
    try {
      // Calculate milestone dates and payments based on job details
      const job = jobs.find(j => j.id === jobId);
      if (!job) {
        throw new Error('Job not found');
      }

      const totalBudget = parseFloat(job.budget);
      const deadline = new Date(job.deadline);
      
      if (isNaN(totalBudget) || !deadline) {
        throw new Error('Invalid job budget or deadline');
      }

      // Create three milestones with evenly distributed payments and dates
      const milestones = [
        {
          name: 'Project Initiation',
          description: 'Initial setup and project planning',
          payment: Math.floor(totalBudget * 0.3), // 30% of total budget
          dueDate: new Date(Date.now() + (deadline - Date.now()) * 0.3).toISOString().split('T')[0],
          status: 'pending'
        },
        {
          name: 'Development Phase',
          description: 'Main development work and implementation',
          payment: Math.floor(totalBudget * 0.4), // 40% of total budget
          dueDate: new Date(Date.now() + (deadline - Date.now()) * 0.6).toISOString().split('T')[0],
          status: 'pending'
        },
        {
          name: 'Project Completion',
          description: 'Final delivery and project handover',
          payment: Math.floor(totalBudget * 0.3), // 30% of total budget
          dueDate: deadline.toISOString().split('T')[0],
          status: 'pending'
        }
      ];

      await acceptProposal(proposalId, jobId, milestones);
      
      // Refresh the proposals list
      await handleViewProposals(jobId);
      
      alert("Proposal awarded successfully!");
    } catch (err) {
      console.error("Error awarding proposal:", err);
      alert(`Failed to award proposal: ${err.message}`);
    }
  };

  const handleChatWithFreelancer = async (freelancerId, freelancerName) => {
    try {
      const chatId = await getOrCreateChat(
        currentUser.uid,
        freelancerId,
        userData.fullName,
        freelancerName
      );
      navigate(`/chat/${chatId}`, { state: { freelancerId, freelancerName } });
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
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
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">Budget: ${job.budget}</span>
                <span className="text-sm text-gray-500">Deadline: {job.deadline}</span>
              </div>
              <div className="flex space-x-4">
                <button
                  className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition duration-300"
                  onClick={() => handleViewProposals(job.id)}
                >
                  View Proposals
                </button>
                {proposals[job.id]?.some(proposal => proposal.status === 'accepted') && (
                  <Link
                    to={`/jobs/${job.id}/milestones`}
                    className="mt-4 ml-2 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition duration-300 inline-flex items-center"
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
                            <img
                              src={proposal.freelancerProfilePicture || "/placeholder-user.jpg"}
                              alt={proposal.freelancerName}
                              className="w-12 h-12 rounded-full mr-4"
                            />
                            <div>
                              <h5 className="font-semibold">{proposal.freelancerName}</h5>
                              <div className="flex items-center text-sm text-gray-500">
                                <FaMapMarkerAlt className="mr-1" />
                                <span>{proposal.freelancerLocation || "Location not specified"}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <FaMoneyBillWave className="text-green-500 mr-2" />
                              <span className="font-semibold">${proposal.paymentAmountRequested}</span>
                            </div>
                            <div className="flex items-center">
                              <FaClock className="text-blue-500 mr-2" />
                              <span>{proposal.duration} days</span>
                            </div>
                          </div>
                          <div className="flex items-center mb-4">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span>{proposal.freelancerRating ? `${proposal.freelancerRating.toFixed(1)} / 5.0` : "No ratings yet"}</span>
                          </div>
                          <p className="text-gray-600 mb-4">{proposal.coverLetter}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              Status: <span className="font-semibold">{proposal.status}</span>
                            </span>
                            <div className="space-x-2">
                              {proposal.status === "pending" && (
                                <button
                                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                                  onClick={() => handleAwardProposal(proposal.id, job.id)}
                                >
                                  Award
                                </button>
                              )}
                              <button
                                className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition duration-300"
                                onClick={() => handleChatWithFreelancer(proposal.freelancerId, proposal.freelancerName)}
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
