import { useState } from "react";
import OrganizationCreateModal from "./CreateOrganizationModal";
import { useGetOrgsQuery } from "../../Redux/api/organizationsApi";
import OrganizationListHeader from "../../components/Organizations/OrganizationListHeader";
import OrganizationListState from "../../components/Organizations/OrganizationListState";
import OrganizationList from "../../components/Organizations/OrganizationList";
import OrganizationDetailSidebar from "../../components/Organizations/OrganizationDetailSidebar";
import Navbar from "../../components/Common/Navbar";

interface Organization {
  client_name: string;
  organization_name: string;
  sector?: string;
  website_url?: string;
  description?: string;
  contact_email?: string;
  phone?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

export default function OrganizationListPage() {
  const { data: orgs, isLoading, error, refetch } = useGetOrgsQuery();
  const [showModal, setShowModal] = useState(false);
  const [viewingOrganization, setViewingOrganization] = useState<Organization | null>(null);

  const organizations = Array.isArray(orgs) ? orgs : orgs?.managed_orgs || [];
  const hasNoOrganizations = !isLoading && !error && organizations.length === 0;

  const handleAddOrganization = () => {
    setShowModal(true);
  };

  const handleViewOrganization = (clientName: string) => {
    const org = organizations.find((o: Organization) => o.client_name === clientName);
    if (org) {
      setViewingOrganization(org);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    refetch();
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
        <Navbar />
        
        <div className="max-w-6xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-3">
              Organizations
            </h1>
            <p className="text-secondary-300 text-lg">
              Manage and view your organizations
            </p>
          </div>
          
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
      
      <OrganizationDetailSidebar
        organization={viewingOrganization}
        isOpen={!!viewingOrganization}
        onClose={() => setViewingOrganization(null)}
      />
    </>
  );
}
