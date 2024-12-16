import React, { useState } from 'react';
import { FaHistory, FaSearch, FaFilter } from 'react-icons/fa';

export default function TransactionHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Mock transaction data
  const transactions = [
    { id: 1, type: 'funding', amount: 5000, date: '2023-05-01', description: 'Wallet Funding' },
    { id: 2, type: 'transfer', amount: -1000, date: '2023-05-03', description: 'Transfer to John Doe' },
    { id: 3, type: 'withdrawal', amount: -2000, date: '2023-05-05', description: 'Withdrawal to Bank Account' },
    { id: 4, type: 'escrow', amount: -1500, date: '2023-05-07', description: 'Escrow Payment for Project X' },
  ];

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesDate = (!startDate || transaction.date >= startDate) && (!endDate || transaction.date <= endDate);
    return matchesSearch && matchesType && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-4">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <FaHistory className="mr-2" /> Transaction History
          </h1>
        </div>
        <div className="p-4">
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Types</option>
                <option value="funding">Funding</option>
                <option value="transfer">Transfer</option>
                <option value="withdrawal">Withdrawal</option>
                <option value="escrow">Escrow</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span>to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b">
                    <td className="p-2">{transaction.date}</td>
                    <td className="p-2">{transaction.description}</td>
                    <td className={`p-2 text-right ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₦{Math.abs(transaction.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}