<script lang="ts">
	import { page } from '$app/stores';
	import { losslessAPI } from '$lib/api';
	import TrackList from '$lib/components/TrackList.svelte';
	import type { Playlist, Track } from '$lib/types';
	import { onMount } from 'svelte';
	import { ArrowLeft, Play, User, Clock, LoaderCircle } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { playerStore } from '$lib/stores/player';

	let playlist = $state<Playlist | null>(null);
	let tracks = $state<Track[]>([]);
	let isLoading = $state(true);
	let error = $state<string | null>(null);

	const playlistId = $derived($page.params.id);

	onMount(async () => {
		if (playlistId) {
			await loadPlaylist(playlistId);
		}
	});

	async function loadPlaylist(id: string) {
		try {
			isLoading = true;
			error = null;
			const data = await losslessAPI.getPlaylist(id);
			playlist = data.playlist;
			tracks = data.items.map((item) => item.item);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load playlist';
			console.error('Failed to load playlist:', err);
		} finally {
			isLoading = false;
		}
	}

	function handlePlayAll() {
		if (tracks.length > 0) {
			playerStore.setQueue(tracks, 0);
			playerStore.play();
		}
	}

	function formatDuration(seconds: number): string {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		if (hours > 0) {
			return `${hours} hr ${minutes} min`;
		}
		return `${minutes} min`;
	}
</script>

<svelte:head>
	<title>{playlist?.title || 'Playlist'} - TIDAL UI</title>
</svelte:head>

{#if isLoading}
	<div class="flex items-center justify-center py-24">
		<LoaderCircle size={16} class="h-16 w-16 animate-spin text-[#00ff41]" />
	</div>
{:else if error}
	<div class="mx-auto max-w-2xl py-12">
		<div class="border border-[#ff0033] bg-[#110000] p-6">
			<h2 class="mb-2 text-xl font-mono font-semibold text-[#ff0033]">[ ERROR LOADING PLAYLIST ]</h2>
			<p class="text-[#ff0033] font-mono text-sm">{error}</p>
			<button
				onclick={() => goto('/')}
				class="mt-4 border border-[#00ff41] bg-black px-4 py-2 text-[#00ff41] font-mono text-xs uppercase transition-all hover:shadow-[0_0_10px_rgba(0,255,65,0.4)]"
			>
				[ GO HOME ]
			</button>
		</div>
	</div>
{:else if playlist}
	<div class="space-y-6 pb-32 lg:pb-40">
		<!-- Back Button -->
		<button
			onclick={() => window.history.back()}
			class="flex items-center gap-2 text-[#006622] transition-all hover:text-[#00ff41] font-mono text-xs uppercase"
		>
			<ArrowLeft size={18} />
			[ BACK ]
		</button>

		<!-- Playlist Header -->
		<div class="flex flex-col gap-8 md:flex-row">
			<!-- Playlist Cover -->
			{#if playlist.image}
				<div
					class="aspect-square w-full flex-shrink-0 overflow-hidden border border-[#00ff41] bg-[#001100] shadow-[0_0_30px_rgba(0,255,65,0.3)] md:w-80"
				>
					<img
						src={losslessAPI.getCoverUrl(playlist.image, '640')}
						alt={playlist.title}
						class="h-full w-full object-cover"
					/>
				</div>
			{/if}

			<!-- Playlist Info -->
			<div class="flex flex-1 flex-col justify-end">
				<p class="mb-2 text-xs text-[#006622] font-mono uppercase tracking-widest">[ PLAYLIST ]</p>
				<h1 class="mb-4 text-4xl font-bold md:text-6xl text-[#00ff41] font-['Orbitron'] matrix-glow" style="font-family: 'Orbitron', monospace;">{playlist.title}</h1>

				{#if playlist.description}
					<p class="mb-4 text-[#00b82e] font-mono text-sm">{playlist.description}</p>
				{/if}

				<div class="mb-4 flex items-center gap-2">
					{#if playlist.creator.picture}
						<img
							src={losslessAPI.getCoverUrl(playlist.creator.picture, '80')}
							alt={playlist.creator.name}
							class="h-8 w-8 rounded-full border border-[#003311]"
						/>
					{:else}
						<div class="flex h-8 w-8 items-center justify-center rounded-full border border-[#003311] bg-[#001100]">
							<User size={16} class="text-[#006622]" />
						</div>
					{/if}
					<span class="text-sm text-[#00b82e] font-mono">{playlist.creator.name}</span>
				</div>

				<div class="mb-6 flex flex-wrap items-center gap-4 text-sm text-[#006622] font-mono">
					<div>{playlist.numberOfTracks} tracks</div>
					{#if playlist.duration}
						<div class="flex items-center gap-1">
							<Clock size={16} />
							{formatDuration(playlist.duration)}
						</div>
					{/if}
					{#if playlist.type}
						<div class="border border-[#003311] bg-[#001100] px-2 py-1 text-xs font-semibold text-[#00ff41]">
							{playlist.type}
						</div>
					{/if}
				</div>

				{#if tracks.length > 0}
					<button
						onclick={handlePlayAll}
						class="flex w-fit items-center gap-2 border border-[#00ff41] bg-[#00ff41] px-8 py-3 font-mono font-semibold uppercase text-black transition-all hover:shadow-[0_0_20px_rgba(0,255,65,0.6)]"
					>
						<Play size={20} fill="currentColor" />
						[ PLAY ALL ]
					</button>
				{/if}
			</div>
		</div>

		<!-- Promoted Artists -->
		{#if playlist.promotedArtists && playlist.promotedArtists.length > 0}
			<div>
				<h3 class="mb-3 text-sm font-semibold text-[#006622] font-mono uppercase tracking-widest">[ FEATURED ARTISTS ]</h3>
				<div class="flex flex-wrap gap-2">
					{#each playlist.promotedArtists as artist}
						<button
							onclick={() => goto(`/artist/${artist.id}`)}
							class="border border-[#003311] bg-[#001100] px-3 py-1.5 text-sm font-mono text-[#00b82e] transition-all hover:border-[#00ff41] hover:text-[#00ff41] hover:shadow-[0_0_10px_rgba(0,255,65,0.3)]"
						>
							{artist.name}
						</button>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Tracks -->
		{#if tracks.length > 0}
			<div class="mt-8">
				<h2 class="mb-4 text-2xl font-bold text-[#00ff41] font-['Orbitron']" style="font-family: 'Orbitron', monospace;">[ TRACKS ]</h2>
				<TrackList {tracks} />
			</div>
		{:else}
			<div class="border border-[#003311] bg-[#001100] p-6 text-[#006622] font-mono">
				<p>[ NO TRACKS IN THIS PLAYLIST ]</p>
			</div>
		{/if}

		<!-- Metadata -->
		<div class="space-y-1 text-xs text-[#003311] font-mono">
			{#if playlist.created}
				<p>Created: {new Date(playlist.created).toLocaleDateString()}</p>
			{/if}
			{#if playlist.lastUpdated}
				<p>Last updated: {new Date(playlist.lastUpdated).toLocaleDateString()}</p>
			{/if}
		</div>
	</div>
{/if}
