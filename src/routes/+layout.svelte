<script lang="ts">
	import '../app.css';
	import { userStore } from '$lib/stores/user';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import ToastContainer from '$lib/components/ToastContainer.svelte';

	let { children } = $props();
	let user = $state($userStore);

	$effect(() => {
		user = $userStore;
	});

	onMount(() => {
		if (!user.hasOnboarded && window.location.pathname !== '/onboarding') {
			goto('/onboarding');
		}
	});
</script>

<div class="min-h-screen bg-background text-foreground">
	{@render children()}
	<ToastContainer />
</div>
