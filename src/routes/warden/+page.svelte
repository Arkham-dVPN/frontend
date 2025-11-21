<script lang="ts">
	import { onMount } from 'svelte';
	import { userStore } from '$lib/stores/user';
	import { toastStore } from '$lib/stores/toast';
	import { nodeStore, type NodeStatus } from '$lib/stores/nodeStore';
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import RegisterWardenModal from '$lib/components/RegisterWardenModal.svelte';
	import FundWalletModal from '$lib/components/FundWalletModal.svelte';
	import WalletAddressCard from '$lib/components/WalletAddressCard.svelte';
	import StakedBalanceModal from '$lib/components/StakedBalanceModal.svelte';
	import { Power, Wallet, Users, HardDrive, Coins, TrendingUp } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	let user = $state($userStore);
	let showRegisterModal = $state(false);
	let showFundModal = $state(false);
	let showStakedModal = $state(false);
	let nodeStatus = $state($nodeStore);

	onMount(async () => {
		await nodeStore.fetchStatus();
	});

	$effect(() => {
		user = $userStore;
		nodeStatus = $nodeStore;
	});

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
		invalidateAll();
	}
</script>

{#if data.error}
	<div class="min-h-screen flex items-center justify-center p-4 text-center">
		<p class="text-destructive">{data.error}</p>
	</div>
{:else if !data.isRegistered || !data.wardenMetrics}
	<div class="min-h-screen flex items-center justify-center p-4 pb-24">
		<div class="w-full max-w-md space-y-6 text-center">
			<WalletAddressCard
				address={data.address}
				balanceLamports={data.balanceLamports}
				solPrice={data.solPrice}
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
							<p class="text-2xl font-bold">{(data.balanceLamports / 1_000_000_000).toFixed(4)} SOL</p>
							<p class="text-sm text-muted-foreground">
								<span>
									${((data.balanceLamports / 1_000_000_000) * data.solPrice).toFixed(2)} USD
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
									{new Intl.NumberFormat().format(data.arkhamBalance || 0)} $ARKHAM
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
							<p class="text-3xl font-bold">{data.wardenMetrics.activeConnections}</p>
						</div>
					</div>
				</Card>

				<Card class="p-6">
					<div class="flex items-center gap-3">
						<HardDrive class="w-8 h-8 text-primary" />
						<div>
							<p class="text-sm text-muted-foreground">Bandwidth Served</p>
							<p class="text-3xl font-bold">
								{(data.wardenMetrics.totalBandwidthServed / 1000).toFixed(2)} GB
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
								{(data.wardenMetrics.pendingClaims / 1_000_000_000).toFixed(4)} SOL
							</p>
							<p class="text-xs text-muted-foreground">
								${((data.wardenMetrics.pendingClaims / 1_000_000_000) * data.solPrice).toFixed(
									2
								)}
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
								{(data.wardenMetrics.arkhamTokensEarned / 1_000_000_000).toFixed(4)}
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
						<div class="flex-1 bg-primary rounded-t" style="height: {value * 20}%" />
					{/each}
				</div>
			</Card>
		</div>
	</div>
{/if}

<BottomNav active="home" />

{#if showRegisterModal}
	<RegisterWardenModal onclose={onRegistrationSuccess} />
{/if}

{#if showFundModal}
	<FundWalletModal onclose={() => (showFundModal = false)} />
{/if}

{#if showStakedModal}
	<StakedBalanceModal
		walletBalance={data.balanceLamports / 1_000_000_000}
		stakeAmount={data.wardenMetrics.stakeAmount}
		stakeToken={data.wardenMetrics.stakeToken}
		solUsdPrice={data.solPrice}
		on:close={() => (showStakedModal = false)}
	/>
{/if}