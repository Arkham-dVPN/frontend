<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Star, MapPin } from 'lucide-svelte';
	import type { WardenApiView } from '$lib/types';
	import ConnectWardenModal from './ConnectWardenModal.svelte';

	let { wardens }: { wardens: WardenApiView[] } = $props();

	let showConnectModal = $state(false);
	let selectedWarden = $state<WardenApiView | null>(null);

	function connectToWarden(warden: WardenApiView) {
		selectedWarden = warden;
		showConnectModal = true;
	}
</script>

<div class="space-y-3">
	{#if wardens && wardens.length > 0}
		{#each wardens as warden}
			<Card class="p-4 hover:border-primary transition-colors">
				<div class="flex items-center justify-between">
					<div class="flex flex-1 items-center gap-4">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20"
						>
							<span class="text-primary font-bold">{warden.id.slice(0, 2)}</span>
						</div>

						<div class="flex-1">
							<p class="font-semibold text-lg">{warden.nickname}</p>
							<div class="flex items-center gap-4 text-sm text-muted-foreground">
								<span class="flex items-center gap-1">
									<MapPin class="h-4 w-4" />
									{warden.location}
								</span>
								<span class="flex items-center gap-1">
									<Star class="h-4 w-4 fill-primary text-primary" />
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

{#if showConnectModal && selectedWarden}
	<ConnectWardenModal warden={selectedWarden} on:close={() => (showConnectModal = false)} />
{/if}
