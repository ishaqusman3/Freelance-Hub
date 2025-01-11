import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/FirebaseAuthContext';
import { useParams } from 'react-router-dom';
import { getMilestones, updateMilestone, payMilestone, addMilestone } from '../services/milestoneService';
import { FaCheckCircle, FaHourglassHalf, FaDollarSign, FaExclamationTriangle, FaMoneyBillWave } from 'react-icons/fa';
import { getJobById } from '../services/jobService';
import { getProposalsByJob } from '../services/proposalService';
import Loader from '../components/Loader';

const MilestonesPage = () => {
  const { jobId } = useParams();
  const { currentUser, userData } = useAuth();
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMilestones = async () => {
      if (!jobId || !currentUser) {
        setLoading(false);
        return;
      }

      try {
        // First, get the job details to check authorization
        const job = await getJobById(jobId);
        const proposals = await getProposalsByJob(jobId);
        
        // Find the accepted proposal for this job
        const acceptedProposal = proposals.find(p => p.status === 'accepted');
        
        // Check if user is authorized
        const isClient = job.clientId === currentUser.uid;
        const isFreelancer = acceptedProposal && acceptedProposal.freelancerId === currentUser.uid;
        
        if (!isClient && !isFreelancer) {
          throw new Error('Unauthorized access');
        }

        const fetchedMilestones = await getMilestones(jobId);
        setMilestones(fetchedMilestones);
      } catch (err) {
        setError(err.message || 'Failed to fetch milestones');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMilestones();
  }, [jobId, currentUser]);

  // if (loading) {
  //   return (
  //     <div className="min-h-screen">
  //       <Loader />
  //     </div>
  //   );
  // }
  const handleMarkCompleted = async (milestoneId) => {
    try {
      await updateMilestone(jobId, milestoneId, { status: 'completed' });
      setMilestones(milestones.map(m => 
        m.id === milestoneId ? { ...m, status: 'completed' } : m
      ));
    } catch (err) {
      setError('Failed to mark milestone as completed');
      console.error(err);
    }
  };

  const handlePayMilestone = async (milestoneId) => {
    try {
      await payMilestone(milestoneId);
      setMilestones(milestones.map(m => 
        m.id === milestoneId ? { ...m, isPaid: true } : m
      ));
    } catch (err) {
      setError('Failed to pay for milestone');
      console.error(err);
    }
  };
  if (loading) return <Loader loading={loading} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Milestones</h1>
      {milestones.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>No milestones have been created for this job yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Milestone {index + 1}: {milestone.name}
                </h2>
                <div className="flex items-center">
                  {milestone.status === 'completed' ? (
                    <FaCheckCircle className="text-green-500 mr-2" />
                  ) : (
                    <FaHourglassHalf className="text-yellow-500 mr-2" />
                  )}
                  <span className={`font-semibold ₦{
                    milestone.status === 'completed' ? 'text-green-500' : 'text-yellow-500'
                  }`}>
                    {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{milestone.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>Due Date: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                <span className="font-semibold">Payment: ₦{milestone.payment}</span>
              </div>
              <div className="flex justify-end space-x-4">
                {userData.role === 'freelancer' && milestone.status !== 'completed' && (
                  <button
                    onClick={() => handleMarkCompleted(milestone.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                  >
                    Mark Completed
                  </button>
                )}
                {userData.role === 'client' && milestone.status === 'completed' && !milestone.isPaid && (
                  <button
                    onClick={() => handlePayMilestone(milestone.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                  >
                    Pay Now
                  </button>
                )}
                {milestone.isPaid && (
                  <div className="flex items-center text-green-500">
                    <FaMoneyBillWave className="mr-1" />
                    <span>Paid</span>
                  </div>
                )}
              </div>
              {index < milestones.length - 1 && !milestones[index].isPaid && milestones[index + 1].status !== 'pending' && (
                <div className="mt-4 flex items-center text-yellow-500">
                  <FaExclamationTriangle className="mr-2" />
                  <span>This milestone must be paid before proceeding to the next one.</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MilestonesPage;