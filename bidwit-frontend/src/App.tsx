import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/Dashboard';
import Settings from './components/Settings';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-bg-primary text-dark-text-primary">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        
        {/* Navigation */}
        <nav className="bg-dark-bg-secondary border-b border-dark-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold">BIDWIT</h1>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <a
                    href="/"
                    className="border-primary-500 text-dark-text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Dashboard
                  </a>
                  <a
                    href="/settings"
                    className="border-transparent text-dark-text-secondary hover:text-dark-text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Settings
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="sm:hidden">
          <div className="flex space-x-1 px-2 pt-2 pb-3 bg-dark-bg-secondary border-b border-dark-border">
            <a
              href="/"
              className="bg-primary-500 text-white flex-1 inline-flex flex-col items-center px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </a>
            <a
              href="/settings"
              className="text-dark-text-secondary hover:text-dark-text-primary flex-1 inline-flex flex-col items-center px-3 py-2 rounded-md text-sm font-medium"
            >
              Settings
            </a>
          </div>
        </div>

        {/* Routes */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 