import React from 'react';
import ReactDOM from 'react-dom';
import Button from './button.jsx';

const Modal = ({ isOpen, onClose, title, children, onSubmit, submitText = "Confirm" }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-semibold dark:text-gray-100">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            &times;
          </button>
        </div>
        <div className="dark:text-gray-200 mb-4">
          {children}
        </div>
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800">
            Cancel
          </Button>
          {onSubmit && (
            <Button onClick={onSubmit} className="bg-red-600 hover:bg-red-700">
              {submitText}
            </Button>
          )}
        </div>
      </div>
    </div>,
    document.getElementById('modal-root') || document.body // Ensure you have a #modal-root in your index.html
  );
};

export default Modal;