import { useParams, useNavigate } from "react-router-dom";
import { useGetRoleQuery } from "../../Redux/api/rolesApi";
import Navbar from "../../components/Common/Navbar";

export default function RoleDetailPage() {
  const { role_id } = useParams<{ role_id: string }>();
  const navigate = useNavigate();
  const { data: role, isLoading, error } = useGetRoleQuery(role_id!);

  if (isLoading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg">Loading role details...</span>
          </div>
        </div>
      </div>
    );
    
  if (error || !role)
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-red-400 mb-2">Role Not Found</h2>
            <p className="text-secondary-400 mb-6">The requested role could not be found.</p>
            <button
              onClick={() => navigate('/roles')}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-500 hover:to-primary-600 transition-all duration-200 font-medium"
            >
              Back to Roles
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/roles')}
            className="flex items-center space-x-2 text-secondary-400 hover:text-primary-400 transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Roles</span>
          </button>
          
          <div className="flex items-center space-x-4 mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
              {role.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent">
                {role.name}
              </h1>
              <p className="text-secondary-400 text-lg">{role.role_id}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-gradient-to-r from-secondary-800/50 to-secondary-700/30 backdrop-blur-sm rounded-xl p-6 border border-secondary-600/30">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">Description</h2>
              </div>
              <p className="text-secondary-300 leading-relaxed">
                {role.description || "No description provided for this role."}
              </p>
            </div>

            {/* Permissions */}
            <div className="bg-gradient-to-r from-secondary-800/50 to-secondary-700/30 backdrop-blur-sm rounded-xl p-6 border border-secondary-600/30">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">Permissions</h2>
              </div>
              
              {role.permissions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {role.permissions.map((permission, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-secondary-700/30 rounded-lg border border-secondary-600/20"
                    >
                      <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                      <span className="text-secondary-200 text-sm font-medium">{permission}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-secondary-400 italic">No permissions assigned to this role.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Role Info */}
            <div className="bg-gradient-to-r from-secondary-800/50 to-secondary-700/30 backdrop-blur-sm rounded-xl p-6 border border-secondary-600/30">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Role Information</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-secondary-400 block mb-1">Role ID</label>
                  <div className="p-3 bg-secondary-700/30 rounded-lg border border-secondary-600/20">
                    <code className="text-primary-300 text-sm font-mono">{role.role_id}</code>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-secondary-400 block mb-1">Permission Count</label>
                  <div className="p-3 bg-secondary-700/30 rounded-lg border border-secondary-600/20">
                    <span className="text-white font-semibold">{role.permissions.length}</span>
                    <span className="text-secondary-400 text-sm ml-1">permissions</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gradient-to-r from-secondary-800/50 to-secondary-700/30 backdrop-blur-sm rounded-xl p-6 border border-secondary-600/30">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Actions</h3>
              </div>
              
              <button
                onClick={() => navigate('/roles')}
                className="w-full px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-500 hover:to-primary-600 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Roles</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
