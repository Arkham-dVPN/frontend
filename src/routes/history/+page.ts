import { userStore } from '$lib/stores/user';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

// This page should only be rendered on the client since it depends on user interaction and localStorage.
export const ssr = false;

export const load: PageLoad = async ({ fetch }) => {
	const user = get(userStore);
	const profileName = user.selectedProfile;

	if (!profileName) {
		// If no profile is selected, return empty history.
		return {
			solHistory: [],
			arkhamHistory: [],
			connectionHistory: [],
			throughputHistory: [] 
		};
	}

	try {
		const response = await fetch(`/api/history?profile=${profileName}`);
		if (!response.ok) {
			throw new Error(`Failed to fetch history: ${response.statusText}`);
		}
		const historyData = await response.json();
		console.log('--- Raw History API Response ---:', historyData);
		
		return {
			solHistory: historyData.solHistory || [],
			arkhamHistory: historyData.arkhamHistory || [],
			connectionHistory: historyData.connectionHistory || [],
			throughputHistory: historyData.throughputHistory || []
		};
	} catch (error) {
		console.error('Error loading history data:', error);
		// Return empty arrays on error
		return {
			solHistory: [],
			arkhamHistory: [],
			connectionHistory: [],
			throughputHistory: [], 
			error: (error as Error).message
		};
	}
};