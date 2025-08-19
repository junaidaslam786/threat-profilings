// src/pages/PlatformAdmin/ActivityLogs.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Common/Button";
import { useGetActivityLogsQuery } from "../../Redux/api/platformAdminApi";
import Input from "../../components/Common/InputField"; // Assuming you have a reusable Input component
import type { ActivityLog } from "../../Redux/slices/platformAdminSlice";


// Utility functions for default dates
const getFirstDayOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
};
const getToday = () => {
  const now = new Date();
  return now.toISOString().slice(0, 10);
};

const ActivityLogs: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    user_email: "",
    action: "",
    start_date: getFirstDayOfMonth(),
    end_date: getToday(),
  });
  const [pagination, setPagination] = useState({ limit: 10, offset: 0 });

  // Always send ISO 8601 strings for start_date and end_date
  const getISODate = (date: string, isEnd = false) => {
    if (!date) return "";
    // If end date, set to end of day
    if (isEnd) {
      return new Date(date + "T23:59:59.999Z").toISOString();
    }
    // Start of day
    return new Date(date + "T00:00:00.000Z").toISOString();
  };

  const apiFilters = {
    ...filters,
    start_date: getISODate(filters.start_date),
    end_date: getISODate(filters.end_date, true),
    ...pagination,
  };

  const {
    data: activityLogsResponse,
    isLoading,
    error,
    refetch,
  } = useGetActivityLogsQuery(apiFilters);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPagination({ ...pagination, offset: 0 });
  };

  const handleClearFilters = () => {
    setFilters({
      user_email: "",
      action: "",
      start_date: getFirstDayOfMonth(),
      end_date: getToday(),
    });
    setPagination({ limit: 10, offset: 0 });
    refetch();
  };

  const handleNextPage = () => {
    if (
      activityLogsResponse &&
      pagination.offset + pagination.limit < activityLogsResponse.total
    ) {
      setPagination((prev) => ({ ...prev, offset: prev.offset + prev.limit }));
    }
  };

  const handlePrevPage = () => {
    setPagination((prev) => ({
      ...prev,
      offset: Math.max(0, prev.offset - prev.limit),
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading activity logs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-red-700 text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Error Loading Activity Logs
          </h2>
          <p className="mb-4">Failed to load activity logs.</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => refetch()}>Retry</Button>
            <Button
              onClick={() => navigate("/platform-admins")}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const logs = activityLogsResponse?.logs || [];
  const totalLogs = activityLogsResponse?.total || 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-blue-400">Activity Logs</h1>
        <div className="flex gap-4">
          <Button
            onClick={() => refetch()}
            className="bg-green-600 hover:bg-green-700"
          >
            Refresh Logs
          </Button>
          <Button
            onClick={() => navigate("/platform-admins")}
            className="bg-gray-600 hover:bg-gray-700"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-blue-700 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-300">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="User Email"
            type="email"
            name="user_email"
            value={filters.user_email}
            onChange={handleFilterChange}
            placeholder="Filter by user email"
          />
          <Input
            label="Action"
            type="text"
            name="action"
            value={filters.action}
            onChange={handleFilterChange}
            placeholder="Filter by action"
          />
          <Input
            label="Start Date"
            type="date"
            name="start_date"
            value={filters.start_date}
            onChange={handleFilterChange}
          />
          <Input
            label="End Date"
            type="date"
            name="end_date"
            value={filters.end_date}
            onChange={handleFilterChange}
          />
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleClearFilters}
            className="bg-red-600 hover:bg-red-700"
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-blue-700">
        {logs.length === 0 ? (
          <p className="text-center text-gray-400">
            No activity logs found matching your criteria.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Timestamp
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      User Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Action
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Resource
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      IP Address
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {logs.map((log: ActivityLog) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-300">
                        {log.user_email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {log.action}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {log.resource}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {log.ip_address || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <Button
                onClick={handlePrevPage}
                disabled={pagination.offset === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </Button>
              <span className="text-gray-300 text-sm">
                Showing {pagination.offset + 1} -{" "}
                {Math.min(pagination.offset + pagination.limit, totalLogs)} of{" "}
                {totalLogs} logs
              </span>
              <Button
                onClick={handleNextPage}
                disabled={pagination.offset + pagination.limit >= totalLogs}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ActivityLogs;
