import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type UserRole = 'seeker' | 'warden' | null;

interface UserState {
	hasOnboarded: boolean;
	role: UserRole;
	nickname: string;
	isWardenRegistered: boolean;
	isWardenActive: boolean;
	selectedProfile: string | null;
}

const defaultState: UserState = {
	hasOnboarded: false,
	role: null,
	nickname: '',
	isWardenRegistered: false,
	isWardenActive: false,
	selectedProfile: null
};

function createUserStore() {
	const stored = browser ? localStorage.getItem('arkham_user') : null;
	const initial: UserState = stored ? JSON.parse(stored) : defaultState;

	const { subscribe, set, update } = writable<UserState>(initial);

	const saveToLocalStorage = (state: UserState) => {
		if (browser) {
			localStorage.setItem('arkham_user', JSON.stringify(state));
		}
	};

	return {
		subscribe,
		set: (value: UserState) => {
			saveToLocalStorage(value);
			set(value);
		},
		update: (fn: (state: UserState) => UserState) => {
			update((state) => {
				const newState = fn(state);
				saveToLocalStorage(newState);
				return newState;
			});
		},
		selectProfile: (profileName: string) => {
			update((state) => ({
				...state,
				selectedProfile: profileName,
				// Infer role from profile name for now
				role: profileName.includes('warden') ? 'warden' : 'seeker'
			}));
		},
		completeOnboarding: (role: UserRole, nickname: string) => {
			update((state) => ({
				...state,
				hasOnboarded: true,
				role,
				nickname,
				selectedProfile: role // Set the initial profile
			}));
		},
		registerWarden: () => {
			update((state) => ({ ...state, isWardenRegistered: true }));
		},
		toggleWardenActive: () => {
			update((state) => ({ ...state, isWardenActive: !state.isWardenActive }));
		},
		logout: () => {
			set(defaultState);
		}
	};
}

export const userStore = createUserStore();
