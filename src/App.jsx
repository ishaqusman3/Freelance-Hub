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
  );
};

export default App;
