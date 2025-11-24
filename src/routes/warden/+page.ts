import type { PageLoad } from './$types';

/**
 * The load function now has minimal responsibility.
 * Data fetching is now handled reactively in the corresponding Svelte component,
 * allowing it to update automatically when the user store changes.
 */
export const load: PageLoad = async () => {
	return {};
};