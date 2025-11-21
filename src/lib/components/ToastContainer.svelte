<script lang="ts">
  import { toastStore } from '$lib/stores/toast';
  import { CheckCircle, XCircle, Info } from 'lucide-svelte';

  let toasts = $state($toastStore);

  $effect(() => {
    toasts = $toastStore;
  });
</script>

<div class="fixed bottom-24 right-4 z-50 space-y-2">
  {#each toasts as toast (toast.id)}
    <div
      class="bg-card border border-border rounded-lg p-4 shadow-lg flex items-center gap-3 min-w-80 animate-in slide-in-from-right"
    >
      {#if toast.type === 'success'}
        <CheckCircle class="w-5 h-5 text-primary flex-shrink-0" />
      {:else if toast.type === 'error'}
        <XCircle class="w-5 h-5 text-destructive flex-shrink-0" />
      {:else}
        <Info class="w-5 h-5 text-primary flex-shrink-0" />
      {/if}
      <p class="text-sm">{toast.message}</p>
    </div>
  {/each}
</div>
