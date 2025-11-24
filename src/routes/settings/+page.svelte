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

	let newProfileName = $state('');
	let isLoading = $state(false);

	function copyToClipboard(text: string, label: string) {
		if (!navigator.clipboard) {
			toastStore.show('Clipboard API not available', 'error');
			return;
		}
		navigator.clipboard.writeText(text);
		toastStore.show(`${label} copied to clipboard`, 'success');
	}

	async function createProfile() {
		if (!newProfileName.trim()) {
			toastStore.show('Profile name cannot be empty', 'error');
			return;
		}

		isLoading = true;
		try {
			const response = await fetch('/api/create-profile', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ profileName: newProfileName })
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || 'Failed to create profile');
			}

			toastStore.show(`Successfully created profile "${newProfileName}"!`, 'success');
			newProfileName = ''; // Clear input
			// Invalidate all data to re-run all load functions, which will update the profile switcher
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

		<!-- Create New Profile -->
		<Card class="p-6">
			<h2 class="text-xl font-semibold mb-4">Create New Profile</h2>
			<p class="text-sm text-muted-foreground mb-4">
				Create a new profile to manage a separate set of warden and seeker wallets.
			</p>
			<div class="flex gap-2">
				<Input
					bind:value={newProfileName}
					placeholder="e.g. MyNode, David, etc."
					class="flex-1"
					id="newProfile"
					disabled={isLoading}
				/>
				<Button onclick={createProfile} disabled={isLoading}>
					{isLoading ? 'Creating...' : 'Create'}
				</Button>
			</div>
		</Card>

		<!-- Wallets -->
		<Card class="p-6">
			<h2 class="text-xl font-semibold mb-4">Wallet Addresses</h2>
			<div class="space-y-4">
				{#if data.addresses && Object.keys(data.addresses).length > 0}
					{#each Object.entries(data.addresses) as [name, address]}
						<div>
							<label for={name} class="text-sm text-muted-foreground mb-2 block capitalize"
								>{name.replace('_', ' ')}</label
							>
							<div class="flex gap-2">
								<Input id={name} value={address} readonly class="flex-1 font-mono text-sm" />
								<Button
									variant="outline"
									size="icon"
									onclick={() => copyToClipboard(address, name)}
								>
									<Copy class="w-4 h-4" />
								</Button>
							</div>
						</div>
					{/each}
				{:else}
					<p class="text-center text-muted-foreground">No wallets found.</p>
				{/if}
			</div>
		</Card>
	</div>
</div>

<BottomNav active="settings" />
