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

export function FormButton({
    children,
    icon,
    type = "button",
    onClick,
    loading = false,
    loading_msg,
    loading_icon,
    className = "",
    disabled = false,
}: ButtonProps) {
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
