import { auth } from './firebase'

import type { Params } from '../schemas/generate_menu'
import type { MenusSlimByMonth } from "../types/menu.tsx";

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

export async function fetchMenus(months: string[]): Promise<MenusSlimByMonth> {
    const user = auth.currentUser;
    if (!user)
        throw new Error("User not authenticated");
    const token = await user.getIdToken();

    const url = `${API_URL}/menus?month=${encodeURIComponent(months.map(m => `month=${encodeURIComponent(m)}`).join('&'))}`;
    const response = await fetch(
        url,
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
    return await response.json() as MenusSlimByMonth;
}
