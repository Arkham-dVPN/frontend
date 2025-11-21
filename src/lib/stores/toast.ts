import { writable } from "svelte/store"

export interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info"
}

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([])

  return {
    subscribe,
    show: (message: string, type: Toast["type"] = "info") => {
      const id = Math.random().toString(36).substring(7)
      update((toasts) => [...toasts, { id, message, type }])

      setTimeout(() => {
        update((toasts) => toasts.filter((t) => t.id !== id))
      }, 3000)
    },
    remove: (id: string) => {
      update((toasts) => toasts.filter((t) => t.id !== id))
    },
  }
}

export const toastStore = createToastStore()
