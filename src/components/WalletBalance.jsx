import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/FirebaseAuthContext';
import { getWalletBalance, createWallet } from '../services/walletService';

const WalletBalance = () => {
  const { currentUser } = useAuth();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        // Try to get wallet balance, if wallet doesn't exist, create one
        try {
          const walletBalance = await getWalletBalance(currentUser.uid);
          setBalance(walletBalance);
        } catch (error) {
          if (error.message === 'Wallet not found') {
            // Create wallet if it doesn't exist
            await createWallet(currentUser.uid);
            const walletBalance = await getWalletBalance(currentUser.uid);
            setBalance(walletBalance);
          } else {
            throw error;
          }
        }
      } catch (err) {
        setError(err.message);
        console.error('Error getting wallet balance:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [currentUser]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="text-white">
      <span className="font-semibold">Balance:</span> ₦{balance.toLocaleString()}
    </div>
  );
};

export default WalletBalance;