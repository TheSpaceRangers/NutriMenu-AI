export default function Hero({
    title = "Créez votre menu personnalisé",
    subtitle = "Générez un menu adapté à vos besoins avec l'intelligence artificielle"
}) {
  return (
    <section className="text-center mb-12">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">{title}</h1>
      <h2 className="text-gray-500 text-lg">{subtitle}</h2>
    </section>
  )
}
