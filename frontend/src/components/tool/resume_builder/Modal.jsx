import React from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 overflow-auto z-50 bg-black bg-opacity-50 flex justify-center items-start pt-2">
      <div className="bg-white dark:backdrop-opacity-20 dark:backdrop-invert dark:bg-black/30 rounded-md shadow-lg w-11/12 max-w-lg mx-auto p-4 mt-4 mb-4">
        <div className="relative">
          <button
            className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
            onClick={onClose}
          >
            &times;
          </button>
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          <div>{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
