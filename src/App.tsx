import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import { DataProvider } from './context/DataContext';
import './App.css';
import './styles/index.css';

// Protected Route wrapper component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const user = localStorage.getItem('user');
        if (!user) {
          throw new Error('No user data');
        }
        
        const userData = JSON.parse(user);
        if (!userData.email || !userData.timestamp || !userData.name) {
          throw new Error('Invalid user data');
        }
        
        const timestamp = new Date(userData.timestamp);
        const now = new Date();
        if (now.getTime() - timestamp.getTime() > 24 * 60 * 60 * 1000) {
          throw new Error('Session expired');
        }
      } catch (err) {
        localStorage.removeItem('user');
        navigate('/login', { replace: true, state: { from: location.pathname } });
      }
    };

    checkAuth();
  }, [navigate, location]);

  return <>{children}</>;
};

// Public Route wrapper component
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        const timestamp = new Date(userData.timestamp);
        const now = new Date();
        if (userData.email && userData.name && now.getTime() - timestamp.getTime() <= 24 * 60 * 60 * 1000) {
          navigate('/dashboard', { replace: true });
        } else {
          localStorage.removeItem('user');
        }
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, [navigate]);

  return <>{children}</>;
};

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Clear any invalid auth state on app load
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        const timestamp = new Date(userData.timestamp);
        const now = new Date();
        if (!userData.email || !userData.timestamp || !userData.name || (now.getTime() - timestamp.getTime()) > 24 * 60 * 60 * 1000) {
          localStorage.removeItem('user');
        }
      } catch {
        localStorage.removeItem('user');
      }
    }
    setIsInitialized(true);
  }, []);

  if (!isInitialized) {
    return null; // or a loading spinner
  }

  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route 
            path="/landing" 
            element={<Landing />} 
          />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={<Navigate to="/landing" replace />} 
          />
          <Route 
            path="*" 
            element={<Navigate to="/landing" replace />} 
          />
        </Routes>
      </Router>
    </DataProvider>
  );
};

export default App;
