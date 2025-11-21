import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
  try {
    const response = await fetch('http://localhost:8088/api/addresses');
    if (!response.ok) {
      throw new Error('Failed to fetch addresses');
    }
    const addresses = await response.json();
    return { addresses };
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return { addresses: {}, error: 'Could not connect to the backend.' };
  }
};
