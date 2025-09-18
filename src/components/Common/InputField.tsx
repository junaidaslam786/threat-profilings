import React from 'react';

// InputField component for consistent form input styling
const InputField: React.FC<{
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  pattern?: string;
  title?: string;
  required?: boolean;
  className?: string;
}> = ({ label, type, name, value, onChange, placeholder, error, pattern, title, required, className }) => (
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
      className={`${className} shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-secondary-600 focus:border-transparent transition duration-300 ease-in-out
        ${error ? 'border-red-500' : 'border-gray-600 bg-gray-700 text-white'}`}
      pattern={pattern}
      title={title}
      required={required}
    />
    {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
  </div>
);

export default InputField;