import React, { useState, useMemo, useCallback } from "react";
import OrganizationCreateModal from "./CreateOrganizationModal";
import {
  useGetOrgsQuery,
  useGetAllOrgsQuery,
} from "../../Redux/api/organizationsApi";
import { useGetProfileQuery } from "../../Redux/api/userApi";
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

// Memoized Organization List Page for better performance
const OrganizationListPage = React.memo(() => {
  const { data: userProfile } = useGetProfileQuery();
  const [showModal, setShowModal] = useState(false);
  const [viewingOrganization, setViewingOrganization] =
    useState<Organization | null>(null);

  // Memoize user permissions to avoid recalculation
  const userPermissions = useMemo(() => {
    const isPlatformAdmin =
      userProfile?.roles_and_permissions?.access_levels?.platform_admin ===
        "admin" ||
      userProfile?.roles_and_permissions?.access_levels?.platform_admin ===
        "super_admin";
    
    const isLeAdmin = userProfile?.user_info?.user_type === "LE";
    
    return { isPlatformAdmin, isLeAdmin };
  }, [userProfile]);

  const { isPlatformAdmin, isLeAdmin } = userPermissions;

  // Use getAllOrgs only for platform/super admins, otherwise use regular getOrgs
  const {
    data: allOrgs,
    isLoading: isLoadingAll,
    error: errorAll,
    refetch: refetchAll,
  } = useGetAllOrgsQuery(undefined, {
    skip: !isPlatformAdmin,
  });

  const {
    data: userOrgs,
    isLoading: isLoadingUser,
    error: errorUser,
    refetch: refetchUser,
  } = useGetOrgsQuery(undefined, {
    skip: isPlatformAdmin,
  });

  // Memoize organizations data processing for better performance
  const organizations = useMemo(() => {
    let orgs: Organization[] = [];
    if (isPlatformAdmin && allOrgs) {
      orgs = Array.isArray(allOrgs) ? allOrgs : [];
    } else if (!isPlatformAdmin) {
      if (userOrgs) {
        orgs = Array.isArray(userOrgs)
          ? userOrgs
          : userOrgs?.managed_orgs || [];
      }
      // Always use accessible_organizations as fallback for LE users
      if (orgs.length === 0 && userProfile?.accessible_organizations) {
        orgs = userProfile.accessible_organizations.map((org) => ({
          client_name: org.client_name,
          organization_name: org.organization_name,
          sector: undefined,
          website_url: undefined,
        }));
      }
    }
    return orgs;
  }, [isPlatformAdmin, allOrgs, userOrgs, userProfile?.accessible_organizations]);

  // Memoize computed values with proper typing
  const computedValues = useMemo(() => {
    const loading = isPlatformAdmin ? isLoadingAll : isLoadingUser;
    const err = isPlatformAdmin ? errorAll : errorUser;
    const refetchFn = isPlatformAdmin ? refetchAll : refetchUser;
    const hasNoOrgs = !loading && !err && organizations.length === 0;
    
    return {
      isLoading: loading,
      error: err,
      refetch: refetchFn,
      hasNoOrganizations: hasNoOrgs,
    };
  }, [isPlatformAdmin, isLoadingAll, isLoadingUser, errorAll, errorUser, refetchAll, refetchUser, organizations.length]);

  const { isLoading, error, refetch, hasNoOrganizations } = computedValues;

  // Memoize event handlers
  const handleAddOrganization = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleViewOrganization = useCallback((clientName: string) => {
    const org = organizations.find(
      (o: Organization) => o.client_name === clientName
    );
    if (org) {
      setViewingOrganization(org);
    }
  }, [organizations]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    refetch();
  }, [refetch]);

  const handleCloseSidebar = useCallback(() => {
    setViewingOrganization(null);
  }, []);

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

          {isLeAdmin && (
            <OrganizationListHeader onAddOrganization={handleAddOrganization} />
          )}

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

        {showModal && <OrganizationCreateModal onClose={handleCloseModal} />}
      </div>

      <OrganizationDetailSidebar
        organization={viewingOrganization}
        isOpen={!!viewingOrganization}
        onClose={handleCloseSidebar}
        canEdit={!isPlatformAdmin}
      />
    </>
  );
});

// Set display name for better debugging
OrganizationListPage.displayName = 'OrganizationListPage';

export default OrganizationListPage;
