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
  updateDoc 
} from 'firebase/firestore';

/**
 * Create or get a chat between two users.
 * @param {string} user1Id - The first user's ID.
 * @param {string} user2Id - The second user's ID.
 * @param {string} user1Name - The first user's name.
 * @param {string} user2Name - The second user's name.
 * @returns {string} - The chat ID.
*/
// export const getOrCreateChat = async (user1Id, user2Id, user1Name, user2Name) => {
//   const chatsRef = collection(db, 'chats');

//   // Query for existing chat
//   const chatQuery = query(chatsRef, where('participants', 'array-contains', user1Id));
//   const chatSnapshot = await getDocs(chatQuery);

//   let existingChat = null;
//   chatSnapshot.forEach((doc) => {
//     const data = doc.data();
//     if (data.participants.includes(user2Id)) {
//       existingChat = { id: doc.id, ...data };
//     }
//   });

//   // Return existing chat ID if found
//   if (existingChat) {
//     return existingChat.id;
//   }

//   // Create a new chat if no existing one is found
//   const newChatRef = doc(chatsRef);
//   const chatData = {
//     participants: [user1Id, user2Id],
//     participantNames: [user1Name, user2Name],
//     lastMessage: '',
//     lastMessageTimestamp: serverTimestamp(),
//   };
//   await setDoc(newChatRef, chatData);

//   return newChatRef.id;
// };
// export const getOrCreateChat = async (user1Id, user2Id, user1Name, user2Name) => {
//   const chatsRef = collection(db, 'chats');
  
//   // Query for an existing chat between the two users
//   const chatQuery = query(
//     chatsRef,
//     where('participants', 'array-contains', user1Id)
//   );
//   const chatSnapshot = await getDocs(chatQuery);

//   // Find if a chat already exists
//   let existingChat = null;
//   chatSnapshot.forEach((doc) => {
//     const data = doc.data();
//     if (data.participants.includes(user2Id)) {
//       existingChat = { id: doc.id, ...data };
//     }
//   });

//   // Return the existing chat ID if found
//   if (existingChat) {
//     return existingChat.id;
//   }

//   // Create a new chat if no existing one is found
//   const newChatRef = doc(chatsRef);
//   const chatData = {
//     participants: [user1Id, user2Id],
//     participantNames: [user1Name, user2Name],
//     lastMessage: '',
//     lastMessageTimestamp: serverTimestamp(),
//   };
//   await setDoc(newChatRef, chatData);

//   return newChatRef.id;
// };
export const getOrCreateChat = async (user1Id, user2Id, user1Name, user2Name) => {
  const chatsRef = collection(db, 'chats');

  // Query for existing chat
  const chatQuery = query(chatsRef, where('participants', 'array-contains', user1Id));
  const chatSnapshot = await getDocs(chatQuery);

  let existingChat = null;
  chatSnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.participants.includes(user2Id)) {
      existingChat = { id: doc.id, ...data };
    }
  });

  // Return existing chat ID if found
  if (existingChat) {
    return existingChat.id;
  }

  // Create a new chat if no existing one is found
  const newChatRef = doc(chatsRef); // Create a reference for the new chat
  const chatData = {
    participants: [user1Id, user2Id],
    participantNames: [user1Name, user2Name],
    lastMessage: '',
    lastMessageTimestamp: serverTimestamp(),
  };
  await setDoc(newChatRef, chatData); // Save the chat data

  return newChatRef.id;
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
