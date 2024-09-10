import React from "react";
import { Spinner } from "./Spinner";

const variants = {
  green: {
    className: "hover:bg-green-600 focus:ring-green-400 bg-green-500",
  },
  red: {
    className: "hover:bg-red-600 focus:ring-red-400 bg-red-500",
  },
};

interface ButtonProps {
  icon?: React.ReactNode;
  label?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: keyof typeof variants;
  isLoading?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  icon,
  isLoading,
  children,
  onClick,
  variant = "green",
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={isLoading || disabled}
      onClick={onClick}
      className={`flex items-center justify-center px-4 py-2 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 min-w-[110px] ${
        variants[variant].className
      } 
      ${disabled ? "cursor-not-allowed opacity-50" : ""}
      `}
      {...props}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {children}
          {icon && <span className="ml-1">{icon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
