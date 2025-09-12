import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-950 text-white p-4 mt-8">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} My Blog App. All rights reserved.</p>
        <p className="text-sm mt-2">
          Built with React, Tailwind CSS, and powered by your amazing backend.
        </p>
      </div>
    </footer>
  );
};

export default Footer;