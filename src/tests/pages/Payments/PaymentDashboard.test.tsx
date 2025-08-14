import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils";
import PaymentDashboard from "../../../Pages/Payments/PaymentDashboard";

// Mock the APIs
const mockGetProfileQuery = vi.fn();
const mockGetPaymentStatusQuery = vi.fn();
const mockGetInvoicesQuery = vi.fn();

vi.mock("../../../Redux/api/userApi", () => ({
  useGetProfileQuery: () => mockGetProfileQuery(),
}));

vi.mock("../../../Redux/api/paymentsApi", () => ({
  useGetPaymentStatusQuery: () => mockGetPaymentStatusQuery(),
  useGetInvoicesQuery: () => mockGetInvoicesQuery(),
}));

// Mock navigation
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("PaymentDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  it("should display loading state while loading user profile", () => {
    mockGetProfileQuery.mockReturnValue({
      data: null,
      isLoading: true,
    });
    mockGetPaymentStatusQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });
    mockGetInvoicesQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    renderWithProviders(<PaymentDashboard />);

    expect(screen.getByText(/loading user profile/i)).toBeInTheDocument();
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument(); // Loading spinner
  });

  it("should display error when user profile fails to load", () => {
    mockGetProfileQuery.mockReturnValue({
      data: null,
      isLoading: false,
    });
    mockGetPaymentStatusQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });
    mockGetInvoicesQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    renderWithProviders(<PaymentDashboard />);

    expect(
      screen.getByText(/unable to load user profile/i)
    ).toBeInTheDocument();
  });

  it("should display payment dashboard when data is loaded", () => {
    const mockUserProfile = {
      user_info: {
        client_name: "test-client",
        name: "John Doe",
        email: "john@example.com",
      },
    };

    const mockPaymentStatus = {
      payment_status: "paid",
      subscription_level: "L1",
      can_run_profiling: true,
    };

    mockGetProfileQuery.mockReturnValue({
      data: mockUserProfile,
      isLoading: false,
    });
    mockGetPaymentStatusQuery.mockReturnValue({
      data: mockPaymentStatus,
      isLoading: false,
      error: null,
    });
    mockGetInvoicesQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    renderWithProviders(<PaymentDashboard />);

    expect(screen.getByText("Payment Dashboard")).toBeInTheDocument();
    expect(screen.getByText(/welcome, john doe/i)).toBeInTheDocument();
    expect(screen.getByText("Current Payment Status")).toBeInTheDocument();
  });

  it("should show no payment status message when data is null", () => {
    const mockUserProfile = {
      user_info: {
        client_name: "test-client",
        name: "John Doe",
        email: "john@example.com",
      },
    };

    mockGetProfileQuery.mockReturnValue({
      data: mockUserProfile,
      isLoading: false,
    });
    mockGetPaymentStatusQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });
    mockGetInvoicesQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    renderWithProviders(<PaymentDashboard />);

    expect(screen.getByText(/no payment status found/i)).toBeInTheDocument();
  });

  it("should display payment status when data is available", () => {
    const mockUserProfile = {
      user_info: {
        client_name: "test-client",
        name: "John Doe",
        email: "john@example.com",
      },
    };

    const mockPaymentStatus = {
      payment_status: "paid",
      subscription_level: "L2",
      can_run_profiling: true,
      next_billing_date: "2025-09-14",
    };

    mockGetProfileQuery.mockReturnValue({
      data: mockUserProfile,
      isLoading: false,
    });
    mockGetPaymentStatusQuery.mockReturnValue({
      data: mockPaymentStatus,
      isLoading: false,
      error: null,
    });
    mockGetInvoicesQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    renderWithProviders(<PaymentDashboard />);

    expect(screen.getByText(/paid/i)).toBeInTheDocument();
    expect(screen.getByText(/l2/i)).toBeInTheDocument();
  });

  it("should show error message when payment status fails to load", () => {
    const mockUserProfile = {
      user_info: {
        client_name: "test-client",
        name: "John Doe",
        email: "john@example.com",
      },
    };

    mockGetProfileQuery.mockReturnValue({
      data: mockUserProfile,
      isLoading: false,
    });
    mockGetPaymentStatusQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: "Network error",
    });
    mockGetInvoicesQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    renderWithProviders(<PaymentDashboard />);

    expect(
      screen.getByText(/error loading payment status/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/network error/i)).toBeInTheDocument();
  });

  it("should show API documentation section", () => {
    const mockUserProfile = {
      user_info: {
        client_name: "test-client",
        name: "John Doe",
        email: "john@example.com",
      },
    };

    mockGetProfileQuery.mockReturnValue({
      data: mockUserProfile,
      isLoading: false,
    });
    mockGetPaymentStatusQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });
    mockGetInvoicesQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    renderWithProviders(<PaymentDashboard />);

    expect(screen.getByText(/available api endpoints/i)).toBeInTheDocument();
    expect(screen.getByText(/frontend hooks/i)).toBeInTheDocument();
  });

  it("should navigate to payments page when Make Payment button is clicked", () => {
    const mockUserProfile = {
      user_info: {
        client_name: "test-client",
        name: "John Doe",
        email: "john@example.com",
      },
    };

    mockGetProfileQuery.mockReturnValue({
      data: mockUserProfile,
      isLoading: false,
    });
    mockGetPaymentStatusQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });
    mockGetInvoicesQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    renderWithProviders(<PaymentDashboard />);

    const makePaymentButton = screen.getByRole("button", {
      name: /💳 make payment/i,
    });
    fireEvent.click(makePaymentButton);

    expect(mockNavigate).toHaveBeenCalledWith("/payments");
  });

  it("should navigate to dashboard when Back to Dashboard button is clicked", () => {
    const mockUserProfile = {
      user_info: {
        client_name: "test-client",
        name: "John Doe",
        email: "john@example.com",
      },
    };

    mockGetProfileQuery.mockReturnValue({
      data: mockUserProfile,
      isLoading: false,
    });
    mockGetPaymentStatusQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });
    mockGetInvoicesQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    renderWithProviders(<PaymentDashboard />);

    const backButton = screen.getByRole("button", {
      name: /← back to dashboard/i,
    });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("should navigate to invoices when View Invoices card is clicked", () => {
    const mockUserProfile = {
      user_info: {
        client_name: "test-client",
        name: "John Doe",
        email: "john@example.com",
      },
    };

    mockGetProfileQuery.mockReturnValue({
      data: mockUserProfile,
      isLoading: false,
    });
    mockGetPaymentStatusQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });
    mockGetInvoicesQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    renderWithProviders(<PaymentDashboard />);

    const invoicesCard = screen.getByText("View Invoices").closest("div");
    fireEvent.click(invoicesCard!);

    expect(mockNavigate).toHaveBeenCalledWith("/invoices");
  });

  it("should navigate to payment test when Test Payment card is clicked", () => {
    const mockUserProfile = {
      user_info: {
        client_name: "test-client",
        name: "John Doe",
        email: "john@example.com",
      },
    };

    mockGetProfileQuery.mockReturnValue({
      data: mockUserProfile,
      isLoading: false,
    });
    mockGetPaymentStatusQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });
    mockGetInvoicesQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    renderWithProviders(<PaymentDashboard />);

    const testPaymentCard = screen.getByText("Test Payment").closest("div");
    fireEvent.click(testPaymentCard!);

    expect(mockNavigate).toHaveBeenCalledWith("/payment-test");
  });

  it("should show loading state for payment status", () => {
    const mockUserProfile = {
      user_info: {
        client_name: "test-client",
        name: "John Doe",
        email: "john@example.com",
      },
    };

    mockGetProfileQuery.mockReturnValue({
      data: mockUserProfile,
      isLoading: false,
    });
    mockGetPaymentStatusQuery.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });
    mockGetInvoicesQuery.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    renderWithProviders(<PaymentDashboard />);

    expect(screen.getByText(/loading status/i)).toBeInTheDocument();
  });
});
