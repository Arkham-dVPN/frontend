import type { PageLoad } from './$types';

// This load function runs on the client-side to fetch all necessary data for the warden dashboard.
export const load: PageLoad = async ({ fetch }) => {
	// Define fetchers for different data points to run them in parallel.
	const fetchWardenStatus = async () => {
		try {
			const res = await fetch('/api/warden-status?profile=warden');
			if (!res.ok) {
				// If the profile doesn't exist, the API returns an error, which is expected.
				// We'll treat it as not registered.
				return { is_registered: false, warden: null };
			}
			return res.json();
		} catch (e) {
			return { is_registered: false, warden: null };
		}
	};

	const fetchAddress = async () => {
		try {
			const res = await fetch('/api/addresses');
			if (!res.ok) return null;
			const data = await res.json();
			return data?.warden;
		} catch (e) {
			return null;
		}
	};

	const fetchBalance = async () => {
		try {
			const res = await fetch('/api/balance?profile=warden');
			if (!res.ok) return { lamports: 0 };
			return res.json();
		} catch (e) {
			return { lamports: 0 };
		}
	};

	const fetchSolPrice = async () => {
		try {
			const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
			if (!res.ok) return 0;
			const data = await res.json();
			return data?.solana?.usd || 0;
		} catch (e) {
			// If coingecko is blocked or down, return a default price
			return 0;
		}
	};

	try {
		// Run all fetches concurrently for performance.
		const [statusData, address, balanceData, solPrice] = await Promise.all([
			fetchWardenStatus(),
			fetchAddress(),
			fetchBalance(),
			fetchSolPrice()
		]);

		// The new page.svelte uses 'wardenMetrics' for the warden object.
		// Let's align with that.
		return {
			isRegistered: statusData.is_registered,
			wardenMetrics: statusData.warden, // Pass the full warden object
			address: address,
			balanceLamports: balanceData.lamports,
			solPrice: solPrice
		};
	} catch (error: any) {
		// Return a default state with an error message if anything goes wrong.
		return {
			isRegistered: false,
			wardenMetrics: null,
			address: null,
			balanceLamports: 0,
			solPrice: 0,
			error: error.message
		};
	}
};
