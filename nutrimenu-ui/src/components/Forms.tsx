// FormControls.tsx

import React from "react";

// --------- FormSelect ---------
type Option = { value: string | number; label: string }

type FormSelectProps = {
    id: string
    name: string
    label: string
    options?: Option[]
    value: string | number
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    required?: boolean
    className?: string
}

export function FormSelect({
   id,
   name,
   label,
   options = [],
   value,
   onChange,
   required = false,
   className = "",
}: FormSelectProps) {
    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={id} className="font-medium text-gray-700 flex items-center gap-1">
                {label}
            </label>
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className={`h-10 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:outline-none ${className}`}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    )
}

// --------- FormInput ---------
type FormInputProps = {
    id: string
    name: string
    label: string
    type?: string
    value: string | number
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    required?: boolean
    className?: string
    min?: string
    max?: string
}

export function FormInput({
    id,
    name,
    label,
    type = "text",
    value,
    onChange,
    placeholder = "",
    required = false,
    className = "",
    min,
    max
}: FormInputProps) {
    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={id} className="font-medium text-gray-700 flex items-center gap-1">
                {label}
            </label>

            <input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={`h-10 px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:outline-none ${className}`}
                min={min}
                max={max}
            />
        </div>
    );
}

// --------- Button ---------
type ButtonProps = {
    children?: React.ReactNode
    icon?: string
    type?: "button" | "submit" | "reset"
    onClick?: () => void
    loading?: boolean
    loading_msg?: string
    loading_icon?: string
    className?: string
    center?: boolean
    disabled?: boolean
    ariaLabel?: string
    size?: "sm" | "md" | "lg"
};

export function FormButton({
    children,
    icon,
    type = "button",
    onClick,
    loading = false,
    loading_msg,
    loading_icon,
    className = "",
    center = true,
    disabled = false,
    ariaLabel,
    size = "md",
}: ButtonProps) {
    const sizes = {
        sm: "px-3 py-1 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            aria-label={ariaLabel}
            className={`
                rounded-md border flex items-center justify-center gap-2 font-medium
                ${sizes[size]}
                ${center ? "mx-auto block" : ""}
                ${loading ? "bg-indigo-500 text-white" : "bg-white hover:bg-gray-100"}
                ${disabled ? "opacity-60 cursor-not-allowed" : ""}
                ${className}
            `}>
            {icon && <span aria-hidden="true">{loading ? loading_icon : icon}</span>}
            {loading ? loading_msg : children}
        </button>
    );
}

