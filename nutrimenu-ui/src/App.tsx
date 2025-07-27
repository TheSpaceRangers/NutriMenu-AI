import {useEffect, useState} from "react";

import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'

import { setDefaultOptions } from "date-fns/setDefaultOptions"
import { fr } from "date-fns/locale"

import Header from './components/header/Header'
import Hero from './components/Hero'

import HistoryPage from './pages/HistoryPage'

import GenerateMenu from './components/GenerateMenu.tsx'

import { auth } from "./services/firebase.tsx";

import './App.css'

setDefaultOptions({ locale: fr })

function App() {
    const [activePage, setActivePage] = useState(0);

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
            <Header active={activePage} setActive={setActivePage}/>

            <main className="max-w-5xl mx-auto p-8">
                <Hero
                    title={
                        activePage === 0
                            ? "Créez votre menu personnalisé"
                            : "Historique des menus générés"
                    }
                    subtitle={
                        activePage === 0
                            ? "Générez un menu adapté à vos besoins avec l'IA"
                            : "Consultez vos menus enregistrés dans le calendrier"
                    }
                />

                {activePage === 0 && <GenerateMenu />}
                {activePage === 1 && <HistoryPage />}
            </main>
        </div>
    )
}

export default App
