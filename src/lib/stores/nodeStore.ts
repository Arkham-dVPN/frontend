import { writable } from 'svelte/store';

export interface NodeStatus {
	isRunning: boolean;
	peerId?: string;
	addresses?: string[];
}

function createNodeStore() {
	const { subscribe, set } = writable<NodeStatus>({ isRunning: false });

	return {
		subscribe,
		setStatus: (status: NodeStatus) => set(status),
		start: async () => {
			const response = await fetch('/api/node/start', { method: 'POST' });
			if (!response.ok) {
				throw new Error('Failed to start node');
			}
			const status: NodeStatus = await response.json();
			set(status);
			return status;
		},
		stop: async () => {
			const response = await fetch('/api/node/stop', { method: 'POST' });
			if (!response.ok) {
				throw new Error('Failed to stop node');
			}
			const status: NodeStatus = await response.json();
			set(status);
			return status;
		},
		fetchStatus: async () => {
			const response = await fetch('/api/node/status');
			if (!response.ok) {
				throw new Error('Failed to fetch node status');
			}
			const status: NodeStatus = await response.json();
			set(status);
			return status;
		}
	};
}

export const nodeStore = createNodeStore();
