import { auth } from './firebase'

import type { Params } from '../schemas/generate_menu'

const API_URL = import.meta.env.VITE_API_URL;

export async function generateMenu({ days, people, diet, start_date }: Params) {
    const user = auth.currentUser;
    if (!user)
        throw new Error("User not authenticated");
    const token = await user.getIdToken();

    const response = await fetch(
      `${API_URL}/generate_menu?days=${days}&people=${people}&diet=${encodeURIComponent(diet)}&start_date=${start_date}`,
      {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok)
        throw new Error("API error")
    return response.json();
}

export async function fetchMenus(month: string) {
    const user = auth.currentUser;
    if (!user)
        throw new Error("User not authenticated");
    const token = await user.getIdToken();

    const response = await fetch(
        `${API_URL}/menus?month=${encodeURIComponent(month)}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        }
    );

    if (!response.ok)
        throw new Error("Erreur lors de la récupération des menus");
    return response.json();
}

