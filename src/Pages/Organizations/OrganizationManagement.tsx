import React, { useState } from "react";
import { useGetOrganizationsQuery } from "../../Redux/api/orgSubscriptionApi";
import EditOrganizationModal from "./EditOrganizationModal";
import Button from "../../components/Common/Button";
import type { OrgDetails } from "../../Redux/slices/orgSubscriptionSlice";

const OrganizationManagement: React.FC = () => {
  const { data: organizations = [], isLoading, isError, refetch } = useGetOrganizationsQuery();
  const [selectedOrg, setSelectedOrg] = useState<OrgDetails | null>(null);

  return (
    <div className="p-8 min-h-screen bg-gray-900 text-white">
      <h2 className="text-3xl font-bold text-blue-500 mb-8">Organization Management</h2>
      {isLoading ? (
        <p>Loading organizations...</p>
      ) : isError ? (
        <p className="text-red-500">Failed to load organizations.</p>
      ) : (
        <table className="min-w-full bg-gray-800 text-white rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-blue-300">Name</th>
              <th className="px-4 py-2 text-left text-blue-300">Domain</th>
              <th className="px-4 py-2 text-left text-blue-300">Sector</th>
              <th className="px-4 py-2 text-left text-blue-300">Website</th>
              <th className="px-4 py-2 text-left text-blue-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map(org => (
              <tr key={org.clientName}>
                <td className="px-4 py-2">{org.orgName}</td>
                <td className="px-4 py-2">{org.orgDomain}</td>
                <td className="px-4 py-2">{org.sector || "N/A"}</td>
                <td className="px-4 py-2">
                  {org.websiteUrl ? (
                    <a href={org.websiteUrl} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                      {org.websiteUrl}
                    </a>
                  ) : "N/A"}
                </td>
                <td className="px-4 py-2">
                  <Button onClick={() => setSelectedOrg(org)} className="bg-blue-700 hover:bg-blue-800">Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedOrg && (
        <EditOrganizationModal
          org={selectedOrg}
          onClose={() => setSelectedOrg(null)}
          onSave={() => { setSelectedOrg(null); refetch(); }}
        />
      )}
    </div>
  );
};

export default OrganizationManagement;
