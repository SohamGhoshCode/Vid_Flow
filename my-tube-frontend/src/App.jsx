import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Watch from './pages/Watch';
import Channel from './pages/Channel';
import Dashboard from './pages/Dashboard';
import UploadVideo from './components/Video/UploadVideo';
import Library from './pages/Library';
import Subscriptions from './pages/Subscriptions';
import Trending from './pages/Trending';
import History from './pages/History';

// Components
import Navbar from './components/Common/Navbar';
import Footer from './components/Common/Footer';

// Styles
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <ToastContainer position="top-right" autoClose={3000} />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/watch/:videoId" element={<Watch />} />
              <Route path="/channel/:username" element={<Channel />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/history" element={<History />} />
              
              {/* Protected Routes */}
              <Route path="/upload" element={
                <PrivateRoute>
                  <UploadVideo />
                </PrivateRoute>
              } />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/library" element={
                <PrivateRoute>
                  <Library />
                </PrivateRoute>
              } />
              <Route path="/subscriptions" element={
                <PrivateRoute>
                  <Subscriptions />
                </PrivateRoute>
              } />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;