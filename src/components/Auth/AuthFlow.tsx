import React, { useState, useEffect } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomSignIn from './CustomSignIn';
import CustomSignUp from './CustomSignUp';
import LoadingScreen from '../Common/LoadingScreen';

const AuthFlow: React.FC = () => {
  const [currentView, setCurrentView] = useState<'signIn' | 'signUp'>('signIn');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await getCurrentUser();
        // User is already authenticated, redirect to dashboard
        const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } catch {
        // User is not authenticated, show auth flow
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [navigate, location]);

  const handleAuthSuccess = () => {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      {currentView === 'signIn' ? (
        <CustomSignIn
          onSwitchToSignUp={() => setCurrentView('signUp')}
          onSignInSuccess={handleAuthSuccess}
        />
      ) : (
        <CustomSignUp
          onSwitchToSignIn={() => setCurrentView('signIn')}
          onSignUpSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
};

export default AuthFlow;
