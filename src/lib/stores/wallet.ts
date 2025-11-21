import { writable } from "svelte/store"

interface WalletState {
  solBalance: number
  usdValue: number
  address: string
}

export const walletStore = writable<WalletState>({
  solBalance: 0.5,
  usdValue: 75.5,
  address: "ArkhamWallet1234567890abcdefghijklmnop",
})
