import React from "react";

// Enhanced smooth LoadingScreen component for seamless UX
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900">
    <div className="text-center flex flex-col items-center loading-fade-in">
      <div className="relative mb-6">
        <div className="w-12 h-12 border-4 border-primary-600/30 border-t-primary-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-primary-300/50 rounded-full animate-spin animation-delay-75"></div>
      </div>
      <div className="space-y-2">
        <p className="text-primary-300 font-medium pulse-gentle">
          Loading your content...
        </p>
        <div className="w-32 h-1 progress-bar mx-auto"></div>
        <p className="text-secondary-400 text-xs">This won't take long</p>
      </div>
    </div>
  </div>
);

export default LoadingScreen;
