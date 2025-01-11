import React, { useState } from 'react';
import { FaExchangeAlt, FaPlusCircle } from 'react-icons/fa';
import { initiateWithdrawal } from '../services/walletService';
import { useAuth } from '../context/FirebaseAuthContext';
import Loader from '../components/Loader';
import { showNotification } from '../utils/notification';

export default function WithdrawFundsPage() {
  const { currentUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState('');

  // Mock data for bank accounts
  const bankAccounts = [
    { id: '1', name: 'Access Bank - 0123456789' },
    { id: '2', name: 'GTBank - 9876543210' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const confirmWithdrawal = async () => {
    setIsLoading(true);
    setError('');

    try {
      await initiateWithdrawal({
        amount: parseFloat(amount),
        userId: currentUser.uid,
        bankAccountId: selectedBank
      });
      
      // Show success message and reset form
      setShowConfirmation(false);
      setAmount('');
      setSelectedBank('');
      showNotification.success('Withdrawal initiated successfully');
    } catch (err) {
      setError(err.message || 'Failed to process withdrawal');
      showNotification.error(err.message || 'Failed to process withdrawal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-700 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center">
          <FaExchangeAlt className="mr-2" /> Withdraw Funds
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-gray-700 font-bold mb-2">
              Amount (₦)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter amount"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bank" className="block text-gray-700 font-bold mb-2">
              Select Bank Account
            </label>
            <select
              id="bank"
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select a bank account</option>
              {bankAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="mb-4 text-indigo-600 hover:text-indigo-800 flex items-center"
            onClick={() => {/* TODO: Implement add new bank account logic */}}
          >
            <FaPlusCircle className="mr-2" /> Add New Bank Account
          </button>
          <p className="text-sm text-gray-600 mb-4">
            Withdrawal Limit: ₦100,000 per transaction<br />
            Fee: 1% of withdrawal amount
          </p>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Withdraw'}
          </button>
        </form>

        {showConfirmation && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-xl">
              <h3 className="text-xl font-bold mb-4">Confirm Withdrawal</h3>
              <p className="mb-4">Are you sure you want to withdraw ₦{amount}?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmWithdrawal}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoading && <Loader loading={isLoading} />}
      </div>
    </div>
  );
}