import type { PageLoad } from './$types';

/** @type {import('./$types').PageLoad} */
export const load: PageLoad = async ({ fetch }) => {
  try {
    const response = await fetch('http://localhost:8088/api/profiles');
    if (!response.ok) {
      return {
        profiles: [],
        error: 'Failed to connect to the Arkham backend.'
      };
    }
    const profiles: string[] = await response.json();
    return {
      profiles
    };
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return {
      profiles: [],
      error: 'Could not connect to the Arkham backend. Is the CLI running?'
    };
  }
};
