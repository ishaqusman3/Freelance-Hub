// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FirebaseAuthProvider } from './context/FirebaseAuthContext';

import Header from './components/Header';
import Footer from './components/Footer';
import './index.css'; // Import Tailwind CSS here

// Import your page components
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import HomePage from './pages/HomePage';
import GoogleSignInHandler from './pages/GoogleSignInHandler';
import ProfileCompletionPage from './pages/ProfileCompletionPage';
import PostJobPage from './pages/PostJobPage';
import JobsPage from './pages/JobsPage';
import MyJobsPage from './pages/MyJobsPage';
import MyProposalsPage from './pages/MyProposalsPage';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // <App />
  // <TestService />
  <Router>
    <FirebaseAuthProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/google-signin" element={<GoogleSignInHandler />} />
            <Route path="/profile-completion" element={<ProfileCompletionPage />} />
            <Route path="/post-job" element = {<PostJobPage />} />
            <Route path="/jobs" element = {<JobsPage />} />
            <Route path="/my-jobs" element = {<MyJobsPage />} />
            <Route path="/proposals" element = {<MyProposalsPage /> } />
            </Routes>
        </main>

        <Footer />
      </div>
    </FirebaseAuthProvider>
  </Router>
);
