// import React, { useEffect, useState } from "react";
// import { getJobsByClient } from "../services/jobService";
// import { getProposalsByJob, acceptProposal, declineProposal } from "../services/proposalService";
// import { useAuth } from "../context/FirebaseAuthContext";
// import { useNavigate } from "react-router-dom";

// const MyJobsPage = () => {
//   const { currentUser } = useAuth();
//   const [jobs, setJobs] = useState([]);
//   const [proposals, setProposals] = useState({});
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         if (!currentUser) return;

//         const clientJobs = await getJobsByClient(currentUser.uid);
//         setJobs(clientJobs);
//       } catch (err) {
//         setError("Failed to fetch jobs.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobs();
//   }, [currentUser]);

//   const handleViewProposals = async (jobId) => {
//     try {
//       const jobProposals = await getProposalsByJob(jobId);
//       setProposals((prev) => ({ ...prev, [jobId]: jobProposals }));
//       setSelectedJob(jobId);
//     } catch (err) {
//       console.error("Error fetching proposals:", err);
//     }
//   };

//   const handleAcceptProposal = async (proposalId) => {
//     try {
//       await acceptProposal(proposalId);
//       alert("Proposal accepted!");
//       handleViewProposals(selectedJob); // Refresh proposals
//     } catch (err) {
//       console.error("Error accepting proposal:", err);
//     }
//   };

//   const handleDeclineProposal = async (proposalId) => {
//     try {
//       await declineProposal(proposalId);
//       alert("Proposal declined.");
//       handleViewProposals(selectedJob); // Refresh proposals
//     } catch (err) {
//       console.error("Error declining proposal:", err);
//     }
//   };

//   const handleChatWithFreelancer = (freelancerId, freelancerName) => {
//     const chatId = `${currentUser.uid}_${freelancerId}`; // Generate a unique chat ID
//     navigate(`/chat/${chatId}`, { state: { freelancerId, freelancerName } }); // Navigate to the DirectMessagingPage
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-3xl font-bold mb-6">My Jobs</h2>

//       {jobs.length === 0 ? (
//         <p>No jobs posted yet.</p>
//       ) : (
//         <div>
//           {jobs.map((job) => (
//             <div key={job.id} className="mb-4 bg-white p-4 rounded shadow">
//               <h3 className="text-xl font-semibold">{job.title}</h3>
//               <p>{job.description}</p>
//               <button
//                 className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
//                 onClick={() => handleViewProposals(job.id)}
//               >
//                 View Proposals
//               </button>

//               {/* Display Proposals for Selected Job */}
//               {selectedJob === job.id && proposals[job.id] && (
//                 <div className="mt-4">
//                   <h4 className="text-lg font-semibold">Proposals</h4>
//                   {proposals[job.id].length === 0 ? (
//                     <p>No proposals yet.</p>
//                   ) : (
//                     proposals[job.id].map((proposal) => (
//                       <div
//                         key={proposal.id}
//                         className="bg-gray-100 p-3 rounded mb-2"
//                       >
//                         <p>
//                           <strong>Freelancer:</strong> {proposal.freelancerName || "Unknown"}
//                         </p>
//                         <p>
//                           <strong>Status:</strong> {proposal.status}
//                         </p>
//                         <p>
//                           <strong>Submitted At:</strong>{" "}
//                           {proposal.submittedAt
//                             ? new Date(proposal.submittedAt.seconds * 1000).toLocaleString()
//                             : "Unknown"}
//                         </p>
//                         <div className="mt-2 flex gap-2">
//                           {proposal.status === "pending" && (
//                             <>
//                               <button
//                                 className="bg-green-500 text-white px-4 py-2 rounded"
//                                 onClick={() => handleAcceptProposal(proposal.id)}
//                               >
//                                 Accept
//                               </button>
//                               <button
//                                 className="bg-red-500 text-white px-4 py-2 rounded"
//                                 onClick={() => handleDeclineProposal(proposal.id)}
//                               >
//                                 Decline
//                               </button>
//                             </>
//                           )}
//                           {/* Chat Button */}
//                           <button
//                             className="bg-indigo-500 text-white px-4 py-2 rounded"
//                             onClick={() =>
//                               handleChatWithFreelancer(proposal.freelancerId, proposal.freelancerName)
//                             }
//                           >
//                             Chat
//                           </button>
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyJobsPage;
import React, { useEffect, useState } from "react";
import { getJobsByClient } from "../services/jobService";
import { getProposalsByJob, acceptProposal, declineProposal } from "../services/proposalService";
import { getOrCreateChat } from "../services/messageService"; // Import chat logic
import { useAuth } from "../context/FirebaseAuthContext";
import { useNavigate } from "react-router-dom";

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

  const handleAcceptProposal = async (proposalId) => {
    try {
      await acceptProposal(proposalId);
      alert("Proposal accepted!");
      handleViewProposals(selectedJob); // Refresh proposals
    } catch (err) {
      console.error("Error accepting proposal:", err);
    }
  };

  const handleDeclineProposal = async (proposalId) => {
    try {
      await declineProposal(proposalId);
      alert("Proposal declined.");
      handleViewProposals(selectedJob); // Refresh proposals
    } catch (err) {
      console.error("Error declining proposal:", err);
    }
  };

  const handleChatWithFreelancer = async (freelancerId, freelancerName) => {
    try {
      const chatId = await getOrCreateChat(
        currentUser.uid,
        freelancerId,
        userData.fullName, // Client's name
        freelancerName // Freelancer's name
      );
      navigate(`/chat/${chatId}`, { state: { freelancerId, freelancerName } });
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">My Jobs</h2>

      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <div>
          {jobs.map((job) => (
            <div key={job.id} className="mb-4 bg-white p-4 rounded shadow">
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p>{job.description}</p>
              <button
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => handleViewProposals(job.id)}
              >
                View Proposals
              </button>

              {/* Display Proposals for Selected Job */}
              {selectedJob === job.id && proposals[job.id] && (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold">Proposals</h4>
                  {proposals[job.id].length === 0 ? (
                    <p>No proposals yet.</p>
                  ) : (
                    proposals[job.id].map((proposal) => (
                      <div
                        key={proposal.id}
                        className="bg-gray-100 p-3 rounded mb-2"
                      >
                        <p>
                          <strong>Freelancer:</strong> {proposal.freelancerName || "Unknown"}
                        </p>
                        <p>
                          <strong>Status:</strong> {proposal.status}
                        </p>
                        <p>
                          <strong>Submitted At:</strong>{" "}
                          {proposal.submittedAt
                            ? new Date(proposal.submittedAt.seconds * 1000).toLocaleString()
                            : "Unknown"}
                        </p>
                        <div className="mt-2 flex gap-2">
                          {proposal.status === "pending" && (
                            <>
                              <button
                                className="bg-green-500 text-white px-4 py-2 rounded"
                                onClick={() => handleAcceptProposal(proposal.id)}
                              >
                                Accept
                              </button>
                              <button
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={() => handleDeclineProposal(proposal.id)}
                              >
                                Decline
                              </button>
                            </>
                          )}
                          {/* Chat Button */}
                          <button
                            className="bg-indigo-500 text-white px-4 py-2 rounded"
                            onClick={() =>
                              handleChatWithFreelancer(proposal.freelancerId, proposal.freelancerName)
                            }
                          >
                            Chat
                          </button>
                        </div>
                      </div>
                    ))
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
