<script lang="ts">
	import { goto } from '$app/navigation';
	import { userStore } from '$lib/stores/user';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();
	let user = $state($userStore);

	// This effect runs whenever the user store changes.
	$effect(() => {
		// If a profile has been selected (either by logging in or completing onboarding),
		// redirect to the correct dashboard.
		if (user.selectedProfile) {
			if (user.role === 'warden') {
				goto('/warden', { replaceState: true });
			} else if (user.role === 'seeker') {
				goto('/seeker', { replaceState: true });
			}
		}
	});

	function handleSelectProfile(profile: string) {
		userStore.selectProfile(profile);
		// The $effect above will handle the redirect automatically when the store updates.
	}
</script>

{#if !user.selectedProfile}
	<div class="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
		<div class="w-full max-w-md rounded-lg border p-8 text-center shadow-lg">
			<h1 class="mb-6 text-3xl font-bold text-primary">Welcome to Arkham</h1>

			{#if data.error}
				<div
					class="rounded-md border border-destructive bg-destructive/10 p-4 text-destructive-foreground"
				>
					<h3 class="font-semibold">Connection Error</h3>
					<p>{data.error}</p>
				</div>
			{:else if data.profiles && data.profiles.length > 0}
				<p class="mb-6 text-muted-foreground">Please select a profile to continue.</p>
				<div class="flex flex-col space-y-3">
					{#each data.profiles as profile}
						<button
							onclick={() => handleSelectProfile(profile)}
							class="w-full rounded-md bg-primary py-3 text-primary-foreground transition-colors hover:bg-primary/90"
						>
							<span class="capitalize">{profile}</span>
						</button>
					{/each}
				</div>
				<div class="my-4 flex items-center">
					<div class="flex-grow border-t border-muted"></div>
					<span class="mx-4 flex-shrink text-xs uppercase text-muted-foreground">Or</span>
					<div class="flex-grow border-t border-muted"></div>
				</div>
				<button
					onclick={() => goto('/onboarding')}
					class="w-full rounded-md border border-input bg-transparent py-3 text-foreground transition-colors hover:bg-accent"
				>
					Create New Profile
				</button>
			{:else}
				<p class="mb-6 text-muted-foreground">Get started by creating your first profile.</p>
				<button
					onclick={() => goto('/onboarding')}
					class="w-full rounded-md bg-primary py-3 text-primary-foreground transition-colors hover:bg-primary/90"
				>
					Create Your First Profile
				</button>
			{/if}
		</div>
	</div>
{:else}
	<!-- Show a loading spinner while the redirect is happening -->
	<div class="flex items-center justify-center min-h-screen">
		<div class="text-center">
			<div
				class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"
			></div>
			<p class="mt-4 text-muted-foreground">Loading Dashboard...</p>
		</div>
	</div>
{/if}
