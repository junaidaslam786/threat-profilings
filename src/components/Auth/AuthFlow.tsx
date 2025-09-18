import React, { useState, useEffect } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomSignIn from './CustomSignIn';
import CustomSignUp from './CustomSignUp';
import MFASetup from './MFASetup';
import MFAVerification from './MFAVerification';

const AuthFlow: React.FC = () => {
  const [currentView, setCurrentView] = useState<'signIn' | 'signUp' | 'mfa' | 'mfaSetup'>('signIn');
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
          navigate(from, { replace: true });
        }
      } catch {
        console.log('Auth check result: not authenticated');
      }
    };

    checkAuthStatus();
  }, [navigate, location]);

  const handleAuthSuccess = () => {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
  };

  const handleMFAStep = (step: 'mfa' | 'mfaSetup') => {
    setCurrentView(step);
  };

  const handleBackToSignIn = () => {
    setCurrentView('signIn');
  };

  // For MFA steps, render without the AuthFlow container
  if (currentView === 'mfa') {
    return (
      <MFAVerification
        onBack={handleBackToSignIn}
        onSuccess={handleAuthSuccess}
      />
    );
  }

  if (currentView === 'mfaSetup') {
    return (
      <MFASetup
        onComplete={handleAuthSuccess}
        onCancel={handleBackToSignIn}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-2xl border border-white/20 p-8 w-full max-w-md">
        {/* CYORN Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">CYORN</h1>
          <p className="text-gray-200">
            {currentView === 'signIn' 
              ? 'Sign in here to access your account'
              : 'Register here to create your account'
            }
          </p>
        </div>

        {currentView === 'signIn' ? (
          <CustomSignIn
            onSwitchToSignUp={() => setCurrentView('signUp')}
            onSignInSuccess={handleAuthSuccess}
            onMFAStep={handleMFAStep}
          />
        ) : (
          <CustomSignUp
            onSwitchToSignIn={() => setCurrentView('signIn')}
            onSignUpSuccess={handleAuthSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default AuthFlow;
