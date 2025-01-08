import { useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { doc, updateDoc, increment, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

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
        const walletRef = doc(db, 'wallets', userId);
        await updateDoc(walletRef, {
          balance: increment(amountPaid),
          updatedAt: serverTimestamp()
        });

        // 4. Record the transaction
        await addDoc(collection(db, 'transactions'), {
          userId,
          type: 'deposit',
          amount: amountPaid,
          currency,
          paymentMethod,
          reference: paymentReference,
          status: 'completed',
          description: paymentDescription,
          paidAt: new Date(paidOn),
          createdAt: serverTimestamp()
        });

        // 5. Update payment intent status
        await updateDoc(doc(paymentIntentsRef, querySnapshot.docs[0].id), {
          status: 'completed',
          completedAt: serverTimestamp()
        });

        return true;
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
      throw error;
    }
  };

  return { handlePaymentWebhook };
};
