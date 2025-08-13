import React, { useState } from "react";
import { useDetectRegistrationFlowMutation } from "../../Redux/api/userApi";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        className="bg-gray-800 p-8 rounded-xl border border-blue-700 w-full max-w-md shadow-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-blue-300 mb-4">Get Started</h2>
        <p className="text-gray-300 mb-6">
          Enter your email address to begin the registration process.
        </p>
        
        <div className="space-y-4">
          <input
            className="w-full p-3 rounded bg-gray-700 border border-blue-900 focus:border-blue-500 focus:outline-none"
            name="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        {error && <div className="text-red-400 mt-4">{error}</div>}
        
        <div className="mt-6">
          <Button type="submit" loading={isLoading} className="w-full">
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
