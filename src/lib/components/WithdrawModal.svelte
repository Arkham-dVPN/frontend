<script lang="ts">
  import { toastStore } from '$lib/stores/toast';
  import Button from '$lib/components/ui/button/button.svelte';
  import Input from '$lib/components/ui/input/input.svelte';
  import { X } from 'lucide-svelte';

  let { onclose } = $props<{ onclose: () => void }>();
  
  let address = $state('');
  let amount = $state('');

  function withdraw() {
    // Simulate withdrawal
    setTimeout(() => {
      toastStore.show('Withdrawal initiated successfully', 'success');
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
    aria-labelledby="withdraw-modal-title"
  >
    <div class="flex items-center justify-between">
      <h2 id="withdraw-modal-title" class="text-2xl font-bold">Withdraw Funds</h2>
      <button onclick={onclose} class="text-muted-foreground hover:text-foreground" aria-label="Close modal">
        <X class="w-6 h-6" />
      </button>
    </div>

    <div class="space-y-4">
      <div>
        <label for="address" class="text-sm text-muted-foreground mb-2 block">Destination Address</label>
        <Input
          id="address"
          bind:value={address}
          placeholder="Enter Solana address"
          class="font-mono text-sm"
        />
      </div>

      <div>
        <label for="amount" class="text-sm text-muted-foreground mb-2 block">Amount (SOL)</label>
        <Input
          id="amount"
          type="number"
          bind:value={amount}
          placeholder="0.00"
          class="text-lg"
        />
      </div>

      <Button onclick={withdraw} class="w-full" disabled={!address || !amount}>
        Withdraw
      </Button>
    </div>
  </div>
</div>
