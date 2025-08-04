// src/components/ui/button.tsx
import React from "react";
import clsx from "clsx";

// Optional: simple spinner for loading state
function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 mr-2 text-blue-300 inline-block"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
  );
}

export type ButtonVariant = "primary" | "outline" | "ghost" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
}

const baseStyles =
  "inline-flex items-center justify-center rounded-lg font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-blue-700 hover:bg-blue-600 text-white border border-blue-800",
  outline: "bg-gray-900 hover:bg-blue-800 text-blue-200 border border-blue-700",
  ghost:
    "bg-transparent hover:bg-blue-900 text-blue-300 border border-transparent",
  danger: "bg-red-600 hover:bg-red-700 text-white border border-red-800",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      loading = false,
      disabled = false,
      fullWidth = false,
      className,
      children,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      disabled={loading || disabled}
      aria-disabled={loading || disabled}
      className={clsx(
        baseStyles,
        variantStyles[variant],
        fullWidth && "w-full",
        (loading || disabled) && "opacity-60 cursor-not-allowed",
        "cursor-pointer px-4 py-2 text-base",
        className
      )}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  )
);

Button.displayName = "Button";

export default Button;
