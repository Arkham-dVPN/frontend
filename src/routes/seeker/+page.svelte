<script lang="ts">
  import { walletStore } from '$lib/stores/wallet';
  import { userStore } from '$lib/stores/user';
  import Button from '$lib/components/ui/button/button.svelte';
  import Card from '$lib/components/ui/card/card.svelte';
  import BottomNav from '$lib/components/BottomNav.svelte';
  import FundWalletModal from '$lib/components/FundWalletModal.svelte';
  import ConnectWardenModal from '$lib/components/ConnectWardenModal.svelte';
  import { Wallet, HardDrive, Star, MapPin } from 'lucide-svelte';

  let wallet = $state($walletStore);
  let user = $state($userStore);
  let showFundModal = $state(false);
  let showConnectModal = $state(false);
  let selectedWarden = $state<any>(null);

  $effect(() => {
    wallet = $walletStore;
    user = $userStore;
  });

  const metrics = {
    activeConnection: null,
    bandwidthConsumed: 2.4
  };

  const wardens = [
    { id: 'W1', nickname: 'PhantomNode', location: '🇺🇸 USA', price: 0.05, reputation: 5 },
    { id: 'W2', nickname: 'CryptoGuard', location: '🇬🇧 UK', price: 0.04, reputation: 4.5 },
    { id: 'W3', nickname: 'ShadowRunner', location: '🇩🇪 Germany', price: 0.06, reputation: 5 },
    { id: 'W4', nickname: 'GhostNode', location: '🇯🇵 Japan', price: 0.07, reputation: 4 },
    { id: 'W5', nickname: 'CipherNet', location: '🇨🇦 Canada', price: 0.05, reputation: 4.5 },
  ];

  function connectToWarden(warden: any) {
    selectedWarden = warden;
    showConnectModal = true;
  }
</script>

<div class="min-h-screen p-6 pb-24">
  <div class="max-w-6xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold">Seeker Dashboard</h1>
      <div class="text-sm text-muted-foreground">Welcome, {user.nickname}</div>
    </div>

    <!-- Wallet Balance -->
    <Card class="p-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Wallet class="w-8 h-8 text-primary" />
          <div>
            <p class="text-sm text-muted-foreground">Wallet Balance</p>
            <p class="text-2xl font-bold">{wallet.solBalance} SOL</p>
            <p class="text-sm text-muted-foreground">${wallet.usdValue.toFixed(2)} USD</p>
          </div>
        </div>
        <Button onclick={() => showFundModal = true} variant="outline">
          Fund Wallet
        </Button>
      </div>
    </Card>

    <!-- Metrics -->
    <div class="grid md:grid-cols-2 gap-4">
      <Card class="p-6">
        <div class="flex items-center gap-3">
          <div class="w-3 h-3 rounded-full {metrics.activeConnection ? 'bg-primary' : 'bg-muted'}"></div>
          <div>
            <p class="text-sm text-muted-foreground">Active Connection</p>
            <p class="text-xl font-bold">
              {metrics.activeConnection || 'Not Connected'}
            </p>
          </div>
        </div>
      </Card>

      <Card class="p-6">
        <div class="flex items-center gap-3">
          <HardDrive class="w-8 h-8 text-primary" />
          <div>
            <p class="text-sm text-muted-foreground">Bandwidth Consumed</p>
            <p class="text-xl font-bold">{metrics.bandwidthConsumed} GB</p>
          </div>
        </div>
      </Card>
    </div>

    <!-- Warden List -->
    <div>
      <h2 class="text-2xl font-bold mb-4">Available Wardens</h2>
      <div class="space-y-3">
        {#each wardens as warden}
          <Card class="p-4 hover:border-primary transition-colors">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4 flex-1">
                <div class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span class="text-primary font-bold">{warden.id}</span>
                </div>
                
                <div class="flex-1">
                  <p class="font-semibold text-lg">{warden.nickname}</p>
                  <div class="flex items-center gap-4 text-sm text-muted-foreground">
                    <span class="flex items-center gap-1">
                      <MapPin class="w-4 h-4" />
                      {warden.location}
                    </span>
                    <span class="flex items-center gap-1">
                      <Star class="w-4 h-4 fill-primary text-primary" />
                      {warden.reputation}
                    </span>
                  </div>
                </div>

                <div class="text-right">
                  <p class="text-2xl font-bold text-primary">${warden.price}</p>
                  <p class="text-xs text-muted-foreground">per GB</p>
                </div>
              </div>

              <Button onclick={() => connectToWarden(warden)} class="ml-4">
                Connect
              </Button>
            </div>
          </Card>
        {/each}
      </div>
    </div>
  </div>
</div>

<BottomNav active="home" />

{#if showFundModal}
  <FundWalletModal onclose={() => showFundModal = false} />
{/if}

{#if showConnectModal && selectedWarden}
  <ConnectWardenModal warden={selectedWarden} onclose={() => showConnectModal = false} />
{/if}
