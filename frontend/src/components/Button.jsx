import React from 'react';

const Button = ({ children, onClick, type = 'button', className = '', ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 
        ${className.includes('bg-') ? '' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'}
        ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;