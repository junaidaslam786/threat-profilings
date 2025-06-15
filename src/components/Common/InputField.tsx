import React from 'react';

// InputField component for consistent form input styling
const InputField: React.FC<{
  label: string; // Label for the input field
  type: string; // Input type (e.g., "text", "email", "password")
  name: string; // Name attribute for the input
  value: string; // Current value of the input
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Change event handler
  placeholder?: string; // Optional placeholder text
  error?: string; // Optional error message to display below the input
  pattern?: string; // Optional regex pattern for input validation (HTML5)
  title?: string; // Optional title attribute for tooltip
}> = ({ label, type, name, value, onChange, placeholder, error, pattern, title }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-gray-300 text-sm font-bold mb-2">
      {label}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-300 ease-in-out
        ${error ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-white'}`} // Dynamic border color based on error prop
      pattern={pattern}
      title={title}
    />
    {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
  </div>
);

export default InputField;