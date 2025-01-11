import { db } from '../firebase/firebaseConfig';
import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  query, 
  where, 
  getDocs, 
  setDoc, 
  serverTimestamp, 
  updateDoc, 
  or, 
  and,
  orderBy
} from 'firebase/firestore';

/**
 * Create or get a chat between a client and freelancer.
 * @param {string} clientId - The client's ID.
 * @param {string} freelancerId - The freelancer's ID.
 * @param {string} clientName - The client's name.
 * @param {string} freelancerName - The freelancer's name.
 * @returns {string} - The chat ID.
 */
export const getOrCreateChat = async ({ clientId, freelancerId, clientName, freelancerName }) => {
  try {
    // First, check if a chat already exists between these users
    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef,
      or(
        and(
          where('clientId', '==', clientId),
          where('freelancerId', '==', freelancerId)
        ),
        and(
          where('clientId', '==', freelancerId),
          where('freelancerId', '==', clientId)
        )
      )
    );

    const querySnapshot = await getDocs(q);

    // If chat exists, return its ID
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].id;
    }

    // If no chat exists, create a new one
    const newChat = await addDoc(chatsRef, {
      clientId,
      freelancerId,
      clientName,
      freelancerName,
      createdAt: serverTimestamp(),
      lastMessage: null,
      lastMessageTime: null
    });

    return newChat.id;
  } catch (error) {
    console.error('Error in getOrCreateChat:', error);
    throw error;
  }
};

/**
 * Send a message in a chat.
 * @param {string} chatId - The ID of the chat.
 * @param {object} messageData - The message data (text, senderId, etc.).
 */
export const sendMessage = async (chatId, messageData) => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  
  // Add the message to the messages sub-collection
  await addDoc(messagesRef, {
    ...messageData,
    timestamp: serverTimestamp(),
  });

  // Update the last message and timestamp in the chat document
  const chatRef = doc(db, 'chats', chatId);
  await updateDoc(chatRef, {
    lastMessage: messageData.text,
    lastMessageTimestamp: serverTimestamp(),
  });
};

/**
 * Get all messages in a chat.
 * @param {string} chatId - The ID of the chat.
 * @returns {Array} - The list of messages.
 */
export const getMessagesInChat = async (chatId) => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
  const messageSnapshot = await getDocs(messagesQuery);

  return messageSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
