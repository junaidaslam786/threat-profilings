import React, { useState, useEffect } from 'react';
import { CognitoIdentityProviderClient, VerifySoftwareTokenCommand } from '@aws-sdk/client-cognito-identity-provider';
import Button from '../Common/Button';
import InputField from '../Common/InputField';
import ErrorMessage from '../Common/ErrorMessage';

const cognitoClient = new CognitoIdentityProviderClient({
  region: 'eu-north-1',
});

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
  const [error, setError] = useState('');
  const [setupComplete, setSetupComplete] = useState(false);

  useEffect(() => {
    if (step === 'setup' && !isLoading && !secretCode && !setupComplete) {
      setupMFA();
    }
  }, [step, isLoading, secretCode, setupComplete]);

  const setupMFA = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Get QR code from Cognito MFA endpoint
      const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
      const redirectUri = import.meta.env.VITE_APP_URL;
      const mfaUrl = `https://tpauth.cyorn.com/mfa/totp?client_id=${clientId}&response_type=token&scope=openid&redirect_uri=${encodeURIComponent(redirectUri)}&_data=routes%2Fmfa_.totp`;
      
      const response = await fetch(mfaUrl);
      const data = await response.json();
      
      if (data.registrationParams?.qrCode && data.registrationParams?.secretKey) {
        setSecretCode(data.registrationParams.secretKey);
        setQrCodeUrl(data.registrationParams.qrCode);
        setSetupComplete(true);
      } else {
        throw new Error('Failed to get MFA setup data from Cognito');
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error('MFA setup error:', error);
      setError(error.message || 'Failed to setup MFA. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyMFA = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const session = sessionStorage.getItem('mfaSetupSession');
      if (!session) {
        throw new Error('No MFA setup session found. Please sign in again.');
      }

      const command = new VerifySoftwareTokenCommand({
        Session: session,
        UserCode: verificationCode,
      });

      await cognitoClient.send(command);
      // Clear sessions after successful verification
      sessionStorage.removeItem('mfaSetupSession');
      sessionStorage.removeItem('currentAuthSession');
      if (onComplete) {
        onComplete();
      } else {
        // Default behavior - redirect to sign in to complete the flow
        window.location.href = '/auth';
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error('MFA verification error:', error);
      setError(error.message || 'Invalid verification code. Please try again.');
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
          className="mx-auto mb-4 border border-white/20 rounded-lg"
        />
        <p className="text-sm text-gray-300 mb-2">
          Scan this QR code with your authenticator app
        </p>
        <p className="text-xs text-gray-400">
          Or manually enter this secret: <code className="bg-white/10 px-2 py-1 rounded">{secretCode}</code>
        </p>
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

        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onClose={() => setError('')} />
          </div>
        )}

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
                  <h3 className="font-semibold mb-2">Instructions:</h3>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Install an authenticator app (Google Authenticator, Authy, etc.)</li>
                    <li>Scan the QR code above or manually enter the secret</li>
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
            <InputField
              label="Verification Code"
              type="text"
              name="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit code"
              required
              className="bg-white/10 border-white/30 text-white placeholder-gray-300"
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