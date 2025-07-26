import { auth } from './firebase'

const API_URL = import.meta.env.VITE_API_URL;

type Params = {
    days: number;
    people: number;
    diet: string;
}

export async function generateMenu({ days, people, diet }: Params) {
    const user = auth.currentUser;
    if (!user)
        throw new Error("User not authenticated");
    const token = await user.getIdToken();

  const response = await fetch(
    `${API_URL}/generate_menu?days=${days}&people=${people}&diet=${diet}`,
      {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
      }
  );

  if (!response.ok) {
    throw new Error("API error");
  }

  return response.json();
}
