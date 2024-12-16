import React from 'react';
import { Link } from 'react-router-dom';
import { FaWallet, FaMoneyBillWave, FaExchangeAlt, FaHistory } from 'react-icons/fa';

export default function WalletBalance({ balance }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center">
        <FaWallet className="mr-2" /> Wallet Balance
      </h2>
      <p className="text-3xl font-bold text-gray-800 mb-6">₦{balance.toFixed(2)}</p>
      <div className="grid grid-cols-3 gap-4">
        <Link
          to="/fund-wallet"
          className="bg-green-500 text-white py-2 px-4 rounded-md flex items-center justify-center hover:bg-green-600 transition duration-300"
        >
          <FaMoneyBillWave className="mr-2" /> Fund Wallet
        </Link>
        <Link
          to="/withdraw-funds"
          className="bg-blue-500 text-white py-2 px-4 rounded-md flex items-center justify-center hover:bg-blue-600 transition duration-300"
        >
          <FaExchangeAlt className="mr-2" /> Withdraw Funds
        </Link>
        <Link
          to="/transactions"
          className="bg-purple-500 text-white py-2 px-4 rounded-md flex items-center justify-center hover:bg-purple-600 transition duration-300"
        >
          <FaHistory className="mr-2" /> View Transactions
        </Link>
      </div>
    </div>
  );
}