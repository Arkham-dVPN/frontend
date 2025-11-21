<script lang="ts">
  import { Home, History, Settings } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import { userStore } from '$lib/stores/user';

  let { active } = $props<{ active: 'home' | 'history' | 'settings' }>();
  let user = $state($userStore);

  $effect(() => {
    user = $userStore;
  });

  function navigateHome() {
    goto(user.role === 'warden' ? '/warden' : '/seeker');
  }
</script>

<nav class="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
  <div class="max-w-md mx-auto flex justify-around items-center h-20">
    <button
      onclick={navigateHome}
      class="flex flex-col items-center gap-1 px-6 py-2 transition-colors {active === 'home' ? 'text-primary' : 'text-muted-foreground'}"
    >
      <Home class="w-6 h-6" />
      <span class="text-xs font-medium">Home</span>
    </button>

    <button
      onclick={() => goto('/history')}
      class="flex flex-col items-center gap-1 px-6 py-2 transition-colors {active === 'history' ? 'text-primary' : 'text-muted-foreground'}"
    >
      <History class="w-6 h-6" />
      <span class="text-xs font-medium">History</span>
    </button>

    <button
      onclick={() => goto('/settings')}
      class="flex flex-col items-center gap-1 px-6 py-2 transition-colors {active === 'settings' ? 'text-primary' : 'text-muted-foreground'}"
    >
      <Settings class="w-6 h-6" />
      <span class="text-xs font-medium">Settings</span>
    </button>
  </div>
</nav>
