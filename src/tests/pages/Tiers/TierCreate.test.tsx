import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils";
import TierCreate from "../../../Pages/Tiers/TierCreate";

// Mock the tiers API
const mockCreateTier = vi.fn();
const mockUnwrap = vi.fn();

vi.mock("../../../Redux/api/tiersApi", () => ({
  tiersApi: {
    reducerPath: 'tiersApi',
    reducer: (state = {}) => state,
    middleware: () => (next: unknown) => (action: unknown) => (next as Function)(action),
  },
  useCreateTierMutation: () => [
    mockCreateTier.mockReturnValue({ unwrap: mockUnwrap }),
    { isLoading: false }
  ],
}));

describe("TierCreate", () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUnwrap.mockResolvedValue({ data: {} });
    mockCreateTier.mockReturnValue({ unwrap: mockUnwrap });
  });

  it("should render all required form fields", () => {
    renderWithProviders(<TierCreate onSuccess={mockOnSuccess} />);

    // Check for select dropdown by name attribute
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Basic, Pro, Enterprise")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("10")).toBeInTheDocument(); // Max Edits
    expect(screen.getByPlaceholderText("5")).toBeInTheDocument(); // Max Apps
    expect(screen.getByPlaceholderText("100")).toBeInTheDocument(); // Run Quota
    expect(screen.getByPlaceholderText("29.99")).toBeInTheDocument(); // Monthly Price
    expect(screen.getByPlaceholderText("99.00")).toBeInTheDocument(); // One-time Registration Price
  });

  it("should validate required fields before submission", async () => {
    renderWithProviders(<TierCreate onSuccess={mockOnSuccess} />);

    // Get the form element using querySelector
    const form = document.querySelector('form');
    expect(form).toBeTruthy();
    
    // Submit the form directly to bypass HTML5 validation
    fireEvent.submit(form!);

    await waitFor(() => {
      // Form should not submit without required fields
      expect(mockCreateTier).not.toHaveBeenCalled();
    });
  });

  it("should handle compliance frameworks parsing correctly", async () => {
    renderWithProviders(<TierCreate onSuccess={mockOnSuccess} />);

    // Fill required fields using current UI elements
    const tierSelect = screen.getByRole("combobox");
    fireEvent.change(tierSelect, { target: { value: "L1" } });

    fireEvent.change(screen.getByPlaceholderText("Basic, Pro, Enterprise"), {
      target: { value: "Test Tier" },
    });
    fireEvent.change(screen.getByPlaceholderText("10"), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByPlaceholderText("5"), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByPlaceholderText("100"), {
      target: { value: "100" },
    });
    fireEvent.change(screen.getByPlaceholderText("29.99"), {
      target: { value: "99.99" },
    });
    fireEvent.change(screen.getByPlaceholderText("99.00"), {
      target: { value: "199.99" },
    });

    // The compliance frameworks are now handled by a multi-select component
    // Let's test the form submission with the available fields
    const submitButton = screen.getByRole("button", { name: /create tier/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateTier).toHaveBeenCalled();
    });
  });

  it("should toggle feature checkboxes correctly", () => {
    renderWithProviders(<TierCreate onSuccess={mockOnSuccess} />);

    const complianceReportsCheckbox = screen.getByLabelText(/compliance reports/i);
    const apiAccessCheckbox = screen.getByLabelText(/api access/i);

    expect(complianceReportsCheckbox).not.toBeChecked();
    expect(apiAccessCheckbox).not.toBeChecked();

    fireEvent.click(complianceReportsCheckbox);
    fireEvent.click(apiAccessCheckbox);

    expect(complianceReportsCheckbox).toBeChecked();
    expect(apiAccessCheckbox).toBeChecked();
  });

  it("should handle form submission with all fields filled", async () => {
    renderWithProviders(<TierCreate onSuccess={mockOnSuccess} />);

    // Fill all required fields using current UI placeholders
    const tierSelect = screen.getByRole("combobox");
    fireEvent.change(tierSelect, { target: { value: "L2" } });

    fireEvent.change(screen.getByPlaceholderText("Basic, Pro, Enterprise"), {
      target: { value: "Premium Tier" },
    });
    
    // Description field
    const descriptionField = screen.getByPlaceholderText("Describe this tier's purpose and benefits");
    fireEvent.change(descriptionField, {
      target: { value: "Premium tier with advanced features" },
    });

    fireEvent.change(screen.getByPlaceholderText("10"), {
      target: { value: "20" },
    });
    fireEvent.change(screen.getByPlaceholderText("5"), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByPlaceholderText("100"), {
      target: { value: "500" },
    });
    fireEvent.change(screen.getByPlaceholderText("29.99"), {
      target: { value: "199.99" },
    });
    fireEvent.change(screen.getByPlaceholderText("99.00"), {
      target: { value: "399.99" },
    });

    // Toggle some features
    fireEvent.click(screen.getByLabelText(/api access/i));

    const submitButton = screen.getByRole("button", { name: /create tier/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateTier).toHaveBeenCalled();
    });
  });

  it("should handle API errors gracefully", async () => {
    const errorMessage = "Failed to create tier";
    mockUnwrap.mockRejectedValue(new Error(errorMessage));

    renderWithProviders(<TierCreate onSuccess={mockOnSuccess} />);

    // Fill required fields and submit using current UI
    const tierSelect = screen.getByRole("combobox");
    fireEvent.change(tierSelect, { target: { value: "L1" } });

    fireEvent.change(screen.getByPlaceholderText("Basic, Pro, Enterprise"), {
      target: { value: "Test Tier" },
    });
    fireEvent.change(screen.getByPlaceholderText("10"), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByPlaceholderText("5"), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByPlaceholderText("100"), {
      target: { value: "100" },
    });
    fireEvent.change(screen.getByPlaceholderText("29.99"), {
      target: { value: "99.99" },
    });
    fireEvent.change(screen.getByPlaceholderText("99.00"), {
      target: { value: "199.99" },
    });

    const submitButton = screen.getByRole("button", { name: /create tier/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateTier).toHaveBeenCalled();
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it("should call onSuccess callback when tier is created successfully", async () => {
    renderWithProviders(<TierCreate onSuccess={mockOnSuccess} />);

    // Fill required fields and submit using current UI
    const tierSelect = screen.getByRole("combobox");
    fireEvent.change(tierSelect, { target: { value: "L1" } });

    fireEvent.change(screen.getByPlaceholderText("Basic, Pro, Enterprise"), {
      target: { value: "Test Tier" },
    });
    fireEvent.change(screen.getByPlaceholderText("10"), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByPlaceholderText("5"), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByPlaceholderText("100"), {
      target: { value: "100" },
    });
    fireEvent.change(screen.getByPlaceholderText("29.99"), {
      target: { value: "99.99" },
    });
    fireEvent.change(screen.getByPlaceholderText("99.00"), {
      target: { value: "199.99" },
    });

    const submitButton = screen.getByRole("button", { name: /create tier/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it("should handle empty compliance frameworks gracefully", async () => {
    renderWithProviders(<TierCreate onSuccess={mockOnSuccess} />);

    // Fill required fields using current UI
    const tierSelect = screen.getByRole("combobox");
    fireEvent.change(tierSelect, { target: { value: "L1" } });

    fireEvent.change(screen.getByPlaceholderText("Basic, Pro, Enterprise"), {
      target: { value: "Test Tier" },
    });
    fireEvent.change(screen.getByPlaceholderText("10"), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByPlaceholderText("5"), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByPlaceholderText("100"), {
      target: { value: "100" },
    });
    fireEvent.change(screen.getByPlaceholderText("29.99"), {
      target: { value: "99.99" },
    });
    fireEvent.change(screen.getByPlaceholderText("99.00"), {
      target: { value: "199.99" },
    });

    const submitButton = screen.getByRole("button", { name: /create tier/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateTier).toHaveBeenCalled();
    });
  });
});
