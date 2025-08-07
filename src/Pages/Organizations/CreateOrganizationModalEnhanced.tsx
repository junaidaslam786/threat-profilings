import Button from "../../components/Common/Button";
import Modal from "../../components/Common/Modal";
import PaymentSection from "../../components/Common/PaymentSection";
import { useCreateOrgMutation } from "../../Redux/api/organizationsApi";
import { useState } from "react";

export default function OrganizationCreateModalEnhanced({
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
  const [currentSection, setCurrentSection] = useState(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  const sections = [
    { 
      title: "Basic Information", 
      fields: ["orgName", "orgDomain", "sector"] 
    },
    { 
      title: "Online Presence", 
      fields: ["websiteUrl", "homeUrl", "aboutUsUrl"] 
    },
    { 
      title: "Additional Details", 
      fields: ["countriesOfOperation", "additionalDetails"] 
    },
  ];

  const currentSectionFields = sections[currentSection]?.fields || [];

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="xl">
      <div className="text-white max-h-[80vh] overflow-auto scrollbar-hide">
        <h2 className="text-xl font-bold text-blue-300 mb-4">
          Create Organization
        </h2>
        
        {/* Section Navigation */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {sections.map((section, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSection(index)}
              className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
                currentSection === index 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Current Section Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-300 mb-4">
              {sections[currentSection]?.title}
            </h3>
            
            {currentSectionFields.map((fieldName) => {
              const isTextArea = fieldName === 'additionalDetails';
              const isRequired = fieldName === 'orgName' || fieldName === 'orgDomain';

              const getFieldLabel = (name: string) => {
                switch (name) {
                  case 'orgName': return 'Organization Name';
                  case 'orgDomain': return 'Organization Domain';
                  case 'websiteUrl': return 'Website URL';
                  case 'homeUrl': return 'Home URL';
                  case 'aboutUsUrl': return 'About Us URL';
                  case 'countriesOfOperation': return 'Countries of Operation';
                  case 'additionalDetails': return 'Additional Details';
                  default: return name.charAt(0).toUpperCase() + name.slice(1);
                }
              };

              const getPlaceholder = (name: string) => {
                switch (name) {
                  case 'orgName': return 'Enter organization name';
                  case 'orgDomain': return 'example.com';
                  case 'sector': return 'Technology, Healthcare, Finance, etc.';
                  case 'websiteUrl': return 'https://www.example.com';
                  case 'homeUrl': return 'https://www.example.com/home';
                  case 'aboutUsUrl': return 'https://www.example.com/about';
                  case 'countriesOfOperation': return 'USA, Canada, UK (comma-separated)';
                  case 'additionalDetails': return 'Any additional information about the organization';
                  default: return `Enter ${getFieldLabel(name).toLowerCase()}`;
                }
              };

              return (
                <div key={fieldName} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    {getFieldLabel(fieldName)}
                    {isRequired && " *"}
                  </label>
                  {isTextArea ? (
                    <textarea
                      name={fieldName}
                      value={fields[fieldName as keyof typeof fields]}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-gray-700 border border-blue-900 text-white min-h-[100px]"
                      placeholder={getPlaceholder(fieldName)}
                    />
                  ) : (
                    <input
                      type="text"
                      name={fieldName}
                      value={fields[fieldName as keyof typeof fields]}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-gray-700 border border-blue-900 text-white"
                      placeholder={getPlaceholder(fieldName)}
                      required={isRequired}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center space-x-4 border-t border-gray-700 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={prevSection}
              disabled={currentSection === 0}
            >
              Previous
            </Button>
            
            <span className="text-gray-400 text-sm">
              {currentSection + 1} of {sections.length}
            </span>
            
            {currentSection === sections.length - 1 ? (
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Organization"}
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                onClick={nextSection}
              >
                Next
              </Button>
            )}
          </div>

          {/* Payment Section - Only show on the last section */}
          {currentSection === sections.length - 1 && (
            <div className="mt-6 border-t border-gray-700 pt-6">
              <PaymentSection
                paymentData={{
                  amount: 199.99,
                  client_name: fields.orgName || "Organization",
                  tier: "L1",
                  payment_type: "registration",
                  partner_code: "CYBER20",
                }}
                title="Payment Required - Organization Registration"
                description="Complete your payment to register your organization and access our threat profiling services. This includes basic threat assessment capabilities."
                onPaymentSuccess={() => {
                  console.log("Payment successful for organization registration");
                  // You could auto-submit the form here after successful payment
                }}
                disabled={!fields.orgName || !fields.orgDomain}
              />
            </div>
          )}
        </form>
      </div>
    </Modal>
  );
}
