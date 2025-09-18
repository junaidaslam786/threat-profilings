import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import PendingApprovalView from '../../components/Dashboard/PendingApprovalView';
import type { RegisterUserResponse } from '../../Redux/slices/userSlice';

const PendingApprovalPage: React.FC = () => {
  const location = useLocation();
  const userDetails = location.state?.userDetails as RegisterUserResponse;
  
  // If no user details are provided, redirect to home
  if (!userDetails || !location.state?.showPendingApproval) {
    return <Navigate to="/" replace />;
  }

  // Transform the registration response to match PendingApprovalView expected format
  const transformedUser = {
    user_info: {
      name: userDetails.name || userDetails.user_type || 'Platform Admin',
      email: userDetails.email || '',
      client_name: userDetails.client_name || 'N/A',
      status: userDetails.status
    },
    roles_and_permissions: {
      primary_role: userDetails.role
    }
  };

  return <PendingApprovalView user={transformedUser} />;
};

export default PendingApprovalPage;