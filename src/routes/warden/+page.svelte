<script lang="ts">
	import { userStore } from '$lib/stores/user';
	import { toastStore } from '$lib/stores/toast';
	import { nodeStore } from '$lib/stores/nodeStore';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import RegisterWardenModal from '$lib/components/RegisterWardenModal.svelte';
	import FundWalletModal from '$lib/components/FundWalletModal.svelte';
	import WalletAddressCard from '$lib/components/WalletAddressCard.svelte';
	import StakedBalanceModal from '$lib/components/StakedBalanceModal.svelte';
	import { Power, Wallet, Users, HardDrive, Coins, TrendingUp } from 'lucide-svelte';
	import { invalidateAll } from '$app/navigation';

	// --- Component State ---
	let isLoading = $state(true);
	let showRegisterModal = $state(false);
	let showFundModal = $state(false);
	let showStakedModal = $state(false);

	// --- Data from API ---
	let wardenStatus: any = $state(null);
	let solBalance: number | null = $state(null);
	let arkhamBalance: number | null = $state(null);
	let solPrice: number = $state(150); // Default price, will be updated

	// --- Derived State from Stores ---
	let user = $state($userStore);
	let nodeStatus = $state($nodeStore);

	// --- Data Fetching ---
	async function fetchData(profile: string | null) {
		if (!profile) return;

		isLoading = true;
		try {
			const solPricePromise = fetch(
				'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
			)
				.then((res) => res.json())
				.then((data) => data?.solana?.usd || 150)
				.catch(() => 150); // Fallback on error

			const [statusRes, solRes, arkhamRes, price] = await Promise.all([
				fetch(`/api/warden-status?profile=${profile}`),
				fetch(`/api/balance?profile=${profile}`),
				fetch(
					`/api/token-balance?profile=${profile}&mint=2NGz2GGAHVNL7yRm7if8K7RJ8ozy3Hms6UDRL8pHwDQU`
				),
				solPricePromise
			]);

			if (!statusRes.ok || !solRes.ok || !arkhamRes.ok) {
				throw new Error('Failed to fetch warden data');
			}

			wardenStatus = await statusRes.json();
			const solData = await solRes.json();
			solBalance = solData.lamports;

			const arkhamData = await arkhamRes.json();
			arkhamBalance = arkhamData.uiAmount;

			solPrice = price;
		} catch (error) {
			const message = error instanceof Error ? error.message : 'An unknown error occurred';
			toastStore.show(message, 'error');
			console.error('Error fetching warden data:', error);
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
		nodeStatus = $nodeStore;
	});

	$effect(() => {
		// Auto-start node for unregistered wardens only after data is loaded
		if (wardenStatus && !wardenStatus.is_registered && !nodeStatus.isRunning) {
			nodeStore.start().catch(err => {
				console.error('Failed to auto-start node for registration:', err);
				toastStore.show('Failed to start P2P node for registration.', 'error');
			});
		}
	});

	// --- UI Actions ---
	async function togglePower() {
		try {
			if (nodeStatus.isRunning) {
				await nodeStore.stop();
				toastStore.show('Warden P2P service stopped', 'success');
			} else {
				await nodeStore.start();
				toastStore.show('Warden P2P service started', 'success');
			}
		} catch (error) {
			toastStore.show('Failed to change node status', 'error');
			console.error(error);
		}
	}

	function onRegistrationSuccess() {
		showRegisterModal = false;
		// Refetch data for the current profile
		fetchData($userStore.selectedProfile);
	}
</script>

{#if isLoading}
	<div class="min-h-screen flex items-center justify-center p-4 text-center">
		<p class="text-muted-foreground">Loading Warden Data...</p>
	</div>
{:else if !wardenStatus?.is_registered}
	<div class="min-h-screen flex items-center justify-center p-4 pb-24">
		<div class="w-full max-w-md space-y-6 text-center">
			<WalletAddressCard
				profileName={$userStore.selectedProfile}
				solBalance={solBalance}
				arkhamBalance={arkhamBalance}
			/>
			<div>
				<h1 class="text-2xl font-bold">Become a Warden</h1>
				<p class="text-muted-foreground mt-2">
					Fund your wallet, then register on-chain to start providing bandwidth and earning rewards.
				</p>
			</div>
			<Button onclick={() => (showRegisterModal = true)} size="lg" class="w-full">
				Register as Warden
			</Button>
		</div>
	</div>
{:else}
	<!-- This is the main dashboard for a registered warden -->
	<div class="min-h-screen p-6 pb-24">
		<div class="max-w-6xl mx-auto space-y-6">
			<div class="flex items-center justify-between">
				<h1 class="text-3xl font-bold">Warden Dashboard</h1>
				<div class="text-sm text-muted-foreground">Welcome back, {user.nickname}</div>
			</div>

			<!-- Power Button -->
			<div class="flex justify-center">
				<button
					onclick={togglePower}
					class="w-32 h-32 rounded-full border-4 transition-all {nodeStatus.isRunning
						? 'bg-primary border-primary animate-pulse'
						: 'bg-card border-border'}"
				>
					<Power
						class="w-16 h-16 mx-auto {nodeStatus.isRunning ? 'text-background' : 'text-muted-foreground'}"
					/>
				</button>
			</div>

			<div class="text-center">
				<p
					class="text-lg font-semibold {nodeStatus.isRunning ? 'text-primary' : 'text-muted-foreground'}"
				>
					{nodeStatus.isRunning ? 'P2P Service Active' : 'P2P Service Inactive'}
				</p>
			</div>

			<!-- Node Status -->
			{#if nodeStatus.isRunning && nodeStatus.peerId}
				<Card class="p-6 bg-background/50">
					<h3 class="text-lg font-semibold mb-2">Node Info</h3>
					<div class="space-y-2 text-sm font-mono break-all">
						<p><strong>Peer ID:</strong> {nodeStatus.peerId}</p>
						{#if nodeStatus.addresses && nodeStatus.addresses.length > 0}
							<div>
								<strong>Addresses:</strong>
								<ul class="list-disc pl-5 mt-1">
									{#each nodeStatus.addresses as addr}
										<li>{addr}</li>
									{/each}
								</ul>
							</div>
						{/if}
					</div>
				</Card>
			{/if}

			<!-- Wallet Balance -->
			<Card class="p-6">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<Wallet class="w-8 h-8 text-primary" />
						<div>
							<p class="text-sm text-muted-foreground">Wallet Balance</p>
							<p class="text-2xl font-bold">{(solBalance / 1_000_000_000).toFixed(4)} SOL</p>
							<p class="text-sm text-muted-foreground">
								<span>
									${((solBalance / 1_000_000_000) * solPrice).toFixed(2)} USD
								</span>
								<span class="mx-1">|</span>
								<button
									onclick={() => (showStakedModal = true)}
									class="underline hover:text-primary transition-colors"
								>
									Staked
								</button>
								<span class="mx-1">|</span>
								<span>
									{new Intl.NumberFormat().format(arkhamBalance || 0)} $ARKHAM
								</span>
							</p>
						</div>
					</div>
					<Button onclick={() => (showFundModal = true)} variant="outline"> Fund Wallet </Button>
				</div>
			</Card>

			<!-- Metrics -->
			<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card class="p-6">
					<div class="flex items-center gap-3">
						<Users class="w-8 h-8 text-primary" />
						<div>
							<p class="text-sm text-muted-foreground">Active Connections</p>
							<p class="text-3xl font-bold">{wardenStatus.warden.activeConnections}</p>
						</div>
					</div>
				</Card>

				<Card class="p-6">
					<div class="flex items-center gap-3">
						<HardDrive class="w-8 h-8 text-primary" />
						<div>
							<p class="text-sm text-muted-foreground">Bandwidth Served</p>
							<p class="text-3xl font-bold">
								{(wardenStatus.warden.totalBandwidthServed / 1000).toFixed(2)} GB
							</p>
						</div>
					</div>
				</Card>

				<Card class="p-6">
					<div class="flex items-center gap-3">
						<Coins class="w-8 h-8 text-primary" />
						<div>
							<p class="text-sm text-muted-foreground">Unclaimed SOL</p>
							<p class="text-2xl font-bold">
								{(wardenStatus.warden.pendingClaims / 1_000_000_000).toFixed(4)} SOL
							</p>
							<p class="text-xs text-muted-foreground">
								${((wardenStatus.warden.pendingClaims / 1_000_000_000) * solPrice).toFixed(2)}
							</p>
						</div>
					</div>
				</Card>

				<Card class="p-6">
					<div class="flex items-center gap-3">
						<TrendingUp class="w-8 h-8 text-primary" />
						<div>
							<p class="text-sm text-muted-foreground">Unclaimed ARKHAM</p>
							<p class="text-2xl font-bold">
								{(wardenStatus.warden.arkhamTokensEarned / 1_000_000_000).toFixed(4)}
							</p>
							<p class="text-xs text-muted-foreground">$ARKHAM</p>
						</div>
					</div>
				</Card>
			</div>

			<!-- Chart -->
			<Card class="p-6">
				<h3 class="text-lg font-semibold mb-4">Active Connections Over Time</h3>
				<div class="h-64 flex items-end gap-2">
					{#each [2, 3, 1, 4, 3, 5, 3, 4, 2, 3] as value}
						<div class="flex-1 bg-primary rounded-t" style="height: {value * 20}%"></div>
					{/each}
				</div>
			</Card>
		</div>
	</div>
{/if}

<BottomNav active="home" />

{#if showRegisterModal}
	<RegisterWardenModal
		profileName={$userStore.selectedProfile}
		on:close={onRegistrationSuccess}
	/>
{/if}

{#if showFundModal}
	<FundWalletModal on:close={() => (showFundModal = false)} />
{/if}

{#if showStakedModal && wardenStatus?.warden}
	<StakedBalanceModal
		walletBalance={solBalance / 1_000_000_000}
		stakeAmount={wardenStatus.warden.stakeAmount}
		stakeToken={wardenStatus.warden.stakeToken}
		solUsdPrice={solPrice}
		on:close={() => (showStakedModal = false)}
	/>
{/if}
