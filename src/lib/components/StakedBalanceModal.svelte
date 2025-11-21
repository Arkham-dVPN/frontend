<script lang="ts">
	import { Chart, type ChartConfiguration, ArcElement, Tooltip, Legend, PieController } from 'chart.js';
	import { createEventDispatcher, onMount } from 'svelte';

	// Register all required components for a pie chart.
	Chart.register(PieController, ArcElement, Tooltip, Legend);

	// Use camelCase to match the JSON output from the Go backend's view model.
	export let walletBalance = 0; // in SOL
	export let stakeAmount = 0; // in lamports or smallest unit
	export let stakeToken: { [key: string]: object } = { Sol: {} };
	export let solUsdPrice = 0;

	const dispatch = createEventDispatcher();

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	let stakedTokenName = 'UNKNOWN';
	let stakedValueInSol = 0;
	let stakedDisplayAmount = 0;
	let stakedDisplayUnit = '';
	let stakedUsdValue = 0;

	// The keys from the Go JSON view model will be capitalized (e.g., "Sol", "Usdc").
	if (stakeToken.Sol) {
		stakedTokenName = 'SOL';
		stakedValueInSol = stakeAmount / 1_000_000_000;
		stakedDisplayAmount = stakedValueInSol;
		stakedDisplayUnit = 'SOL';
		stakedUsdValue = stakedValueInSol * solUsdPrice;
	} else if (stakeToken.Usdc) {
		stakedTokenName = 'USDC';
		stakedDisplayAmount = stakeAmount / 1_000_000;
		stakedDisplayUnit = 'USDC';
		stakedUsdValue = stakedDisplayAmount;
		stakedValueInSol = solUsdPrice > 0 ? stakedUsdValue / solUsdPrice : 0;
	} else if (stakeToken.Usdt) {
		stakedTokenName = 'USDT';
		stakedDisplayAmount = stakeAmount / 1_000_000;
		stakedDisplayUnit = 'USDT';
		stakedUsdValue = stakedDisplayAmount;
		stakedValueInSol = solUsdPrice > 0 ? stakedUsdValue / solUsdPrice : 0;
	}

	const totalValueInSol = walletBalance + stakedValueInSol;
	const walletPct = totalValueInSol > 0 ? (walletBalance / totalValueInSol) * 100 : 0;
	const stakedPct = totalValueInSol > 0 ? (stakedValueInSol / totalValueInSol) * 100 : 0;

	const chartConfig: ChartConfiguration = {
		type: 'pie',
		data: {
			labels: [`Wallet Balance (${walletPct.toFixed(1)}%)`, `Staked (${stakedPct.toFixed(1)}%)`],
			datasets: [
				{
					data: [walletBalance, stakedValueInSol],
					backgroundColor: ['#8b5cf6', '#10b981'],
					hoverBackgroundColor: ['#a78bfa', '#34d399'],
					borderWidth: 0
				}
			]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					position: 'top',
					labels: {
						color: '#cbd5e1' // slate-300
					}
				}
			}
		}
	};

	onMount(() => {
		if (canvas) {
			chart = new Chart(canvas, chartConfig);
		}
		return () => {
			chart?.destroy();
		};
	});

	function handleClose() {
		dispatch('close');
	}
</script>

<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
	on:click|self={handleClose}
>
	<div class="relative w-full max-w-md rounded-lg border bg-card text-card-foreground shadow-xl">
		<div class="flex flex-col space-y-1.5 p-6">
			<h3 class="font-semibold tracking-tight text-2xl">Asset Allocation</h3>
			<p class="text-sm text-muted-foreground">
				Comparison of your liquid wallet balance versus your staked assets.
			</p>
		</div>

		<div class="p-6 pt-0">
			<div class="h-64 w-full">
				<canvas bind:this={canvas}></canvas>
			</div>

			<div class="mt-6 space-y-4">
				<div
					class="flex justify-between items-center p-3 rounded-lg bg-background border border-purple-500/50"
				>
					<div>
						<span class="font-semibold">Wallet Balance</span>
						<p class="text-sm text-muted-foreground">Liquid assets in your wallet</p>
					</div>
					<div class="text-right">
						<p class="font-bold text-lg">{walletBalance.toFixed(4)} SOL</p>
						<p class="text-sm text-muted-foreground">
							~${(walletBalance * solUsdPrice).toFixed(2)}
						</p>
					</div>
				</div>

				<div
					class="flex justify-between items-center p-3 rounded-lg bg-background border border-emerald-500/50"
				>
					<div>
						<span class="font-semibold">Staked Balance</span>
						<p class="text-sm text-muted-foreground">Assets locked in the protocol</p>
					</div>
					<div class="text-right">
						<p class="font-bold text-lg">
							{stakedDisplayAmount.toFixed(4)}
							{stakedDisplayUnit}
						</p>
						<p class="text-sm text-muted-foreground">~${stakedUsdValue.toFixed(2)}</p>
					</div>
				</div>
			</div>
		</div>

		<div class="flex items-center p-6 pt-0">
			<button class="btn btn-primary w-full" on:click={handleClose}>Close</button>
		</div>
	</div>
</div>