import { useState } from "react";
import Button from "../../components/Common/Button";
import InputField from "../../components/Common/InputField";
import Modal from "../../components/Common/Modal";

interface EnhancedUserCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EnhancedUserCreationModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: EnhancedUserCreationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const [fields, setFields] = useState({
    // Basic Information
    email: "",
    first_name: "",
    last_name: "",
    username: "",
    
    // Profile Information
    phone_number: "",
    job_title: "",
    department: "",
    location: "",
    timezone: "UTC",
    bio: "",
    
    // Account Settings
    is_active: true,
    is_verified: false,
    require_password_change: true,
    force_mfa: false,
    
    // Permissions and Access
    role: "user",
    permissions: [] as string[],
    organization_access: [] as string[],
    
    // Security Settings
    max_sessions: 5,
    session_timeout: 1440, // minutes
    password_expires_in: 90, // days
    failed_login_threshold: 5,
    
    // Notification Preferences
    email_notifications: true,
    security_alerts: true,
    marketing_emails: false,
    weekly_digest: true,
    
    // Metadata
    notes: "",
    tags: [] as string[],
    created_by: "",
    cost_center: "",
    manager_email: "",
  });
  
  const [customFields, setCustomFields] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState("");
  const [currentSection, setCurrentSection] = useState(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFields(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFields(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFields(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayField = (fieldName: string, value: string) => {
    const items = value.split(",").map(item => item.trim()).filter(item => item);
    setFields(prev => ({ ...prev, [fieldName]: items }));
  };

  const handleCustomFieldChange = (key: string, value: string) => {
    setCustomFields(prev => ({ ...prev, [key]: value }));
  };

  const addCustomField = () => {
    const key = prompt("Enter custom field name:");
    if (key && !customFields[key]) {
      setCustomFields(prev => ({ ...prev, [key]: "" }));
    }
  };

  const removeCustomField = (key: string) => {
    setCustomFields(prev => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!fields.email || !fields.first_name || !fields.last_name) {
      setError("Email, first name, and last name are required.");
      return;
    }

    try {
      setIsLoading(true);
      const userData = {
        ...fields,
        custom_fields: customFields,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // TODO: Implement actual API call when available
      console.log("Creating user:", userData);
      
      onSuccess?.();
      onClose();
    } catch {
      setError("Failed to create user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

  const sections = [
    "Basic Information",
    "Profile Details",
    "Account Settings",
    "Security & Access",
    "Notifications",
    "Custom Fields"
  ];

  const renderSection = () => {
    switch (currentSection) {
      case 0: // Basic Information
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Email Address *"
                type="email"
                name="email"
                value={fields.email}
                onChange={handleChange}
                required
              />
              <InputField
                label="Username"
                type="text"
                name="username"
                value={fields.username}
                onChange={handleChange}
                placeholder="Auto-generated if empty"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="First Name *"
                type="text"
                name="first_name"
                value={fields.first_name}
                onChange={handleChange}
                required
              />
              <InputField
                label="Last Name *"
                type="text"
                name="last_name"
                value={fields.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        );

      case 1: // Profile Details
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Phone Number"
                type="tel"
                name="phone_number"
                value={fields.phone_number}
                onChange={handleChange}
              />
              <InputField
                label="Job Title"
                type="text"
                name="job_title"
                value={fields.job_title}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Department"
                type="text"
                name="department"
                value={fields.department}
                onChange={handleChange}
              />
              <InputField
                label="Location"
                type="text"
                name="location"
                value={fields.location}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Timezone</label>
                <select
                  name="timezone"
                  value={fields.timezone}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                  <option value="Asia/Shanghai">Shanghai</option>
                  <option value="Australia/Sydney">Sydney</option>
                </select>
              </div>
              <InputField
                label="Manager Email"
                type="email"
                name="manager_email"
                value={fields.manager_email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className={labelClasses}>Bio</label>
              <textarea
                name="bio"
                value={fields.bio}
                onChange={handleChange}
                rows={3}
                className={inputClasses}
                placeholder="Brief bio or description"
              />
            </div>
            <InputField
              label="Cost Center"
              type="text"
              name="cost_center"
              value={fields.cost_center}
              onChange={handleChange}
            />
          </div>
        );

      case 2: // Account Settings
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>User Role</label>
                <select
                  name="role"
                  value={fields.role}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="moderator">Moderator</option>
                  <option value="analyst">Analyst</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <InputField
                label="Created By"
                type="text"
                name="created_by"
                value={fields.created_by}
                onChange={handleChange}
                placeholder="Current admin user"
              />
            </div>

            <div className="space-y-3">
              <h4 className="text-md font-medium text-blue-200">Account Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={fields.is_active}
                    onChange={handleChange}
                    className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-300">Account Active</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="is_verified"
                    checked={fields.is_verified}
                    onChange={handleChange}
                    className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-300">Email Verified</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="require_password_change"
                    checked={fields.require_password_change}
                    onChange={handleChange}
                    className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-300">Require Password Change</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="force_mfa"
                    checked={fields.force_mfa}
                    onChange={handleChange}
                    className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-300">Force MFA</span>
                </label>
              </div>
            </div>

            <div>
              <label className={labelClasses}>Permissions (comma-separated)</label>
              <input
                type="text"
                value={fields.permissions.join(", ")}
                onChange={(e) => handleArrayField("permissions", e.target.value)}
                className={inputClasses}
                placeholder="read:users, write:reports, admin:all"
              />
            </div>

            <div>
              <label className={labelClasses}>Organization Access (comma-separated)</label>
              <input
                type="text"
                value={fields.organization_access.join(", ")}
                onChange={(e) => handleArrayField("organization_access", e.target.value)}
                className={inputClasses}
                placeholder="org1, org2, org3"
              />
            </div>
          </div>
        );

      case 3: // Security & Access
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Max Concurrent Sessions</label>
                <input
                  type="number"
                  name="max_sessions"
                  value={fields.max_sessions}
                  onChange={handleChange}
                  min="1"
                  max="20"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Session Timeout (minutes)</label>
                <input
                  type="number"
                  name="session_timeout"
                  value={fields.session_timeout}
                  onChange={handleChange}
                  min="15"
                  max="10080"
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Password Expires In (days)</label>
                <input
                  type="number"
                  name="password_expires_in"
                  value={fields.password_expires_in}
                  onChange={handleChange}
                  min="30"
                  max="365"
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Failed Login Threshold</label>
                <input
                  type="number"
                  name="failed_login_threshold"
                  value={fields.failed_login_threshold}
                  onChange={handleChange}
                  min="3"
                  max="10"
                  className={inputClasses}
                />
              </div>
            </div>
          </div>
        );

      case 4: // Notifications
        return (
          <div className="space-y-4">
            <h4 className="text-md font-medium text-blue-200">Notification Preferences</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="email_notifications"
                  checked={fields.email_notifications}
                  onChange={handleChange}
                  className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-300">Email Notifications</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="security_alerts"
                  checked={fields.security_alerts}
                  onChange={handleChange}
                  className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-300">Security Alerts</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="marketing_emails"
                  checked={fields.marketing_emails}
                  onChange={handleChange}
                  className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-300">Marketing Emails</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="weekly_digest"
                  checked={fields.weekly_digest}
                  onChange={handleChange}
                  className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-300">Weekly Digest</span>
              </label>
            </div>
            <div>
              <label className={labelClasses}>Tags (comma-separated)</label>
              <input
                type="text"
                value={fields.tags.join(", ")}
                onChange={(e) => handleArrayField("tags", e.target.value)}
                className={inputClasses}
                placeholder="vip, beta-tester, contractor"
              />
            </div>
            <div>
              <label className={labelClasses}>Notes</label>
              <textarea
                name="notes"
                value={fields.notes}
                onChange={handleChange}
                rows={3}
                className={inputClasses}
                placeholder="Internal notes about this user"
              />
            </div>
          </div>
        );

      case 5: // Custom Fields
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-md font-medium text-blue-200">Custom Fields</h4>
              <Button type="button" onClick={addCustomField} variant="outline">
                Add Field
              </Button>
            </div>
            <div className="space-y-3">
              {Object.entries(customFields).map(([key, value]) => (
                <div key={key} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">{key}</label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleCustomFieldChange(key, e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                  <Button 
                    type="button" 
                    onClick={() => removeCustomField(key)}
                    variant="outline"
                    className="text-red-400 border-red-400 hover:bg-red-400/10"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              {Object.keys(customFields).length === 0 && (
                <p className="text-gray-400 text-sm">No custom fields added yet.</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl">
      <div className="text-white max-h-[80vh] overflow-auto scrollbar-hide">
        <h2 className="text-2xl font-bold text-blue-300 mb-6">
          Create New User Account
        </h2>

        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Section Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {sections.map((section, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSection(index)}
              className={`px-3 py-1 rounded text-sm ${
                currentSection === index 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {section}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
            <h3 className="text-lg font-semibold text-blue-300 mb-4">
              {sections[currentSection]}
            </h3>
            {renderSection()}
          </div>

          {/* Navigation and Form Actions */}
          <div className="flex justify-between items-center pt-4">
            <div className="space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                disabled={currentSection === 0}
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
                disabled={currentSection === sections.length - 1}
              >
                Next
              </Button>
            </div>
            
            <div className="space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create User"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
