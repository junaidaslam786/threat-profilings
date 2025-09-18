import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks";
import {
  closeApplicationModal,
  updateApplicationForm,
  setApplicationFormErrors,
  clearApplicationFormErrors,
} from "../../Redux/slices/applicationsSlice";
import {
  useCreateApplicationMutation,
  useUpdateApplicationMutation,
} from "../../Redux/api/applicationsApi";
import Modal from "../Common/Modal";
import InputField from "../Common/InputField";
import TextArea from "../Common/TextArea";
import MultiSelect from "../Common/MultiSelect";
import Button from "../Common/Button";
import { useUser } from "../../hooks/useUser";
import type {
  ApplicationFormData,
  ApplicationFormErrors,
} from "../../Redux/slices/types/applicationTypes";

// Import constants
import {
  APP_TYPES as AppTypeOptions,
  APP_PRIORITIES as AppPriorityOptions,
  COMMON_TECHNOLOGIES as TechnologyOptions,
} from "../../Redux/slices/types/applicationTypes";

interface ApplicationModalProps {
  className?: string;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  className = "",
}) => {
  const dispatch = useAppDispatch();
  const { isOrgAdmin, isLEAdmin } = useUser();

  const {
    isApplicationModalOpen,
    modalMode,
    selectedApplication,
    applicationForm,
    applicationFormErrors,
    loading,
  } = useAppSelector((state) => state.applications);

  const [createApplication] = useCreateApplicationMutation();
  const [updateApplication] = useUpdateApplicationMutation();

  const [customTechnology, setCustomTechnology] = useState("");
  const [showCustomTechnologyInput, setShowCustomTechnologyInput] =
    useState(false);

  // Check user permissions - use role checking functions from useUser
  const canCreateEdit = isOrgAdmin || isLEAdmin;

  // Technology options with custom input
  const technologyOptions = [
    ...TechnologyOptions.map((tech) => ({ value: tech, label: tech })),
    { value: "__custom__", label: "+ Add Custom Technology" },
  ];

  useEffect(() => {
    if (isApplicationModalOpen) {
      dispatch(clearApplicationFormErrors());
    }
  }, [isApplicationModalOpen, dispatch]);

  const handleClose = () => {
    dispatch(closeApplicationModal());
    setCustomTechnology("");
    setShowCustomTechnologyInput(false);
  };

  const handleInputChange = (
    field: keyof ApplicationFormData,
    value: string | string[]
  ) => {
    dispatch(updateApplicationForm({ [field]: value }));

    // Clear field-specific error when user starts typing
    if (applicationFormErrors[field]) {
      dispatch(
        setApplicationFormErrors({
          ...applicationFormErrors,
          [field]: undefined,
        })
      );
    }
  };

  const handleTechnologyChange = (selectedValues: string[]) => {
    const hasCustom = selectedValues.includes("__custom__");
    const cleanValues = selectedValues.filter((v) => v !== "__custom__");

    if (hasCustom && !showCustomTechnologyInput) {
      setShowCustomTechnologyInput(true);
    }

    handleInputChange("technologies", cleanValues);
  };

  const handleAddCustomTechnology = () => {
    if (
      customTechnology.trim() &&
      !applicationForm.technologies.includes(customTechnology.trim())
    ) {
      const newTechnologies = [
        ...applicationForm.technologies,
        customTechnology.trim(),
      ];
      handleInputChange("technologies", newTechnologies);
      setCustomTechnology("");
      setShowCustomTechnologyInput(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: ApplicationFormErrors = {};

    // Required field validation
    if (!applicationForm.appName.trim()) {
      errors.appName = "Application name is required";
    } else if (applicationForm.appName.length < 2) {
      errors.appName = "Application name must be at least 2 characters";
    } else if (applicationForm.appName.length > 100) {
      errors.appName = "Application name must be less than 100 characters";
    }

    // Optional field validation
    if (
      applicationForm.description &&
      applicationForm.description.length > 500
    ) {
      errors.description = "Description must be less than 500 characters";
    }

    if (applicationForm.repositoryUrl && applicationForm.repositoryUrl.trim()) {
      const urlPattern =
        /^https?:\/\/[\w-_]+(\.[\w-_]+)+([\w-.,@?^=%&:/~+#]*[\w-@?^=%&/~+#])?$/;
      if (!urlPattern.test(applicationForm.repositoryUrl)) {
        errors.repositoryUrl = "Please enter a valid repository URL";
      }
    }

    if (applicationForm.deploymentUrl && applicationForm.deploymentUrl.trim()) {
      const urlPattern =
        /^https?:\/\/[\w-_]+(\.[\w-_]+)+([\w-.,@?^=%&:/~+#]*[\w-@?^=%&/~+#])?$/;
      if (!urlPattern.test(applicationForm.deploymentUrl)) {
        errors.deploymentUrl = "Please enter a valid deployment URL";
      }
    }

    // if (applicationForm.contactEmail && applicationForm.contactEmail.trim()) {
    //   const emailPattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    //   if (!emailPattern.test(applicationForm.contactEmail)) {
    //     errors.contactEmail = "Please enter a valid email address";
    //   }
    // }

    if (Object.keys(errors).length > 0) {
      dispatch(setApplicationFormErrors(errors));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canCreateEdit) {
      toast.error("You do not have permission to perform this action");
      return;
    }

    if (!validateForm()) {
      toast.error("Please correct the form errors before submitting");
      return;
    }

    try {
      const formData = {
        appName: applicationForm.appName.trim(),
        description: applicationForm.description?.trim() || undefined,
        appType: applicationForm.appType,
        technologies: applicationForm.technologies,
        repositoryUrl: applicationForm.repositoryUrl?.trim() || undefined,
        deploymentUrl: applicationForm.deploymentUrl?.trim() || undefined,
        contactEmail: applicationForm.contactEmail?.trim() || undefined,
        priority: applicationForm.priority,
      };

      if (modalMode === "create") {
        await createApplication(formData).unwrap();
        toast.success("Application created successfully");
      } else if (modalMode === "edit" && selectedApplication) {
        await updateApplication({
          appId: selectedApplication.app_id,
          data: formData,
        }).unwrap();
        toast.success("Application updated successfully");
      }

      handleClose();
    } catch (error: unknown) {
      console.error("Error saving application:", error);

      // Handle different types of errors
      if (error && typeof error === "object" && "data" in error) {
        const apiError = error as {
          data?: { message?: string; error?: string };
        };
        if (apiError.data?.message) {
          toast.error(apiError.data.message);
        } else if (apiError.data?.error) {
          toast.error(apiError.data.error);
        } else {
          toast.error(
            `Failed to ${
              modalMode === "create" ? "create" : "update"
            } application`
          );
        }
      } else if (error && typeof error === "object" && "message" in error) {
        const standardError = error as { message: string };
        toast.error(standardError.message);
      } else {
        toast.error(
          `Failed to ${
            modalMode === "create" ? "create" : "update"
          } application`
        );
      }
    }
  };

  const modalTitle =
    modalMode === "create"
      ? "Create New Application"
      : modalMode === "edit"
      ? "Edit Application"
      : "Application Details";

  const isViewMode = modalMode === "view";
  const isLoading = loading.creating || loading.updating;

  return (
    <Modal
      show={isApplicationModalOpen}
      onClose={handleClose}
      size="xl"
      className={className}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-secondary-700 pb-4">
          <h2 className="text-2xl font-bold text-white mb-2">{modalTitle}</h2>
          {modalMode === "create" && (
            <p className="text-secondary-300 text-sm">
              Add a new application to your organization for threat profiling
              and security assessment.
            </p>
          )}
        </div>

        {/* Permission Check */}
        {!canCreateEdit && modalMode !== "view" && (
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-yellow-400 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-yellow-300 text-sm">
                You don't have permission to {modalMode} applications. Only
                administrators can {modalMode} applications.
              </span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Application Name */}
            <div className="md:col-span-2">
              <InputField
                label="Application Name *"
                type="text"
                name="appName"
                value={applicationForm.appName}
                onChange={(e) => handleInputChange("appName", e.target.value)}
                placeholder="Enter application name"
                error={applicationFormErrors.appName}
                required
                className={
                  isViewMode ? "bg-secondary-700 text-secondary-300" : ""
                }
              />
            </div>

            {/* Application Type */}
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Application Type
              </label>
              <select
                value={applicationForm.appType}
                onChange={(e) => handleInputChange("appType", e.target.value)}
                disabled={isViewMode}
                className={`shadow appearance-none border rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-secondary-600 focus:border-transparent transition duration-300 ease-in-out
                  ${
                    isViewMode
                      ? "bg-secondary-700 text-secondary-300"
                      : "border-gray-600 bg-gray-700 text-white"
                  }`}
              >
                {AppTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {applicationFormErrors.appType && (
                <p className="text-red-500 text-xs italic mt-1">
                  {applicationFormErrors.appType}
                </p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Priority Level
              </label>
              <select
                value={applicationForm.priority}
                onChange={(e) => handleInputChange("priority", e.target.value)}
                disabled={isViewMode}
                className={`shadow appearance-none border rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-secondary-600 focus:border-transparent transition duration-300 ease-in-out
                  ${
                    isViewMode
                      ? "bg-secondary-700 text-secondary-300"
                      : "border-gray-600 bg-gray-700 text-white"
                  }`}
              >
                {AppPriorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {applicationFormErrors.priority && (
                <p className="text-red-500 text-xs italic mt-1">
                  {applicationFormErrors.priority}
                </p>
              )}
            </div>

            {/* Repository URL */}
            <div>
              <InputField
                label="Repository URL"
                type="url"
                name="repositoryUrl"
                value={applicationForm.repositoryUrl}
                onChange={(e) =>
                  handleInputChange("repositoryUrl", e.target.value)
                }
                placeholder="https://github.com/..."
                error={applicationFormErrors.repositoryUrl}
                className={
                  isViewMode ? "bg-secondary-700 text-secondary-300" : ""
                }
              />
            </div>

            {/* Deployment URL */}
            <div>
              <InputField
                label="Deployment URL"
                type="url"
                name="deploymentUrl"
                value={applicationForm.deploymentUrl}
                onChange={(e) =>
                  handleInputChange("deploymentUrl", e.target.value)
                }
                placeholder="https://app.example.com"
                error={applicationFormErrors.deploymentUrl}
                className={
                  isViewMode ? "bg-secondary-700 text-secondary-300" : ""
                }
              />
            </div>

            {/* Contact Email */}
            <div>
              <InputField
                label="Contact Email"
                type="email"
                name="contactEmail"
                value={applicationForm.contactEmail}
                onChange={(e) =>
                  handleInputChange("contactEmail", e.target.value)
                }
                placeholder="contact@example.com"
                error={applicationFormErrors.contactEmail}
                className={
                  isViewMode ? "bg-secondary-700 text-secondary-300" : ""
                }
              />
            </div>
          </div>

          {/* Technologies */}
          <div>
            <MultiSelect
              id="technologies"
              label="Technologies"
              options={technologyOptions}
              values={applicationForm.technologies}
              onChange={handleTechnologyChange}
              placeholder="Select technologies used..."
              error={applicationFormErrors.technologies}
              disabled={isViewMode}
              searchable
            />

            {/* Custom Technology Input */}
            {showCustomTechnologyInput && !isViewMode && (
              <div className="mt-3 p-4 bg-secondary-800 rounded-lg border border-secondary-600">
                <label className="block text-gray-300 text-sm font-bold mb-2">
                  Add Custom Technology
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTechnology}
                    onChange={(e) => setCustomTechnology(e.target.value)}
                    placeholder="Enter technology name"
                    className="shadow appearance-none border rounded-lg flex-1 py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-secondary-600 focus:border-transparent transition duration-300 ease-in-out border-gray-600 bg-gray-700 text-white"
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleAddCustomTechnology()
                    }
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTechnology}
                    className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomTechnologyInput(false);
                      setCustomTechnology("");
                    }}
                    className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <TextArea
              label="Description"
              name="description"
              value={applicationForm.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the application, its purpose, and key features..."
              rows={4}
              className={
                isViewMode ? "bg-secondary-700 text-secondary-300" : ""
              }
            />
            {applicationFormErrors.description &&
              toast.error(applicationFormErrors.description)}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-secondary-700">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              {isViewMode ? "Close" : "Cancel"}
            </Button>

            {!isViewMode && canCreateEdit && (
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {modalMode === "create" ? "Creating..." : "Updating..."}
                  </div>
                ) : modalMode === "create" ? (
                  "Create Application"
                ) : (
                  "Update Application"
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ApplicationModal;
