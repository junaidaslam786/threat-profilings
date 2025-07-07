// // src/pages/Dashboard.tsx

// import React, { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import Button from "../../components/Common/Button";
// import { useGetProfileMutation } from "../../Redux/api/userApi";
// import { setUserDetails } from "../../Redux/slices/userSlice";
// import { useAppSelector, type RootState } from "../../Redux/store";

// const Dashboard: React.FC = () => {
//   const dispatch = useDispatch();
//   const { user, isLoading, error } = useAppSelector(
//     (state: RootState) => state.user
//   );

//   const [
//     fetchMe,
//     {
//       data: fetchedUserData,
//       isLoading: isFetchingMe,
//       isSuccess,
//       isError,
//       error: fetchError,
//     },
//   ] = useGetProfileMutation();

//   useEffect(() => {
//     fetchMe();
//   }, [fetchMe]);

//   useEffect(() => {
//     if (isSuccess && fetchedUserData) {
//       dispatch(setUserDetails(fetchedUserData));
//     } else if (isError) {
//       console.error("Failed to fetch user details:", fetchError);
//       dispatch(setUserDetails(null));
//     }
//   }, [isSuccess, fetchedUserData, isError, fetchError, dispatch]);

//   const handleSignInClick = () => {
//     window.location.href =
//       "https://eu-north-1p9cm0plzr.auth.eu-north-1.amazoncognito.com/login?client_id=5h8d5bk73e6f8m9fdvkkaq8mbt&response_type=token&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F";
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-4xl font-bold text-blue-500">
//           Welcome to Your Dashboard!
//         </h2>
//         <div>
//           <Button
//             onClick={handleSignInClick}
//             className="bg-green-600 hover:bg-green-700 w-auto px-6 py-2"
//           >
//             Sign In
//           </Button>
//         </div>
//       </div>

//       {isLoading || isFetchingMe ? ( // Use isLoading from slice or isFetchingMe from mutation
//         <p className="text-center text-gray-400">Loading user data...</p>
//       ) : user ? (
//         <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-blue-700 max-w-2xl mx-auto">
//           <h3 className="text-2xl font-semibold mb-4 text-blue-400">
//             User Information
//           </h3>
//           <p className="mb-2">
//             <span className="font-medium">User ID:</span>{" "}
//             <span className="break-words">21245012421</span>
//           </p>
//           <p className="mb-2">
//             <span className="font-medium">Organization Name:</span>{" "}
//             {user.client_name || "N/A"}
//           </p>
//           <p className="mb-2">
//             <span className="font-medium">Email:</span> {user.email}
//           </p>
//           <p className="mb-2">
//             <span className="font-medium">Client Name:</span>{" "}
//             {user.name
//               ? user.name.toLowerCase().replace(/\s/g, "_")
//               : "N/A"}{" "}
//             {/* Assuming client_name is derived from org name */}
//           </p>
//           <p className="mb-2">
//             <span className="font-medium">Role:</span>{" "}
//             {user.role ? user.role : "N/A"}
//           </p>
//           <p className="text-gray-400 text-sm mt-4">
//             This dashboard displays user information fetched from the backend.
//           </p>
//         </div>
//       ) : (
//         <p className="text-center text-gray-400">
//           No user data found. Please ensure you've signed in.
//           {error && (
//             <span className="text-red-500 block mt-2">Error: {error}</span>
//           )}
//         </p>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

// src/pages/Dashboard.tsx

import React from "react";
import Button from "../../components/Common/Button";
import { useUser } from "../../Redux/hooks/useUser";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();

  // Make role check case-insensitive!
  const role = user?.role?.toLowerCase();
  const isAdmin = role === "admin";
  const isLEAdmin = role === "le_admin";
  const isViewer = role === "viewer";

  const adminFeatures = [
    {
      label: "Approval Requests",
      onClick: () => navigate("/admin/approval-requests"),
    },
    {
      label: "User Management",
      onClick: () => alert("Go to User Management!"),
    },
    {
      label: "Organization Management",
      onClick: () => navigate("/admin/organization-management"),
    },
    {
      label: "Billing & Subscription",
      onClick: () => alert("Go to Billing!"),
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-blue-700 text-center">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">
            Sign In Required
          </h2>
          <p className="mb-4">
            You are not signed in. Please log in to access the dashboard.
          </p>
          <Button onClick={() => (window.location.href = "/")}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-blue-400">
          Dashboard - {isAdmin ? "Admin" : isLEAdmin ? "LE Admin" : "Viewer"}
        </h1>
        <Button
          onClick={() => {
            window.location.href = "/";
          }}
          className="bg-red-600 hover:bg-red-700 px-6 py-2"
        >
          Sign Out
        </Button>
      </div>

      <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-blue-700 max-w-2xl mx-auto mb-10">
        <h3 className="text-2xl font-semibold mb-3 text-blue-300">
          User Profile
        </h3>
        <p className="mb-1">
          <b>Name:</b> {user.name}
        </p>
        <p className="mb-1">
          <b>Email:</b> {user.email}
        </p>
        <p className="mb-1">
          <b>Role:</b> {user.role}
        </p>
        <p className="mb-1">
          <b>Organization:</b> {user.client_name}
        </p>
        {user.partner_code && (
          <p className="mb-1">
            <b>Partner Code:</b> {user.partner_code}
          </p>
        )}
        <p className="text-gray-400 text-xs mt-2">
          This information is fetched securely from the backend.
        </p>
      </div>

      {/* ADMIN ONLY SECTION */}
      {isAdmin && (
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-green-700 max-w-3xl mx-auto">
          <h3 className="text-2xl font-semibold mb-5 text-green-400">
            Admin Features
          </h3>
          <ul className="grid gap-4 md:grid-cols-2">
            {adminFeatures.map((feature) => (
              <li key={feature.label}>
                <Button
                  className="w-full bg-green-700 hover:bg-green-800"
                  onClick={feature.onClick}
                >
                  {feature.label}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* LE ADMIN SECTION */}
      {isLEAdmin && (
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-purple-700 max-w-3xl mx-auto mt-10">
          <h3 className="text-2xl font-semibold mb-5 text-purple-400">
            LE Admin Features
          </h3>
          <ul>
            <li>
              <Button
                className="w-full bg-purple-700 hover:bg-purple-800 mb-2"
                onClick={() => alert("Go to LE Org Management!")}
              >
                Manage Organizations (LE)
              </Button>
            </li>
          </ul>
        </div>
      )}

      {/* VIEWER SECTION */}
      {isViewer && (
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-blue-700 max-w-2xl mx-auto mt-10">
          <h3 className="text-xl font-semibold mb-2 text-blue-400">
            Viewer Mode
          </h3>
          <p>
            You have read-only access. Please contact your administrator if you
            need additional privileges.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
