import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils";
import TierCreate from "../../../Pages/Tiers/TierCreate";

// Mock the tiers API
const mockCreateTier = vi.fn();
const mockUnwrap = vi.fn();

vi.mock("../../../Redux/api/tiersApi", () => ({
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

    expect(
      screen.getByPlaceholderText("Sub Level (L0, L1, ...)")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Max Edits")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Max Apps")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Allowed Tabs (comma-separated)")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Run Quota")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Monthly Price")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("One-time Registration Price")
    ).toBeInTheDocument();
  });

  it("should validate required fields before submission", async () => {
    renderWithProviders(<TierCreate onSuccess={mockOnSuccess} />);

    // Get the form element using querySelector
    const form = document.querySelector('form');
    expect(form).toBeTruthy();
    
    // Submit the form directly to bypass HTML5 validation
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(
        screen.getByText("Please fill all required fields (sub_level, name, max_edits, max_apps, allowed_tabs, run_quota, price_monthly, price_onetime_registration).")
      ).toBeInTheDocument();
    });

    expect(mockCreateTier).not.toHaveBeenCalled();
  });

  it("should handle compliance frameworks parsing correctly", async () => {
    renderWithProviders(<TierCreate onSuccess={mockOnSuccess} />);

    // Fill required fields
    fireEvent.change(screen.getByPlaceholderText("Sub Level (L0, L1, ...)"), {
      target: { value: "L1" },
    });
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Test Tier" },
    });
    fireEvent.change(screen.getByPlaceholderText("Max Edits"), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByPlaceholderText("Max Apps"), {
      target: { value: "5" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Allowed Tabs (comma-separated)"),
      {
        target: { value: "tab1,tab2" },
      }
    );
    fireEvent.change(screen.getByPlaceholderText("Run Quota"), {
      target: { value: "100" },
    });
    fireEvent.change(screen.getByPlaceholderText("Monthly Price"), {
      target: { value: "99.99" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("One-time Registration Price"),
      {
        target: { value: "199.99" },
      }
    );

    // Set compliance frameworks
    const complianceInput = screen.getByPlaceholderText(
      "Compliance Frameworks (comma-separated)"
    );
    fireEvent.change(complianceInput, {
      target: { value: "ISM,NIST,ISO27001" },
    });

    const submitButton = screen.getByRole("button", { name: /create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateTier).toHaveBeenCalledWith(
        expect.objectContaining({
          features: expect.objectContaining({
            compliance_frameworks: ["ISM", "NIST", "ISO27001"],
          }),
        })
      );
    });
  });

  it("should toggle feature checkboxes correctly", () => {
    renderWithProviders(<TierCreate onSuccess={mockOnSuccess} />);

    const threatDetectionCheckbox = screen.getByLabelText(/threat detection/i);
    const complianceReportsCheckbox =
      screen.getByLabelText(/compliance reports/i);
    const apiAccessCheckbox = screen.getByLabelText(/api access/i);

    expect(threatDetectionCheckbox).not.toBeChecked();
    expect(complianceReportsCheckbox).not.toBeChecked();
    expect(apiAccessCheckbox).not.toBeChecked();

    fireEvent.click(threatDetectionCheckbox);
    fireEvent.click(complianceReportsCheckbox);
    fireEvent.click(apiAccessCheckbox);

    expect(threatDetectionCheckbox).toBeChecked();
    expect(complianceReportsCheckbox).toBeChecked();
    expect(apiAccessCheckbox).toBeChecked();
  });

  it("should handle form submission with all fields filled", async () => {
    renderWithProviders(<TierCreate onSuccess={mockOnSuccess} />);

    // Fill all required fields
    fireEvent.change(screen.getByPlaceholderText("Sub Level (L0, L1, ...)"), {
      target: { value: "L2" },
    });
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Premium Tier" },
    });
    fireEvent.change(screen.getByPlaceholderText("Description"), {
      target: { value: "Premium tier with advanced features" },
    });
    fireEvent.change(screen.getByPlaceholderText("Max Edits"), {
      target: { value: "20" },
    });
    fireEvent.change(screen.getByPlaceholderText("Max Apps"), {
      target: { value: "10" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Allowed Tabs (comma-separated)"),
      {
        target: { value: "dashboard,reports,analytics" },
      }
    );
    fireEvent.change(screen.getByPlaceholderText("Run Quota"), {
      target: { value: "500" },
    });
    fireEvent.change(screen.getByPlaceholderText("Monthly Price"), {
      target: { value: "199.99" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("One-time Registration Price"),
      {
        target: { value: "399.99" },
      }
    );

    // Toggle some features
    fireEvent.click(screen.getByLabelText(/threat detection/i));
    fireEvent.click(screen.getByLabelText(/api access/i));

    const submitButton = screen.getByRole("button", { name: /create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateTier).toHaveBeenCalledWith(
        expect.objectContaining({
          sub_level: "L2",
          name: "Premium Tier",
          max_edits: 20,
          max_apps: 10,
          allowed_tabs: ["dashboard", "reports", "analytics"],
          run_quota: 500,
          price_monthly: 199.99,
          price_onetime_registration: 399.99,
          features: expect.objectContaining({
            threat_detection: true,
            api_access: true,
            compliance_reports: false,
          }),
        })
      );
    });
  });

  it("should handle API errors gracefully", async () => {
    const errorMessage = "Failed to create tier";
    mockUnwrap.mockRejectedValue(new Error(errorMessage));

    renderWithProviders(<TierCreate onSuccess={mockOnSuccess} />);

    // Fill required fields and submit
    fireEvent.change(screen.getByPlaceholderText("Sub Level (L0, L1, ...)"), {
      target: { value: "L1" },
    });
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Test Tier" },
    });
    fireEvent.change(screen.getByPlaceholderText("Max Edits"), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByPlaceholderText("Max Apps"), {
      target: { value: "5" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Allowed Tabs (comma-separated)"),
      {
        target: { value: "tab1,tab2" },
      }
    );
    fireEvent.change(screen.getByPlaceholderText("Run Quota"), {
      target: { value: "100" },
    });
    fireEvent.change(screen.getByPlaceholderText("Monthly Price"), {
      target: { value: "99.99" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("One-time Registration Price"),
      {
        target: { value: "199.99" },
      }
    );

    const submitButton = screen.getByRole("button", { name: /create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(new RegExp(errorMessage, "i"))
      ).toBeInTheDocument();
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it("should call onSuccess callback when tier is created successfully", async () => {
    renderWithProviders(<TierCreate onSuccess={mockOnSuccess} />);

    // Fill required fields and submit
    fireEvent.change(screen.getByPlaceholderText("Sub Level (L0, L1, ...)"), {
      target: { value: "L1" },
    });
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Test Tier" },
    });
    fireEvent.change(screen.getByPlaceholderText("Max Edits"), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByPlaceholderText("Max Apps"), {
      target: { value: "5" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Allowed Tabs (comma-separated)"),
      {
        target: { value: "tab1,tab2" },
      }
    );
    fireEvent.change(screen.getByPlaceholderText("Run Quota"), {
      target: { value: "100" },
    });
    fireEvent.change(screen.getByPlaceholderText("Monthly Price"), {
      target: { value: "99.99" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("One-time Registration Price"),
      {
        target: { value: "199.99" },
      }
    );

    const submitButton = screen.getByRole("button", { name: /create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it("should handle empty compliance frameworks gracefully", async () => {
    renderWithProviders(<TierCreate onSuccess={mockOnSuccess} />);

    // Fill required fields
    fireEvent.change(screen.getByPlaceholderText("Sub Level (L0, L1, ...)"), {
      target: { value: "L1" },
    });
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Test Tier" },
    });
    fireEvent.change(screen.getByPlaceholderText("Max Edits"), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByPlaceholderText("Max Apps"), {
      target: { value: "5" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Allowed Tabs (comma-separated)"),
      {
        target: { value: "tab1,tab2" },
      }
    );
    fireEvent.change(screen.getByPlaceholderText("Run Quota"), {
      target: { value: "100" },
    });
    fireEvent.change(screen.getByPlaceholderText("Monthly Price"), {
      target: { value: "99.99" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("One-time Registration Price"),
      {
        target: { value: "199.99" },
      }
    );

    // Leave compliance frameworks empty
    const complianceInput = screen.getByPlaceholderText(
      "Compliance Frameworks (comma-separated)"
    );
    fireEvent.change(complianceInput, {
      target: { value: "" },
    });

    const submitButton = screen.getByRole("button", { name: /create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateTier).toHaveBeenCalledWith(
        expect.objectContaining({
          features: expect.objectContaining({
            compliance_frameworks: [],
          }),
        })
      );
    });
  });
});
