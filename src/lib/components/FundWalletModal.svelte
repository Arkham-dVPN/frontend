<script lang="ts">
  import { walletStore } from '$lib/stores/wallet';
  import Button from '$lib/components/ui/button/button.svelte';
  import { X, Copy } from 'lucide-svelte';
  import { toastStore } from '$lib/stores/toast';

  let { onclose } = $props<{ onclose: () => void }>();
  let wallet = $state($walletStore);

  $effect(() => {
    wallet = $walletStore;
  });

  function copyAddress() {
    navigator.clipboard.writeText(wallet.address);
    toastStore.show('Address copied to clipboard', 'success');
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
    aria-labelledby="fund-wallet-modal-title"
  >
    <div class="flex items-center justify-between">
      <h2 id="fund-wallet-modal-title" class="text-2xl font-bold">Fund Wallet</h2>
      <button onclick={onclose} class="text-muted-foreground hover:text-foreground" aria-label="Close modal">
        <X class="w-6 h-6" />
      </button>
    </div>

    <div class="space-y-4">
      <div class="bg-muted p-4 rounded-lg text-center">
        <div class="w-48 h-48 bg-white mx-auto mb-4 rounded-lg flex items-center justify-center">
          <p class="text-background text-xs">QR Code</p>
        </div>
        <p class="text-sm text-muted-foreground mb-2">Send SOL to this address:</p>
        <div class="flex items-center gap-2">
          <code class="flex-1 bg-background p-2 rounded text-xs break-all">{wallet.address}</code>
          <Button size="icon" variant="outline" onclick={copyAddress} aria-label="Copy address">
            <Copy class="w-4 h-4" />
          </Button>
        </div>
      </div>

      <p class="text-xs text-muted-foreground text-center">
        Only send SOL to this address. Sending other tokens may result in loss of funds.
      </p>
    </div>
  </div>
</div>
