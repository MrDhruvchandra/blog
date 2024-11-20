import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { PenSquare, LogIn, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            BlogSpace
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <Link
                to="/new"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
              >
                <PenSquare className="w-4 h-4 mr-2" />
                New Post
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <img
                  src={user?.picture}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full"
                />
                <button
                  onClick={() => logout()}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => loginWithRedirect()}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;