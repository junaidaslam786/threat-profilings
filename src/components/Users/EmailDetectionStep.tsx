import React, { useState } from "react";
import { useDetectRegistrationFlowMutation } from "../../Redux/api/userApi";
import { debugTokenDetails } from "../../utils/debugTokens";
import type { DetectFlowResponse } from "../../Redux/slices/userSlice";
import Button from "../Common/Button";

interface EmailDetectionStepProps {
  onFlowDetected: (email: string, flowData: DetectFlowResponse) => void;
}

export default function EmailDetectionStep({ onFlowDetected }: EmailDetectionStepProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [detectFlow, { isLoading }] = useDetectRegistrationFlowMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const flowData = await detectFlow({ email }).unwrap();
      onFlowDetected(email, flowData);
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "data" in err &&
        typeof (err as { data?: unknown }).data === "object" &&
        (err as { data?: unknown }).data !== null &&
        "message" in (err as { data: { message?: string } }).data
      ) {
        setError(
          (err as { data: { message?: string } }).data?.message ||
            "Failed to detect registration flow."
        );
      } else {
        setError("Failed to detect registration flow.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900">
      <div className="bg-gradient-to-br from-secondary-800/80 to-secondary-700/80 backdrop-blur-sm p-12 rounded-2xl border border-secondary-600/30 shadow-2xl max-w-lg w-full mx-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Welcome to Threat Profiling</h2>
          <p className="text-secondary-300 text-lg">
            Enter your email address to begin your personalized registration journey.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <input
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-secondary-700/50 border border-secondary-600/50 focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 focus:outline-none text-white placeholder-secondary-400 transition-all duration-200"
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          {error && (
            <div className="bg-danger-500/10 border border-danger-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-danger-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-danger-400">{error}</p>
              </div>
            </div>
          )}
          
          <Button 
            type="submit" 
            loading={isLoading} 
            className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            {isLoading ? 'Detecting Registration Flow...' : 'Continue'}
          </Button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-secondary-400 text-sm">
            We'll automatically detect the best registration path for your organization
          </p>
          
          {/* Debug button - only show in development or with debug query param */}
          {(import.meta.env.MODE === 'development' || window.location.search.includes('debug=true')) && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => debugTokenDetails()}
                className="text-xs text-secondary-500 hover:text-secondary-300 underline"
              >
                Debug Token Info
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
