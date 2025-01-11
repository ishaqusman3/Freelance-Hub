import React, { useState } from 'react';
import { useAuth } from '../context/FirebaseAuthContext';
import { createJob } from '../services/jobService';
import { Timestamp } from 'firebase/firestore';
import { FaBriefcase, FaFileAlt, FaMoneyBillWave, FaCalendarAlt, FaPaperclip, FaMapMarkerAlt } from 'react-icons/fa';
import Loader from '../components/Loader';
import { showNotification } from '../utils/notification';

export default function PostJobPage() {
  const { currentUser, userData } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    technologiesRequired: '',
    attachment: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, attachment: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title || !formData.description || !formData.budget || !formData.deadline || !formData.technologiesRequired) {
      showNotification.error('All fields are required.');
      return;
    }

    try {
      const jobData = {
        ...formData,
        budget: parseFloat(formData.budget),
        clientId: currentUser.uid,
        clientName: userData.fullName || 'Unknown Client',
        clientLocation: userData.location || 'Location not specified',
        postedAt: Timestamp.now(),
        technologiesRequired: formData.technologiesRequired.split(',').map(tech => tech.trim()),
      };

      await createJob(jobData);
      showNotification.success('Job posted successfully!');
      setFormData({ 
        title: '', 
        description: '', 
        budget: '', 
        deadline: '', 
        technologiesRequired: '', 
        attachment: null,
      });
    } catch (err) {
      showNotification.error(err.message || 'Failed to post job');
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
              placeholder="Budget (₦)"
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
          {/* Technologies Required */}
          <div className="relative">
            <FaFileAlt className="absolute top-3 left-3 text-gray-400" />
            <input
              name="technologiesRequired"
              type="text"
              required
              placeholder="Technologies Required (comma-separated)"
              value={formData.technologiesRequired}
              onChange={handleChange}
              className="w-full pl-10 py-2 border rounded focus:ring-indigo-500"
            />
          </div>
          {/* Attachment */}
          <div className="relative">
            <FaPaperclip className="absolute top-3 left-3 text-gray-400" />
            <input
              name="attachment"
              type="file"
              onChange={handleFileChange}
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
      {loading && <Loader loading={loading} />}
    </div>
  );
}
