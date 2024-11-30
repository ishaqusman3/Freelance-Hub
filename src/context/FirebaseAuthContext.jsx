// // // // src/context/FirebaseAuthContext.jsx
// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { auth, db } from '../firebase/firebaseConfig';
// import { doc, getDoc, setDoc } from 'firebase/firestore';
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signInWithPopup,
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signOut,
// } from 'firebase/auth';

// const FirebaseAuthContext = createContext();

// export const useAuth = () => useContext(FirebaseAuthContext);

// export const FirebaseAuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [userData, setUserData] = useState(null);
//   const navigate = useNavigate();

//   // Sign up function for email/password
//   const signUp = async (email, password) => {
//     return createUserWithEmailAndPassword(auth, email, password);
//   };

//   // Log in function for email/password
//   const logIn = async (email, password) => {
//     return signInWithEmailAndPassword(auth, email, password);
//   };

//   // Google sign-in function
//   const googleSignIn = async () => {
//     const provider = new GoogleAuthProvider();
//     const result = await signInWithPopup(auth, provider);
//     const user = result.user;

//     console.log('User signed in with Google:', user);

//     // Check if the user already exists in Firestore
//     const userDocRef = doc(db, 'users', user.uid);
//     const userDoc = await getDoc(userDocRef);

//     if (!userDoc.exists()) {
//       console.log('User document does not exist. Redirecting to profile completion...');

//       // Temporarily set user data with default values
//       const defaultData = {
//         fullName: user.displayName || '',
//         email: user.email,
//         role: null, // To be completed
//         location: null, // To be completed
//         skills: null, // To be completed
//       };

//       await setDoc(userDocRef, defaultData); // Save default data to Firestore
//       setUserData(defaultData);
//       navigate('/profile-completion'); // Redirect to profile completion page
//     } else {
//       console.log('User document exists:', userDoc.data());
//       setUserData(userDoc.data());
//     }

//     setCurrentUser(user);
//   };

//   // Log out function
//   const logOut = async () => {
//     await signOut(auth);
//     setCurrentUser(null);
//     setUserData(null);
//     navigate('/');
//   };

//   // Listen for authentication state changes
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         console.log('Auth state changed: user signed in', user);
//         setCurrentUser(user);

//         // Fetch Firestore user data
//         const userDocRef = doc(db, 'users', user.uid);
//         const userDoc = await getDoc(userDocRef);

//         if (userDoc.exists()) {
//           console.log('User data fetched from Firestore:', userDoc.data());
//           setUserData(userDoc.data());
//         } else {
//           console.log('User document does not exist in Firestore. Redirecting...');
//           navigate('/profile-completion');
//         }
//       } else {
//         console.log('Auth state changed: user signed out');
//         setCurrentUser(null);
//         setUserData(null);
//       }
//     });

//     return unsubscribe;
//   }, [navigate]);

//   const value = {
//     currentUser,
//     userData,
//     signUp, // Ensure signUp is included in the context value
//     logIn,
//     googleSignIn,
//     logOut,
//   };

//   return (
//     <FirebaseAuthContext.Provider value={value}>
//       {children}
//     </FirebaseAuthContext.Provider>
//   );
// };
// src/context/FirebaseAuthContext.jsx
// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { auth, db } from '../firebase/firebaseConfig';
// import { doc, getDoc, setDoc } from 'firebase/firestore';
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signInWithPopup,
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signOut,
// } from 'firebase/auth';

// const FirebaseAuthContext = createContext();

// export const useAuth = () => useContext(FirebaseAuthContext);

// export const FirebaseAuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [userData, setUserData] = useState(null);
//   const navigate = useNavigate();

//   // Sign up function for email/password
//   // const signUp = async (email, password, fullName) => {
//   //   const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//   //   const user = userCredential.user;

//   //   // Save the user to Firestore with additional profile data
//   //   const userDocRef = doc(db, 'users', user.uid);
//   //   const userData = {
//   //     fullName,
//   //     email: user.email,
//   //     role: null,
//   //     location: null,
//   //     skills: null,
//   //     createdAt: new Date(),
//   //   };
//   //   await setDoc(userDocRef, userData);
//   //   setUserData(userData);
//   //   setCurrentUser(user);
//   // };
//   const signUp = async (email, password, fullName) => {
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;
  
//     // Save the user to Firestore with additional profile data
//     const userDocRef = doc(db, 'users', user.uid);
//     const userData = {
//       fullName,
//       email: user.email,
//       role: null,
//       location: null,
//       skills: null,
//       createdAt: new Date(),
//     };
//     await setDoc(userDocRef, userData); // Save the user data to Firestore
//     setUserData(userData); // Update local state
//     setCurrentUser(user); // Update current user
//   };
  
//   // Log in function for email/password
//   // const logIn = async (email, password) => {
//   //   return signInWithEmailAndPassword(auth, email, password);
//   // };
//   const logIn = async (email, password) => {
//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;
  
//     // Fetch user data from Firestore
//     const userDocRef = doc(db, 'users', user.uid);
//     const userDoc = await getDoc(userDocRef);
  
//     if (userDoc.exists()) {
//       setUserData(userDoc.data());
//       setCurrentUser(user);
//     } else {
//       console.log('User document does not exist in Firestore. Redirecting...');
//       navigate('/profile-completion');
//     }
//   };
  
//   // Google sign-in function
//   // const googleSignIn = async () => {
//   //   const provider = new GoogleAuthProvider();
//   //   const result = await signInWithPopup(auth, provider);
//   //   const user = result.user;

//   //   console.log('User signed in with Google:', user);

//   //   // Check if the user already exists in Firestore
//   //   const userDocRef = doc(db, 'users', user.uid);
//   //   const userDoc = await getDoc(userDocRef);

//   //   if (!userDoc.exists()) {
//   //     console.log('User document does not exist. Redirecting to profile completion...');

//   //     // Temporarily set user data with default values
//   //     const defaultData = {
//   //       fullName: user.displayName || '',
//   //       email: user.email,
//   //       role: null, // To be completed
//   //       location: null, // To be completed
//   //       skills: null, // To be completed
//   //       createdAt: new Date(),
//   //     };

//   //     await setDoc(userDocRef, defaultData); // Save default data to Firestore
//   //     setUserData(defaultData);
//   //     navigate('/profile-completion'); // Redirect to profile completion page
//   //   } else {
//   //     console.log('User document exists:', userDoc.data());
//   //     setUserData(userDoc.data());
//   //   }

//   //   setCurrentUser(user);
//   // };

//   // Log out function
//   const logOut = async () => {
//     await signOut(auth);
//     setCurrentUser(null);
//     setUserData(null);
//     navigate('/');
//   };
//   const googleSignIn = async () => {
//   const provider = new GoogleAuthProvider();
//   const result = await signInWithPopup(auth, provider);
//   const user = result.user;

//   console.log('User signed in with Google:', user);

//   // Check if the user already exists in Firestore
//   const userDocRef = doc(db, 'users', user.uid);
//   const userDoc = await getDoc(userDocRef);

//   if (!userDoc.exists()) {
//     console.log('User document does not exist. Redirecting to profile completion...');

//     // Temporarily set user data with default values
//     const defaultData = {
//       fullName: user.displayName || '',
//       email: user.email,
//       role: null, // To be completed
//       location: null, // To be completed
//       skills: null, // To be completed
//       createdAt: new Date(),
//     };

//     await setDoc(userDocRef, defaultData); // Save default data to Firestore
//     setUserData(defaultData);
//     navigate('/profile-completion'); // Redirect to profile completion page
//   } else {
//     console.log('User document exists:', userDoc.data());
//     setUserData(userDoc.data());
//   }

//   setCurrentUser(user);
// };

//   // Listen for authentication state changes
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         console.log('Auth state changed: user signed in', user);
//         setCurrentUser(user);

//         // Fetch Firestore user data
//         const userDocRef = doc(db, 'users', user.uid);
//         const userDoc = await getDoc(userDocRef);

//         if (userDoc.exists()) {
//           console.log('User data fetched from Firestore:', userDoc.data());
//           setUserData(userDoc.data());
//         } else {
//           console.log('User document does not exist in Firestore. Redirecting...');
//           navigate('/profile-completion');
//         }
//       } else {
//         console.log('Auth state changed: user signed out');
//         setCurrentUser(null);
//         setUserData(null);
//       }
//     });

//     return unsubscribe;
//   }, [navigate]);

//   const value = {
//     currentUser,
//     userData,
//     signUp,
//     logIn,
//     googleSignIn,
//     logOut,
//   };

//   return (
//     <FirebaseAuthContext.Provider value={value}>
//       {children}
//     </FirebaseAuthContext.Provider>
//   );
// };
// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { auth, db } from '../firebase/firebaseConfig';
// import { doc, getDoc, setDoc } from 'firebase/firestore';
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signInWithPopup,
//   GoogleAuthProvider,
//   onAuthStateChanged,
//   signOut,
// } from 'firebase/auth';

// const FirebaseAuthContext = createContext();

// export const useAuth = () => useContext(FirebaseAuthContext);

// export const FirebaseAuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [userData, setUserData] = useState(null);
//   const navigate = useNavigate();

//   // Sign up function for email/password
//   const signUp = async (email, password, fullName) => {
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;

//     // Add user data to Firestore
//     const userDocRef = doc(db, 'users', user.uid);
//     const userData = {
//       fullName, // Save fullName during sign-up
//       email: user.email,
//       role: null,
//       location: null,
//       skills: null,
//       createdAt: new Date(),
//     };

//     await setDoc(userDocRef, userData);
//     setUserData(userData);
//     setCurrentUser(user);
//   };

//   // Log in function for email/password
//   const logIn = async (email, password) => {
//     return signInWithEmailAndPassword(auth, email, password);
//   };

//   // Google sign-in function
//   const googleSignIn = async () => {
//     const provider = new GoogleAuthProvider();
//     const result = await signInWithPopup(auth, provider);
//     const user = result.user;

//     // Fetch or create user document in Firestore
//     const userDocRef = doc(db, 'users', user.uid);
//     const userDoc = await getDoc(userDocRef);

//     if (!userDoc.exists()) {
//       const userData = {
//         fullName: user.displayName || '', // Use Google displayName
//         email: user.email,
//         role: null,
//         location: null,
//         skills: null,
//         createdAt: new Date(),
//       };

//       await setDoc(userDocRef, userData);
//       setUserData(userData);
//       navigate('/profile-completion'); // Redirect for first-time users
//     } else {
//       setUserData(userDoc.data());
//     }

//     setCurrentUser(user);
//   };

//   // Log out function
//   const logOut = async () => {
//     await signOut(auth);
//     setCurrentUser(null);
//     setUserData(null);
//     navigate('/');
//   };

//   // Listen for authentication state changes
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         setCurrentUser(user);

//         // Fetch user data from Firestore
//         const userDocRef = doc(db, 'users', user.uid);
//         const userDoc = await getDoc(userDocRef);

//         if (userDoc.exists()) {
//           setUserData(userDoc.data());
//         } else {
//           navigate('/profile-completion');
//         }
//       } else {
//         setCurrentUser(null);
//         setUserData(null);
//       }
//     });

//     return unsubscribe;
//   }, [navigate]);

//   const value = {
//     currentUser,
//     userData,
//     signUp,
//     logIn,
//     googleSignIn,
//     logOut,
//   };

//   return <FirebaseAuthContext.Provider value={value}>{children}</FirebaseAuthContext.Provider>;
// };
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';

const FirebaseAuthContext = createContext();

export const useAuth = () => useContext(FirebaseAuthContext);

export const FirebaseAuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Sign up function for email/password
  // const signUp = async (email, password, fullName) => {
  //   try {
  //     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  //     const user = userCredential.user;

  //     // Add user data to Firestore
  //     const userDocRef = doc(db, 'users', user.uid);
  //     const userData = {
  //       fullName, // Save fullName from the input
  //       email: user.email,
  //       role: null, // Default values for new users
  //       location: null,
  //       skills: null,
  //       createdAt: new Date(),
  //     };

  //     await setDoc(userDocRef, userData); // Write user data to Firestore
  //     setUserData(userData);
  //     setCurrentUser(user);
  //   } catch (error) {
  //     console.error('Error during sign-up:', error);
  //     throw error; // Propagate the error for error handling in the UI
  //   }
  // };
//   const signUp = async (email, password, fullName) => {
//   try {
//     if (!fullName || fullName.trim() === '') {
//       throw new Error('Full name is required.');
//     }

//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;

//     // Add user data to Firestore
//     const userDocRef = doc(db, 'users', user.uid);
//     const userData = {
//       fullName: fullName.trim(), // Ensure fullName is not undefined
//       email: user.email,
//       role: null, // Default values for new users
//       location: null,
//       skills: null,
//       createdAt: new Date(),
//     };

//     await setDoc(userDocRef, userData); // Write user data to Firestore
//     setUserData(userData);
//     setCurrentUser(user);
//   } catch (error) {
//     console.error('Error during sign-up:', error);
//     throw error; // Propagate the error for error handling in the UI
//   }
// };
const signUp = async (email, password, fullName) => {
  if (!fullName) {
    throw new Error('Full name is required.');
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Save user data to Firestore
  const userDocRef = doc(db, 'users', user.uid);
  const userData = {
    fullName,
    email,
    role: null, // Default role, can be updated later
    location: null, // Default location, can be updated later
    skills: '', // Default skills, only for freelancers
  };

  await setDoc(userDocRef, userData); // Save data to Firestore

  return userCredential;
};


  // Log in function for email/password
  const logIn = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google sign-in function
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Fetch or create user document in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      const userData = {
        fullName: user.displayName || '', // Use Google displayName
        email: user.email,
        role: null,
        location: null,
        skills: null,
        createdAt: new Date(),
      };

      await setDoc(userDocRef, userData); // Save Google user data to Firestore
      setUserData(userData);
      navigate('/profile-completion'); // Redirect for incomplete profiles
    } else {
      setUserData(userDoc.data());
    }

    setCurrentUser(user);
  };

  // Log out function
  const logOut = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserData(null);
    navigate('/');
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('Auth state changed: user signed in', user);
        setCurrentUser(user);

        // Fetch user data from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          console.log('User data fetched from Firestore:', data);
          setUserData(data);
        } else {
          console.log('User document does not exist in Firestore. Redirecting...');
          navigate('/profile-completion');
        }
      } else {
        console.log('Auth state changed: user signed out');
        setCurrentUser(null);
        setUserData(null);
      }
    });

    return unsubscribe;
  }, [navigate]);

  const value = {
    currentUser,
    userData,
    signUp,
    logIn,
    googleSignIn,
    logOut,
  };

  return <FirebaseAuthContext.Provider value={value}>{children}</FirebaseAuthContext.Provider>;
};
