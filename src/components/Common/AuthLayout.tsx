import React from 'react';

// AuthLayout component provides a consistent layout for authentication pages
const AuthLayout: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
    <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-blue-700">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-500">{title}</h2>
      {children}
    </div>
  </div>
);

export default AuthLayout;