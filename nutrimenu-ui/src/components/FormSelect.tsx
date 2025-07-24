type Option = { value: string | number; label: string }

type Props = {
    id: string
    name: string
    label: string
    options?: Option[]
    value: string | number
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    required?: boolean
    className?: string
}

export default function FormSelect({
  id,
  name,
  label,
  options = [],
  value,
  onChange,
  required = false,
  className = "",
}: Props) {
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
