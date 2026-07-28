import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-white">
          M.Sc. Software Systems
        </Link>
        {user ? (
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">Dashboard</Link>
            <Link to="/courses" className="text-gray-300 hover:text-white transition-colors">Courses</Link>
            <Link to="/profile" className="text-gray-300 hover:text-white transition-colors">Profile</Link>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
            <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
