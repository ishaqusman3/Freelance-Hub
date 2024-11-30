import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

// Send a message
export const sendMessage = async (messageData) => {
  const messageRef = collection(db, 'messages');
  await addDoc(messageRef, messageData);
};

// Get messages between two users
export const getMessagesBetweenUsers = async (user1Id, user2Id) => {
  const messageRef = collection(db, 'messages');
  const messagesQuery = query(
    messageRef,
    where('senderId', 'in', [user1Id, user2Id]),
    where('receiverId', 'in', [user1Id, user2Id])
  );
  const messageSnapshot = await getDocs(messagesQuery);
  return messageSnapshot.docs.map((doc) => doc.data());
};
