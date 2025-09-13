import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext'; // Import ThemeContext
import Button from './Button.jsx';
import { toast } from 'react-toastify';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext); // Use the global context
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to log out.');
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-gray-800 dark:bg-gray-950 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
          MyBlog
        </Link>

        {/* Hamburger menu for small screens */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        {/* Desktop menu */}
        <div className={`md:flex items-center space-x-4 ${isMenuOpen ? 'block' : 'hidden'} md:block absolute md:static top-16 right-4 bg-gray-800 dark:bg-gray-950 md:bg-transparent p-4 md:p-0 rounded-md shadow-lg md:shadow-none`}>
          <ul className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
            <li><Link to="/blogs" className="block hover:text-indigo-300 transition-colors duration-200">Blogs</Link></li>
            {user && (
              <>
                <li><Link to="/create-blog" className="block hover:text-indigo-300 transition-colors duration-200">Create Blog</Link></li>
                <li><Link to="/dashboard" className="block hover:text-indigo-300 transition-colors duration-200">Dashboard</Link></li>
              </>
            )}

            <li>
              {/* Use the global toggleTheme function */}
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors duration-200">
                {/* Use the global theme state to choose the icon */}
                {theme === 'dark' ? <SunIcon className="h-5 w-5 text-yellow-400" /> : <MoonIcon className="h-5 w-5 text-gray-300" />}
              </button>
            </li>

            {user ? (
              <li className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <span className="text-gray-300">Welcome, {user.username}!</span>
                <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-1 text-sm">Logout</Button>
              </li>
            ) : (
              <li className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <Link to="/login" className="block px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm">Login</Link>
                <Link to="/register" className="block px-3 py-1 bg-green-600 hover:bg-green-700 rounded-md text-sm">Register</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;