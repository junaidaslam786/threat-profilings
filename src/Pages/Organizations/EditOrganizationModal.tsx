import React, { useState, useEffect } from "react";
import { useUpdateOrganizationMutation, useGetOrganizationQuery } from "../../Redux/api/orgSubscriptionApi";
import Button from "../../components/Common/Button";
import toast from "react-hot-toast";

interface EditOrganizationModalProps {
  org: {
    clientName: string;
    sector?: string;
    websiteUrl?: string;
    countriesOfOperation?: string[];
    homeUrl?: string;
    aboutUsUrl?: string;
    additionalDetails?: string;
    run_number?: number;
  };
  onClose: () => void;
  onSave: () => void;
}

interface FormState {
    sector: string;
    websiteUrl: string;
    countriesOfOperation: string;
    homeUrl: string;
    aboutUsUrl: string;
    additionalDetails: string;
}
interface UpdateOrganizationBody {
    sector: string;
    websiteUrl: string;
    countriesOfOperation: string[];
    homeUrl: string;
    aboutUsUrl: string;
    additionalDetails: string;
}

interface UpdateOrganizationArgs {
    clientName: string;
    body: UpdateOrganizationBody;
}

const EditOrganizationModal: React.FC<EditOrganizationModalProps> = ({ org, onClose, onSave }) => {
  const { data: orgDetails } = useGetOrganizationQuery(org.clientName, { skip: !org.clientName });
  const [form, setForm] = useState({
    sector: org.sector || "",
    websiteUrl: org.websiteUrl || "",
    countriesOfOperation: org.countriesOfOperation ? org.countriesOfOperation.join(", ") : "",
    homeUrl: org.homeUrl || "",
    aboutUsUrl: org.aboutUsUrl || "",
    additionalDetails: org.additionalDetails || "",
  });

  useEffect(() => {
    if (orgDetails) {
      setForm({
        sector: orgDetails.sector || "",
        websiteUrl: orgDetails.websiteUrl || "",
        countriesOfOperation: orgDetails.countriesOfOperation ? orgDetails.countriesOfOperation.join(", ") : "",
        homeUrl: orgDetails.homeUrl || "",
        aboutUsUrl: orgDetails.aboutUsUrl || "",
        additionalDetails: orgDetails.additionalDetails || "",
      });
    }
  }, [orgDetails]);

  const [updateOrganization, { isLoading }] = useUpdateOrganizationMutation();

  // Assume you get this info in orgDetails (adapt as needed)
  const isEditable = !orgDetails?.run_number || orgDetails.run_number === 0;



const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f: FormState) => ({ ...f, [name]: value }));
};



const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
        await updateOrganization({
            clientName: org.clientName,
            body: {
                sector: form.sector,
                websiteUrl: form.websiteUrl,
                countriesOfOperation: form.countriesOfOperation
                    ? form.countriesOfOperation.split(",").map((s: string) => s.trim())
                    : [],
                homeUrl: form.homeUrl,
                aboutUsUrl: form.aboutUsUrl,
                additionalDetails: form.additionalDetails,
            }
        } as UpdateOrganizationArgs).unwrap();
        toast.success("Organization updated!");
        onSave();
    } catch {
        toast.error("Failed to update organization.");
    }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg max-w-md w-full border border-blue-700">
        <h2 className="text-2xl font-bold text-blue-400 mb-4">Edit Organization</h2>
        <label className="block mb-2">Sector</label>
        <input
          name="sector"
          className="mb-4 w-full px-2 py-1 rounded text-black"
          value={form.sector}
          onChange={handleChange}
          disabled={!isEditable}
        />
        <label className="block mb-2">Website URL</label>
        <input
          name="websiteUrl"
          className="mb-4 w-full px-2 py-1 rounded text-black"
          value={form.websiteUrl}
          onChange={handleChange}
          disabled={!isEditable}
        />
        <label className="block mb-2">Countries of Operation (comma separated)</label>
        <input
          name="countriesOfOperation"
          className="mb-4 w-full px-2 py-1 rounded text-black"
          value={form.countriesOfOperation}
          onChange={handleChange}
          disabled={!isEditable}
        />
        <label className="block mb-2">Home URL</label>
        <input
          name="homeUrl"
          className="mb-4 w-full px-2 py-1 rounded text-black"
          value={form.homeUrl}
          onChange={handleChange}
          disabled={!isEditable}
        />
        <label className="block mb-2">About Us URL</label>
        <input
          name="aboutUsUrl"
          className="mb-4 w-full px-2 py-1 rounded text-black"
          value={form.aboutUsUrl}
          onChange={handleChange}
          disabled={!isEditable}
        />
        <label className="block mb-2">Additional Details</label>
        <textarea
          name="additionalDetails"
          className="mb-4 w-full px-2 py-1 rounded text-black"
          value={form.additionalDetails}
          onChange={handleChange}
          disabled={!isEditable}
        />
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} className="bg-gray-700">Cancel</Button>
          <Button
            onClick={handleSubmit}
            className="bg-green-700"
            disabled={!isEditable || isLoading}
          >
            Save
          </Button>
        </div>
        {!isEditable && (
          <div className="text-yellow-400 text-xs mt-2">
            Organization fields cannot be edited after the first profiling run.
          </div>
        )}
      </form>
    </div>
  );
};

export default EditOrganizationModal;
