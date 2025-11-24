<script lang="ts">
	import { userStore } from '$lib/stores/user';
	import { toastStore } from '$lib/stores/toast';
	import { nodeStore } from '$lib/stores/nodeStore';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import WalletAddressCard from '$lib/components/WalletAddressCard.svelte';
	import WardenList from '$lib/components/WardenList.svelte';
	import type { WardenApiView } from '$lib/types';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import FundWalletModal from '$lib/components/FundWalletModal.svelte';
	import ConnectWardenModal from '$lib/components/ConnectWardenModal.svelte';
	import WardenMap from '$lib/components/WardenMap.svelte';
	import { Wallet, HardDrive, Star, MapPin, List, Map } from 'lucide-svelte';
	import { LAMPORTS_PER_SOL } from '@solana/web3.js';

	// --- Component State ---
	let isLoading = $state(true);
	let showFundModal = $state(false);
	let showConnectModal = $state(false);
	let selectedWarden = $state<any>(null);
	let viewMode: 'list' | 'map' = $state('list');

	// --- Data from API ---
	let seekerStatus: any = $state(null);
	let solBalance: number | null = $state(null);
	let arkhamBalance: number | null = $state(null);
	let wardens: WardenApiView[] = $state([]);
	let p2pGraph: any = $state(null);
	let solPrice: number = $state(150); // Default price

	// --- Derived State ---
	const seekerMetrics = $derived(seekerStatus?.seeker);
	const solBalanceDisplay = $derived((solBalance || 0) / LAMPORTS_PER_SOL);
	const usdValue = $derived(solBalanceDisplay * solPrice);
	const bandwidthConsumedGB = $derived((seekerMetrics?.totalBandwidthConsumed || 0) / 1024);

// --- Derived State from Stores ---
	let user = $state($userStore);
	let nodeStatus = $state($nodeStore);

	// --- Data Fetching ---
	async function fetchData(profile: string | null) {
		if (!profile) return;

		isLoading = true;
		try {
			const [statusRes, solRes, arkhamRes, wardensRes, p2pGraphRes] = await Promise.all([
				fetch(`/api/seeker-status?profile=${profile}`),
				fetch(`/api/balance?profile=${profile}`),
				fetch(`/api/token-balance?profile=${profile}&mint=2NGz2GGAHVNL7yRm7if8K7RJ8ozy3Hms6UDRL8pHwDQU`),
				fetch('/api/wardens'),
				fetch('/api/p2p-graph')
			]);

			if (!statusRes.ok || !solRes.ok || !arkhamRes.ok || !wardensRes.ok || !p2pGraphRes.ok) {
				throw new Error('Failed to fetch seeker dashboard data');
			}

			seekerStatus = await statusRes.json();
			const solData = await solRes.json();
			solBalance = solData.lamports;
			const arkhamData = await arkhamRes.json();
			arkhamBalance = arkhamData.uiAmount;
			wardens = await wardensRes.json();
			p2pGraph = await p2pGraphRes.json();
		} catch (error) {
			const message = error instanceof Error ? error.message : 'An unknown error occurred';
			toastStore.show(message, 'error');
			console.error('Error fetching seeker data:', error);
		} finally {
			isLoading = false;
		}
	}

	// --- Effects ---
	$effect(() => {
		// This effect runs whenever the selected profile changes
		fetchData($userStore.selectedProfile);
	});

	$effect(() => {
		// Keep local state in sync with store state
		user = $userStore;
	});

	$effect(() => {
		// Keep local state in sync with store state
		nodeStatus = $nodeStore;
	});

	$effect(() => {
		// Auto-start node for seekers when profile is selected and node is not running
		if ($userStore.selectedProfile && !nodeStatus.isRunning) {
			startNodeIfNeeded($userStore.selectedProfile);
		}
	});

	async function startNodeIfNeeded(profile: string | null) {
		if (!profile) return;

		console.log(`Attempting to start P2P node for seeker profile: ${profile}`);

		try {
			// Check node status
			const nodeStatusRes = await fetch('/api/node/status');
			if (!nodeStatusRes.ok) {
				console.error('Failed to fetch node status:', nodeStatusRes.status);
				return;
			}
			const nodeStatus = await nodeStatusRes.json();
			console.log('Node status:', nodeStatus);
			if (nodeStatus.isRunning) {
				console.log('Node already running, skipping start');
				return;
			}

			// Start the node
			const startRes = await fetch('/api/node/start', { method: 'POST' });
			if (startRes.ok) {
				console.log('Node started successfully');
				toastStore.show('P2P node started successfully', 'success');
			} else {
				console.error('Failed to start node:', startRes.status);
				toastStore.show('Failed to start P2P node', 'error');
			}
		} catch (error) {
			console.error('Error starting node:', error);
		}
	}

	// --- UI Actions ---
	function connectToWarden(warden: any) {
		selectedWarden = warden;
		showConnectModal = true;
	}
</script>

{#if isLoading}
	<div class="min-h-screen flex items-center justify-center p-4 text-center">
		<p class="text-muted-foreground">Loading Seeker Dashboard...</p>
	</div>
{:else}
	<div class="min-h-screen p-6 pb-24">
		<div class="max-w-6xl mx-auto space-y-6">
			<div class="flex items-center justify-between">
				<h1 class="text-3xl font-bold">Seeker Dashboard</h1>
				<div class="text-sm text-muted-foreground">Welcome, {$userStore.nickname}</div>
			</div>

			<!-- Wallet Balance -->
			<Card class="p-6">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<Wallet class="w-8 h-8 text-primary" />
						<div>
							<p class="text-sm text-muted-foreground">Wallet Balance</p>
							<p class="text-2xl font-bold">{solBalanceDisplay.toFixed(4)} SOL</p>
							<p class="text-sm text-muted-foreground">
								<span>${usdValue.toFixed(2)} USD</span>
								<span class="mx-1">|</span>
								<span>
									{new Intl.NumberFormat().format(arkhamBalance || 0)} $ARKHAM
								</span>
							</p>
						</div>
					</div>
					<Button onclick={() => (showFundModal = true)} variant="outline">
						Fund Wallet
					</Button>
				</div>
			</Card>

			<!-- Metrics -->
			<div class="grid md:grid-cols-2 gap-4">
				<Card class="p-6">
					<div class="flex items-center gap-3">
						<div
							class="w-3 h-3 rounded-full {seekerMetrics?.activeConnections > 0
								? 'bg-primary'
								: 'bg-muted'}"
						></div>
						<div>
							<p class="text-sm text-muted-foreground">Active Connection</p>
							<p class="text-xl font-bold">
								{seekerMetrics?.activeConnections > 0
									? `${seekerMetrics.activeConnections} Active`
									: 'Not Connected'}
							</p>
						</div>
					</div>
				</Card>

				<Card class="p-6">
					<div class="flex items-center gap-3">
						<HardDrive class="w-8 h-8 text-primary" />
						<div>
							<p class="text-sm text-muted-foreground">Bandwidth Consumed</p>
							<p class="text-xl font-bold">{bandwidthConsumedGB.toFixed(2)} GB</p>
						</div>
					</div>
				</Card>
			</div>

			<!-- Warden List / Map -->
			<div>
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-2xl font-bold">Available Wardens</h2>
					<div class="flex items-center gap-2 rounded-lg bg-muted p-1">
						<Button
							size="sm"
							variant={viewMode === 'list' ? 'secondary' : 'ghost'}
							onclick={() => (viewMode = 'list')}
							class="gap-2"
						>
							<List class="h-4 w-4" />
							List
						</Button>
						<Button
							size="sm"
							variant={viewMode === 'map' ? 'secondary' : 'ghost'}
							onclick={() => (viewMode = 'map')}
							class="gap-2"
						>
							<Map class="h-4 w-4" />
							Map
						</Button>
					</div>
				</div>

				{#if viewMode === 'list'}
					<div class="space-y-3">
						{#if wardens.length > 0}
							{#each wardens as warden}
								<Card class="p-4 hover:border-primary transition-colors">
									<div class="flex items-center justify-between">
										<div class="flex items-center gap-4 flex-1">
											<div
												class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center"
											>
												<span class="text-primary font-bold">{warden.id.slice(0, 2)}</span>
											</div>

											<div class="flex-1">
												<p class="font-semibold text-lg">{warden.nickname}</p>
												<div class="flex items-center gap-4 text-sm text-muted-foreground">
													<span class="flex items-center gap-1">
														<MapPin class="w-4 h-4" />
														{warden.location}
													</span>
													<span class="flex items-center gap-1">
														<Star class="w-4 h-4 fill-primary text-primary" />
														{warden.reputation.toFixed(2)}
													</span>
												</div>
											</div>

											<div class="text-right">
												<p class="text-2xl font-bold text-primary">${warden.price.toFixed(2)}</p>
												<p class="text-xs text-muted-foreground">per GB</p>
											</div>
										</div>

										<Button onclick={() => connectToWarden(warden)} class="ml-4">
											Connect
										</Button>
									</div>
								</Card>
							{/each}
						{:else}
							<Card class="p-6 text-center text-muted-foreground">
								<p>No wardens available at the moment. Please check back later.</p>
							</Card>
						{/if}
					</div>
				{:else}
					<WardenMap {wardens} {p2pGraph} />
				{/if}
			</div>
		</div>
	</div>
{/if}

<BottomNav active="home" />

{#if showFundModal}
	<FundWalletModal on:close={() => (showFundModal = false)} />
{/if}

{#if showConnectModal && selectedWarden}
	<ConnectWardenModal warden={selectedWarden} on:close={() => (showConnectModal = false)} />
{/if}
