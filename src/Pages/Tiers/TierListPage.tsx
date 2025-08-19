import { useState } from "react";
import {
  useDeleteTierMutation,
  useGetTiersQuery,
} from "../../Redux/api/tiersApi";
import { useUser } from "../../hooks/useUser";
import TierCreate from "./TierCreate";
import TierListHeader from "../../components/Tiers/TierListHeader";
import TierList from "../../components/Tiers/TierList";
import TierEditModal from "../../components/Tiers/TierEditModal";
import TierDetailSidebar from "../../components/Tiers/TierDetailSidebar";
import DataState from "../../components/Common/DataState";
import Navbar from "../../components/Common/Navbar";
import type { TierConfigDto } from "../../Redux/slices/tiersSlice";

export default function TierListPage() {
  const { data: tiers, isLoading, error, refetch } = useGetTiersQuery();
  const [deleteTier, { isLoading: isDeleting }] = useDeleteTierMutation();
  const { isPlatformAdmin } = useUser();
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [editingTier, setEditingTier] = useState<TierConfigDto | null>(null);
  const [viewingTier, setViewingTier] = useState<TierConfigDto | null>(null);

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
    const tier = tiers?.find(t => t.sub_level === subLevel);
    if (tier) {
      setViewingTier(tier);
    }
  };

  const handleEditTier = (tier: TierConfigDto) => {
    setEditingTier(tier);
  };

  const handleToggleCreate = () => {
    setShowCreate((v) => !v);
  };

  const handleCreateSuccess = () => {
    setShowCreate(false);
    refetch();
  };

  const handleEditSuccess = () => {
    setEditingTier(null);
    refetch();
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
        <Navbar />
        
        <div className="max-w-6xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-3">
              Subscription Tiers
            </h1>
            <p className="text-secondary-300 text-lg">
              {isPlatformAdmin 
                ? "Manage subscription tiers and pricing" 
                : "Available subscription plans"}
            </p>
          </div>

          {isPlatformAdmin && (
            <TierListHeader 
              showCreate={showCreate}
              onToggleCreate={handleToggleCreate}
            />
          )}
          
          {showCreate && isPlatformAdmin && (
            <div className="mb-8">
              <TierCreate onSuccess={handleCreateSuccess} />
            </div>
          )}
          
          <DataState
            isLoading={isLoading}
            error={error}
            hasNoData={hasNoTiers}
            loadingMessage="Loading subscription tiers..."
            errorMessage="Failed to load tiers."
            noDataMessage="No tiers available."
          />
          
          {!isLoading && !error && tiers && tiers.length > 0 && (
            <TierList
              tiers={tiers}
              onViewTier={handleViewTier}
              onEditTier={isPlatformAdmin ? handleEditTier : undefined}
              onDeleteTier={isPlatformAdmin ? handleDelete : undefined}
              isDeleting={isDeleting}
              deleteTarget={deleteTarget}
            />
          )}
          
          {editingTier && (
            <TierEditModal
              tier={editingTier}
              isOpen={!!editingTier}
              onClose={() => setEditingTier(null)}
              onSuccess={handleEditSuccess}
            />
          )}
        </div>
      </div>
      
      <TierDetailSidebar
        tier={viewingTier}
        isOpen={!!viewingTier}
        onClose={() => setViewingTier(null)}
      />
    </>
  );
}
