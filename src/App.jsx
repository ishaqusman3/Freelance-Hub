<<<<<<< HEAD
import React, { useEffect } from 'react';
import { updateUserDocuments } from './utils/updateUsers';
import { addPostedAtToJobs } from './utils/updateJobs';
import { ToastContainer } from 'react-toastify';
import PageLayout from './components/PageLayout';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  useEffect(() => {
    // Call the function once when the app loads
    // updateUserDocuments();
    addPostedAtToJobs(); 
  }, []);

  return (
    <>
      <PageLayout>
        <div>App is running...</div>
      </PageLayout>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{
          top: '5rem',
          zIndex: 9999
        }}
      />
    </>
=======
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FirebaseAuthProvider } from './context/FirebaseAuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainApp from './main';

const App = () => {
  return (
    <Router>
      <FirebaseAuthProvider>
        <MainApp />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          style={{
            top: '5rem',
            zIndex: 9999
          }}
        />
      </FirebaseAuthProvider>
    </Router>
>>>>>>> 1c2342d (wallet and review fixed)
  );
};

export default App;
