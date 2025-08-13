import React from 'react';

interface DataStateProps {
  isLoading: boolean;
  error: unknown;
  hasNoData: boolean;
  loadingMessage?: string;
  errorMessage?: string;
  noDataMessage?: string;
}

const DataState: React.FC<DataStateProps> = ({
  isLoading,
  error,
  hasNoData,
  loadingMessage = "Loading...",
  errorMessage = "Failed to load data.",
  noDataMessage = "No data found."
}) => {
  if (isLoading) {
    return <div className="py-8 text-center">{loadingMessage}</div>;
  }

  if (error) {
    return (
      <div className="text-red-400 py-8 text-center">
        {errorMessage}
      </div>
    );
  }

  if (hasNoData) {
    return (
      <div className="text-center text-gray-400 py-12">
        {noDataMessage}
      </div>
    );
  }

  return null;
};

export default DataState;
