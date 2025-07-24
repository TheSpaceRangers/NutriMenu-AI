type Props = {
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
};

export default function FormInput({
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
}: Props) {
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
