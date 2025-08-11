import { useState } from "react";
import {
  useCreateOrgMutation,
  useCreateLeOrgMutation,
  useUpdateOrgMutation,
} from "../../Redux/api/organizationsApi";
import Button from "../../components/Common/Button";
import Modal from "../../components/Common/Modal";
import type {
  CreateOrgDto,
  LeCreateOrgDto,
  UpdateOrgDto,
  ClientDataDto,
} from "../../Redux/slices/organizationsSlice";

interface EnhancedOrgModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editingOrg?: ClientDataDto | null;
  isLEOrg?: boolean;
}

export default function EnhancedOrganizationModal({
  isOpen,
  onClose,
  onSuccess,
  editingOrg = null,
  isLEOrg = false,
}: EnhancedOrgModalProps) {
  const [createOrg, { isLoading: isCreating }] = useCreateOrgMutation();
  const [createLeOrg, { isLoading: isCreatingLE }] = useCreateLeOrgMutation();
  const [updateOrg, { isLoading: isUpdating }] = useUpdateOrgMutation();

  const [fields, setFields] = useState({
    orgName: editingOrg?.organization_name || "",
    orgDomain: editingOrg?.org_domain || "",
    sector: editingOrg?.sector || "",
    websiteUrl: editingOrg?.website_url || "",
    countriesOfOperation: editingOrg?.countries_of_operation?.join(", ") || "",
    homeUrl: editingOrg?.home_url || "",
    aboutUsUrl: editingOrg?.about_us_url || "",
    additionalDetails: editingOrg?.additional_details || "",
    industry: editingOrg?.sector || "", // For LE orgs
    org_size: "1-10" as const,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isLoading = isCreating || isCreatingLE || isUpdating;
  const isEditing = !!editingOrg;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fields.orgName || !fields.orgDomain) {
      setError("Organization name and domain are required.");
      return;
    }

    try {
      const countriesArray = fields.countriesOfOperation
        ? fields.countriesOfOperation
            .split(",")
            .map((country) => country.trim())
            .filter((country) => country)
        : [];

      if (isEditing && editingOrg) {
        // Update existing organization
        const updateData: UpdateOrgDto = {
          orgName: fields.orgName,
          sector: fields.sector || undefined,
          websiteUrl: fields.websiteUrl || undefined,
          countriesOfOperation:
            countriesArray.length > 0 ? countriesArray : undefined,
          homeUrl: fields.homeUrl || undefined,
          aboutUsUrl: fields.aboutUsUrl || undefined,
          additionalDetails: fields.additionalDetails || undefined,
        };

        await updateOrg({
          clientName: editingOrg.client_name,
          body: updateData,
        }).unwrap();

        setSuccess("Organization updated successfully!");
      } else if (isLEOrg) {
        // Create LE organization
        const leOrgData: LeCreateOrgDto = {
          org_name: fields.orgName,
          org_domain: fields.orgDomain,
          industry: fields.industry,
          org_size: fields.org_size,
          websiteUrl: fields.websiteUrl || undefined,
          countriesOfOperation:
            countriesArray.length > 0 ? countriesArray : undefined,
          homeUrl: fields.homeUrl || undefined,
          aboutUsUrl: fields.aboutUsUrl || undefined,
          additionalDetails: fields.additionalDetails || undefined,
        };

        await createLeOrg(leOrgData).unwrap();
        setSuccess("LE Organization created successfully!");
      } else {
        // Create standard organization
        const orgData: CreateOrgDto = {
          orgName: fields.orgName,
          orgDomain: fields.orgDomain,
          sector: fields.sector || undefined,
          websiteUrl: fields.websiteUrl || undefined,
          countriesOfOperation:
            countriesArray.length > 0 ? countriesArray : undefined,
          homeUrl: fields.homeUrl || undefined,
          aboutUsUrl: fields.aboutUsUrl || undefined,
          additionalDetails: fields.additionalDetails || undefined,
        };

        await createOrg(orgData).unwrap();
        setSuccess("Organization created successfully!");
      }

      // Reset form
      setFields({
        orgName: "",
        orgDomain: "",
        sector: "",
        websiteUrl: "",
        countriesOfOperation: "",
        homeUrl: "",
        aboutUsUrl: "",
        additionalDetails: "",
        industry: "",
        org_size: "1-10",
      });

      setTimeout(() => {
        onSuccess?.();
        onClose();
        setSuccess("");
      }, 1500);
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "data" in err) {
        const errorData = err as { data?: { message?: string } };
        setError(
          errorData.data?.message ||
            `Failed to ${isEditing ? "update" : "create"} organization`
        );
      } else {
        setError(`Failed to ${isEditing ? "update" : "create"} organization`);
      }
    }
  };

  const inputClasses =
    "w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl">
      <div className="text-white max-h-[80vh] overflow-auto scrollbar-hide">
        <h2 className="text-2xl font-bold text-blue-300 mb-6">
          {isEditing
            ? "Edit Organization"
            : isLEOrg
            ? "Create LE Organization"
            : "Create Organization"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-900/20 border border-green-500 text-green-400 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Organization Name *</label>
              <input
                type="text"
                name="orgName"
                value={fields.orgName}
                onChange={handleChange}
                placeholder="Acme Corporation"
                className={inputClasses}
                required
              />
            </div>

            <div>
              <label className={labelClasses}>Organization Domain *</label>
              <input
                type="text"
                name="orgDomain"
                value={fields.orgDomain}
                onChange={handleChange}
                placeholder="acme.com"
                className={inputClasses}
                required
                disabled={isEditing} // Domain usually shouldn't be changed
              />
            </div>
          </div>

          {/* Industry/Sector */}
          {isLEOrg ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Industry *</label>
                <input
                  type="text"
                  name="industry"
                  value={fields.industry}
                  onChange={handleChange}
                  placeholder="Large Enterprise"
                  className={inputClasses}
                  required
                />
              </div>

              <div>
                <label className={labelClasses}>Organization Size</label>
                <select
                  name="org_size"
                  value={fields.org_size}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-100">51-100 employees</option>
                  <option value="101-500">101-500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </div>
            </div>
          ) : (
            <div>
              <label className={labelClasses}>Sector/Industry</label>
              <input
                type="text"
                name="sector"
                value={fields.sector}
                onChange={handleChange}
                placeholder="Technology, Healthcare, Finance, etc."
                className={inputClasses}
              />
            </div>
          )}

          {/* Website Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Website URL</label>
              <input
                type="url"
                name="websiteUrl"
                value={fields.websiteUrl}
                onChange={handleChange}
                placeholder="https://www.acme.com"
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>Home Page URL</label>
              <input
                type="url"
                name="homeUrl"
                value={fields.homeUrl}
                onChange={handleChange}
                placeholder="https://www.acme.com/home"
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>About Us URL</label>
            <input
              type="url"
              name="aboutUsUrl"
              value={fields.aboutUsUrl}
              onChange={handleChange}
              placeholder="https://www.acme.com/about"
              className={inputClasses}
            />
          </div>

          {/* Countries of Operation */}
          <div>
            <label className={labelClasses}>Countries of Operation</label>
            <input
              type="text"
              name="countriesOfOperation"
              value={fields.countriesOfOperation}
              onChange={handleChange}
              placeholder="USA, Canada, UK (comma-separated)"
              className={inputClasses}
            />
            <p className="text-gray-400 text-sm mt-1">
              Enter countries separated by commas
            </p>
          </div>

          {/* Additional Details */}
          <div>
            <label className={labelClasses}>Additional Details</label>
            <textarea
              name="additionalDetails"
              value={fields.additionalDetails}
              onChange={handleChange}
              placeholder="Any additional information about the organization..."
              rows={4}
              className={inputClasses}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                ? "Update Organization"
                : "Create Organization"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
