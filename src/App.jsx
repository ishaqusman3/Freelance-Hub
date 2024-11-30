import React, { useEffect } from 'react';
import { updateUserDocuments } from './utils/updateUsers';
import { addPostedAtToJobs } from './utils/updateJobs';

const App = () => {
  useEffect(() => {
    // Call the function once when the app loads
    // updateUserDocuments();
    addPostedAtToJobs(); 
  }, []);
  return <div>App is running...</div>;
};
export default App;
