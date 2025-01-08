import { db } from '../firebase/firebaseConfig';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
  increment,
  query,
  where,
  getDocs,
  runTransaction,
  orderBy,
  limit
} from 'firebase/firestore';

const MONNIFY_API_KEY = import.meta.env.VITE_MONNIFY_API_KEY;
const MONNIFY_SECRET_KEY = import.meta.env.VITE_MONNIFY_SECRET_KEY;
const MONNIFY_BASE_URL = import.meta.env.VITE_MONNIFY_BASE_URL;
const MONNIFY_CONTRACT_CODE = import.meta.env.VITE_MONNIFY_CONTRACT_CODE;

/**
 * Create a new wallet for a user
 * @param {string} userId - User's ID
 * @param {string} fullName - User's full name
 * @param {string} email - User's email
 */
/** */
        
export const createWallet = async (userId, fullName, email) => {
  try {
    const walletRef = doc(db, 'wallets', userId);
    const walletSnapshot = await getDoc(walletRef);

    // Check if wallet already exists
    if (walletSnapshot.exists()) {
      console.log('Wallet already exists.');
      return walletSnapshot.data();
    }

    let monnifyAccountDetails = null;

    // Try to create Monnify account
    try {
      const token = await generateMonnifyToken();
      const accountData = await reserveMonnifyAccount(token, userId, fullName, email);

      if (accountData.requestSuccessful) {
        monnifyAccountDetails = accountData.responseBody;
      } else {
        console.error('Monnify account creation failed:', accountData);
      }
    } catch (error) {
      console.error('Monnify integration error:', error);
    }

    // Create wallet data
    const walletData = {
      userId,
      accountName: fullName,
      email,
      balance: 0,
      pendingBalance: 0,
      totalEarnings: 0,
      totalWithdrawals: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
      ...(monnifyAccountDetails && {
        monnifyAccountNumber: monnifyAccountDetails.accountNumber,
        monnifyBankName: monnifyAccountDetails.bankName,
        monnifyAccountReference: monnifyAccountDetails.accountReference,
        reservationReference: monnifyAccountDetails.reservationReference,
      }),
    };

    await setDoc(walletRef, walletData);

    // Record wallet creation transaction
    await addDoc(collection(db, 'transactions'), {
      userId,
      type: 'wallet_creation',
      status: 'completed',
      amount: 0,
      description: 'Wallet created',
      createdAt: new Date(),
    });

    return walletData;
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw new Error('Failed to create wallet');
  }
};


/**
 * Generate Monnify authentication token
 */
const generateMonnifyToken = async () => {
  try {
    if (!MONNIFY_API_KEY || !MONNIFY_SECRET_KEY || !MONNIFY_BASE_URL) {
      throw new Error('Monnify configuration missing');
    }

    const credentials = `${MONNIFY_API_KEY}:${MONNIFY_SECRET_KEY}`;
    const encodedCredentials = btoa(credentials);

    const response = await fetch(`${MONNIFY_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodedCredentials}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.responseBody.accessToken;
  } catch (error) {
    console.error('Error generating Monnify token:', error);
    throw error;
  }
};

/**
 * Reserve Monnify account
 */
const reserveMonnifyAccount = async (token, userId, fullName, email) => {
  try {
    const response = await fetch(`${MONNIFY_BASE_URL}/api/v2/bank-transfer/reserved-accounts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        accountReference: userId,
        accountName: fullName,
        customerEmail: email,
        customerName: fullName,
        currencyCode: 'NGN',
        contractCode: MONNIFY_CONTRACT_CODE,
        preferredBanks: ['035', '232'] // Wema and Sterling bank codes
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error reserving Monnify account:', error);
    throw error;
  }
};

/**
 * Initialize payment
 */
// export const initializePayment = async (amount, customerName, customerEmail) => {
//   try {
//     if (!MONNIFY_API_KEY || !MONNIFY_SECRET_KEY || !MONNIFY_BASE_URL) {
//       throw new Error('Monnify configuration missing');
//     }

//     const reference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
//     const credentials = `${MONNIFY_API_KEY}:${MONNIFY_SECRET_KEY}`;
//     const encodedCredentials = btoa(credentials);

//     const response = await fetch(`${MONNIFY_BASE_URL}/api/v1/merchant/transactions/init-transaction`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Basic ${encodedCredentials}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         amount,
//         customerName,
//         customerEmail,
//         paymentReference: reference,
//         paymentDescription: 'Wallet Funding',
//         currencyCode: 'NGN',
//         contractCode: MONNIFY_CONTRACT_CODE,
//         redirectUrl: window.location.origin + '/payment/callback',
//         paymentMethods: ['CARD', 'ACCOUNT_TRANSFER']
//       })
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();

//     // Store payment intent
//     await addDoc(collection(db, 'paymentIntents'), {
//       userId: customerEmail,
//       amount,
//       reference,
//       status: 'pending',
//       createdAt: serverTimestamp()
//     });

//     return data.responseBody;
//   } catch (error) {
//     console.error('Payment initialization failed:', error);
//     throw error;
//   }
// };
export const initializePayment = async (amount, customerName, customerEmail) => {
  try {
    const reference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const credentials = `${MONNIFY_API_KEY}:${MONNIFY_SECRET_KEY}`;
    const encodedCredentials = btoa(credentials);

    const response = await fetch(`${MONNIFY_BASE_URL}/api/v1/merchant/transactions/init-transaction`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodedCredentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        customerName,
        customerEmail,
        paymentReference: reference,
        paymentDescription: 'Wallet Funding',
        currencyCode: 'NGN',
        contractCode: MONNIFY_CONTRACT_CODE,
        redirectUrl: `${window.location.origin}/payment/callback`,
        paymentMethods: ['CARD', 'ACCOUNT_TRANSFER'],
      }),
    });

    const data = await response.json();

    if (!data.requestSuccessful) {
      throw new Error('Payment initialization failed');
    }

    // Store payment intent in Firestore
    await addDoc(collection(db, 'paymentIntents'), {
      userId: customerEmail,
      amount,
      reference,
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    return data.responseBody;
  } catch (error) {
    console.error('Error initializing payment:', error);
    throw error;
  }
};


/**
 * Get wallet balance
 * @param {string} userId - User's ID
 */
export const getWalletBalance = async (userId) => {
  try {
    const walletRef = doc(db, 'wallets', userId);
    const walletDoc = await getDoc(walletRef);

    if (!walletDoc.exists()) {
      throw new Error('Wallet not found');
    }

    return walletDoc.data().balance;
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    throw error;
  }
};

/**
 * Update wallet balance
 * @param {string} userId - User's ID
 * @param {number} amount - Amount to add/subtract
 * @param {string} type - Transaction type
 */
export const updateWalletBalance = async (userId, amount, type) => {
  try {
    const walletRef = doc(db, 'wallets', userId);
    
    await updateDoc(walletRef, {
      balance: increment(amount),
      updatedAt: new Date(),
      ...(amount > 0 ? { totalEarnings: increment(amount) } : { totalWithdrawals: increment(Math.abs(amount)) })
    });

    // Record transaction
    await addDoc(collection(db, 'transactions'), {
      userId,
      type,
      amount,
      status: 'completed',
      createdAt: new Date(),
      description: `${type} transaction`
    });
  } catch (error) {
    console.error('Error updating wallet balance:', error);
    throw error;
  }
};

// ... rest of the existing functions (transferFunds, getTransactionHistory, etc.) ...

export const verifyPayment = async (reference) => {
  try {
    const response = await fetch(
      `${MONNIFY_BASE_URL}/api/v1/merchant/transactions/query?paymentReference=${reference}`,
      {
        headers: {
          'Authorization': `Basic ${btoa(`${MONNIFY_API_KEY}:${MONNIFY_SECRET_KEY}`)}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Payment verification failed:', error);
    throw error;
  }
};

// Transfer funds between wallets
export const transferFunds = async (fromUserId, toUserId, amount, description) => {
  try {
    await runTransaction(db, async (transaction) => {
      const fromWalletRef = doc(db, 'wallets', fromUserId);
      const toWalletRef = doc(db, 'wallets', toUserId);

      const fromWallet = await transaction.get(fromWalletRef);
      const toWallet = await transaction.get(toWalletRef);

      if (!fromWallet.exists() || !toWallet.exists()) {
        throw new Error('One or both wallets not found');
      }

      if (fromWallet.data().balance < amount) {
        throw new Error('Insufficient balance');
      }

      transaction.update(fromWalletRef, {
        balance: increment(-amount),
        updatedAt: serverTimestamp()
      });

      transaction.update(toWalletRef, {
        balance: increment(amount),
        updatedAt: serverTimestamp()
      });

      // Record transaction
      const transactionRef = collection(db, 'transactions');
      transaction.set(doc(transactionRef), {
        fromUserId,
        toUserId,
        amount,
        description,
        type: 'transfer',
        status: 'completed',
        timestamp: serverTimestamp()
      });
    });

    return true;
  } catch (error) {
    console.error('Transfer failed:', error);
    throw error;
  }
};

// Get transaction history
export const getTransactionHistory = async (userId) => {
  const transactionsRef = collection(db, 'transactions');
  const q = query(
    transactionsRef,
    where('fromUserId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(50)
  );

  const receivedQuery = query(
    transactionsRef,
    where('toUserId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(50)
  );

  const [sentSnapshot, receivedSnapshot] = await Promise.all([
    getDocs(q),
    getDocs(receivedQuery)
  ]);

  return {
    sent: sentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    received: receivedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  };
};

// export const handleWithdrawal = async (userId, amount, bankDetails) => {
//   try {
//     const walletRef = doc(db, 'wallets', userId);
    
//     return await runTransaction(db, async (transaction) => {
//       const walletDoc = await transaction.get(walletRef);
      
//       if (!walletDoc.exists()) {
//         throw new Error('Wallet not found');
//       }

//       const walletData = walletDoc.data();
//       if (walletData.balance < amount) {
//         throw new Error('Insufficient balance');
//       }

//       // Initialize withdrawal with Monnify
//       const token = await generateMonnifyToken();
//       const withdrawalResponse = await fetch(`${MONNIFY_BASE_URL}/api/v2/disbursements/single`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           amount,
//           reference: `WD-${Date.now()}-${userId}`,
//           narration: bankDetails.narration || 'Withdrawal',
//           destinationBankCode: bankDetails.bankCode,
//           destinationAccountNumber: bankDetails.accountNumber,
//           currency: 'NGN',
//           sourceAccountNumber: walletData.monnifyAccountNumber
//         })
//       });

//       const withdrawalData = await withdrawalResponse.json();
      
//       if (!withdrawalData.requestSuccessful) {
//         throw new Error('Withdrawal failed');
//       }

//       // Update wallet balance
//       transaction.update(walletRef, {
//         balance: increment(-amount),
//         updatedAt: new Date()
//       });

//       // Record withdrawal transaction
//       await addDoc(collection(db, 'transactions'), {
//         userId,
//         type: 'withdrawal',
//         amount: -amount,
//         status: 'completed',
//         bankDetails: {
//           bankCode: bankDetails.bankCode,
//           accountNumber: bankDetails.accountNumber,
//           narration: bankDetails.narration
//         },
//         reference: withdrawalData.responseBody.reference,
//         createdAt: new Date()
//       });

//       return {
//         status: 'success',
//         transactionDetails: withdrawalData.responseBody
//       };
//     });
//   } catch (error) {
//     console.error('Withdrawal error:', error);
//     throw error;
//   }
// };
export const handleWithdrawal = async (userId, amount, bankDetails) => {
  try {
    const walletRef = doc(db, 'wallets', userId);

    return await runTransaction(db, async (transaction) => {
      const walletDoc = await transaction.get(walletRef);

      if (!walletDoc.exists()) {
        throw new Error('Wallet not found');
      }

      const walletData = walletDoc.data();
      if (walletData.balance < amount) {
        throw new Error('Insufficient balance');
      }

      // Initialize withdrawal with Monnify
      const token = await generateMonnifyToken();
      const withdrawalResponse = await fetch(`${MONNIFY_BASE_URL}/api/v2/disbursements/single`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          reference: `WD-${Date.now()}-${userId}`,
          narration: bankDetails.narration || 'Withdrawal',
          destinationBankCode: bankDetails.bankCode,
          destinationAccountNumber: bankDetails.accountNumber,
          currency: 'NGN',
          sourceAccountNumber: walletData.monnifyAccountNumber,
        }),
      });

      const withdrawalData = await withdrawalResponse.json();

      if (!withdrawalData.requestSuccessful) {
        throw new Error('Withdrawal failed');
      }

      // Update wallet balance
      transaction.update(walletRef, {
        balance: increment(-amount),
        updatedAt: new Date(),
      });

      // Record transaction
      await addDoc(collection(db, 'transactions'), {
        userId,
        type: 'withdrawal',
        amount: -amount,
        status: 'completed',
        bankDetails,
        reference: withdrawalData.responseBody.reference,
        createdAt: new Date(),
      });

      return {
        status: 'success',
        transactionDetails: withdrawalData.responseBody,
      };
    });
  } catch (error) {
    console.error('Error during withdrawal:', error);
    throw error;
  }
};


export const initiateWithdrawal = async (userId, amount, bankDetails) => {
  return handleWithdrawal(userId, amount, bankDetails);
};
