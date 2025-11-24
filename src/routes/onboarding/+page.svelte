<script lang="ts">
	import { userStore, type UserRole } from '$lib/stores/user';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Power, Shield } from 'lucide-svelte';

	let step = $state(1);
	let nickname = $state('');

	const suggestedNames = [
		'AnonymousUser',
		'GhostInTheMachine',
		'Cipher',
		'ShadowRunner',
		'PhantomNode',
		'CryptoNomad'
	];

	const defaultName = suggestedNames[Math.floor(Math.random() * suggestedNames.length)];

	function nextStep() {
		if (step < 4) {
			step++;
		}
	}

	function selectRole(role: 'seeker' | 'warden') {
		const finalNickname = nickname.trim() || defaultName;

		// Manually construct the final state object.
		const finalState = {
			hasOnboarded: true,
			role: role,
			nickname: finalNickname,
			selectedProfile: role,
			isWardenRegistered: role === 'warden' ? $userStore.isWardenRegistered : false,
			isWardenActive: role === 'warden' ? $userStore.isWardenActive : false
		};

		// Force the save to localStorage synchronously before navigating.
		localStorage.setItem('arkham_user', JSON.stringify(finalState));

		// Set the store's value for the current session.
		userStore.set(finalState);

		// Now, it is safe to navigate.
		goto(role === 'warden' ? '/warden' : '/seeker', { replaceState: true });
	}
</script>

<div class="min-h-screen flex items-center justify-center p-4">
	<div class="w-full max-w-2xl">
		{#if step === 1}
			<div class="text-center space-y-8">
				<h1 class="text-4xl font-bold text-primary">Welcome to Arkham</h1>
				<p class="text-2xl text-foreground">The Decentralized Private Network (dPN)</p>

				<div class="space-y-4 max-w-md mx-auto">
					<Input
						type="text"
						placeholder="Choose a nickname"
						bind:value={nickname}
						class="text-lg"
					/>
					<div class="text-sm text-muted-foreground">Suggested: {suggestedNames.join(', ')}</div>
				</div>

				<Button onclick={nextStep} size="lg" class="px-8"> Next </Button>
			</div>
		{:else if step === 2}
			<div class="text-center space-y-8">
				<h2 class="text-3xl font-bold">How Arkham Works</h2>

				<div class="grid md:grid-cols-2 gap-6 mt-8">
					<div class="bg-card p-6 rounded-lg border border-border">
						<Shield class="w-12 h-12 text-primary mx-auto mb-4" />
						<h3 class="text-xl font-semibold mb-2">Pay As You Go</h3>
						<p class="text-muted-foreground">
							Use the dVPN and pay only for what you consume with crypto
						</p>
					</div>

					<div class="bg-card p-6 rounded-lg border border-border">
						<Power class="w-12 h-12 text-primary mx-auto mb-4" />
						<h3 class="text-xl font-semibold mb-2">Earn Crypto</h3>
						<p class="text-muted-foreground">Provide bandwidth and earn rewards in SOL and $ARKHAM</p>
					</div>
				</div>

				<Button onclick={nextStep} size="lg" class="px-8"> Next </Button>
			</div>
		{:else if step === 3}
			<div class="text-center space-y-8">
				<h2 class="text-3xl font-bold">Ready to Get Started?</h2>
				<p class="text-xl text-muted-foreground">
					Join the decentralized revolution and take control of your privacy
				</p>

				<div class="flex justify-center gap-4">
					<Button onclick={nextStep} size="lg" class="px-8"> Let's Go! </Button>
				</div>
			</div>
		{:else if step === 4}
			<div class="text-center space-y-8">
				<h2 class="text-3xl font-bold">Choose Your Role</h2>
				<p class="text-muted-foreground">You can always switch later in settings</p>

				<div class="grid md:grid-cols-2 gap-6 mt-8">
					<button
						onclick={() => selectRole('seeker')}
						class="bg-card p-8 rounded-lg border-2 border-border hover:border-primary transition-colors text-left"
					>
						<Shield class="w-16 h-16 text-primary mb-4" />
						<h3 class="text-2xl font-semibold mb-2">Become a Seeker</h3>
						<p class="text-muted-foreground">I want to use the dVPN and protect my privacy</p>
					</button>

					<button
						onclick={() => selectRole('warden')}
						class="bg-card p-8 rounded-lg border-2 border-border hover:border-primary transition-colors text-left"
					>
						<Power class="w-16 h-16 text-primary mb-4" />
						<h3 class="text-2xl font-semibold mb-2">Become a Warden</h3>
						<p class="text-muted-foreground">I want to provide bandwidth and earn crypto</p>
					</button>
				</div>
			</div>
		{/if}

		<div class="flex justify-center gap-2 mt-8">
			{#each [1, 2, 3, 4] as s}
				<div class="w-2 h-2 rounded-full {step === s ? 'bg-primary' : 'bg-muted'}"></div>
			{/each}
		</div>
	</div>
</div>