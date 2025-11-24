import type { PageLoad } from './$types';

/**
 * The load function now has minimal responsibility.
 * Data fetching will be handled reactively in the Svelte component
 * based on changes in the user store.
 */
export const load: PageLoad = async () => {
	return {};
};
