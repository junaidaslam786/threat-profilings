import React, { useState } from "react";
import InputField from "../../components/Common/InputField";
import Button from "../../components/Common/Button";
import AuthLayout from "../../components/Common/AuthLayout";

const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdminSignIn = () => {
    setGeneralError(null);
    if (!formData.email || !formData.password) {
      setGeneralError("Please enter both email and password.");
      return;
    }
    alert("Admin Sign In Successful! (Simulated)");
  };

  return (
    <AuthLayout title="Admin Login">
      {generalError && (
        <p className="text-red-500 text-center mb-4">{generalError}</p>
      )}
      <InputField
        label="Admin Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="admin@yourcompany.com"
      />
      <InputField
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="********"
      />
      <Button onClick={handleAdminSignIn}>Login as Admin</Button>
      <p className="text-center text-gray-400 text-sm mt-4">
        <button className="text-primary-500 hover:underline">
          Return to Client Sign In
        </button>
      </p>
    </AuthLayout>
  );
};

export default AdminLogin;
