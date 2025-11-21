<script lang="ts">
  import { toastStore } from '$lib/stores/toast';
  import { walletStore } from '$lib/stores/wallet';
  import Button from '$lib/components/ui/button/button.svelte';
  import Input from '$lib/components/ui/input/input.svelte';
  import { X } from 'lucide-svelte';

  let { warden, onclose } = $props<{ warden: any; onclose: () => void }>();
  
  let wallet = $state($walletStore);
  let estimatedMb = $state('');
  
  $effect(() => {
    wallet = $walletStore;
    // Calculate 90% of available balance
    const availableBalance = wallet.solBalance * 0.9;
    const suggestedMb = Math.floor((availableBalance / warden.price) * 1024);
    estimatedMb = suggestedMb.toString();
  });

  function connect() {
    // Simulate on-chain connection
    setTimeout(() => {
      toastStore.show(`Connected to ${warden.nickname}!`, 'success');
      onclose();
    }, 1000);
  }

  function handleBackdropKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      onclose();
    }
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      onclose();
    }
  }
</script>

<!-- Updated modal backdrop with proper role and keyboard handling -->
<div 
  class="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" 
  role="presentation"
  onkeydown={handleBackdropKeydown}
  onclick={handleBackdropClick}
>
  <div 
    class="bg-card rounded-lg max-w-md w-full p-6 space-y-6" 
    role="dialog" 
    aria-modal="true" 
    aria-labelledby="connect-warden-modal-title"
  >
    <div class="flex items-center justify-between">
      <h2 id="connect-warden-modal-title" class="text-2xl font-bold">Connect to Warden</h2>
      <button onclick={onclose} class="text-muted-foreground hover:text-foreground" aria-label="Close modal">
        <X class="w-6 h-6" />
      </button>
    </div>

    <div class="bg-muted p-4 rounded-lg">
      <p class="text-sm text-muted-foreground">Connecting to:</p>
      <p class="text-xl font-bold">{warden.nickname}</p>
      <p class="text-sm text-muted-foreground">{warden.location}</p>
    </div>

    <div class="space-y-4">
      <div>
        <label class="text-sm text-muted-foreground mb-2 block" for="estimatedMb">Estimated MB for Session</label>
        <Input
          type="number"
          bind:value={estimatedMb}
          placeholder="0"
          class="text-lg"
          id="estimatedMb"
        />
        <p class="text-xs text-muted-foreground mt-1">
          Based on your balance, we suggest {estimatedMb} MB for this session (90% of available escrow).
        </p>
      </div>

      <div class="bg-muted p-4 rounded-lg">
        <div class="flex justify-between text-sm mb-1">
          <span class="text-muted-foreground">Estimated Cost:</span>
          <span class="font-semibold">${((parseFloat(estimatedMb) / 1024) * warden.price).toFixed(4)}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-muted-foreground">Rate:</span>
          <span class="font-semibold">${warden.price} / GB</span>
        </div>
      </div>

      <Button onclick={connect} class="w-full" disabled={!estimatedMb || parseFloat(estimatedMb) <= 0}>
        Connect
      </Button>
    </div>
  </div>
</div>
