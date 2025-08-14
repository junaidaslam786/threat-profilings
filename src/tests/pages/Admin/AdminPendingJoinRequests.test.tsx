import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils";
import AdminPendingJoinRequests from "../../../Pages/Admin/AdminPendingJoinRequests";

// Mock the user API
const mockGetProfileQuery = vi.fn();
const mockGetPendingJoinRequestsQuery = vi.fn();
const mockApproveJoinRequestMutation = vi.fn();

vi.mock("../../../Redux/api/userApi", () => ({
  useGetProfileQuery: () => mockGetProfileQuery(),
  useGetPendingJoinRequestsQuery: () => mockGetPendingJoinRequestsQuery(),
  useApproveJoinRequestMutation: () => [
    mockApproveJoinRequestMutation(),
    { isLoading: false },
  ],
}));

describe("AdminPendingJoinRequests", () => {
  const mockApproveJoinRequest = vi.fn();
  const mockRefetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    const mockUnwrap = vi.fn().mockResolvedValue({ data: {} });
    mockApproveJoinRequest.mockReturnValue({
      unwrap: mockUnwrap,
    });
    mockApproveJoinRequestMutation.mockReturnValue(mockApproveJoinRequest);
  });

  it("should render the title and initial state", () => {
    mockGetProfileQuery.mockReturnValue({
      data: {
        accessible_organizations: [],
      },
    });
    mockGetPendingJoinRequestsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<AdminPendingJoinRequests />);

    expect(screen.getByText("Pending Join Requests")).toBeInTheDocument();
  });

  it("should switch between organizations", () => {
    const mockOrganizations = [
      { client_name: "org1", organization_name: "Organization 1" },
      { client_name: "org2", organization_name: "Organization 2" },
    ];

    mockGetProfileQuery.mockReturnValue({
      data: {
        accessible_organizations: mockOrganizations,
      },
    });
    mockGetPendingJoinRequestsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<AdminPendingJoinRequests />);

    const org1Button = screen.getByRole("button", { name: "Organization 1" });
    const org2Button = screen.getByRole("button", { name: "Organization 2" });

    // Organization 1 should be selected by default
    expect(org1Button).toHaveClass("bg-blue-600");
    expect(org2Button).toHaveClass("bg-gray-800");

    // Click on Organization 2
    fireEvent.click(org2Button);

    // Organization 2 should now be selected
    expect(org2Button).toHaveClass("bg-blue-600");
  });

  it("should display organization name in the viewing text", () => {
    const mockOrganizations = [
      { client_name: "org1", organization_name: "Test Organization" },
    ];

    mockGetProfileQuery.mockReturnValue({
      data: {
        accessible_organizations: mockOrganizations,
      },
    });
    mockGetPendingJoinRequestsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<AdminPendingJoinRequests />);

    expect(screen.getByText(/viewing requests for:/i)).toBeInTheDocument();
    expect(screen.getByText("Test Organization", { selector: "span" })).toBeInTheDocument();
  });

  it("should display loading state", () => {
    const mockOrganizations = [
      { client_name: "org1", organization_name: "Test Organization" },
    ];

    mockGetProfileQuery.mockReturnValue({
      data: {
        accessible_organizations: mockOrganizations,
      },
    });
    mockGetPendingJoinRequestsQuery.mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<AdminPendingJoinRequests />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should display error state", () => {
    const mockOrganizations = [
      { client_name: "org1", organization_name: "Test Organization" },
    ];

    mockGetProfileQuery.mockReturnValue({
      data: {
        accessible_organizations: mockOrganizations,
      },
    });
    mockGetPendingJoinRequestsQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: "Failed to load requests",
      refetch: mockRefetch,
    });

    renderWithProviders(<AdminPendingJoinRequests />);

    expect(screen.getByText("Failed to load requests.")).toBeInTheDocument();
  });

  it("should display no requests message when requests array is empty", () => {
    const mockOrganizations = [
      { client_name: "org1", organization_name: "Test Organization" },
    ];

    mockGetProfileQuery.mockReturnValue({
      data: {
        accessible_organizations: mockOrganizations,
      },
    });
    mockGetPendingJoinRequestsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<AdminPendingJoinRequests />);

    expect(screen.getByText("No pending requests.")).toBeInTheDocument();
  });

  it("should display pending requests with role selection", () => {
    const mockOrganizations = [
      { client_name: "org1", organization_name: "Test Organization" },
    ];

    const mockRequests = [
      {
        join_id: "req1",
        email: "john@example.com",
        name: "John Doe",
        client_name: "org1",
        message: "Want to join",
        created_at: "2025-08-14T10:00:00Z",
      },
      {
        join_id: "req2",
        email: "jane@example.com",
        name: "Jane Smith",
        client_name: "org1",
        message: "Looking to collaborate",
        created_at: "2025-08-14T11:00:00Z",
      },
    ];

    mockGetProfileQuery.mockReturnValue({
      data: {
        accessible_organizations: mockOrganizations,
      },
    });
    mockGetPendingJoinRequestsQuery.mockReturnValue({
      data: mockRequests,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<AdminPendingJoinRequests />);

    expect(screen.getByText(/john@example\.com/)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/jane@example\.com/)).toBeInTheDocument();
    expect(screen.getByText(/Jane Smith/)).toBeInTheDocument();

    // Should have role selection dropdowns
    const roleSelects = screen.getAllByRole("combobox");
    expect(roleSelects).toHaveLength(2);
    
    // Both selects should have "viewer" as default value
    roleSelects.forEach(select => {
      expect(select).toHaveValue("viewer");
    });
  });

  it("should handle role selection for join requests", () => {
    const mockOrganizations = [
      { client_name: "org1", organization_name: "Test Organization" },
    ];

    const mockRequests = [
      {
        join_id: "req1",
        email: "john@example.com",
        name: "John Doe",
        client_name: "org1",
        message: "Want to join",
        created_at: "2025-08-14T10:00:00Z",
      },
    ];

    mockGetProfileQuery.mockReturnValue({
      data: {
        accessible_organizations: mockOrganizations,
      },
    });
    mockGetPendingJoinRequestsQuery.mockReturnValue({
      data: mockRequests,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<AdminPendingJoinRequests />);

    const roleSelect = screen.getByRole("combobox");
    expect(roleSelect).toHaveValue("viewer");
    fireEvent.change(roleSelect, { target: { value: "admin" } });

    expect(roleSelect).toHaveValue("admin");
  });

  it("should approve join request with selected role", async () => {
    const mockOrganizations = [
      { client_name: "org1", organization_name: "Test Organization" },
    ];

    const mockRequests = [
      {
        join_id: "req1",
        email: "john@example.com",
        name: "John Doe",
        client_name: "org1",
        message: "Want to join",
        created_at: "2025-08-14T10:00:00Z",
      },
    ];

    mockGetProfileQuery.mockReturnValue({
      data: {
        accessible_organizations: mockOrganizations,
      },
    });
    mockGetPendingJoinRequestsQuery.mockReturnValue({
      data: mockRequests,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<AdminPendingJoinRequests />);

    // Change role to admin
    const roleSelect = screen.getByRole("combobox");
    expect(roleSelect).toHaveValue("viewer");
    fireEvent.change(roleSelect, { target: { value: "admin" } });

    // Click approve button
    const approveButton = screen.getByRole("button", { name: /approve/i });
    fireEvent.click(approveButton);

    await waitFor(() => {
      expect(mockApproveJoinRequest).toHaveBeenCalledWith({
        joinId: "req1",
        body: { role: "admin" },
      });
    });

    expect(mockRefetch).toHaveBeenCalled();
  });

  it("should use default viewer role when no role is selected", async () => {
    const mockOrganizations = [
      { client_name: "org1", organization_name: "Test Organization" },
    ];

    const mockRequests = [
      {
        join_id: "req1",
        email: "john@example.com",
        name: "John Doe",
        client_name: "org1",
        message: "Want to join",
        created_at: "2025-08-14T10:00:00Z",
      },
    ];

    mockGetProfileQuery.mockReturnValue({
      data: {
        accessible_organizations: mockOrganizations,
      },
    });
    mockGetPendingJoinRequestsQuery.mockReturnValue({
      data: mockRequests,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<AdminPendingJoinRequests />);

    // Click approve without changing role
    const approveButton = screen.getByRole("button", { name: /approve/i });
    fireEvent.click(approveButton);

    await waitFor(() => {
      expect(mockApproveJoinRequest).toHaveBeenCalledWith({
        joinId: "req1",
        body: { role: "viewer" },
      });
    });
  });

  it("should skip query when no organization is selected", () => {
    mockGetProfileQuery.mockReturnValue({
      data: {
        accessible_organizations: [],
      },
    });

    mockGetPendingJoinRequestsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<AdminPendingJoinRequests />);

    // When no organization is selected, the component should render without errors
    expect(screen.getByText("Pending Join Requests")).toBeInTheDocument();
  });

  it("should handle organization switching and update requests query", () => {
    const mockOrganizations = [
      { client_name: "org1", organization_name: "Organization 1" },
      { client_name: "org2", organization_name: "Organization 2" },
    ];

    mockGetProfileQuery.mockReturnValue({
      data: {
        accessible_organizations: mockOrganizations,
      },
    });

    mockGetPendingJoinRequestsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    renderWithProviders(<AdminPendingJoinRequests />);

    // Initially Organization 1 should be selected
    expect(screen.getByRole("button", { name: "Organization 1" })).toHaveClass("bg-blue-600");

    // Switch to org2
    const org2Button = screen.getByRole("button", { name: "Organization 2" });
    fireEvent.click(org2Button);

    // Organization 2 should now be selected
    expect(org2Button).toHaveClass("bg-blue-600");
    expect(screen.getByRole("button", { name: "Organization 1" })).toHaveClass("bg-gray-800");
  });
});
