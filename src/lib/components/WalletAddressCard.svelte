<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	import { Copy } from 'lucide-svelte';
	import { toastStore } from '$lib/stores/toast';
	import Button from './ui/button/button.svelte';
	import Card from './ui/card/card.svelte';
	import Input from './ui/input/input.svelte';

	const {
		address,
		balanceLamports = 0,
		solPrice = 0
	} = $props<{
		address: string | undefined;
		balanceLamports: number | undefined;
		solPrice: number | undefined;
	}>();

	let canvas: HTMLCanvasElement;

	const balanceSol = $derived(balanceLamports ? balanceLamports / 1_000_000_000 : 0);
	const balanceUsd = $derived(balanceSol * (solPrice || 0));

	onMount(() => {
		if (address && canvas) {
			QRCode.toCanvas(canvas, address, {
				width: 160,
				margin: 2,
				color: {
					dark: '#e0e0e0', // Foreground
					light: '#1e1e1e' // Card background
				}
			});
		}
	});

	function copyToClipboard() {
		if (!address) return;
		navigator.clipboard.writeText(address);
		toastStore.show('Address copied to clipboard', 'success');
	}
</script>

<Card class="p-6">
	<h2 class="text-xl font-semibold mb-4">Your Warden Wallet</h2>
	<div class="flex flex-col md:flex-row items-center gap-6">
		{#if address}
			<div class="p-2 bg-card rounded-lg">
				<canvas bind:this={canvas} width="160" height="160"></canvas>
			</div>
		{/if}
		<div class="flex-1 w-full space-y-4">
			<div>
				<p class="text-sm text-muted-foreground">Current Balance</p>
				<p class="text-2xl font-bold">{balanceSol.toFixed(4)} SOL</p>
				<p class="text-sm text-muted-foreground">${balanceUsd.toFixed(2)} USD</p>
			</div>
			<div>
				<label for="warden-address" class="text-sm text-muted-foreground mb-2 block"
					>Wallet Address</label
				>
				<div class="flex gap-2">
					<Input
						id="warden-address"
						value={address || 'Loading...'}
						readonly
						class="flex-1 font-mono text-xs"
					/>
					<Button variant="outline" size="icon" onclick={copyToClipboard} disabled={!address}>
						<Copy class="w-4 h-4" />
					</Button>
				</div>
			</div>
		</div>
	</div>
</Card>
