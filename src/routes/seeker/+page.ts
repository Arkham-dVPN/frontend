import type { PageLoad } from './$types';

// This load function runs on the client-side to fetch all necessary data for the seeker dashboard.
export const load: PageLoad = async ({ fetch }) => {
	// Define fetchers for different data points to run them in parallel.
	const fetchSeekerStatus = async () => {
		try {
			const res = await fetch('/api/seeker-status?profile=seeker');
			if (!res.ok) {
				return { is_registered: false, seeker: null };
			}
			return res.json();
		} catch (e) {
			return { is_registered: false, seeker: null };
		}
	};

	const fetchAddress = async () => {
		try {
			const res = await fetch('/api/addresses');
			if (!res.ok) return null;
			const data = await res.json();
			return data?.seeker;
		} catch (e) {
			return null;
		}
	};

	const fetchBalance = async () => {
		try {
			const res = await fetch('/api/balance?profile=seeker');
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

	const fetchArkhamBalance = async () => {
		try {
			const mint = '2NGz2GGAHVNL7yRm7if8K7RJ8ozy3Hms6UDRL8pHwDQU';
			const res = await fetch(`/api/token-balance?profile=seeker&mint=${mint}`);
			if (!res.ok) return { uiAmount: 0 };
			return res.json();
		} catch (e) {
			return { uiAmount: 0 };
		}
	};

	const fetchAvailableWardens = async () => {
		try {
			const res = await fetch('/api/wardens');
			if (!res.ok) {
				console.error('Failed to fetch wardens');
				return [];
			}
			// The backend now returns the data in the format expected by the frontend.
			return res.json();
		} catch (e) {
			console.error('Failed to fetch wardens:', e);
			return []; // Return empty array on error
		}
	}

	try {
		// Run all fetches concurrently for performance.
		const [statusData, address, balanceData, solPrice, arkhamBalanceData, wardens] = await Promise.all([
			fetchSeekerStatus(),
			fetchAddress(),
			fetchBalance(),
			fetchSolPrice(),
			fetchArkhamBalance(),
			fetchAvailableWardens()
		]);

		return {
			isRegistered: statusData.is_registered,
			seekerMetrics: statusData.seeker,
			address: address,
			balanceLamports: balanceData.lamports,
			solPrice: solPrice,
			arkhamBalance: arkhamBalanceData.uiAmount,
			wardens: wardens
		};
	} catch (error: any) {
		// Return a default state with an error message if anything goes wrong.
		return {
			isRegistered: false,
			seekerMetrics: null,
			address: null,
			balanceLamports: 0,
			solPrice: 0,
			arkhamBalance: 0,
			wardens: [],
			error: error.message
		};
	}
};
