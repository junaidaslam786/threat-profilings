import { useGetProfileQuery } from "../../Redux/api/userApi";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { extractErrorMessage } from "../../utils/errorHandling";
import { useUser } from "../../hooks/useUser";
import LoadingScreen from "../../components/Common/LoadingScreen";
import Navbar from "../../components/Common/Navbar";

export default function ProfilePage() {
  const { data, isLoading, error } = useGetProfileQuery();
  const { user, isPlatformAdmin, isAdmin, isLEAdmin } = useUser();

  useEffect(() => {
    if (error) {
      const msg = extractErrorMessage(error) || "Failed to load profile.";
      toast.error(msg);
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
        <LoadingScreen />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-red-400">
        Failed to load profile.
      </div>
    );
  }

  const userRole = isPlatformAdmin ? 'Platform Admin' : isAdmin ? 'Admin' : isLEAdmin ? 'LE Admin' : 'User';
  const profileData = data || user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-3">
            My Profile
          </h1>
          <p className="text-secondary-300 text-lg">
            Manage your personal information and account settings
          </p>
        </div>

        {profileData ? (
          <div className="space-y-8">
            {/* Profile Header */}
            <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-8 border border-secondary-700/50">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-4xl shadow-2xl">
                  {(profileData.user_info?.name || profileData.user_info?.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {profileData.user_info?.name || 'User'}
                  </h2>
                  <p className="text-xl text-secondary-300 mb-4">
                    {profileData.user_info?.email}
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <span className="px-4 py-2 bg-gradient-to-r from-primary-600/20 to-primary-700/20 text-primary-300 rounded-full border border-primary-500/30">
                      {userRole}
                    </span>
                    <span className={`px-4 py-2 rounded-full border ${
                      profileData.user_info?.status === 'active' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }`}>
                      {profileData.user_info?.status || 'Active'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col space-y-3">
                  <button className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-500 hover:to-primary-600 transition-all duration-200 cursor-pointer">
                    Edit Profile
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-lg hover:from-secondary-500 hover:to-secondary-600 transition-all duration-200 cursor-pointer">
                    Change Password
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50">
                <h3 className="text-xl font-bold text-white mb-6">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-400 mb-1">Full Name</label>
                    <div className="text-white font-medium">{profileData.user_info?.name || 'Not provided'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-400 mb-1">Email Address</label>
                    <div className="text-white font-medium">{profileData.user_info?.email || 'Not provided'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-400 mb-1">Phone Number</label>
                    <div className="text-white font-medium">+1 (555) 123-4567</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-400 mb-1">Location</label>
                    <div className="text-white font-medium">New York, NY</div>
                  </div>
                </div>
              </div>

              {/* Account Statistics */}
              <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50">
                <h3 className="text-xl font-bold text-white mb-6">Account Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-secondary-700/30 rounded-lg">
                    <span className="text-secondary-300">Organizations</span>
                    <span className="text-2xl font-bold text-primary-400">5</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary-700/30 rounded-lg">
                    <span className="text-secondary-300">Security Assessments</span>
                    <span className="text-2xl font-bold text-green-400">23</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary-700/30 rounded-lg">
                    <span className="text-secondary-300">Threats Detected</span>
                    <span className="text-2xl font-bold text-red-400">147</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary-700/30 rounded-lg">
                    <span className="text-secondary-300">Account Created</span>
                    <span className="text-lg font-medium text-secondary-200">Jan 2024</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50">
              <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { action: 'Logged in', time: '2 hours ago', icon: 'login' },
                  { action: 'Updated organization settings', time: '1 day ago', icon: 'settings' },
                  { action: 'Completed security assessment', time: '3 days ago', icon: 'shield' },
                  { action: 'Invited new team member', time: '1 week ago', icon: 'user' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-secondary-700/30 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{activity.action}</p>
                      <p className="text-sm text-secondary-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-8 border border-secondary-700/50 text-center">
            <div className="text-secondary-400">No profile data found.</div>
          </div>
        )}
      </div>
    </div>
  );
}
