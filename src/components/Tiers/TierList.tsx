import React from 'react';
import TierCard from './TierCard';

interface Tier {
  sub_level: string;
  name: string;
  description?: string;
  max_edits: number;
  max_apps: number;
  run_quota: number;
  allowed_tabs: string[];
  price_monthly: number;
  price_onetime_registration: number;
}

interface TierListProps {
  tiers: Tier[];
  onViewTier: (subLevel: string) => void;
  onEditTier?: (tier: Tier) => void;
  onDeleteTier?: (subLevel: string) => void;
  isDeleting: boolean;
  deleteTarget: string | null;
}

const TierList: React.FC<TierListProps> = ({
  tiers,
  onViewTier,
  onEditTier,
  onDeleteTier,
  isDeleting,
  deleteTarget
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
      {tiers.map((tier) => (
        <TierCard
          key={tier.sub_level}
          tier={tier}
          onView={onViewTier}
          onEdit={onEditTier}
          onDelete={onDeleteTier || (() => {})}
          isDeleting={isDeleting}
          deleteTarget={deleteTarget}
        />
      ))}
    </div>
  );
};

export default TierList;
