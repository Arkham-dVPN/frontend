<script lang="ts">
	import { onMount } from 'svelte';
	import { userStore } from '$lib/stores/user';
	import { ChevronDown } from 'lucide-svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	let profiles: string[] = [];
	let allWallets: { [key: string]: string } = {};

	let activeHighLevelProfile: string | null = null;
	let activeRole: 'warden' | 'seeker' | null = null;

	let isOpen = false;

	// Subscribe to the store to reflect the current active wallet
	userStore.subscribe((value) => {
		if (value.selectedProfile) {
			const parts = value.selectedProfile.split('_');
			if (parts.length === 2) {
				activeHighLevelProfile = parts[0];
				activeRole = parts[1] as 'warden' | 'seeker';
			} else {
				activeHighLevelProfile = value.selectedProfile;
				activeRole = value.role;
			}
		}
	});

	async function fetchData() {
		try {
			const [profilesRes, walletsRes] = await Promise.all([
				fetch('/api/profiles'),
				fetch('/api/addresses')
			]);

			if (!profilesRes.ok || !walletsRes.ok) {
				throw new Error('Failed to fetch profile data');
			}

			const profilesData = await profilesRes.json();
			const walletsData = await walletsRes.json();

			profiles = profilesData;
			allWallets = walletsData;

			// Initialize the store if it's not set or invalid
			if (browser && profiles.length > 0) {
				const currentSelection = $userStore.selectedProfile;
				if (!currentSelection || !allWallets[currentSelection]) {
					// Default to the first profile's warden wallet
					userStore.selectProfile(`${profiles[0]}_warden`);
				}
			}
		} catch (error) {
			console.error('Error fetching profile data:', error);
		}
	}

	onMount(() => {
		fetchData();
	});

	// Refetch data when navigating to the page, e.g. after creating a new profile
	$: if ($page.url) {
		fetchData();
	}

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function select(profile: string, role: 'warden' | 'seeker') {
		const fullName = `${profile}_${role}`;
		if (allWallets[fullName]) {
			userStore.selectProfile(fullName);
		}
		isOpen = false;
	}
</script>

<div class="relative">
	<button
		on:click={toggleDropdown}
		class="flex items-center gap-2 rounded-md bg-gray-800 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 capitalize"
	>
		<span>{activeHighLevelProfile || '...'}</span>
		<span class="text-gray-400">/</span>
		<span class="font-bold">{activeRole || '...'}</span>
		<ChevronDown class="h-4 w-4" />
	</button>

	{#if isOpen}
		<div
			class="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
		>
			{#each profiles as profile}
				<div class="px-4 py-2 text-xs font-bold uppercase text-gray-400">{profile}</div>
				{#if allWallets[profile + '_warden']}
					<button
						on:click={() => select(profile, 'warden')}
						class="block w-full px-4 py-2 text-left text-sm {activeHighLevelProfile ===
						profile && activeRole === 'warden'
							? 'bg-primary text-white'
							: 'text-gray-300 hover:bg-gray-700'}"
					>
						Warden
					</button>
				{/if}
				{#if allWallets[profile + '_seeker']}
					<button
						on:click={() => select(profile, 'seeker')}
						class="block w-full px-4 py-2 text-left text-sm {activeHighLevelProfile ===
						profile && activeRole === 'seeker'
							? 'bg-primary text-white'
							: 'text-gray-300 hover:bg-gray-700'}"
					>
						Seeker
					</button>
				{/if}
			{/each}
		</div>
	{/if}
</div>