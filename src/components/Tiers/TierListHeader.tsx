import React from 'react';
import Button from '../Common/Button';

interface TierListHeaderProps {
  showCreate: boolean;
  onToggleCreate: () => void;
}

const TierListHeader: React.FC<TierListHeaderProps> = ({ 
  showCreate, 
  onToggleCreate 
}) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-blue-400">
        Subscription Tiers
      </h1>
      <Button onClick={onToggleCreate}>
        {showCreate ? "Close" : "Create Tier"}
      </Button>
    </div>
  );
};

export default TierListHeader;
