import { writable, derived } from 'svelte/store';
import { losslessAPI } from '$lib/api';
import type { Track, Album } from '$lib/types';

// Search queries for popular artists to get trending content
const FEATURED_SEARCHES = [
    'Linkin Park',
    'Coldplay',
    'The Weeknd',
    'Billie Eilish',
    'Daft Punk',
    'Avicii',
    'Eminem',
    'Kendrick Lamar',
];

const MAX_TRACKS_PER_SEARCH = 4;
const MAX_TOTAL_TRACKS = 20;
const MAX_RECENT_ALBUMS = 12;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface DiscoverState {
    topTracks: Track[];
    recentAlbums: Album[];
    isLoading: boolean;
    error: string | null;
    lastFetched: number | null;
}

const initialState: DiscoverState = {
    topTracks: [],
    recentAlbums: [],
    isLoading: false,
    error: null,
    lastFetched: null
};

const store = writable<DiscoverState>(initialState);

let fetchPromise: Promise<void> | null = null;

function shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j]!, result[i]!];
    }
    return result;
}

async function fetchDiscoverContent(): Promise<void> {
    const state = await new Promise<DiscoverState>((resolve) => {
        const unsubscribe = store.subscribe((s) => {
            resolve(s);
            setTimeout(unsubscribe, 0);
        });
    });

    // Return cached data if fresh
    if (state.lastFetched && Date.now() - state.lastFetched < CACHE_TTL_MS && state.topTracks.length > 0) {
        return;
    }

    store.update((s) => ({ ...s, isLoading: true, error: null }));

    try {
        // Randomly select subset of searches for variety
        const selectedSearches = shuffleArray(FEATURED_SEARCHES).slice(0, 5);

        const searchResults = await Promise.allSettled(
            selectedSearches.map((query) => losslessAPI.searchTracks(query))
        );

        const allTracks: Track[] = [];
        const allAlbums: Album[] = [];
        const seenTrackIds = new Set<number>();
        const seenAlbumIds = new Set<number>();

        for (const result of searchResults) {
            if (result.status !== 'fulfilled') continue;

            const tracks = result.value.items.slice(0, MAX_TRACKS_PER_SEARCH);

            for (const track of tracks) {
                if (!seenTrackIds.has(track.id)) {
                    seenTrackIds.add(track.id);
                    allTracks.push(track);

                    // Also collect albums from tracks
                    if (track.album && !seenAlbumIds.has(track.album.id)) {
                        seenAlbumIds.add(track.album.id);
                        allAlbums.push(track.album);
                    }
                }
            }
        }

        // Sort tracks by popularity and take top N
        const topTracks = allTracks
            .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
            .slice(0, MAX_TOTAL_TRACKS);

        // Sort albums by release date (most recent first) and take top N
        const recentAlbums = allAlbums
            .filter((a) => a.releaseDate)
            .sort((a, b) => {
                const dateA = new Date(a.releaseDate!).getTime();
                const dateB = new Date(b.releaseDate!).getTime();
                return dateB - dateA;
            })
            .slice(0, MAX_RECENT_ALBUMS);

        store.set({
            topTracks,
            recentAlbums,
            isLoading: false,
            error: null,
            lastFetched: Date.now()
        });
    } catch (error) {
        console.error('Failed to fetch discover content:', error);
        store.update((s) => ({
            ...s,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to load discover content'
        }));
    }
}

export const discoverStore = {
    subscribe: store.subscribe,

    async load(): Promise<void> {
        if (fetchPromise) {
            return fetchPromise;
        }
        fetchPromise = fetchDiscoverContent().finally(() => {
            fetchPromise = null;
        });
        return fetchPromise;
    },

    refresh(): Promise<void> {
        store.update((s) => ({ ...s, lastFetched: null }));
        return this.load();
    },

    reset(): void {
        store.set(initialState);
    }
};

export const discoverTracks = derived(store, ($s) => $s.topTracks);
export const discoverAlbums = derived(store, ($s) => $s.recentAlbums);
export const discoverLoading = derived(store, ($s) => $s.isLoading);
export const discoverError = derived(store, ($s) => $s.error);
