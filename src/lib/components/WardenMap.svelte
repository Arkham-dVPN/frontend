<script lang="ts">
	import { Zap } from 'lucide-svelte';

	let { wardens, p2pGraph } = $props<{ wardens: any[], p2pGraph: any[] }>();

	const peerIdToCoords = (peerId: string) => {
		let hash = 0;
		for (let i = 0; i < peerId.length; i++) {
			const char = peerId.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash |= 0;
		}
		const x = (Math.abs(hash) % 70) + 15;
		const y = (Math.abs(hash / 31) % 60) + 20;
		return { x: `${x}%`, y: `${y}%` };
	};

	const onlineWardens = $derived(() => {
		const onlinePeerIds = new Set(p2pGraph.map(p => p.id));
		return wardens
			.filter(w => onlinePeerIds.has(w.id))
			.map(w => {
				const p2pInfo = p2pGraph.find(p => p.id === w.id);
				return {
					...w,
					...p2pInfo,
					coords: peerIdToCoords(w.id)
				};
			});
	});

	let hoveredWarden: any | null = $state(null);
</script>

<div class="relative aspect-[2/1] overflow-hidden rounded-lg border border-border/50 bg-secondary/30">
	<svg viewBox="0 0 800 400" class="h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
		<path d="M100,150 L150,120 L200,130 L250,110 L300,120 L350,100 L400,110 L450,90 L500,100 L550,80 L600,90 L650,70 L700,80" stroke="currentColor" stroke-width="1" fill="none" />
		<path d="M100,200 L150,220 L200,210 L250,230 L300,220 L350,240 L400,230 L450,250 L500,240 L550,260 L600,250 L650,270 L700,260" stroke="currentColor" stroke-width="1" fill="none" />
	</svg>
	<div class="absolute inset-0">
		{#each onlineWardens as warden}
			<div
				class="absolute h-3 w-3 rounded-full bg-primary animate-pulse-glow cursor-pointer"
				style="left: {warden.coords.x}; top: {warden.coords.y};"
				on:mouseenter={() => hoveredWarden = warden}
				on:mouseleave={() => hoveredWarden = null}
			/>
		{/each}

		<!-- User location -->
		<div class="absolute h-4 w-4 rounded-full bg-blue-500" style="left: 25%; top: 55%;" title="Your Location"></div>

		<!-- Tooltip -->
		{#if hoveredWarden}
			<div
				class="absolute bg-card text-card-foreground rounded-lg shadow-lg p-3 text-xs max-w-xs break-all pointer-events-none"
				style="left: {hoveredWarden.coords.x}; top: {hoveredWarden.coords.y}; transform: translate(15px, -100%);"
			>
				<p class="font-bold">Warden:</p>
				<p class="font-mono mb-2">{hoveredWarden.nickname} ({hoveredWarden.id.slice(0, 8)}...)</p>
				<div class="flex items-center gap-2 mb-2">
					<Zap class="h-3 w-3 text-primary" />
					<span class="font-bold">Latency:</span>
					<span class="font-mono">{hoveredWarden.latency > 0 ? `${hoveredWarden.latency} ms` : 'N/A'}</span>
				</div>
				<p class="font-bold">Price:</p>
				<p class="font-mono mb-2">${hoveredWarden.price.toFixed(2)} / GB</p>
			</div>
		{/if}
	</div>
</div>