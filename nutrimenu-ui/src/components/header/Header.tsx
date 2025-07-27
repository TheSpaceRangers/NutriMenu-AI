import Logo from './Logo'
import NavBar from './NavBar'

type Props = {
    active: number;
    setActive: (index: number) => void;
};

export default function Header({ active, setActive }: Props) {
  return (
    <header className="w-full bg-white shadow flex items-center justify-between px-8 py-4">
      <Logo />
      <NavBar active={active} setActive={setActive}/>
    </header>
  )
}