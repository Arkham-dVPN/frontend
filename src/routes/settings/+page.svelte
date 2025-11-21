<script lang="ts">
	import { userStore } from '$lib/stores/user';
	import Card from '$lib/components/ui/card/card.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import { toastStore } from '$lib/stores/toast';
	import { Copy } from 'lucide-svelte';
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let nickname = $state($userStore.nickname);
	let isLoading = $state(false);

	function saveNickname() {
		userStore.update((state) => ({ ...state, nickname }));
		toastStore.show('Nickname updated successfully', 'success');
	}

	function switchRole() {
		userStore.update((state) => {
			const newRole = state.role === 'warden' ? 'seeker' : 'warden';
			toastStore.show(`Switched role to ${newRole}`, 'success');
			return { ...state, role: newRole };
		});
	}

	function copyToClipboard(text: string, label: string) {
		navigator.clipboard.writeText(text);
		toastStore.show(`${label} copied to clipboard`, 'success');
	}

	async function createProfile(role: 'warden' | 'seeker') {
		isLoading = true;
		try {
			const response = await fetch('/api/create-profile', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ profile: role })
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || 'Failed to create profile');
			}

			const result = await response.json();
			toastStore.show(`Successfully created ${role} profile!`, 'success');
			// Invalidate all data to re-run all load functions
			await invalidateAll();
		} catch (error: any) {
			toastStore.show(`Error: ${error.message}`, 'error');
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="min-h-screen p-6 pb-24">
	<div class="max-w-4xl mx-auto space-y-6">
		<h1 class="text-3xl font-bold">Settings</h1>

		<!-- Nickname -->
		<Card class="p-6">
			<h2 class="text-xl font-semibold mb-4">Profile</h2>
			<div class="space-y-4">
				<div>
					<label for="nickname" class="text-sm text-muted-foreground mb-2 block">Nickname</label>
					<div class="flex gap-2">
						<Input bind:value={nickname} class="flex-1" id="nickname" />
						<Button onclick={saveNickname}>Save</Button>
					</div>
				</div>

				<div>
					<label class="text-sm text-muted-foreground mb-2 block">Current Role</label>
					<p class="text-lg font-semibold capitalize">{$userStore.role || 'N/A'}</p>
				</div>

				<Button onclick={switchRole} class="w-full" variant="outline" disabled={!$userStore.role}>
					Switch to {$userStore.role === 'warden' ? 'Seeker' : 'Warden'}
				</Button>
			</div>
		</Card>

		<!-- Wallets -->
		<Card class="p-6">
			<h2 class="text-xl font-semibold mb-4">Wallet Addresses</h2>
			<div class="space-y-4">
				<!-- Warden Wallet -->
				<div>
					<label for="wardenWallet" class="text-sm text-muted-foreground mb-2 block"
						>Warden Wallet</label
					>
					{#if data.addresses?.warden}
						<div class="flex gap-2">
							<Input
								value={data.addresses.warden}
								readonly
								class="flex-1 font-mono text-sm"
								id="wardenWallet"
							/>
							<Button
								variant="outline"
								size="icon"
								onclick={() => copyToClipboard(data.addresses.warden, 'Warden wallet')}
							>
								<Copy class="w-4 h-4" />
							</Button>
						</div>
					{:else}
						<Button onclick={() => createProfile('warden')} disabled={isLoading} class="w-full">
							{isLoading ? 'Generating...' : 'Generate Warden Wallet'}
						</Button>
					{/if}
				</div>

				<!-- Seeker Wallet -->
				<div>
					<label for="seekerWallet" class="text-sm text-muted-foreground mb-2 block"
						>Seeker Wallet</label
					>
					{#if data.addresses?.seeker}
						<div class="flex gap-2">
							<Input
								value={data.addresses.seeker}
								readonly
								class="flex-1 font-mono text-sm"
								id="seekerWallet"
							/>
							<Button
								variant="outline"
								size="icon"
								onclick={() => copyToClipboard(data.addresses.seeker, 'Seeker wallet')}
							>
								<Copy class="w-4 h-4" />
							</Button>
						</div>
					{:else}
						<Button onclick={() => createProfile('seeker')} disabled={isLoading} class="w-full">
							{isLoading ? 'Generating...' : 'Generate Seeker Wallet'}
						</Button>
					{/if}
				</div>
			</div>
		</Card>
	</div>
</div>

<BottomNav active="settings" />