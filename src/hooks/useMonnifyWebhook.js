import { useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { doc, updateDoc, increment, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
<<<<<<< HEAD
=======
import { showNotification } from '../utils/notification';
>>>>>>> 1c2342d (wallet and review fixed)

export const useMonnifyWebhook = () => {
  const handlePaymentWebhook = async (webhookData) => {
    const {
      transactionReference,
      paymentReference,
      amountPaid,
      paidOn,
      paymentStatus,
      paymentDescription,
      transactionHash,
      currency,
      paymentMethod,
<<<<<<< HEAD
      customer: { email, name }
    } = webhookData;

    try {
      // 1. Verify the transaction hash (implement verification logic)
      // const isValidHash = verifyTransactionHash(transactionHash);
      // if (!isValidHash) throw new Error('Invalid transaction hash');

      if (paymentStatus === 'PAID') {
        // 2. Get the payment intent to find the user
        const paymentIntentsRef = collection(db, 'paymentIntents');
        const q = query(paymentIntentsRef, where('reference', '==', paymentReference));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          throw new Error('Payment intent not found');
        }

        const paymentIntent = querySnapshot.docs[0].data();
        const userId = paymentIntent.userId;

        // 3. Update user's wallet balance
=======
      customer: { email }
    } = webhookData;

    try {
      if (paymentStatus === 'PAID') {
        // Get user by email
        const usersRef = collection(db, 'users');
        const userQuery = query(usersRef, where('email', '==', email));
        const userSnapshot = await getDocs(userQuery);
        
        if (userSnapshot.empty) {
          throw new Error('User not found');
        }

        const userId = userSnapshot.docs[0].id;

        // Update wallet balance
>>>>>>> 1c2342d (wallet and review fixed)
        const walletRef = doc(db, 'wallets', userId);
        await updateDoc(walletRef, {
          balance: increment(amountPaid),
          updatedAt: serverTimestamp()
        });

<<<<<<< HEAD
        // 4. Record the transaction
=======
        // Record transaction
>>>>>>> 1c2342d (wallet and review fixed)
        await addDoc(collection(db, 'transactions'), {
          userId,
          type: 'deposit',
          amount: amountPaid,
          currency,
          paymentMethod,
          reference: paymentReference,
          status: 'completed',
<<<<<<< HEAD
          description: paymentDescription,
          paidAt: new Date(paidOn),
          createdAt: serverTimestamp()
        });

        // 5. Update payment intent status
        await updateDoc(doc(paymentIntentsRef, querySnapshot.docs[0].id), {
          status: 'completed',
          completedAt: serverTimestamp()
        });

=======
          description: paymentDescription || 'Wallet funding',
          createdAt: serverTimestamp()
        });

        showNotification.success('Payment successful');
>>>>>>> 1c2342d (wallet and review fixed)
        return true;
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
<<<<<<< HEAD
=======
      showNotification.error('Failed to process payment');
>>>>>>> 1c2342d (wallet and review fixed)
      throw error;
    }
  };

  return { handlePaymentWebhook };
};
