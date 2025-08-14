import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import ErrorBoundary from "../../../components/Common/ErrorBoundary";

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
};

describe("ErrorBoundary", () => {
  it("should render children when no error occurs", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText("No error")).toBeInTheDocument();
  });

  it("should catch and display error when child component throws", () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(
      screen.getByText(/an unexpected error occurred/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /refresh page/i })
    ).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("should render custom fallback when provided", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const customFallback = <div>Custom error message</div>;

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Custom error message")).toBeInTheDocument();
    expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("should call console.error when error is caught", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      "ErrorBoundary caught an error:",
      expect.any(Error),
      expect.any(Object)
    );

    consoleSpy.mockRestore();
  });

  it("should show error UI with correct styling", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Check for specific UI elements
    const errorIcon = screen.getByRole("img", { hidden: true }); // SVG icon
    expect(errorIcon).toBeInTheDocument();

    const refreshButton = screen.getByRole("button", { name: /refresh page/i });
    expect(refreshButton).toHaveClass("bg-blue-600", "text-white");

    consoleSpy.mockRestore();
  });

  it("should handle multiple errors correctly", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText("No error")).toBeInTheDocument();

    // Trigger error
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("should handle nested components with errors", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const NestedComponent = () => (
      <div>
        <span>Outer component</span>
        <ThrowError shouldThrow={true} />
      </div>
    );

    render(
      <ErrorBoundary>
        <NestedComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.queryByText("Outer component")).not.toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("should preserve state across re-renders when no error occurs", () => {
    const StatefulComponent = () => {
      const [count, setCount] = React.useState(0);
      return (
        <div>
          <span>Count: {count}</span>
          <button onClick={() => setCount((c) => c + 1)}>Increment</button>
        </div>
      );
    };

    const { rerender } = render(
      <ErrorBoundary>
        <StatefulComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText("Count: 0")).toBeInTheDocument();

    // Increment counter
    fireEvent.click(screen.getByRole("button", { name: /increment/i }));
    expect(screen.getByText("Count: 1")).toBeInTheDocument();

    // Re-render boundary without error
    rerender(
      <ErrorBoundary>
        <StatefulComponent />
      </ErrorBoundary>
    );

    // Note: In this case the component will be recreated since we're re-rendering
    // the ErrorBoundary itself, but due to React's reconciliation, the state may be preserved
    // Since React sees the same component structure
    expect(screen.getByText("Count: 1")).toBeInTheDocument();
  });
});
