import React, { useEffect, useState, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from '../context/FirebaseAuthContext';
import { FaPaperPlane } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

export default function DirectMessagingPage() {
  const { chatId } = useParams(); // Retrieve chatId from the URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { currentUser, userData } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe; // Cleanup on component unmount
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // const sendMessage = async (e) => {
  //   e.preventDefault();
  //   if (newMessage.trim() === '') return;

  //   await addDoc(collection(db, "chats", chatId, "messages"), {
  //     text: newMessage,
  //     senderId: currentUser.uid,
  //     senderName: currentUser.displayName || 'Anonymous',
  //     timestamp: serverTimestamp(),
  //   });

  //   setNewMessage('');
  // };
  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
  
    const senderName = userData?.fullName || currentUser.displayName || 'Anonymous';
  
    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: newMessage,
      senderId: currentUser.uid,
      senderName: senderName, // Use correct name
      timestamp: serverTimestamp(),
    });
  
    setNewMessage('');
  };
  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-blue-600 to-purple-700">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.senderId === currentUser.uid ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.senderId === currentUser.uid
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white text-gray-800'
              }`}
            >
              <div className="font-bold mb-1">{msg.senderName}</div>
              <p>{msg.text}</p>
              <div className="text-xs mt-1 text-gray-300">
                {msg.timestamp?.toDate().toLocaleString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="bg-white p-4 shadow-lg">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  );
}
