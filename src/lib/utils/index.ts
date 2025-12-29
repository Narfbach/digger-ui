import type { Artist } from '$lib/types';

/**
 * Format artists for metadata embedding
 */
export function formatArtistsForMetadata(artists?: Artist[] | null): string {
    if (!artists || !Array.isArray(artists) || artists.length === 0) {
        return '';
    }

    return artists
        .map((artist) => artist.name)
        .filter((name): name is string => typeof name === 'string' && name.length > 0)
        .join(', ');
}
