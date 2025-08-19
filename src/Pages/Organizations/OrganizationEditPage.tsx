import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetOrgQuery,
  useUpdateOrgMutation,
} from "../../Redux/api/organizationsApi";
import Layout from "../../components/Common/Layout";
import Button from "../../components/Common/Button";
import InputField from "../../components/Common/InputField";
import TextArea from "../../components/Common/TextArea";
import type {
  ClientDataDto,
  UpdateOrgDto,
} from "../../Redux/slices/organizationsSlice";
import type { ApiError } from "../../utils/errorHandling";

const OrganizationEditPage: React.FC = () => {
  const { client_name } = useParams<{ client_name: string }>();
  const navigate = useNavigate();
  const { data: orgData, isLoading } = useGetOrgQuery(client_name!, {
    skip: !client_name,
  });
  const [updateOrg, { isLoading: isUpdating }] = useUpdateOrgMutation();

  const getOrgData = (data: typeof orgData): ClientDataDto | null => {
    if (!data) return null;
    if ("managed_org" in data && data.managed_org) return data.managed_org;
    if ("client_name" in data && "organization_name" in data)
      return data as ClientDataDto;
    return null;
  };

  const org = getOrgData(orgData);

  const [formData, setFormData] = useState<UpdateOrgDto>({
    sector: "",
    websiteUrl: "",
    countriesOfOperation: [],
    homeUrl: "",
    aboutUsUrl: "",
    additionalDetails: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (org) {
      setFormData({
        sector: org.sector || "",
        websiteUrl: org.website_url || "",
        countriesOfOperation: org.countries_of_operation || [],
        homeUrl: org.home_url || "",
        aboutUsUrl: org.about_us_url || "",
        additionalDetails: org.additional_details || "",
      });
    }
  }, [org]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org) return;

    try {
      await updateOrg({
        clientName: org.client_name,
        body: formData,
      }).unwrap();
      navigate("/orgs");
    } catch (err: unknown) {
      setError(
        (err as ApiError)?.data?.message || "Failed to update organization"
      );
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </Layout>
    );
  }

  if (!org) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            Organization Not Found
          </h2>
          <Button onClick={() => navigate("/orgs")}>
            Back to Organizations
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-2">
        <div className="bg-secondary-800/50 rounded-xl border border-secondary-700/30 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Edit Organization
              </h1>
              <p className="text-secondary-400">{org.organization_name}</p>
            </div>
            <Button variant="ghost" onClick={() => navigate("/orgs")}>
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Sector"
                type="text"
                name="sector"
                value={formData.sector || ""}
                onChange={(e) =>
                  setFormData({ ...formData, sector: e.target.value })
                }
                placeholder="e.g., Technology, Healthcare"
              />
              <InputField
                label="Website URL"
                type="url"
                name="websiteUrl"
                value={formData.websiteUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, websiteUrl: e.target.value })
                }
                placeholder="https://example.com"
              />
              <InputField
                label="Home URL"
                type="url"
                name="homeUrl"
                value={formData.homeUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, homeUrl: e.target.value })
                }
                placeholder="https://example.com"
              />
              <InputField
                label="About Us URL"
                type="url"
                name="aboutUsUrl"
                value={formData.aboutUsUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, aboutUsUrl: e.target.value })
                }
                placeholder="https://example.com/about"
              />
            </div>

            <InputField
              label="Countries of Operation"
              type="text"
              name="countriesOfOperation"
              value={
                Array.isArray(formData.countriesOfOperation)
                  ? formData.countriesOfOperation.join(", ")
                  : ""
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  countriesOfOperation: e.target.value
                    .split(",")
                    .map((c) => c.trim())
                    .filter((c) => c),
                })
              }
              placeholder="USA, Canada, UK"
            />

            <TextArea
              label="Additional Details"
              value={formData.additionalDetails}
              onChange={(e) =>
                setFormData({ ...formData, additionalDetails: e.target.value })
              }
              placeholder="Additional information about the organization..."
              rows={4}
            />

            {error && (
              <div className="bg-danger-500/10 border border-danger-500/30 rounded-lg p-4">
                <p className="text-danger-400">{error}</p>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/orgs")}
              >
                Cancel
              </Button>
              <Button type="submit" loading={isUpdating}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default OrganizationEditPage;
