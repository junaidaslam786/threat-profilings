import React, { useState } from 'react';
import { confirmSignIn, type SignInOutput } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import InputField from '../Common/InputField';
import Button from '../Common/Button';
import ErrorMessage from '../Common/ErrorMessage';
import LoadingScreen from '../Common/LoadingScreen';
import { redirectToForgotPassword } from '../../utils/authHelpers';
import { customSignIn } from '../../utils/customAuthHelpers';

interface CustomSignInProps {
  onSwitchToSignUp: () => void;
  onSignInSuccess?: () => void;
}

const CustomSignIn: React.FC<CustomSignInProps> = ({ 
  onSwitchToSignUp, 
  onSignInSuccess 
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmationCode: ''
  });
  const [step, setStep] = useState<'signIn' | 'confirmSignIn'>('signIn');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { isSignedIn, nextStep }: SignInOutput = await customSignIn({
        username: formData.email,
        password: formData.password
      });

      if (isSignedIn) {
        onSignInSuccess?.();
        navigate('/dashboard');
      } else if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        setStep('confirmSignIn');
      } else if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE') {
        setStep('confirmSignIn');
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { isSignedIn } = await confirmSignIn({
        challengeResponse: formData.confirmationCode
      });

      if (isSignedIn) {
        onSignInSuccess?.();
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Confirmation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-2xl border border-white/20 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {step === 'signIn' ? 'Welcome Back' : 'Confirm Sign In'}
          </h1>
          <p className="text-gray-200">
            {step === 'signIn' 
              ? 'Sign in to your Threat Profiling account' 
              : 'Enter the confirmation code sent to you'
            }
          </p>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onClose={() => setError('')} />
          </div>
        )}

        {step === 'signIn' ? (
          <form onSubmit={handleSignIn} className="space-y-6">
            <InputField
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
              className="bg-white/10 border-white/30 text-white placeholder-gray-300"
            />

            <div className="relative">
              <InputField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                className="bg-white/10 border-white/30 text-white placeholder-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-300 hover:text-white transition-colors"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleConfirmSignIn} className="space-y-6">
            <InputField
              label="Confirmation Code"
              type="text"
              name="confirmationCode"
              value={formData.confirmationCode}
              onChange={handleInputChange}
              placeholder="Enter confirmation code"
              required
              className="bg-white/10 border-white/30 text-white placeholder-gray-300"
            />

            <div className="flex space-x-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep('signIn')}
                className="flex-1 bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all duration-200"
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? 'Confirming...' : 'Confirm'}
              </Button>
            </div>
          </form>
        )}

        {step === 'signIn' && (
          <div className="mt-8 text-center space-y-4">
            <button
              type="button"
              className="text-primary-300 hover:text-primary-200 transition-colors underline"
              onClick={redirectToForgotPassword}
            >
              Forgot your password?
            </button>
            
            <div className="text-gray-300">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToSignUp}
                className="text-primary-300 hover:text-primary-200 transition-colors font-semibold"
              >
                Sign up here
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSignIn;
