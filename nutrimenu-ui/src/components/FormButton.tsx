import React from "react";

type Props = {
  children: React.ReactNode
  icon?: string
  type?: "button" | "submit" | "reset"
  onClick?: () => void
  loading?: boolean
  loading_msg?: string
  loading_icon?: string
  className?: string
  disabled?: boolean
};

export default function Button({
  children,
  icon,
  type = "button",
  onClick,
  loading = false,
  loading_msg,
  loading_icon,
  className = "",
  disabled = false,
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        mt-8 mx-auto block min-w-[200px] px-6 py-3 rounded-md bg-gray-900 text-white text-base font-medium flex items-center justify-center gap-2
        transition
        ${loading ? "bg-indigo-500" : "hover:bg-gray-800"}
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      <span aria-hidden="true">{loading ? loading_icon : icon}</span>
      {loading ? loading_msg : children}
    </button>
  );
}
