import { useState } from "react";
import OrganizationCreateModal from "./CreateOrganizationModal";
import { useGetOrgsQuery } from "../../Redux/api/organizationsApi";
import OrganizationListHeader from "../../components/Organizations/OrganizationListHeader";
import OrganizationListState from "../../components/Organizations/OrganizationListState";
import OrganizationList from "../../components/Organizations/OrganizationList";

export default function OrganizationListPage() {
  const { data: orgs, isLoading, error, refetch } = useGetOrgsQuery();
  const [showModal, setShowModal] = useState(false);

  const organizations = Array.isArray(orgs) ? orgs : orgs?.managed_orgs || [];
  const hasNoOrganizations = !isLoading && !error && organizations.length === 0;

  const handleAddOrganization = () => {
    setShowModal(true);
  };

  const handleViewOrganization = (clientName: string) => {
    window.location.href = `/orgs/${clientName}`;
  };

  const handleCloseModal = () => {
    setShowModal(false);
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <OrganizationListHeader onAddOrganization={handleAddOrganization} />
        
        <OrganizationListState 
          isLoading={isLoading}
          error={error}
          hasNoOrganizations={hasNoOrganizations}
        />
        
        {!isLoading && !error && organizations.length > 0 && (
          <OrganizationList 
            organizations={organizations}
            onViewOrganization={handleViewOrganization}
            onRefresh={refetch}
          />
        )}
      </div>
      
      {showModal && (
        <OrganizationCreateModal onClose={handleCloseModal} />
      )}
    </div>
  );
}
