import React from "react";

const ErrorMessage: React.FC<{
  message: string;
  onClose: () => void;
}> = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-red-700 text-white p-6 rounded-lg shadow-xl relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-white hover:text-gray-200 text-lg"
      >
        &times;
      </button>
      <p className="text-xl font-bold mb-4">Error!</p>
      <p>{message}</p>
    </div>
  </div>
);

export default ErrorMessage;
