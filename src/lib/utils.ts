import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };


// --- Formatting Functions ---

export function formatTimestamp(timestamp: string | Date | null | undefined): string {
	if (!timestamp) {
		return 'Invalid Date';
	}
	const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
	if (isNaN(date.getTime())) {
		return 'Invalid Date';
	}
	return date.toLocaleString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
		hour12: true
	});
}

export function formatSol(lamports: number | bigint | null | undefined): number {
	if (!lamports) {
		return 0;
	}
    const sol = Number(lamports) / 1_000_000_000;
    return parseFloat(sol.toFixed(4));
}

export function formatArkham(tokens: number | bigint | null | undefined): number {
	if (!tokens) {
		return 0;
	}
    const arkham = Number(tokens) / 1_000_000_000; // Assuming 9 decimal places
    return parseFloat(arkham.toFixed(4));
}

export function formatBandwidth(bytes: number | bigint): string {
    const b = BigInt(bytes);
    if (b < 1024) {
        return `${b} B`;
    }
    const kb = Number(b) / 1024;
    if (kb < 1024) {
        return `${kb.toFixed(2)} KB`;
    }
    const mb = kb / 1024;
    if (mb < 1024) {
        return `${mb.toFixed(2)} MB`;
    }
    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
}

export function formatDuration(seconds: number | bigint): string {
    const s = Number(seconds);
    if (s < 60) {
        return `${s}s`;
    }
    const m = Math.floor(s / 60);
    const remS = s % 60;
    if (m < 60) {
        return `${m}m ${remS}s`;
    }
    const h = Math.floor(m / 60);
    const remM = m % 60;
    return `${h}h ${remM}m ${remS}s`;
}
