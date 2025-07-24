import Header from './components/header/Header'

import Hero from './components/Hero'
import MenuForm from './components/MenuForm'

import './App.css'

function App() {
  return (
    <div className='min-h-screen bg-gray-100'>
      <Header />

      <main className="max-w-5xl mx-auto p-8">
        <Hero />
        <MenuForm />
      </main>
    </div>
  )
}

export default App
