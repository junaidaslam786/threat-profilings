import { useState } from "react";
import {
  useDeleteTierMutation,
  useGetTiersQuery,
} from "../../Redux/api/tiersApi";
import TierCreate from "./TierCreate";
import TierListHeader from "../../components/Tiers/TierListHeader";
import TierList from "../../components/Tiers/TierList";
import DataState from "../../components/Common/DataState";

export default function TierListPage() {
  const { data: tiers, isLoading, error, refetch } = useGetTiersQuery();
  const [deleteTier, { isLoading: isDeleting }] = useDeleteTierMutation();
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const hasNoTiers = !isLoading && !error && (!tiers || tiers.length === 0);

  const handleDelete = async (sub_level: string) => {
    if (window.confirm("Are you sure you want to delete this tier?")) {
      setDeleteTarget(sub_level);
      await deleteTier(sub_level).unwrap();
      refetch();
      setDeleteTarget(null);
    }
  };

  const handleViewTier = (subLevel: string) => {
    window.location.href = `/tiers/${subLevel}`;
  };

  const handleToggleCreate = () => {
    setShowCreate((v) => !v);
  };

  const handleCreateSuccess = () => {
    setShowCreate(false);
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <TierListHeader 
          showCreate={showCreate}
          onToggleCreate={handleToggleCreate}
        />
        
        {showCreate && (
          <TierCreate onSuccess={handleCreateSuccess} />
        )}
        
        <DataState
          isLoading={isLoading}
          error={error}
          hasNoData={hasNoTiers}
          loadingMessage="Loading..."
          errorMessage="Failed to load tiers."
          noDataMessage="No tiers found."
        />
        
        {!isLoading && !error && tiers && tiers.length > 0 && (
          <TierList
            tiers={tiers}
            onViewTier={handleViewTier}
            onDeleteTier={handleDelete}
            isDeleting={isDeleting}
            deleteTarget={deleteTarget}
          />
        )}
      </div>
    </div>
  );
}
