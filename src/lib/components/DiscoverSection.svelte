<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { discoverStore } from '$lib/stores/discover';
	import { playerStore } from '$lib/stores/player';
	import { losslessAPI } from '$lib/api';
	import type { Track, Album } from '$lib/types';
	import { Play, RefreshCw, Disc, Music, ChevronRight } from 'lucide-svelte';

	const trackSkeletons = Array.from({ length: 8 }, (_, i) => i);
	const albumSkeletons = Array.from({ length: 6 }, (_, i) => i);

	onMount(() => {
		discoverStore.load();
	});

	function handleTrackPlay(track: Track) {
		playerStore.setQueue([track], 0);
		playerStore.play();
	}

	function handlePlayAll() {
		if ($discoverStore.topTracks.length > 0) {
			playerStore.setQueue($discoverStore.topTracks, 0);
			playerStore.play();
		}
	}

	function handleAlbumClick(album: Album) {
		goto(`/album/${album.id}`);
	}

	function handleRefresh() {
		discoverStore.refresh();
	}

	function formatDuration(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}
</script>

<section class="space-y-8">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<Music size={20} class="text-[#00ff41]" />
			<h2 class="font-mono text-lg font-semibold tracking-wider text-[#00ff41] uppercase">
				[ DISCOVER ]
			</h2>
		</div>
		<button
			onclick={handleRefresh}
			disabled={$discoverStore.isLoading}
			class="flex items-center gap-2 border border-[#003311] bg-black px-3 py-1.5 font-mono text-xs text-[#00b82e] transition-all hover:border-[#00ff41] hover:text-[#00ff41] disabled:opacity-50"
		>
			<RefreshCw size={14} class={$discoverStore.isLoading ? 'animate-spin' : ''} />
			REFRESH
		</button>
	</div>

	{#if $discoverStore.error}
		<div class="border border-[#ff0033] bg-[#110000] p-4">
			<p class="font-mono text-sm text-[#ff0033]">{$discoverStore.error}</p>
			<button onclick={handleRefresh} class="mt-2 font-mono text-xs text-[#00ff41] hover:underline">
				[ RETRY ]
			</button>
		</div>
	{/if}

	<!-- Top Tracks Section -->
	<div class="space-y-4">
		<div class="flex items-center justify-between">
			<h3 class="font-mono text-sm tracking-wide text-[#00b82e] uppercase">// TRENDING TRACKS</h3>
			{#if $discoverStore.topTracks.length > 0}
				<button
					onclick={handlePlayAll}
					class="flex items-center gap-2 font-mono text-xs text-[#006622] transition-all hover:text-[#00ff41]"
				>
					<Play size={12} fill="currentColor" />
					PLAY ALL
				</button>
			{/if}
		</div>

		<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
			{#if $discoverStore.isLoading && $discoverStore.topTracks.length === 0}
				{#each trackSkeletons as _}
					<div
						class="flex animate-pulse items-center gap-3 border border-[#003311] bg-[#001100]/50 p-3"
					>
						<div class="h-12 w-12 bg-[#003311]"></div>
						<div class="flex-1 space-y-2">
							<div class="h-3 w-3/4 bg-[#003311]"></div>
							<div class="h-2 w-1/2 bg-[#003311]/50"></div>
						</div>
					</div>
				{/each}
			{:else}
				{#each $discoverStore.topTracks as track (track.id)}
					<button
						onclick={() => handleTrackPlay(track)}
						class="group flex items-center gap-3 border border-[#003311] bg-[#001100]/30 p-3 text-left transition-all hover:border-[#00ff41] hover:bg-[#001100] hover:shadow-[0_0_15px_rgba(0,255,65,0.2)]"
					>
						{#if track.album?.cover}
							<div
								class="relative h-12 w-12 flex-shrink-0 overflow-hidden border border-[#003311] group-hover:border-[#00ff41]"
							>
								<img
									src={losslessAPI.getCoverUrl(track.album.cover, '160')}
									alt={track.title}
									class="h-full w-full object-cover"
									loading="lazy"
								/>
								<div
									class="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
								>
									<Play size={20} class="text-[#00ff41]" fill="currentColor" />
								</div>
							</div>
						{:else}
							<div
								class="flex h-12 w-12 flex-shrink-0 items-center justify-center border border-[#003311] bg-[#001100]"
							>
								<Disc size={20} class="text-[#003311]" />
							</div>
						{/if}
						<div class="min-w-0 flex-1">
							<p
								class="truncate font-mono text-sm font-medium text-[#00ff41] group-hover:text-[#00ff41]"
							>
								{track.title}
							</p>
							<p class="truncate font-mono text-xs text-[#006622]">
								{track.artist?.name ?? 'Unknown Artist'}
							</p>
						</div>
						<span class="font-mono text-[10px] text-[#003311] group-hover:text-[#006622]">
							{formatDuration(track.duration)}
						</span>
					</button>
				{/each}
			{/if}
		</div>
	</div>

	<!-- Recent Albums Section -->
	{#if $discoverStore.recentAlbums.length > 0 || $discoverStore.isLoading}
		<div class="space-y-4">
			<h3 class="font-mono text-sm tracking-wide text-[#00b82e] uppercase">// NEW RELEASES</h3>

			<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
				{#if $discoverStore.isLoading && $discoverStore.recentAlbums.length === 0}
					{#each albumSkeletons as _}
						<div class="animate-pulse space-y-2">
							<div class="aspect-square bg-[#003311]"></div>
							<div class="h-3 w-3/4 bg-[#003311]"></div>
							<div class="h-2 w-1/2 bg-[#003311]/50"></div>
						</div>
					{/each}
				{:else}
					{#each $discoverStore.recentAlbums as album (album.id)}
						<button
							onclick={() => handleAlbumClick(album)}
							class="group space-y-2 text-left transition-all"
						>
							<div
								class="relative aspect-square overflow-hidden border border-[#003311] transition-all group-hover:border-[#00ff41] group-hover:shadow-[0_0_20px_rgba(0,255,65,0.3)]"
							>
								{#if album.cover}
									<img
										src={losslessAPI.getCoverUrl(album.cover, '320')}
										alt={album.title}
										class="h-full w-full object-cover transition-transform group-hover:scale-105"
										loading="lazy"
									/>
								{:else}
									<div class="flex h-full w-full items-center justify-center bg-[#001100]">
										<Disc size={32} class="text-[#003311]" />
									</div>
								{/if}
								<div
									class="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
								>
									<ChevronRight size={32} class="text-[#00ff41]" />
								</div>
							</div>
							<div class="space-y-0.5">
								<p
									class="truncate font-mono text-xs font-medium text-[#00b82e] group-hover:text-[#00ff41]"
								>
									{album.title}
								</p>
								<p class="truncate font-mono text-[10px] text-[#006622]">
									{album.artist?.name ?? 'Various'}
								</p>
								{#if album.releaseDate}
									<p class="font-mono text-[10px] text-[#003311]">
										{new Date(album.releaseDate).getFullYear()}
									</p>
								{/if}
							</div>
						</button>
					{/each}
				{/if}
			</div>
		</div>
	{/if}
</section>
