// import React, { useEffect, useState } from 'react';
// import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
// import { db } from "../firebase/firebaseConfig";
// import { useAuth } from '../context/FirebaseAuthContext';
// import { Link } from 'react-router-dom';
// import { FaUser, FaSearch } from 'react-icons/fa';

// export default function MessagesPage() {
//   const [chats, setChats] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { currentUser } = useAuth();

//   useEffect(() => {
//     const chatsRef = collection(db, "chats");
//     const q = query(
//       chatsRef,
//       where("participants", "array-contains", currentUser.uid),
//       orderBy("lastMessageTimestamp", "desc")
//     );

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const chatList = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
//       setChats(chatList);
//     });

//     return unsubscribe;
//   }, [currentUser.uid]);

//   const filteredChats = chats.filter(chat =>
//     chat.participantNames.some(name =>
//       name.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-700 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
//         <div className="bg-indigo-600 p-4">
//           <h1 className="text-2xl font-bold text-white">Messages</h1>
//         </div>
//         <div className="p-4">
//           <div className="relative mb-4">
//             <input
//               type="text"
//               placeholder="Search conversations..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//             <FaSearch className="absolute left-3 top-3 text-gray-400" />
//           </div>
//           <div className="space-y-4">
//             {filteredChats.map(chat => {
//               const otherParticipant = chat.participantNames.find(name => name !== currentUser.displayName);
//               return (
//                 <Link 
//                   key={chat.id} 
//                   to={`/chat/${chat.id}`}
//                   className="flex items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-150 ease-in-out"
//                 >
//                   <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center text-white">
//                     <FaUser />
//                   </div>
//                   <div className="ml-4 flex-1">
//                     <div className="text-sm font-medium text-gray-900">{otherParticipant}</div>
//                     <div className="text-sm text-gray-500 truncate">{chat.lastMessage}</div>
//                   </div>
//                   <div className="ml-2 text-sm text-gray-500">
//                     {chat.lastMessageTimestamp?.toDate().toLocaleString()}
//                   </div>
//                 </Link>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// import React, { useEffect, useState } from 'react';
// import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
// import { db } from "../firebase/firebaseConfig";
// import { useAuth } from '../context/FirebaseAuthContext';
// import { Link } from 'react-router-dom';
// import { FaUser, FaSearch } from 'react-icons/fa';

// export default function MessagesPage() {
//   const [chats, setChats] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { currentUser } = useAuth();

//   useEffect(() => {
//     if (!currentUser) return;

//     const chatsRef = collection(db, "chats");
//     const q = query(
//       chatsRef,
//       where("participants", "array-contains", currentUser.uid), // Fetch chats where the user is a participant
//       orderBy("lastMessageTimestamp", "desc") // Sort chats by the most recent message
//     );

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const chatList = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setChats(chatList);
//     });

//     return unsubscribe; // Cleanup on component unmount
//   }, [currentUser]);

//   const filteredChats = chats.filter(chat =>
//     chat.participantNames.some(name =>
//       name.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-700 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
//         <div className="bg-indigo-600 p-4">
//           <h1 className="text-2xl font-bold text-white">Messages</h1>
//         </div>
//         <div className="p-4">
//           <div className="relative mb-4">
//             <input
//               type="text"
//               placeholder="Search conversations..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//             <FaSearch className="absolute left-3 top-3 text-gray-400" />
//           </div>
//           <div className="space-y-4">
//             {filteredChats.map(chat => {
//               const otherParticipant = chat.participantNames.find(name => name !== currentUser.displayName);
//               return (
//                 <Link
//                   key={chat.id}
//                   to={`/chat/${chat.id}`}
//                   className="flex items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-150 ease-in-out"
//                 >
//                   <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center text-white">
//                     <FaUser />
//                   </div>
//                   <div className="ml-4 flex-1">
//                     <div className="text-sm font-medium text-gray-900">{otherParticipant}</div>
//                     <div className="text-sm text-gray-500 truncate">{chat.lastMessage}</div>
//                   </div>
//                   <div className="ml-2 text-sm text-gray-500">
//                     {chat.lastMessageTimestamp?.toDate().toLocaleString()}
//                   </div>
//                 </Link>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from '../context/FirebaseAuthContext';
import { Link } from 'react-router-dom';
import { FaUser, FaSearch } from 'react-icons/fa';

export default function MessagesPage() {
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser, userData } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const chatsRef = collection(db, "chats");
    const q = query(
      chatsRef,
      where("participants", "array-contains", currentUser.uid), // Fetch chats where the user is a participant
      orderBy("lastMessageTimestamp", "desc") // Sort chats by the most recent message
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChats(chatList);
    });

    return unsubscribe; // Cleanup on component unmount
  }, [currentUser]);

  const filteredChats = chats.filter(chat =>
    chat.participantNames.some(name =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-700 py-12 px-4 sm:px-6 lg:px-8">
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
              const otherParticipant = chat.participantNames.find(name => name !== currentUser.displayName);
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
                    <div className="text-sm font-medium text-gray-900">{otherParticipant}</div>
                    <div className="text-sm text-gray-500 truncate">{chat.lastMessage}</div>
                  </div>
                  <div className="ml-2 text-sm text-gray-500">
                    {chat.lastMessageTimestamp?.toDate().toLocaleString()}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
