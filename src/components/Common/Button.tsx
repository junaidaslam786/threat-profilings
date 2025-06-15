import React from 'react';

// Button component for consistent styling and interaction
const Button: React.FC<{
  children: React.ReactNode; // Content inside the button (e.g., text, icon)
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void; // Click event handler
  disabled?: boolean; // Optional prop to disable the button
  className?: string; // Optional prop for additional Tailwind CSS classes
}> = ({ children, onClick, disabled, className }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full py-3 px-4 rounded-lg font-bold text-white transition duration-300 ease-in-out shadow-lg
      ${disabled
        ? 'bg-gray-600 cursor-not-allowed' // Styling for disabled state
        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-800' // Styling for enabled state
      }
      ${className} // Apply any additional custom classes
    `}
  >
    {children}
  </button>
);

export default Button;