import { useState, useEffect } from "react";
import type { DetectFlowResponse } from "../../Redux/slices/userSlice";
import { useDetectRegistrationFlowMutation } from "../../Redux/api/userApi";
import EmailDetectionStep from "../../components/Users/EmailDetectionStep";
import DynamicRegistrationForm from "../../components/Users/DynamicRegistrationForm";
import { getIdToken } from "../../utils/cookieHelpers";
import { getEmailFromToken } from "../../utils/jwtHelpers";

type LoadingPhase = 'extracting' | 'detecting' | 'complete';

export default function RegisterPage() {
  const [step, setStep] = useState<'loading' | 'email' | 'form'>('loading');
  const [email, setEmail] = useState("");
  const [flowData, setFlowData] = useState<DetectFlowResponse | null>(null);
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>('extracting');
  const [detectFlow] = useDetectRegistrationFlowMutation();

  useEffect(() => {
    const autoDetectFlow = async () => {
      try {
        setLoadingPhase('extracting');
        
        // Try to get email from JWT token
        const idToken = getIdToken();
        if (idToken) {
          const extractedEmail = getEmailFromToken(idToken);
          if (extractedEmail) {
            setEmail(extractedEmail);
            setLoadingPhase('detecting');
            
            // Automatically run flow detection
            const flowData = await detectFlow({ email: extractedEmail }).unwrap();
            setFlowData(flowData);
            setLoadingPhase('complete');
            setStep('form');
            return;
          }
        }
        
        // If no token or email found, show email input
        setStep('email');
      } catch (error) {
        console.error('Auto-detection failed:', error);
        setStep('email');
      }
    };

    autoDetectFlow();
  }, [detectFlow]);

  const handleFlowDetected = (detectedEmail: string, detectedFlowData: DetectFlowResponse) => {
    setEmail(detectedEmail);
    setFlowData(detectedFlowData);
    setStep('form');
  };

  const handleBack = () => {
    setStep('email');
    setEmail("");
    setFlowData(null);
  };

  if (step === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900">
        <div className="bg-gradient-to-br from-secondary-800/80 to-secondary-700/80 backdrop-blur-sm p-12 rounded-2xl border border-secondary-600/30 shadow-2xl max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <svg className="w-10 h-10 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              {loadingPhase === 'extracting' && 'Extracting User Information'}
              {loadingPhase === 'detecting' && 'Detecting Registration Flow'}
              {loadingPhase === 'complete' && 'Preparing Registration'}
            </h2>
            <p className="text-secondary-300 mb-6">
              {loadingPhase === 'extracting' && 'Reading your authentication details...'}
              {loadingPhase === 'detecting' && 'Determining the best registration path for you...'}
              {loadingPhase === 'complete' && 'Setting up your personalized registration form...'}
            </p>
            <div className="w-full bg-secondary-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: loadingPhase === 'extracting' ? '33%' : 
                         loadingPhase === 'detecting' ? '66%' : '100%' 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'email') {
    return <EmailDetectionStep onFlowDetected={handleFlowDetected} />;
  }

  if (step === 'form' && flowData) {
    return (
      <DynamicRegistrationForm 
        email={email} 
        flowData={flowData} 
        onBack={handleBack} 
      />
    );
  }

  return null;
}
