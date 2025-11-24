<script lang="ts">
	import '../app.css';
	import { userStore } from '$lib/stores/user';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import ToastContainer from '$lib/components/ToastContainer.svelte';
	import ProfileSwitcher from '$lib/components/ProfileSwitcher.svelte';

	let { children } = $props();
	let user = $state($userStore);

	$effect(() => {
		user = $userStore;
	});

	onMount(() => {
		// Redirect to onboarding if the flag is not set.
		// Note: The profile switcher will handle creating the initial default profile.
		if (!user.hasOnboarded && window.location.pathname !== '/onboarding') {
			goto('/onboarding');
		}
	});
</script>

<div class="min-h-screen bg-background text-foreground">
	<header class="absolute right-4 top-4 z-20">
		<ProfileSwitcher />
	</header>
	<main>
		{@render children()}
	</main>
	<ToastContainer />
</div>
