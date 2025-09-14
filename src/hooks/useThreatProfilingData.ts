import { useGetProfilingResultsQuery } from '../Redux/api/threatProfilingApi';

export const useThreatProfilingData = (clientName: string) => {
  const { data: profilingResults, isLoading, error } = useGetProfilingResultsQuery(clientName, {
    skip: !clientName,
  });

  return {
    data: profilingResults,
    isLoading,
    error,
    hasResults: profilingResults?.has_results || false,
    results: profilingResults?.results || null,
    threatActors: profilingResults?.results?.tas || [],
    threats: profilingResults?.results?.ttps_applicable || [],
    detections: profilingResults?.results?.detections || [],
    ismControls: profilingResults?.results?.isms || [],
    e8Mitigations: profilingResults?.results?.e8s || [],
    executiveSummary: profilingResults?.results?.executive_summary || null,
    complianceStatus: profilingResults?.results?.compliance_status || null,
    metadata: profilingResults?.results?.metadata || null
  };
};