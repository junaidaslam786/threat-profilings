import React from 'react';

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  color: string;
  hoverColor: string;
  onClick: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {actions.map((action, index) => (
        <div
          key={index}
          onClick={action.onClick}
          className={`${action.color} ${action.hoverColor} text-white p-6 rounded-lg shadow-md cursor-pointer transition-colors`}
        >
          <div className="text-2xl mb-2">{action.icon}</div>
          <h3 className="font-semibold">{action.title}</h3>
          <p className="text-sm opacity-90">{action.description}</p>
        </div>
      ))}
    </div>
  );
};

export default QuickActions;
