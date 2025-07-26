import { useEffect } from "react";

import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'

import Header from './components/header/Header'
import Hero from './components/Hero'
import MenuForm from './components/MenuForm'

import { auth } from "./services/firebase.tsx";

import './App.css'

function App() {
    useEffect(() => {
        signInAnonymously(auth)
            .catch((error) => console.error(error.message));

        const unsubscribe = onAuthStateChanged(auth, (u: User | null) => {
            if (u) {
                console.log("User signed in: ", u.uid)
            }
        });

        return () => unsubscribe();
    }, []);
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
