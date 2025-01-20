import React, { useEffect, useState, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from '../context/FirebaseAuthContext';
<<<<<<< HEAD
import { FaPaperPlane, FaMoneyBillWave, FaTasks } from 'react-icons/fa';
import { useParams, Link } from 'react-router-dom';
import Loader from '../components/Loader';
import { showNotification } from '../utils/notification';
=======
import { FaPaperPlane, FaMoneyBillWave, FaTasks, FaPaperclip } from 'react-icons/fa';
import { useParams, Link } from 'react-router-dom';
import Loader from '../components/Loader';
import { showNotification } from '../utils/notification';
import { uploadFile } from '../services/messageService';
>>>>>>> 1c2342d (wallet and review fixed)

export default function DirectMessagingPage() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [jobId, setJobId] = useState(null);
  const { currentUser, userData } = useAuth();
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
=======
  const fileInputRef = useRef(null);
>>>>>>> 1c2342d (wallet and review fixed)

  useEffect(() => {
    if (!chatId) return;

    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch the job ID associated with this chat
    const fetchJobId = async () => {
      const chatDoc = await getDoc(doc(db, "chats", chatId));
      if (chatDoc.exists()) {
        setJobId(chatDoc.data().jobId);
      }
    };
    fetchJobId();

    return unsubscribe;
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    try {
      const senderName = userData?.fullName || currentUser.displayName || 'Anonymous';
      
      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: newMessage,
        senderId: currentUser.uid,
        senderName: senderName,
        timestamp: serverTimestamp(),
      });
      
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      showNotification.error('Failed to send message');
    }
  };

  const handlePayFreelancer = () => {
    setShowPaymentModal(true);
  };

  const confirmPayment = async () => {
    // TODO: Implement actual payment logic
    console.log(`Payment of ₦${paymentAmount} to freelancer confirmed`);
    setShowPaymentModal(false);
    setPaymentAmount('');
    // You would typically update the user's wallet balance here
  };

<<<<<<< HEAD
=======
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      
      // Add file validation
      if (file.size > 10 * 1024 * 1024) {
        showNotification.error('File size must be less than 10MB');
        return;
      }

      const allowedTypes = [
        'image/',
        'application/pdf',
        'text/',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!allowedTypes.some(type => file.type.startsWith(type))) {
        showNotification.error('Invalid file type. Only images, PDFs, text, and Word documents are allowed.');
        return;
      }

      const fileUrl = await uploadFile(file, chatId);
      const senderName = userData?.fullName || currentUser.displayName || 'Anonymous';
      
      await addDoc(collection(db, "chats", chatId, "messages"), {
        fileUrl,
        fileName: file.name,
        fileType: file.type,
        senderId: currentUser.uid,
        senderName: senderName,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      showNotification.error(error.message || 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

>>>>>>> 1c2342d (wallet and review fixed)
  if (!chatId) {
    return <div className="text-center p-4">No chat selected</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gradient-to-r from-blue-600 to-purple-700">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.senderId === currentUser.uid ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                msg.senderId === currentUser.uid
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white text-gray-800'
              }`}
            >
              <div className="font-bold mb-1">{msg.senderName}</div>
<<<<<<< HEAD
              <p>{msg.text}</p>
=======
              {msg.fileUrl ? (
                <div className="message-attachment">
                  {msg.fileType.startsWith('image/') ? (
                    <img src={msg.fileUrl} alt={msg.fileName} className="max-w-full rounded-lg mb-2" />
                  ) : (
                    <a 
                      href={msg.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-200 hover:text-blue-100 underline flex items-center"
                    >
                      <FaPaperclip className="mr-2" />
                      {msg.fileName}
                    </a>
                  )}
                </div>
              ) : (
                <p>{msg.text}</p>
              )}
>>>>>>> 1c2342d (wallet and review fixed)
              <div className="text-xs mt-1 text-gray-300">
                {msg.timestamp?.toDate().toLocaleString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-white p-4 shadow-lg fixed bottom-0 left-0 right-0">
        <div className="flex justify-between items-center mb-4">
          {userData.role === 'client' && (
            <button
              onClick={handlePayFreelancer}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 flex items-center"
            >
              <FaMoneyBillWave className="mr-2" />
              Pay Freelancer (₦)
            </button>
          )}
          {jobId && (
            <Link
              to={`/jobs/${jobId}/milestones`}
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition duration-300 flex items-center"
            >
              <FaTasks className="mr-2" />
              View Milestones
            </Link>
          )}
        </div>
        <form onSubmit={sendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
<<<<<<< HEAD
=======
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <FaPaperclip />
          </button>
          <div className="text-xs text-gray-500 mt-1">
            Allowed files: Images, PDF, Text, Word docs (max 10MB)
          </div>
>>>>>>> 1c2342d (wallet and review fixed)
          <button
            type="submit"
            className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <h3 className="text-xl font-bold mb-4">Pay Freelancer</h3>
            <p className="mb-4">Enter the amount you want to pay:</p>
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
              placeholder="Enter amount"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmPayment}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && <Loader loading={loading} />}
    </div>
  );
}