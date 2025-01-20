import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/FirebaseAuthContext';
import { getWalletBalance, createWallet } from '../services/walletService';

const WalletBalance = () => {
  const { currentUser } = useAuth();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
<<<<<<< HEAD

  useEffect(() => {
    const fetchBalance = async () => {
=======
  const [walletDetails, setWalletDetails] = useState(null);

  useEffect(() => {
    const fetchWalletDetails = async () => {
>>>>>>> 1c2342d (wallet and review fixed)
      if (!currentUser) return;
      
      try {
        setLoading(true);
<<<<<<< HEAD
        // Try to get wallet balance, if wallet doesn't exist, create one
=======
>>>>>>> 1c2342d (wallet and review fixed)
        try {
          const walletBalance = await getWalletBalance(currentUser.uid);
          setBalance(walletBalance);
        } catch (error) {
          if (error.message === 'Wallet not found') {
<<<<<<< HEAD
            // Create wallet if it doesn't exist
            await createWallet(currentUser.uid);
            const walletBalance = await getWalletBalance(currentUser.uid);
            setBalance(walletBalance);
=======
            const wallet = await createWallet(
              currentUser.uid,
              currentUser.displayName || 'User',
              currentUser.email
            );
            setWalletDetails(wallet);
            setBalance(wallet.balance);
>>>>>>> 1c2342d (wallet and review fixed)
          } else {
            throw error;
          }
        }
      } catch (err) {
        setError(err.message);
<<<<<<< HEAD
        console.error('Error getting wallet balance:', err);
=======
        console.error('Error fetching wallet:', err);
>>>>>>> 1c2342d (wallet and review fixed)
      } finally {
        setLoading(false);
      }
    };

<<<<<<< HEAD
    fetchBalance();
=======
    fetchWalletDetails();
>>>>>>> 1c2342d (wallet and review fixed)
  }, [currentUser]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="text-white">
<<<<<<< HEAD
      <span className="font-semibold">Balance:</span> ₦{balance.toLocaleString()}
=======
      <div className="font-semibold mb-2">Balance: ₦{balance.toLocaleString()}</div>
      {walletDetails && (
        <div className="text-sm">
          <div>Account Number: {walletDetails.accountNumber}</div>
          <div>Bank: {walletDetails.bankName}</div>
        </div>
      )}
>>>>>>> 1c2342d (wallet and review fixed)
    </div>
  );
};

export default WalletBalance;