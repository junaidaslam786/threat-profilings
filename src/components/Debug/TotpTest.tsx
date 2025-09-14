import React, { useState } from 'react';
import { setupTotpFlow, completeTotpSetup, isValidTotpCode } from '../../utils/totpHelpers';

interface TotpSetupData {
  secretCode: string;
  otpauthUri: string;
  qrCodeDataUrl: string;
  session?: string;
}

const TotpTestComponent: React.FC = () => {
  const [step, setStep] = useState<'initial' | 'setup' | 'verify'>('initial');
  const [totpData, setTotpData] = useState<TotpSetupData | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const testSetupFlow = async () => {
    try {
      setError('');
      setResult('Starting TOTP setup...');
      
      const data = await setupTotpFlow(
        'test@example.com',
        undefined, // No access token for testing
        'test-session', // Mock session
        'auth.cyorn.com'
      );
      
      setTotpData(data);
      setResult('TOTP setup successful! QR code generated.');
      setStep('setup');
    } catch (err) {
      setError(`Setup failed: ${(err as Error).message}`);
    }
  };

  const testVerifyFlow = async () => {
    if (!isValidTotpCode(verificationCode)) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    try {
      setError('');
      setResult('Verifying TOTP code...');
      
      await completeTotpSetup(
        verificationCode,
        undefined, // No access token for testing
        'test-session'
      );
      
      setResult('TOTP verification successful!');
      setStep('verify');
    } catch (err) {
      setError(`Verification failed: ${(err as Error).message}`);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">TOTP Flow Test</h2>
      
      {step === 'initial' && (
        <div>
          <button 
            onClick={testSetupFlow}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test TOTP Setup
          </button>
        </div>
      )}

      {step === 'setup' && totpData && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Setup Complete!</h3>
          <div className="mb-4">
            <img 
              src={totpData.qrCodeDataUrl} 
              alt="QR Code" 
              className="border rounded"
            />
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">Secret Code:</p>
            <code className="bg-gray-100 p-2 rounded block text-xs break-all">
              {totpData.secretCode}
            </code>
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit code"
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <button 
            onClick={testVerifyFlow}
            disabled={verificationCode.length !== 6}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300"
          >
            Test TOTP Verification
          </button>
        </div>
      )}

      {result && (
        <div className="mt-4 p-3 bg-blue-100 text-blue-800 rounded">
          {result}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}

      <div className="mt-4">
        <button 
          onClick={() => {
            setStep('initial');
            setTotpData(null);
            setVerificationCode('');
            setResult('');
            setError('');
          }}
          className="text-sm text-gray-500 underline"
        >
          Reset Test
        </button>
      </div>
    </div>
  );
};

export default TotpTestComponent;