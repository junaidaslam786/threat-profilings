import Modal from "../../components/Common/Modal";
import { useCreateOrgMutation } from "../../Redux/api/organizationsApi";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function OrganizationCreateModal({
  onClose,
  isOpen = true,
}: {
  onClose: () => void;
  isOpen?: boolean;
}) {
  const [createOrg, { isLoading }] = useCreateOrgMutation();
  const [fields, setFields] = useState({
    orgName: "",
    orgDomain: "",
    sector: "",
    websiteUrl: "",
    countriesOfOperation: "",
    homeUrl: "",
    aboutUsUrl: "",
    additionalDetails: "",
  });
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!fields.orgName || !fields.orgDomain) {
      setError("Organization name and domain are required.");
      return;
    }

    type ApiError = {
      data?: {
        message?: string;
      };
    };

    try {
      await createOrg({
        orgName: fields.orgName,
        orgDomain: fields.orgDomain,
        sector: fields.sector,
        websiteUrl: fields.websiteUrl,
        countriesOfOperation: fields.countriesOfOperation
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        homeUrl: fields.homeUrl,
        aboutUsUrl: fields.aboutUsUrl,
        additionalDetails: fields.additionalDetails,
      }).unwrap();
      toast.success("Organization created successfully!");
      onClose();
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "data" in err &&
        typeof (err as ApiError).data === "object" &&
        (err as ApiError).data !== null &&
        "message" in ((err as ApiError).data as object)
      ) {
        setError(
          (err as ApiError).data?.message || "Failed to create organization."
        );
      } else {
        setError("Failed to create organization.");
      }
    }
  };

  const commonSectors = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing",
    "Retail",
    "Government",
    "Non-profit",
    "Other"
  ];

  return (
    <Modal show={isOpen} onClose={onClose} size="xl">
      <div className="p-6 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Create Organization</h2>
            <p className="text-secondary-400 text-sm">Set up a new organization with detailed information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-secondary-700/20 rounded-xl p-6 border border-secondary-600/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">
                  Organization Name *
                </label>
                <input
                  className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600/50 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors"
                  name="orgName"
                  placeholder="Enter organization name"
                  value={fields.orgName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">
                  Domain *
                </label>
                <input
                  className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600/50 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors"
                  name="orgDomain"
                  placeholder="example.com"
                  value={fields.orgDomain}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-300 mb-2">
                  Sector
                </label>
                <select
                  className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600/50 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors cursor-pointer"
                  name="sector"
                  value={fields.sector}
                  onChange={handleChange}
                >
                  <option value="">Select a sector</option>
                  {commonSectors.map((sector) => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Web Presence */}
          <div className="bg-secondary-700/20 rounded-xl p-6 border border-secondary-600/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Web Presence</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">
                  Website URL
                </label>
                <input
                  className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600/50 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors"
                  name="websiteUrl"
                  placeholder="https://example.com"
                  value={fields.websiteUrl}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-300 mb-2">
                    Home URL
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600/50 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors"
                    name="homeUrl"
                    placeholder="https://example.com/home"
                    value={fields.homeUrl}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-300 mb-2">
                    About Us URL
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600/50 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors"
                    name="aboutUsUrl"
                    placeholder="https://example.com/about"
                    value={fields.aboutUsUrl}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-secondary-700/20 rounded-xl p-6 border border-secondary-600/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Additional Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">
                  Countries of Operation
                </label>
                <input
                  className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600/50 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors"
                  name="countriesOfOperation"
                  placeholder="USA, Canada, UK (comma-separated)"
                  value={fields.countriesOfOperation}
                  onChange={handleChange}
                />
                <p className="text-secondary-400 text-sm mt-1">Enter countries separated by commas</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-300 mb-2">
                  Additional Details
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-secondary-700/50 border border-secondary-600/50 rounded-lg text-white focus:border-primary-500 focus:outline-none transition-colors resize-none"
                  name="additionalDetails"
                  placeholder="Any additional information about the organization..."
                  value={fields.additionalDetails}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Create Organization</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white rounded-lg hover:from-secondary-500 hover:to-secondary-600 transition-all duration-200 cursor-pointer flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancel</span>
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
