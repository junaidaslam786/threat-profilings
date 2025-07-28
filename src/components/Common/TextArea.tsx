// src/components/Common/TextArea.tsx
import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ label, id, ...props }) => {
  const textareaId = id || props.name;
  return (
    <div>
      {label && (
        <label htmlFor={textareaId} className="block text-gray-300 text-sm font-bold mb-2">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white resize-y"
        {...props}
      />
    </div>
  );
};

export default TextArea;