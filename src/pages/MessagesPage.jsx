import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from '../context/FirebaseAuthContext';
import { Link } from 'react-router-dom';
import { FaUser, FaSearch } from 'react-icons/fa';
import PageLayout from '../components/PageLayout';
import Loader from '../components/Loader';
import { showNotification } from '../utils/notification';


export default function MessagesPage() {
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser, userData } = useAuth();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);

    // Create two separate queries and merge results
    const clientChatsQuery = query(
      collection(db, "chats"),
      where("clientId", "==", currentUser.uid)
    );

    const freelancerChatsQuery = query(
      collection(db, "chats"),
      where("freelancerId", "==", currentUser.uid)
    );

    // Subscribe to both queries
    const unsubscribeClient = onSnapshot(clientChatsQuery, (clientSnapshot) => {
      const clientChats = clientSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Update state with merged and sorted chats
      setChats(current => {
        const existingFreelancerChats = current.filter(chat => 
          chat.freelancerId === currentUser.uid
        );
        const merged = [...clientChats, ...existingFreelancerChats];
        return merged.sort((a, b) => {
          const timeA = a.lastMessageTime?.toDate() || new Date(0);
          const timeB = b.lastMessageTime?.toDate() || new Date(0);
          return timeB - timeA;
        });
      });
      setLoading(false);
    });

    const unsubscribeFreelancer = onSnapshot(freelancerChatsQuery, (freelancerSnapshot) => {
      const freelancerChats = freelancerSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Update state with merged and sorted chats
      setChats(current => {
        const existingClientChats = current.filter(chat => 
          chat.clientId === currentUser.uid
        );
        const merged = [...existingClientChats, ...freelancerChats];
        return merged.sort((a, b) => {
          const timeA = a.lastMessageTime?.toDate() || new Date(0);
          const timeB = b.lastMessageTime?.toDate() || new Date(0);
          return timeB - timeA;
        });
      });
      setLoading(false);
    });

    // Cleanup function
    return () => {
      unsubscribeClient();
      unsubscribeFreelancer();
    };
  }, [currentUser]);

  const filteredChats = chats.filter(chat => {
    const otherPersonName = currentUser.uid === chat.clientId 
      ? chat.freelancerName 
      : chat.clientName;
    
    return otherPersonName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) return <Loader loading={loading} />;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-700 pt-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-4">
          <h1 className="text-2xl font-bold text-white">Messages</h1>
        </div>
        <div className="p-4">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <div className="space-y-4">
            {filteredChats.map(chat => {
              const isClient = currentUser.uid === chat.clientId;
              const otherPersonName = isClient ? chat.freelancerName : chat.clientName;
              
              return (
                <Link
                  key={chat.id}
                  to={`/chat/${chat.id}`}
                  className="flex items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-150 ease-in-out"
                >
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                    <FaUser />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {otherPersonName}
                      <span className="ml-2 text-xs text-gray-500">
                        ({isClient ? 'Freelancer' : 'Client'})
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {chat.lastMessage || 'No messages yet'}
                    </div>
                  </div>
                  <div className="ml-2 text-sm text-gray-500">
                    {chat.lastMessageTime?.toDate().toLocaleString() || 'Never'}
                  </div>
                </Link>
              );
            })}
            {filteredChats.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                {searchTerm ? 'No conversations match your search' : 'No conversations yet'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
