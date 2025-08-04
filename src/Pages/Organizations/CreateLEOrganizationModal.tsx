import Button from "../../components/Common/Button";
import Modal from "../../components/Common/Modal";
import { useCreateOrgMutation } from "../../Redux/api/organizationsApi";
import { useState } from "react";

export default function LEOrganizationCreateModal({
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

  return (
    <Modal show={isOpen} onClose={onClose} size="xl">
      <div className="text-white max-h-[80vh] overflow-auto scrollbar-hide">
        <h2 className="text-xl font-bold text-blue-300 mb-4">
          Create LE Organization
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-2">
          <input
            className="w-full p-2 rounded bg-gray-700 border border-blue-900"
            name="orgName"
            placeholder="Organization Name *"
            value={fields.orgName}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-2 rounded bg-gray-700 border border-blue-900"
            name="orgDomain"
            placeholder="Domain (e.g. acme.com) *"
            value={fields.orgDomain}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-2 rounded bg-gray-700 border border-blue-900"
            name="sector"
            placeholder="Sector"
            value={fields.sector}
            onChange={handleChange}
          />
          <input
            className="w-full p-2 rounded bg-gray-700 border border-blue-900"
            name="websiteUrl"
            placeholder="Website URL"
            value={fields.websiteUrl}
            onChange={handleChange}
          />
          <input
            className="w-full p-2 rounded bg-gray-700 border border-blue-900"
            name="countriesOfOperation"
            placeholder="Countries (comma-separated)"
            value={fields.countriesOfOperation}
            onChange={handleChange}
          />
          <input
            className="w-full p-2 rounded bg-gray-700 border border-blue-900"
            name="homeUrl"
            placeholder="Home URL"
            value={fields.homeUrl}
            onChange={handleChange}
          />
          <input
            className="w-full p-2 rounded bg-gray-700 border border-blue-900"
            name="aboutUsUrl"
            placeholder="About Us URL"
            value={fields.aboutUsUrl}
            onChange={handleChange}
          />
          <textarea
            className="w-full p-2 rounded bg-gray-700 border border-blue-900"
            name="additionalDetails"
            placeholder="Additional Details"
            value={fields.additionalDetails}
            onChange={handleChange}
          />
          </div>
          <div className="flex gap-2 mt-4">
            <Button type="submit" loading={isLoading}>
              Create
            </Button>
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
