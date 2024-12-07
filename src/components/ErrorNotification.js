import React from "react";

const ErrorNotification = ({ message, onClose }) => {
  if (!message) return null; // If there's no message, don't display the error box

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-red-600 text-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <span className="font-semibold">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-white font-bold text-lg"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ErrorNotification;
