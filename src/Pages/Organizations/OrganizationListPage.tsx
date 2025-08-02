import { useState } from "react";
import OrganizationCreateModal from "./CreateOrganizationModal";
import { useGetOrgsQuery } from "../../Redux/api/organizationsApi";
import Button from "../../components/Common/Button";

export default function OrganizationListPage() {
  const { data: orgs, isLoading, error, refetch } = useGetOrgsQuery();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-400">Organizations</h1>
          <Button onClick={() => setShowModal(true)}>Add Organization</Button>
        </div>
        {isLoading && <div className="text-center py-8">Loading...</div>}
        {error && (
          <div className="text-center py-8 text-red-400">
            Failed to load organizations.
          </div>
        )}
        {!isLoading &&
          !error &&
          (Array.isArray(orgs)
            ? orgs.length === 0
            : orgs?.managed_orgs?.length === 0) && (
            <div className="text-center text-gray-400 py-12">
              No organizations found.
            </div>
          )}
        <div className="space-y-4">
          {(Array.isArray(orgs) ? orgs : orgs?.managed_orgs)?.map((org) => (
            <div
              key={org.client_name}
              className="bg-gray-800 rounded-lg shadow p-6 border border-blue-700 flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="text-lg font-semibold text-blue-300">
                  {org.organization_name}
                </div>
                <div className="text-gray-400 text-sm">{org.client_name}</div>
                <div className="text-xs text-gray-500">
                  {org.sector}{" "}
                  {org.website_url && (
                    <>
                      |{" "}
                      <a
                        href={org.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-blue-500"
                      >
                        {org.website_url}
                      </a>
                    </>
                  )}
                </div>
              </div>
              <div className="mt-2 md:mt-0 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    (window.location.href = `/orgs/${org.client_name}`)
                  }
                >
                  View
                </Button>
                <Button variant="ghost" onClick={refetch}>
                  Refresh
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showModal && (
        <OrganizationCreateModal
          onClose={() => {
            setShowModal(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}
