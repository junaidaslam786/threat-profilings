import React from 'react';

// ErrorMessage component to display error messages in a modal-like overlay
export const ErrorMessage: React.FC<{
  message: string; // The error message to display
  onClose: () => void; // Function to call when the close button is clicked
}> = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-red-700 text-white p-6 rounded-lg shadow-xl relative">
      {/* Close button */}
      <button onClick={onClose} className="absolute top-2 right-2 text-white hover:text-gray-200 text-lg">&times;</button>
      <p className="text-xl font-bold mb-4">Error!</p>
      <p>{message}</p>
    </div>
  </div>
);