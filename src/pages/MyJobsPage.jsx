// // import React, { useEffect, useState } from 'react';
// // import { getJobsByClient } from '../services/jobService'; // Import service function
// // import { useAuth } from '../context/FirebaseAuthContext';

// // const MyJobsPage = () => {
// //   const { currentUser } = useAuth();
// //   const [jobs, setJobs] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     const fetchJobs = async () => {
// //       try {
// //         if (!currentUser) return;

// //         // Fetch jobs posted by the logged-in client
// //         const fetchedJobs = await getJobsByClient(currentUser.uid);
// //         setJobs(fetchedJobs);
// //       } catch (err) {
// //         setError('Failed to fetch jobs');
// //         console.error(err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchJobs();
// //   }, [currentUser]);

// //   if (loading) return <div className="text-center mt-8">Loading...</div>;
// //   if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

// //   return (
// //     <div className="container mx-auto px-4 py-8">
// //       <h2 className="text-3xl font-bold mb-6">My Jobs</h2>
      
// //       {jobs.length === 0 ? (
// //         <p>No jobs found. Start by posting a job!</p>
// //       ) : (
// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
// //           {jobs.map((job) => (
// //             <div key={job.id} className="bg-white p-4 rounded-lg shadow-md">
// //               <h3 className="text-xl font-semibold">{job.title}</h3>
// //               <p className="text-gray-700">{job.description}</p>
// //               <p className="text-sm text-gray-500">Budget: ${job.budget}</p>
// //               <p className="text-sm text-gray-500">Deadline: {job.deadline}</p>
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default MyJobsPage;
// import React, { useEffect, useState } from "react";
// import { getJobsByClient } from "../services/jobService";
// import { getProposalsByJob, acceptProposal, declineProposal } from "../services/proposalService"; // Add these in services
// import { useAuth } from "../context/FirebaseAuthContext";

// const MyJobsPage = () => {
//   const { currentUser } = useAuth();
//   const [jobs, setJobs] = useState([]);
//   const [proposals, setProposals] = useState({});
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

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
//                           <strong>Freelancer:</strong> {proposal.freelancerName}
//                         </p>
//                         <p>
//                           <strong>Status:</strong> {proposal.status}
//                         </p>
//                         <div className="mt-2">
//                           {proposal.status === "pending" && (
//                             <>
//                               <button
//                                 className="bg-green-500 text-white px-4 py-2 rounded mr-2"
//                                 onClick={() =>
//                                   handleAcceptProposal(proposal.id)
//                                 }
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
import { useAuth } from "../context/FirebaseAuthContext";

const MyJobsPage = () => {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [proposals, setProposals] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
                      <div key={proposal.id} className="bg-gray-100 p-3 rounded mb-2">
                        <p>
                          <strong>Freelancer:</strong> {proposal.freelancerName || 'Unknown'}
                        </p>
                        <p>
                          <strong>Status:</strong> {proposal.status}
                        </p>
                        <p>
                          <strong>Submitted At:</strong>{' '}
                          {proposal.submittedAt
                            ? new Date(proposal.submittedAt.seconds * 1000).toLocaleString()
                            : 'Unknown'}
                        </p>
                        <div className="mt-2 flex gap-2">
                          {proposal.status === 'pending' && (
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
