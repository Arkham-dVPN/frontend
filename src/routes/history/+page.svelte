<script lang="ts">
	import type { PageData } from './$types';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import {
		formatTimestamp,
		formatSol,
		formatArkham,
		formatBandwidth,
		formatDuration
	} from '$lib/utils';

	let { data } = $props<PageData>();

	const historyData = $derived(data);

	// 1. Define Explicit Categories based on your requirements
	const solTypes = [
		'SOLTransferReceived', 
		'SOLTransferSent', 
		'EarningsClaimed', 
		'EscrowDeposited'
	];

	const arkhamTypes = [
		'ArkhamTokenReceived',
		'ArkhamTokenSent',
		'ArkhamTokensClaimed'
	];

	const connectionTypes = ['WardenRegistered', 'ConnectionStarted', 'ConnectionEnded'];

	const throughputTypes = ['ThroughputCertificateSubmitted'];

	// 2. Helper to merge all events and normalize keys (fixing the Case Sensitivity issue)
	// We also assign 'ConnectionEnded' to connectionHistory items since the Go struct lacks a 'type' field.
	const allEvents = $derived([
		...(historyData.solHistory ?? []),
		...(historyData.arkhamHistory ?? []),
		...(historyData.throughputHistory ?? []),
		...(historyData.connectionHistory?.map((e) => ({ ...e, type: 'ConnectionEnded' })) ?? [])
	]);

	// 3. Filter and Sort for each Tab
	const solEvents = $derived(
		allEvents
			.filter((e) => e.type && solTypes.includes(e.type))
			.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
	);

	const arkhamEvents = $derived(
		allEvents
			.filter((e) => e.type && arkhamTypes.includes(e.type))
			.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
	);

	const connectionEvents = $derived(
		allEvents
			.filter((e) => e.type && connectionTypes.includes(e.type))
			.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
	);

	const throughputEvents = $derived(
		allEvents
			.filter((e) => e.type && throughputTypes.includes(e.type))
			.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
	);

	type HistoryItem = (typeof allEvents)[0];

	let selectedTab: 'sol' | 'arkham' | 'connections' | 'throughput' = $state('sol');
	let selectedItem: HistoryItem | null = $state(null);

	function openModal(item: HistoryItem) {
		selectedItem = item;
	}

	function closeModal(e: MouseEvent) {
		if (e.currentTarget === e.target) {
			selectedItem = null;
		}
	}

	// Helper to determine if an event adds value (+) or removes it (-)
	function isPositiveEvent(type: string): boolean {
		return ['SOLTransferReceived', 'EarningsClaimed', 'ArkhamTokenReceived', 'ArkhamTokensClaimed'].includes(type);
	}
</script>

<div class="container mx-auto p-4 md:p-8">
	<h1 class="text-3xl font-bold mb-6">Transaction History</h1>

	<div class="border-b border-gray-200 dark:border-gray-700 mb-6">
		<nav class="-mb-px flex space-x-6" aria-label="Tabs">
			<button
				onclick={() => (selectedTab = 'sol')}
				class="px-3 py-2 font-medium text-sm rounded-md {selectedTab === 'sol'
					? 'bg-primary/10 text-primary'
					: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}"
			>
				SOL
			</button>
			<button
				onclick={() => (selectedTab = 'arkham')}
				class="px-3 py-2 font-medium text-sm rounded-md {selectedTab === 'arkham'
					? 'bg-primary/10 text-primary'
					: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}"
			>
				ARKHAM
			</button>
			<button
				onclick={() => (selectedTab = 'connections')}
				class="px-3 py-2 font-medium text-sm rounded-md {selectedTab === 'connections'
					? 'bg-primary/10 text-primary'
					: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}"
			>
				Connections
			</button>
			<button
				onclick={() => (selectedTab = 'throughput')}
				class="px-3 py-2 font-medium text-sm rounded-md {selectedTab === 'throughput'
					? 'bg-primary/10 text-primary'
					: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}"
			>
				Throughput
			</button>
		</nav>
	</div>

	{#await data}
		<div class="space-y-4">
			{#each Array(5) as _}
				<div class="bg-card p-4 rounded-lg shadow-sm animate-pulse">
					<div class="flex justify-between items-center">
						<div>
							<div class="h-5 w-32 bg-muted rounded"></div>
							<div class="h-4 w-24 bg-muted rounded mt-2"></div>
						</div>
						<div class="text-right">
							<div class="h-5 w-20 bg-muted rounded"></div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:then _}
		<div class="space-y-4">
			
			{#if selectedTab === 'sol'}
				{#each solEvents as item}
					<div
						class="bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
						onclick={() => openModal(item)}
						role="button"
						tabindex="0"
						onkeydown={(e) => e.key === 'Enter' && openModal(item)}
					>
						<div class="flex justify-between items-center">
							<div>
								<p class="font-semibold">
									{item.type?.replace(/([A-Z])/g, ' $1').trim()}
								</p>
								<p class="text-sm text-muted-foreground">{formatTimestamp(item.timestamp)}</p>
							</div>
							<div class="text-right">
								<p
									class="font-mono {isPositiveEvent(item.type) ? 'text-green-500' : 'text-red-500'}"
								>
									{isPositiveEvent(item.type) ? '+' : '-'}
									{formatSol(item.amount)} SOL
								</p>
							</div>
						</div>
					</div>
				{/each}
				{#if solEvents.length === 0}
					<p class="text-center text-muted-foreground py-8">No SOL transaction history.</p>
				{/if}
			{/if}

			{#if selectedTab === 'arkham'}
				{#each arkhamEvents as item}
					<div
						class="bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
						onclick={() => openModal(item)}
						role="button"
						tabindex="0"
						onkeydown={(e) => e.key === 'Enter' && openModal(item)}
					>
						<div class="flex justify-between items-center">
							<div>
								<p class="font-semibold">{item.type?.replace(/([A-Z])/g, ' $1').trim()}</p>
								<p class="text-sm text-muted-foreground">{formatTimestamp(item.timestamp)}</p>
							</div>
							<div class="text-right">
								<p class="font-mono {isPositiveEvent(item.type) ? 'text-green-500' : 'text-red-500'}">
									{isPositiveEvent(item.type) ? '+' : '-'} {formatArkham(item.amount)} ARKHAM
								</p>
							</div>
						</div>
					</div>
				{/each}
				{#if arkhamEvents.length === 0}
					<p class="text-center text-muted-foreground py-8">No ARKHAM token history.</p>
				{/if}
			{/if}

			{#if selectedTab === 'connections'}
				{#each connectionEvents as item}
					<div
						class="bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
						onclick={() => openModal(item)}
						role="button"
						tabindex="0"
						onkeydown={(e) => e.key === 'Enter' && openModal(item)}
					>
						<div class="flex justify-between items-center">
							<div>
								<p class="font-semibold">
									{item.type === 'BandwidthProofSubmitted'
										? 'Throughput Certificate Submitted'
										: item.type?.replace(/([A-Z])/g, ' $1').trim()}
								</p>
								<p class="text-sm text-muted-foreground">{formatTimestamp(item.timestamp)}</p>
							</div>
							<div class="text-right">
								{#if 'bandwidth' in item && item.bandwidth}
									<p class="font-mono text-primary">{formatBandwidth(item.bandwidth)}</p>
									{#if item.duration}
										<p class="text-sm text-muted-foreground">{formatDuration(item.duration)}</p>
									{/if}
								{:else if 'mbConsumed' in item && item.mbConsumed}
									<p class="font-mono text-primary">{item.mbConsumed} MB</p>
									<p class="text-sm text-muted-foreground">Submitted</p>
								{:else if 'amount' in item}
									<p class="font-mono text-primary">
										{#if item.type === 'WardenRegistered'}
											Stake
										{:else if item.type === 'ConnectionStarted'}
											Escrow
										{:else}
											Proof
										{/if}
									</p>
									<p class="text-sm text-muted-foreground">{formatSol(item.amount)} SOL</p>
								{/if}
							</div>
						</div>
					</div>
				{/each}
				{#if connectionEvents.length === 0}
					<p class="text-center text-muted-foreground py-8">No connection history.</p>
				{/if}
			{/if}

			{#if selectedTab === 'throughput'}
				{#each throughputEvents as item}
					<div
						class="bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
						onclick={() => openModal(item)}
						role="button"
						tabindex="0"
						onkeydown={(e) => e.key === 'Enter' && openModal(item)}
					>
						<div class="flex justify-between items-center">
							<div>
								<p class="font-semibold">
									Throughput Certificate
								</p>
								<p class="text-sm text-muted-foreground">{formatTimestamp(item.timestamp)}</p>
							</div>
							<div class="text-right">
								{#if item.mbConsumed}
									<p class="font-mono text-primary">{item.mbConsumed} MB</p>
									<p class="text-sm text-muted-foreground">Submitted</p>
								{/if}
							</div>
						</div>
					</div>
				{/each}
				{#if throughputEvents.length === 0}
					<p class="text-center text-muted-foreground py-8">No throughput history.</p>
				{/if}
			{/if}
		</div>
	{:catch error}
		<div class="text-center py-8">
			<p class="text-red-500">Failed to load transaction history.</p>
			<p class="text-muted-foreground text-sm mt-2">{error.message}</p>
		</div>
	{/await}
</div>

{#if selectedItem}
	<button
		type="button"
		class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center w-full h-full"
		onclick={closeModal}
	>
		<div class="bg-card rounded-xl p-6 w-full max-w-md" role="dialog" aria-modal="true">
			<h3 class="text-lg font-bold mb-4">Transaction Details</h3>
			<div class="space-y-2 text-sm">
				{#each Object.entries(selectedItem) as [key, value]}
					{#if value !== undefined && value !== null && value !== ''}
						<div class="flex justify-between">
							<span class="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
							<span class="font-mono text-right">
								{#if typeof value === 'string' && value.length > 30}
									{value.slice(0, 6)}...{value.slice(-6)}
								{:else if key === 'timestamp'}
									{formatTimestamp(value)}
								{:else}
									{String(value)}
								{/if}
							</span>
						</div>
					{/if}
				{/each}
			</div>
			<div class="mt-6 text-center">
				<a
					href="https://orb.helius.dev/tx/{selectedItem.signature}?cluster=devnet"
					target="_blank"
					rel="noopener noreferrer"
					class="text-primary hover:underline text-sm"
				>
					View on Orb
				</a>
			</div>
		</div>
	</button>
{/if}

<BottomNav active="history" />