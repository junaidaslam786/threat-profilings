import React from 'react';
import { redirectToHostedUI } from '../../utils/authUrlHelpers';
import Button from '../Common/Button';

interface AuthChoiceProps {
  onCustomAuth: () => void;
}

const AuthChoice: React.FC<AuthChoiceProps> = ({ onCustomAuth }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-2xl border border-white/20 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Choose Your Sign In Method
          </h1>
          <p className="text-gray-200">
            Select how you'd like to access your account
          </p>
        </div>

        <div className="space-y-4">
          {/* Hosted UI Option - Primary */}
          <Button
            type="button"
            variant="primary"
            onClick={() => redirectToHostedUI('signin')}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            🚀 Continue with AWS Cognito
            <div className="text-sm opacity-80 mt-1">
              Secure hosted authentication (Recommended)
            </div>
          </Button>

          {/* Custom Form Option */}
          <Button
            type="button"
            variant="secondary"
            onClick={onCustomAuth}
            className="w-full bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all duration-200 py-4 px-6"
          >
            📝 Use Custom Form
            <div className="text-sm opacity-80 mt-1">
              Sign in directly on this page
            </div>
          </Button>
        </div>

        <div className="mt-8 text-center">
          <div className="text-gray-300 text-sm">
            New to Threat Profiling?{' '}
            <button
              type="button"
              onClick={() => redirectToHostedUI('signup')}
              className="text-primary-300 hover:text-primary-200 transition-colors font-semibold"
            >
              Create an account
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-primary-900/20 rounded-lg border border-primary-700/30">
          <div className="text-center text-sm text-primary-200">
            <strong>Note:</strong> AWS Cognito Hosted UI will redirect you to{' '}
            <code className="bg-primary-800/50 px-1 rounded">tpauth.cyorn.com</code>
            {' '}for secure authentication.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthChoice;
