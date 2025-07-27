type Props = {
  active: number;
  setActive: (index: number) => void;
};

export default function NavBar({ active, setActive }: Props) {
  const navs = [
    { label: 'Génération', icon: '⚡' },
    { label: 'Historique', icon: '📋' },
  ]

  return (
    <nav className="flex gap-4">
      {navs.map((nav, i) => (
        <a
          href="#"
          key={nav.label}
          className={`nav-btn px-4 py-2 border rounded-md flex items-center gap-2 text-sm transition no-underline
            ${active === i
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-100'}`}
          onClick={e => {
            e.preventDefault()
            setActive(i)
          }}
        >
          <span>{nav.icon}</span>
          {nav.label}
        </a>
      ))}
    </nav>
  )
}
