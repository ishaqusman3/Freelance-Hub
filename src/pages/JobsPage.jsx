// //JobsPage;
// import React, { useEffect, useState } from 'react';
// import { getAllJobs } from '../services/jobService';
// import { getProposalsByFreelancer } from '../services/proposalService';
// import { useAuth } from '../context/FirebaseAuthContext';
// import { createProposal } from '../services/proposalService';
// import { formatDistanceToNow } from 'date-fns';

// const JobsPage = () => {
//   const { currentUser } = useAuth();
//   const [jobs, setJobs] = useState([]);
//   const [proposals, setProposals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   useEffect(() => {
//     const fetchJobsAndProposals = async () => {
//       try {
//         if (!currentUser) return;

//         // Fetch all jobs and proposals
//         const jobList = await getAllJobs();
//         const freelancerProposals = await getProposalsByFreelancer(currentUser.uid);

//         // Sort jobs by `postedAt` timestamp (newest first)
//         const sortedJobs = jobList.sort((a, b) => b.postedAt.seconds - a.postedAt.seconds);

//         setJobs(sortedJobs);
//         setProposals(freelancerProposals);
//       } catch (err) {
//         console.error('Error fetching jobs or proposals:', err);
//         setError('Failed to load jobs. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobsAndProposals();
//   }, [currentUser]);

//   const handleApply = async (jobId) => {
//     try {
//       if (!currentUser) {
//         setError('You need to be logged in to apply for jobs.');
//         return;
//       }

//       // Submit a proposal for the job
//       const proposal = {
//         jobId,
//         freelancerId: currentUser.uid,
//         status: 'pending',
//         submittedAt: new Date(),
//       };
//       await createProposal(proposal);

//       // Update local proposals state to include the new proposal
//       setProposals((prev) => [...prev, { jobId }]);
//       setSuccessMessage('Proposal submitted successfully!');
//       setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
//     } catch (err) {
//       console.error('Error applying for job:', err);
//       setError('Failed to apply for the job. Please try again.');
//     }
//   };

//   const hasAppliedForJob = (jobId) => {
//     return proposals.some((proposal) => proposal.jobId === jobId);
//   };

//   if (loading) return <div className="text-center mt-8">Loading...</div>;
//   if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

//   return (
//     <div className="flex flex-col items-center min-h-screen bg-gray-100 py-8">
//       <h2 className="text-3xl font-bold text-purple-600 mb-6">Available Jobs</h2>

//       {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

//       <div className="w-full max-w-4xl space-y-4">
//         {jobs.map((job) => (
//           <div key={job.id} className="bg-white p-6 rounded-lg shadow-lg">
//             <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
//             <p className="text-gray-600 mt-2">{job.description}</p>
//             <p className="text-gray-800 mt-4">
//               <span className="font-bold">Budget:</span> ${job.budget}
//             </p>
//             <p className="text-gray-800">
//               <span className="font-bold">Client:</span> {job.clientName}
//             </p>
//             <p className="text-gray-800 mt-2">
//               <span className="font-bold">Deadline:</span> {job.deadline}
//             </p>
//             <p className="text-gray-500 mt-2">
//               Posted {formatDistanceToNow(new Date(job.postedAt.seconds * 1000))} ago
//             </p>
//             {hasAppliedForJob(job.id) ? (
//               <button
//                 disabled
//                 className="mt-4 bg-gray-500 text-white py-2 px-4 rounded cursor-not-allowed"
//               >
//                 Already Applied
//               </button>
//             ) : (
//               <button
//                 onClick={() => handleApply(job.id)}
//                 className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
//               >
//                 Apply
//               </button>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default JobsPage;
import React, { useEffect, useState } from 'react';
import { getAllJobs } from '../services/jobService';
import { getProposalsByFreelancer, createProposal } from '../services/proposalService';
import { useAuth } from '../context/FirebaseAuthContext';
import { formatDistanceToNow } from 'date-fns';

const JobsPage = () => {
  const { currentUser, userData } = useAuth(); // Ensure userData is retrieved here
  const [jobs, setJobs] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchJobsAndProposals = async () => {
      try {
        if (!currentUser) return;

        // Fetch all jobs and proposals
        const jobList = await getAllJobs();
        const freelancerProposals = await getProposalsByFreelancer(currentUser.uid);

        // Sort jobs by `postedAt` timestamp (newest first)
        const sortedJobs = jobList.sort((a, b) => b.postedAt.seconds - a.postedAt.seconds);

        setJobs(sortedJobs);
        setProposals(freelancerProposals);
      } catch (err) {
        console.error('Error fetching jobs or proposals:', err);
        setError('Failed to load jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobsAndProposals();
  }, [currentUser]);

  const handleApply = async (jobId) => {
    try {
      if (!currentUser || !userData) {
        setError('You need to be logged in to apply for jobs.');
        return;
      }

      const proposal = {
        jobId,
        freelancerId: currentUser.uid,
        freelancerName: userData.fullName || 'Unknown Freelancer', // Ensure freelancer name is included
        status: 'pending',
        submittedAt: new Date(),
      };

      await createProposal(proposal); // Save the proposal

      // Update local proposals state to include the new proposal
      setProposals((prev) => [...prev, { jobId, ...proposal }]);
      setSuccessMessage('Proposal submitted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
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
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-8">
      <h2 className="text-3xl font-bold text-purple-600 mb-6">Available Jobs</h2>

      {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

      <div className="w-full max-w-4xl space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white p-6 rounded-lg shadow-lg">
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
            <p className="text-gray-500 mt-2">
              Posted {formatDistanceToNow(new Date(job.postedAt.seconds * 1000))} ago
            </p>
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
