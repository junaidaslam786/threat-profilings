import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import Button from '../Common/Button';
import InputField from '../Common/InputField';
import { 
  buildOtpauthUri, 
  otpauthToDataUrl, 
  isValidTotpCode
} from '../../utils/totpHelpers';
import { 
  handleMFASetupChallenge, 
  completeMFASetupChallenge 
} from '../../utils/customAuthHelpers';

interface MFASetupProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

const MFASetup: React.FC<MFASetupProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<'setup' | 'verify'>('setup');
  const [secretCode, setSecretCode] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');

  const setupMFA = useCallback(async () => {
    setIsLoading(true);

    try {
      // Use the challenge-based MFA setup
      const result = await handleMFASetupChallenge();
      
      if (!result.secretCode) {
        throw new Error('Failed to get TOTP secret from Cognito');
      }

      // Get the email from session storage or use fallback
      let email = userEmail;
      if (!email) {
        const authSession = sessionStorage.getItem('currentAuthSession');
        if (authSession) {
          const parsed = JSON.parse(authSession);
          email = parsed.username || 'user@example.com';
        } else {
          email = 'user@example.com';
        }
        setUserEmail(email);
      }

      // Build the otpauth URI with custom branding
      const otpauthUri = buildOtpauthUri(
        result.secretCode,
        email,
        'Threat Profiling',
        'TPcyorn'
      );

      // Generate QR code
      const qrCodeDataUrl = await otpauthToDataUrl(otpauthUri);

      setSecretCode(result.secretCode);
      setQrCodeUrl(qrCodeDataUrl);
      setSetupComplete(true);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('MFA setup error:', error);
      toast.error(error.message || 'Failed to setup MFA. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    if (step === 'setup' && !isLoading && !secretCode && !setupComplete) {
      setupMFA();
    }
  }, [step, isLoading, secretCode, setupComplete, setupMFA]);

  const verifyMFA = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!isValidTotpCode(verificationCode)) {
        throw new Error('Please enter a valid 6-digit code');
      }

      // Use our challenge-based TOTP completion flow
      const result = await completeMFASetupChallenge(verificationCode);

      if (result.isSignedIn) {
        // MFA setup completed and user is signed in
        sessionStorage.removeItem('mfaSetupSession');
        sessionStorage.removeItem('currentAuthSession');
        
        if (onComplete) {
          onComplete();
        } else {
          // Default behavior - redirect to auth-redirect-handler for proper role-based routing
          window.location.href = '/auth-redirect-handler';
        }
      } else if (result.nextChallenge === 'SOFTWARE_TOKEN_MFA') {
        // MFA is set up but need to verify again with newly set up TOTP
        if (onComplete) {
          onComplete();
        } else {
          // Signal that setup is complete and now need regular MFA verification
          window.location.href = '/auth';
        }
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error('MFA verification error:', error);
      toast.error(error.message || 'Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateQRCode = () => {
    if (!qrCodeUrl) return null;
    
    return (
      <div className="text-center mb-6">
        <img 
          src={qrCodeUrl} 
          alt="QR Code for MFA Setup" 
          className="mx-auto mb-4 border border-white/20 rounded-lg bg-white p-2"
        />
        <p className="text-sm text-gray-300 mb-2">
          Scan this QR code with your authenticator app
        </p>
        <div className="bg-white/10 rounded-lg p-3 text-xs">
          <p className="text-gray-400 mb-1">Or manually enter this secret:</p>
          <code className="bg-white/20 px-2 py-1 rounded text-white font-mono break-all">
            {secretCode}
          </code>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-2xl border border-white/20 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {step === 'setup' ? 'Setup Multi-Factor Authentication' : 'Verify Your Setup'}
          </h1>
          <p className="text-gray-200">
            {step === 'setup' 
              ? 'Secure your account with an authenticator app' 
              : 'Enter the code from your authenticator app'
            }
          </p>
        </div>

        {step === 'setup' ? (
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                <p className="text-gray-300 mt-2">Setting up MFA...</p>
              </div>
            ) : (
              <>
                {generateQRCode()}
                
                <div className="bg-white/5 rounded-lg p-4 text-sm text-gray-300">
                  <h3 className="font-semibold mb-2 text-primary-300">Instructions:</h3>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Install an authenticator app (Google Authenticator, Authy, Microsoft Authenticator, etc.)</li>
                    <li>Scan the QR code above or manually enter the secret key</li>
                    <li>Click "Continue" to verify your setup</li>
                  </ol>
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => onCancel ? onCancel() : window.location.href = '/auth'}
                    className="flex-1 bg-white/10 border border-white/30 text-white hover:bg-white/20"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => setStep('verify')}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
                  >
                    Continue
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          <form onSubmit={verifyMFA} className="space-y-6">
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600/20 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-primary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-300 text-sm">
                Open your authenticator app and enter the current 6-digit code for <span className="font-semibold text-primary-300">{userEmail}</span>
              </p>
              <p className="text-gray-400 text-xs mt-2">
                The code refreshes every 30 seconds
              </p>
            </div>

            <InputField
              label="Verification Code"
              type="text"
              name="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit code"
              required
              className="bg-white/10 border-white/30 text-white placeholder-gray-300 text-center text-lg font-mono"
            />

            <div className="flex space-x-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep('setup')}
                className="flex-1 bg-white/10 border border-white/30 text-white hover:bg-white/20"
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? 'Verifying...' : 'Complete Setup'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MFASetup;