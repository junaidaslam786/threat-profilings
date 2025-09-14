import React, { useState } from 'react';
import { useGetProfilingResultsQuery } from '../../Redux/api/threatProfilingApi';

const ApiTest: React.FC = () => {
  const [clientName, setClientName] = useState('tunki_com');
  const { data, isLoading, error } = useGetProfilingResultsQuery(clientName);

  return (
    <div className="p-4 bg-secondary-800 rounded-lg">
      <h3 className="text-white mb-4">API Test</h3>
      <div className="mb-4">
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="px-3 py-2 bg-secondary-700 text-white rounded"
          placeholder="Client name"
        />
      </div>
      <div className="text-white">
        <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
        <p>Error: {error ? JSON.stringify(error) : 'None'}</p>
        <p>Data: {data ? JSON.stringify(data, null, 2) : 'None'}</p>
      </div>
    </div>
  );
};

export default ApiTest;