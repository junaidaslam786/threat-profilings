import { useState } from "react";
import type { DetectFlowResponse } from "../../Redux/slices/userSlice";
import EmailDetectionStep from "../../components/Users/EmailDetectionStep";
import DynamicRegistrationForm from "../../components/Users/DynamicRegistrationForm";

export default function RegisterPage() {
  const [step, setStep] = useState<'email' | 'form'>('email');
  const [email, setEmail] = useState("");
  const [flowData, setFlowData] = useState<DetectFlowResponse | null>(null);

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
