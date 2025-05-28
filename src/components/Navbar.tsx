import React from 'react';
import * as Icons from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  userEmail: string;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const userEmail = "bidwit.analytics@gmail.com";

  return (
    <nav className="bg-dark-bg-secondary shadow-lg transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              BIDWIT
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Icons.FiSun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Icons.FiMoon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-300">
                {userEmail}
              </span>
              <button
                onClick={onLogout}
                className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
                aria-label="Logout"
              >
                <Icons.FiLogOut className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 