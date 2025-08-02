import { useParams } from "react-router-dom";
import { useState } from "react";
import { useGetAllOrgsQuery, useUpdateOrgMutation } from "../../Redux/api/organizationsApi";
import Button from "../../components/Common/Button";

export default function OrganizationDetailPage() {
  const { client_name } = useParams<{ client_name: string }>();
  const {
    data: allOrgs,
    isLoading,
    error,
    refetch,
  } = useGetAllOrgsQuery();
  
  const org = allOrgs?.find((o) => o.client_name === client_name);
  const [editing, setEditing] = useState(false);
  type OrgFields = {
    sector: string;
    websiteUrl: string;
    countriesOfOperation: string;
    homeUrl: string;
    aboutUsUrl: string;
    additionalDetails: string;
  };

  const [fields, setFields] = useState<OrgFields>({
    sector: "",
    websiteUrl: "",
    countriesOfOperation: "",
    homeUrl: "",
    aboutUsUrl: "",
    additionalDetails: "",
  });
  const [updateOrg, { isLoading: isUpdating }] = useUpdateOrgMutation();
  const [errMsg, setErrMsg] = useState("");

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  if (error || !org)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400">
        Organization not found.
      </div>
    );

  const startEdit = () => {
    setFields({
      sector: org.sector || "",
      websiteUrl: org.website_url || "",
      countriesOfOperation: (org.countries_of_operation || []).join(", "),
      homeUrl: org.home_url || "",
      aboutUsUrl: org.about_us_url || "",
      additionalDetails: org.additional_details || "",
    });
    setEditing(true);
    setErrMsg("");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFields((prev: OrgFields) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg("");
    try {
      await updateOrg({
        clientName: org.client_name,
        body: {
          sector: fields.sector,
          websiteUrl: fields.websiteUrl,
          countriesOfOperation: fields.countriesOfOperation
            .split(",")
            .map((c: string) => c.trim())
            .filter(Boolean),
          homeUrl: fields.homeUrl,
          aboutUsUrl: fields.aboutUsUrl,
          additionalDetails: fields.additionalDetails,
        },
      }).unwrap();
      setEditing(false);
      refetch();
    } catch (err: unknown) {
      interface ErrorWithMessage {
        data?: {
          message?: string;
        };
      }
      if (
        err &&
        typeof err === "object" &&
        "data" in err &&
        (err as ErrorWithMessage).data &&
        typeof (err as ErrorWithMessage).data?.message === "string"
      ) {
        setErrMsg((err as ErrorWithMessage).data!.message!);
      } else {
        setErrMsg("Update failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-xl mx-auto bg-gray-800 rounded-xl shadow-lg border border-blue-700 p-8">
        <h1 className="text-2xl font-bold text-blue-300 mb-2">
          {org.organization_name}
        </h1>
        <div className="text-gray-400 text-sm mb-4">{org.client_name}</div>
        {!editing ? (
          <>
            <div className="mb-3">
              <span className="text-blue-400 font-semibold">Sector:</span>{" "}
              {org.sector || "-"}
            </div>
            <div className="mb-3">
              <span className="text-blue-400 font-semibold">Website:</span>{" "}
              {org.website_url ? (
                <a
                  href={org.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-500"
                >
                  {org.website_url}
                </a>
              ) : (
                "-"
              )}
            </div>
            <div className="mb-3">
              <span className="text-blue-400 font-semibold">Countries:</span>{" "}
              {org.countries_of_operation?.join(", ") || "-"}
            </div>
            <div className="mb-3">
              <span className="text-blue-400 font-semibold">Home URL:</span>{" "}
              {org.home_url || "-"}
            </div>
            <div className="mb-3">
              <span className="text-blue-400 font-semibold">About Us:</span>{" "}
              {org.about_us_url || "-"}
            </div>
            <div className="mb-3">
              <span className="text-blue-400 font-semibold">Additional:</span>{" "}
              {org.additional_details || "-"}
            </div>
            <Button className="mt-4" onClick={startEdit}>
              Edit Organization
            </Button>
          </>
        ) : (
          <form className="space-y-2" onSubmit={handleSave}>
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
            {errMsg && <div className="text-red-400">{errMsg}</div>}
            <div className="flex gap-2 mt-4">
              <Button type="submit" loading={isUpdating}>
                Save
              </Button>
              <Button
                variant="ghost"
                type="button"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
