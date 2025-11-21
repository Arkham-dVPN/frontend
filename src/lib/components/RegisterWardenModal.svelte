<script lang="ts">
	import { userStore } from '$lib/stores/user';
	import { toastStore } from '$lib/stores/toast';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { X } from 'lucide-svelte';

	let { onclose } = $props<{ onclose: () => void }>();

	let step = $state(1);
	let selectedToken = $state('SOL');
	let amount = $state('');
	let isLoading = $state(false);
	let user = $state($userStore);

	async function register() {
		isLoading = true;
		const stakeAmount = parseFloat(amount);

		if (!stakeAmount || stakeAmount < 0.1) {
			toastStore.show('Invalid amount. Minimum is 0.1.', 'error');
			isLoading = false;
			return;
		}

		try {
			const response = await fetch('/api/register-warden', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					profile: user.selectedProfile,
					stakeToken: selectedToken,
					stakeAmount: stakeAmount
				})
			});

			if (!response.ok) {
				const errorData = await response.text();
				throw new Error(errorData || 'Registration failed');
			}

			const result = await response.json();

			userStore.registerWarden();
			toastStore.show('Successfully registered as Warden!', 'success');
			console.log('Registration successful, tx:', result.transactionSignature);
			onclose();
		} catch (error: any) {
			toastStore.show(`Error: ${error.message}`, 'error');
			console.error('Registration error:', error);
		} finally {
			isLoading = false;
		}
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
    aria-labelledby="register-warden-modal-title"
  >
    <div class="flex items-center justify-between">
      <h2 id="register-warden-modal-title" class="text-2xl font-bold">Register as Warden</h2>
      <button aria-label="Close modal" onclick={onclose} class="text-muted-foreground hover:text-foreground">
        <X class="w-6 h-6" />
      </button>
    </div>

    {#if step === 1}
      <div class="space-y-4">
        <div>
          <label for="token-select" class="text-sm text-muted-foreground mb-2 block">Select Token to Stake</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              id="token-select-sol"
              onclick={() => selectedToken = 'SOL'}
              class="p-4 rounded-lg border-2 transition-colors {selectedToken === 'SOL' ? 'border-primary bg-primary/10' : 'border-border'}"
            >
              <p class="font-semibold">SOL</p>
            </button>
            <button
              id="token-select-usdc"
              onclick={() => selectedToken = 'USDC'}
              class="p-4 rounded-lg border-2 transition-colors {selectedToken === 'USDC' ? 'border-primary bg-primary/10' : 'border-border'}"
            >
              <p class="font-semibold">USDC</p>
            </button>
          </div>
        </div>

        <Button onclick={() => step = 2} class="w-full">
          Next
        </Button>
      </div>
    {:else if step === 2}
      <div class="space-y-4">
        <div>
          <label for="stake-amount" class="text-sm text-muted-foreground mb-2 block">Amount to Stake</label>
          <Input
            id="stake-amount"
            type="number"
            bind:value={amount}
            placeholder="0.00"
            class="text-lg"
          />
          <p class="text-xs text-muted-foreground mt-1">Minimum: 0.1 {selectedToken}</p>
        </div>

        <div class="bg-muted p-4 rounded-lg">
          <p class="text-sm text-muted-foreground">You are staking:</p>
          <p class="text-2xl font-bold text-primary">{amount || '0'} {selectedToken}</p>
        </div>

        <Button onclick={register} class="w-full" disabled={!amount || parseFloat(amount) < 0.1}>
          Register & Stake
        </Button>
      </div>
    {/if}
  </div>
</div>
