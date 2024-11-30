// // import React, { useState } from 'react';
// // import { useAuth } from '../context/FirebaseAuthContext'; // To get client details
// // import { createJob } from '../services/jobService'; // Function to add job to Firestore

// // const PostJobPage = () => {
// //   const { currentUser, userData } = useAuth(); // Get current user details
// //   const [title, setTitle] = useState('');
// //   const [description, setDescription] = useState('');
// //   const [budget, setBudget] = useState('');
// //   const [deadline, setDeadline] = useState('');
// //   const [error, setError] = useState('');
// //   const [success, setSuccess] = useState('');

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError('');
// //     setSuccess('');

// //     if (!title || !description || !budget || !deadline) {
// //       setError('All fields are required.');
// //       return;
// //     }

// //     try {
// //       // Call the jobService to create a new job
// //       await createJob({
// //         title,
// //         description,
// //         budget: parseFloat(budget),
// //         deadline,
// //         clientId: currentUser.uid,
// //         clientName: userData.fullName || 'Unknown Client', // Get client name from userData
// //       });

// //       setSuccess('Job posted successfully!');
// //       setTitle('');
// //       setDescription('');
// //       setBudget('');
// //       setDeadline('');
// //     } catch (err) {
// //       console.error('Error posting job:', err);
// //       setError('Failed to post job. Please try again.');
// //     }
// //   };

// //   return (
// //     <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
// //       <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
// //         <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">Post a Job</h2>
        
// //         {error && <p className="text-red-500 text-center mb-4">{error}</p>}
// //         {success && <p className="text-green-500 text-center mb-4">{success}</p>}

// //         <form onSubmit={handleSubmit} className="space-y-4">
// //           <div>
// //             <label className="block text-gray-700">Job Title</label>
// //             <input
// //               type="text"
// //               value={title}
// //               onChange={(e) => setTitle(e.target.value)}
// //               required
// //               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
// //               placeholder="Enter job title"
// //             />
// //           </div>

// //           <div>
// //             <label className="block text-gray-700">Description</label>
// //             <textarea
// //               value={description}
// //               onChange={(e) => setDescription(e.target.value)}
// //               required
// //               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
// //               placeholder="Enter job description"
// //             ></textarea>
// //           </div>

// //           <div>
// //             <label className="block text-gray-700">Budget</label>
// //             <input
// //               type="number"
// //               value={budget}
// //               onChange={(e) => setBudget(e.target.value)}
// //               required
// //               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
// //               placeholder="Enter budget (e.g., 1000)"
// //             />
// //           </div>

// //           <div>
// //             <label className="block text-gray-700">Deadline</label>
// //             <input
// //               type="date"
// //               value={deadline}
// //               onChange={(e) => setDeadline(e.target.value)}
// //               required
// //               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
// //             />
// //           </div>

// //           <button
// //             type="submit"
// //             className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
// //           >
// //             Post Job
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default PostJobPage;
// import { useAuth } from '../context/FirebaseAuthContext';
// import { createJob } from '../services/jobService';
// import { FaBriefcase, FaFileAlt, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa';

// export default function PostJobPage() {
//   const { currentUser, userData } = useAuth();
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     budget: '',
//     deadline: ''
//   });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccess('');

//     if (!formData.title || !formData.description || !formData.budget || !formData.deadline) {
//       setError('All fields are required.');
//       return;
//     }

//     try {
//       await createJob({
//         ...formData,
//         budget: parseFloat(formData.budget),
//         clientId: currentUser.uid,
//         clientName: userData.fullName || 'Unknown Client',
//       });

//       setSuccess('Job posted successfully!');
//       setFormData({ title: '', description: '', budget: '', deadline: '' });
//     } catch (err) {
//       console.error('Error posting job:', err);
//       setError('Failed to post job. Please try again.');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-purple-700 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Post a New Job</h2>
//         </div>
        
//         {error && <p className="text-red-500 text-center mb-4 bg-red-100 p-2 rounded">{error}</p>}
//         {success && <p className="text-green-500 text-center mb-4 bg-green-100 p-2 rounded">{success}</p>}

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="rounded-md shadow-sm -space-y-px">
//             <div className="relative">
//               <label htmlFor="title" className="sr-only">Job Title</label>
//               <FaBriefcase className="absolute top-3 left-3 text-gray-400" />
//               <input
//                 id="title"
//                 name="title"
//                 type="text"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 placeholder="Job Title"
//                 value={formData.title}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="relative">
//               <label htmlFor="description" className="sr-only">Job Description</label>
//               <FaFileAlt className="absolute top-3 left-3 text-gray-400" />
//               <textarea
//                 id="description"
//                 name="description"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 placeholder="Job Description"
//                 rows="4"
//                 value={formData.description}
//                 onChange={handleChange}
//               ></textarea>
//             </div>
//             <div className="relative">
//               <label htmlFor="budget" className="sr-only">Budget</label>
//               <FaMoneyBillWave className="absolute top-3 left-3 text-gray-400" />
//               <input
//                 id="budget"
//                 name="budget"
//                 type="number"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 placeholder="Budget"
//                 value={formData.budget}
//                 onChange={handleChange}
//               />
//             </div>
//             <div className="relative">
//               <label htmlFor="deadline" className="sr-only">Deadline</label>
//               <FaCalendarAlt className="absolute top-3 left-3 text-gray-400" />
//               <input
//                 id="deadline"
//                 name="deadline"
//                 type="date"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 value={formData.deadline}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Post Job
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }import React, { useState } from 'react';
import React, { useState } from 'react';
import { useAuth } from '../context/FirebaseAuthContext';
import { createJob } from '../services/jobService';
import { Timestamp } from 'firebase/firestore';
import { FaBriefcase, FaFileAlt, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa';

export default function PostJobPage() {
  const { currentUser, userData } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title || !formData.description || !formData.budget || !formData.deadline) {
      setError('All fields are required.');
      return;
    }

    try {
      const jobData = {
        ...formData,
        budget: parseFloat(formData.budget),
        clientId: currentUser.uid,
        clientName: userData.fullName || 'Unknown Client',
        postedAt: Timestamp.now(), // Add the current timestamp
      };

      console.log('Submitting job:', jobData);
      await createJob(jobData);

      setSuccess('Job posted successfully!');
      setFormData({ title: '', description: '', budget: '', deadline: '' });
    } catch (err) {
      console.error('Error posting job:', err);
      setError('Failed to post job. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-purple-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Post a New Job</h2>
        </div>
        
        {error && <p className="text-red-500 text-center mb-4 bg-red-100 p-2 rounded">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4 bg-green-100 p-2 rounded">{success}</p>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Job Title */}
          <div className="relative">
            <FaBriefcase className="absolute top-3 left-3 text-gray-400" />
            <input
              name="title"
              type="text"
              required
              placeholder="Job Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full pl-10 py-2 border rounded focus:ring-indigo-500"
            />
          </div>
          {/* Job Description */}
          <div className="relative">
            <FaFileAlt className="absolute top-3 left-3 text-gray-400" />
            <textarea
              name="description"
              required
              placeholder="Job Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full pl-10 py-2 border rounded focus:ring-indigo-500"
            />
          </div>
          {/* Budget */}
          <div className="relative">
            <FaMoneyBillWave className="absolute top-3 left-3 text-gray-400" />
            <input
              name="budget"
              type="number"
              required
              placeholder="Budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full pl-10 py-2 border rounded focus:ring-indigo-500"
            />
          </div>
          {/* Deadline */}
          <div className="relative">
            <FaCalendarAlt className="absolute top-3 left-3 text-gray-400" />
            <input
              name="deadline"
              type="date"
              required
              value={formData.deadline}
              onChange={handleChange}
              className="w-full pl-10 py-2 border rounded focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
}
