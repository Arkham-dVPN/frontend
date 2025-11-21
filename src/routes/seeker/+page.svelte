<script lang="ts">
	import type { PageData } from './$types';
	import { userStore } from '$lib/stores/user';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import FundWalletModal from '$lib/components/FundWalletModal.svelte';
	import ConnectWardenModal from '$lib/components/ConnectWardenModal.svelte';
	import WardenMap from '$lib/components/WardenMap.svelte';
	import { Wallet, HardDrive, Star, MapPin, List, Map } from 'lucide-svelte';
	import { LAMPORTS_PER_SOL } from '@solana/web3.js';

	let { data } = $props<PageData>();

	let user = $state($userStore);
	let showFundModal = $state(false);
	let showConnectModal = $state(false);
	let selectedWarden = $state<any>(null);
	let viewMode: 'list' | 'map' = $state('list');

	$effect(() => {
		user = $userStore;
	});

	function connectToWarden(warden: any) {
		selectedWarden = warden;
		showConnectModal = true;
	}

	const solBalance = $derived(data.balanceLamports / LAMPORTS_PER_SOL);
	const usdValue = $derived(solBalance * data.solPrice);
	const bandwidthConsumedGB = $derived((data.seekerMetrics?.totalBandwidthConsumed || 0) / 1024); // Assuming the value is in MB

</script>

<div class="min-h-screen p-6 pb-24">
	<div class="max-w-6xl mx-auto space-y-6">
		<div class="flex items-center justify-between">
			<h1 class="text-3xl font-bold">Seeker Dashboard</h1>
			<div class="text-sm text-muted-foreground">Welcome, {user.nickname}</div>
		</div>

		<!-- Wallet Balance -->
		<Card class="p-6">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<Wallet class="w-8 h-8 text-primary" />
					<div>
						<p class="text-sm text-muted-foreground">Wallet Balance</p>
						<p class="text-2xl font-bold">{solBalance.toFixed(4)} SOL</p>
						<p class="text-sm text-muted-foreground">
							<span>${usdValue.toFixed(2)} USD</span>
							<span class="mx-1">|</span>
							<span>
								{new Intl.NumberFormat().format(data.arkhamBalance || 0)} $ARKHAM
							</span>
						</p>
					</div>
				</div>
				<Button onclick={() => showFundModal = true} variant="outline">
					Fund Wallet
				</Button>
			</div>
		</Card>

		<!-- Metrics -->
		<div class="grid md:grid-cols-2 gap-4">
			<Card class="p-6">
				<div class="flex items-center gap-3">
					<div class="w-3 h-3 rounded-full {data.seekerMetrics?.activeConnections > 0 ? 'bg-primary' : 'bg-muted'}"></div>
					<div>
						<p class="text-sm text-muted-foreground">Active Connection</p>
						<p class="text-xl font-bold">
							{data.seekerMetrics?.activeConnections > 0 ? `${data.seekerMetrics.activeConnections} Active` : 'Not Connected'}
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
						onclick={() => viewMode = 'list'}
						class="gap-2"
					>
						<List class="h-4 w-4" />
						List
					</Button>
					<Button
						size="sm"
						variant={viewMode === 'map' ? 'secondary' : 'ghost'}
						onclick={() => viewMode = 'map'}
						class="gap-2"
					>
						<Map class="h-4 w-4" />
						Map
					</Button>
				</div>
			</div>

			{#if viewMode === 'list'}
				<div class="space-y-3">
					{#if data.wardens.length > 0}
						{#each data.wardens as warden}
						<Card class="p-4 hover:border-primary transition-colors">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-4 flex-1">
									<div class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
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
				<WardenMap wardens={data.wardens} p2pGraph={data.p2pGraph} />
			{/if}
		</div>
	</div>
</div>

<BottomNav active="home" />

{#if showFundModal}
  <FundWalletModal onclose={() => showFundModal = false} />
{/if}

{#if showConnectModal && selectedWarden}
  <ConnectWardenModal warden={selectedWarden} onclose={() => showConnectModal = false} />
{/if}