import { useState } from "react";
import SignUp from "./Pages/Auth/SignUp";
import SignIn from "./Pages/Auth/SignIn";
import TwoFactorAuth from "./Pages/Auth/TwoFactorAuth";
import AdminLogin from "./Pages/Admin/AdminLogin";
import AdminApprovalRequests from "./Pages/Admin/AdminApprovalRequests";
import Dashboard from "./Pages/Dashboard/Dashboard";


function App() {
  // State to manage the current view/page displayed
  const [currentView, setCurrentView] = useState('dashboard'); // Default view is SignIn

  // Function to change the current view
  const onViewChange = (view: string) => {
    setCurrentView(view);
  };

  return (
    <div className="font-inter antialiased">
      {/* Conditional rendering based on the currentView state */}
      {(() => {
        switch (currentView) {
          case 'signUp':
            return <SignUp onViewChange={onViewChange} />;
          case 'signIn':
            return <SignIn onViewChange={onViewChange} />;
          case 'twoFactorAuth':
            return <TwoFactorAuth onViewChange={onViewChange} />;
          case 'adminLogin':
            return <AdminLogin onViewChange={onViewChange} />;
          case 'adminApprovalRequests':
            return <AdminApprovalRequests onViewChange={onViewChange} />;
          case 'dashboard':
            return <Dashboard onViewChange={onViewChange} />;
          default:
            // Fallback to SignIn if currentView is not recognized
            return <SignIn onViewChange={onViewChange} />;
        }
      })()}
    </div>
  );
}

export default App;