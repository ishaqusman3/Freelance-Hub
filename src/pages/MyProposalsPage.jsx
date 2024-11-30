// import React, { useEffect, useState } from 'react';
// import { getProposalsByFreelancer } from '../services/proposalService'; // Import service function
// import { useAuth } from '../context/FirebaseAuthContext';

// const MyProposalsPage = () => {
//   const { currentUser } = useAuth();
//   const [proposals, setProposals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProposals = async () => {
//       try {
//         if (!currentUser) return;

//         // Fetch proposals submitted by the logged-in freelancer
//         const fetchedProposals = await getProposalsByFreelancer(currentUser.uid);
//         setProposals(fetchedProposals);
//       } catch (err) {
//         setError('Failed to fetch proposals');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProposals();
//   }, [currentUser]);

//   if (loading) return <div className="text-center mt-8">Loading...</div>;
//   if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h2 className="text-3xl font-bold mb-6">My Proposals</h2>
      
//       {proposals.length === 0 ? (
//         <p>No proposals found. Start by applying for jobs!</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {proposals.map((proposal) => (
//             <div key={proposal.id} className="bg-white p-4 rounded-lg shadow-md">
//               <h3 className="text-xl font-semibold">{proposal.jobTitle}</h3>
//               <p className="text-gray-700">Status: {proposal.status}</p>
//               <p className="text-sm text-gray-500">
//                 Submitted on: {new Date(proposal.submittedAt?.seconds * 1000).toLocaleDateString()}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyProposalsPage;

import React, { useEffect, useState } from 'react';
import { getProposalsByFreelancer } from '../services/proposalService'; // Import service function
import { getAllJobs } from '../services/jobService'; // Import job details
import { useAuth } from '../context/FirebaseAuthContext';

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

        // Fetch proposals submitted by the logged-in freelancer
        const fetchedProposals = await getProposalsByFreelancer(currentUser.uid);

        // Fetch job details for proposals
        const allJobs = await getAllJobs();
        const jobMap = allJobs.reduce((acc, job) => {
          acc[job.id] = job; // Map jobId to job details
          return acc;
        }, {});

        setJobs(jobMap); // Save jobs in state
        setProposals(fetchedProposals); // Save proposals in state
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
            const job = jobs[proposal.jobId]; // Find job details by jobId

            return (
              <div
                key={proposal.id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition"
              >
                <h3 className="text-xl font-bold text-gray-800">{job?.title || 'Job Title'}</h3>
                <p className="text-gray-700 mt-2">{job?.description || 'Job description not available.'}</p>
                <p className="text-gray-800 mt-4">
                  <span className="font-semibold">Budget:</span> ${job?.budget || 'N/A'}
                </p>
                <p className="text-gray-800">
                  <span className="font-semibold">Client:</span> {job?.clientName || 'N/A'}
                </p>
                <p className="text-gray-700 mt-4">
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
                <p className="text-sm text-gray-500 mt-2">
                  Submitted on:{' '}
                  {proposal.submittedAt
                    ? new Date(proposal.submittedAt.seconds * 1000).toLocaleDateString()
                    : 'Unknown'}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyProposalsPage;
