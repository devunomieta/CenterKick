const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

export async function fetchLiveMatches() {
  if (!API_FOOTBALL_KEY) {
    console.warn('API_FOOTBALL_KEY is not defined. Returning mock data.');
    return [];
  }

  try {
    const res = await fetch(`${BASE_URL}/fixtures?live=all`, {
      method: 'GET',
      headers: {
        'x-apisports-key': API_FOOTBALL_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io'
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch live matches: ${res.statusText}`);
    }

    const data = await res.json();
    return data.response;
  } catch (error) {
    console.error('Error in fetchLiveMatches:', error);
    return [];
  }
}

export async function fetchPlayerStats(playerId: number, season: string) {
  if (!API_FOOTBALL_KEY) return null;

  try {
    const res = await fetch(`${BASE_URL}/players?id=${playerId}&season=${season}`, {
      method: 'GET',
      headers: {
        'x-apisports-key': API_FOOTBALL_KEY,
        'x-rapidapi-host': 'v3.football.api-sports.io'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    const data = await res.json();
    return data.response[0];
  } catch (error) {
    console.error('Error in fetchPlayerStats:', error);
    return null;
  }
}
