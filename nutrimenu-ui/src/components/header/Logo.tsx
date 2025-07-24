export default function Logo({ logo = "M", text = "NutriMenu AI" }) {
  return (
    <div className="flex items-center gap-2 font-semibold text-lg">
      <div className="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center text-white font-bold">{logo}</div>

      <span>{text}</span>
    </div>
  )
}