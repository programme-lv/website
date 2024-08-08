import React from "react";

type AlertProps = {
  message: string;
  type: "info" | "error" | "success" | "warning";
  onClose: () => void;
};

const alertStyles = {
  info: "text-blue-800 bg-blue-50 dark:bg-gray-800 dark:text-blue-400",
  error: "text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400",
  success: "text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400",
  warning: "text-yellow-800 bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300",
};

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  return (
    <div
      className={`flex items-center p-4 mb-4 rounded-lg ${alertStyles[type]}`}
      role="alert"
    >
      <svg
        aria-hidden="true"
        className="flex-shrink-0 w-4 h-4"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg>
      <span className="sr-only">Info</span>
      <div className="ms-3 text-sm font-normal">{message}</div>
      <button
        aria-label="Close"
        className="ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-gray-400 p-1.5 hover:bg-gray-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
        type="button"
        onClick={onClose}
      >
        <span className="sr-only">Close</span>
        <svg
          aria-hidden="true"
          className="w-3 h-3"
          fill="none"
          viewBox="0 0 14 14"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </button>
    </div>
  );
};

export default Alert;
