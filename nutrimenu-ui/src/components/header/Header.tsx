import Logo from './Logo'
import NavBar from './NavBar'

export default function Header() {
  return (
    <header className="w-full bg-white shadow flex items-center justify-between px-8 py-4">
      <Logo />
      <NavBar />
    </header>
  )
}