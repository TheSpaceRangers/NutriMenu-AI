const API_URL = import.meta.env.VITE_API_URL;

type Params = {
    days: number;
    people: number;
    diet: string;
}

export async function generateMenu({ days, people, diet }: Params) {
  const response = await fetch(
    `${API_URL}/generate_trip_v1?days=${days}&people=${people}&diet=${diet}`
  );

  if (!response.ok) {
    throw new Error("API error");
  }

  return response.json();
}
