import React from "react";
import clsx from "clsx";

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 mr-2 text-white inline-block"
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

export type ButtonVariant = "primary" | "outline" | "ghost" | "danger" | "secondary" | "tertiary";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
}

const baseStyles =
  "inline-flex items-center justify-center rounded-lg font-medium smooth-transition focus:outline-none focus-smooth shadow-lg hover:shadow-xl cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 active:transition-none";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white border border-primary-500/30",
  outline: "bg-transparent hover:bg-primary-600/10 text-primary-300 border border-primary-500/50 hover:border-primary-400",
  ghost: "bg-transparent hover:bg-secondary-700/50 text-secondary-300 hover:text-white border border-transparent",
  danger: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white border border-red-500/30",
  secondary: "bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-500 hover:to-secondary-600 text-white border border-secondary-500/30",
  tertiary: "bg-gradient-to-r from-tertiary-600 to-tertiary-700 hover:from-tertiary-500 hover:to-tertiary-600 text-white border border-tertiary-500/30",
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
        (loading || disabled) && "opacity-50 cursor-not-allowed hover:shadow-lg",
        "px-4 py-2 text-sm",
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
