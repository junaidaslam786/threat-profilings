import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import DynamicRegistrationForm from "../../components/Users/DynamicRegistrationForm";
import userReducer from "../../Redux/slices/userSlice";

// Mock external dependencies
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock API
vi.mock("../../Redux/api/userApi", () => ({
  useCreateUserMutation: () => [vi.fn(), { isLoading: false }],
  useJoinOrgRequestMutation: () => [vi.fn(), { isLoading: false }],
}));

describe("DynamicRegistrationForm org_size fix", () => {
  let store: ReturnType<typeof configureStore>;

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  beforeEach(() => {
    store = configureStore({
      reducer: {
        user: userReducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    });
  });

  it("should use correct org_size values in select options", () => {
    const mockFlowData = {
      registration_type: "standard" as const,
      required_fields: ["email", "org_name", "org_domain", "org_size"],
      user_type_detected: {
        suggested_type: "standard" as const,
        is_platform_admin: false,
        org_exists: false,
        can_create_le: false,
      },
    };

    render(
      <TestWrapper>
        <DynamicRegistrationForm
          email="test@example.com"
          flowData={mockFlowData}
          onBack={vi.fn()}
        />
      </TestWrapper>
    );

    // Check that the select element exists
    const selectElement = screen.getByDisplayValue("1-10 employees");
    expect(selectElement).toBeInTheDocument();

    // Check that all options have the correct values (not enum keys)
    const options = screen.getAllByRole("option");
    const optionValues = options.map((option) => (option as HTMLOptionElement).value);
    
    expect(optionValues).toContain("1-10");
    expect(optionValues).toContain("11-50");
    expect(optionValues).toContain("51-100");
    expect(optionValues).toContain("101-500");
    expect(optionValues).toContain("500+");
    
    // Ensure old enum key values are not present
    expect(optionValues).not.toContain("SMALL");
    expect(optionValues).not.toContain("MEDIUM");
    expect(optionValues).not.toContain("LARGE");
    expect(optionValues).not.toContain("XLARGE");
    expect(optionValues).not.toContain("ENTERPRISE");
  });

  it("should have correct default value for org_size", () => {
    const mockFlowData = {
      registration_type: "standard" as const,
      required_fields: ["email", "org_name", "org_domain", "org_size"],
      user_type_detected: {
        suggested_type: "standard" as const,
        is_platform_admin: false,
        org_exists: false,
        can_create_le: false,
      },
    };

    render(
      <TestWrapper>
        <DynamicRegistrationForm
          email="test@example.com"
          flowData={mockFlowData}
          onBack={vi.fn()}
        />
      </TestWrapper>
    );

    const selectElement = screen.getByDisplayValue("1-10 employees");
    expect((selectElement as HTMLSelectElement).value).toBe("1-10");
  });
});
