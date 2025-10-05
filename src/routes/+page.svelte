<script lang="ts">
	import SearchInterface from '$lib/components/SearchInterface.svelte';
	import type { Track, Album, Artist, Playlist } from '$lib/types';
	import { playerStore } from '$lib/stores/player';
	import { goto } from '$app/navigation';

	let { data } = $props();

	function handleTrackSelect(track: Track) {
		playerStore.setQueue([track], 0);
		playerStore.play();
	}

	function handleAlbumSelect(album: Album) {
		goto(`/album/${album.id}`);
	}

	function handleArtistSelect(artist: Artist) {
		goto(`/artist/${artist.id}`);
	}

	function handlePlaylistSelect(playlist: Playlist) {
		goto(`/playlist/${playlist.uuid}`);
	}
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content="Underground lossless music streaming" />
</svelte:head>

<div class="space-y-12 px-4">
	<!-- Hero Section - Matrix Style -->
	<div class="py-16 text-center relative">
		<!-- Glitch effect container -->
		<div class="relative inline-block">
			<h1
				class="matrix-glow font-['Orbitron'] text-7xl md:text-8xl font-black tracking-wider mb-6 relative"
				style="font-family: 'Orbitron', monospace;"
			>
				<span class="text-[#00ff41]">&gt;</span>
				<span class="text-[#00ff41]">{data.title}</span>
				<span class="text-[#00ff41] animate-pulse">_</span>
			</h1>
		</div>

		<div class="flex items-center justify-center gap-3 mb-8">
			<div class="h-px w-16 bg-[#00ff41] opacity-50"></div>
			<p class="text-[#00b82e] text-sm font-mono uppercase tracking-[0.3em]">
				[ SYSTEM ONLINE ]
			</p>
			<div class="h-px w-16 bg-[#00ff41] opacity-50"></div>
		</div>

		<p class="mx-auto max-w-2xl text-base text-[#006622] font-mono uppercase tracking-wider">
			{data.slogan}
		</p>

		<!-- Version badge -->
		<div class="mt-6 inline-block px-4 py-1 border border-[#003311] bg-[#001100] text-[#00b82e] text-xs font-mono">
			VERSION 1.5.0
		</div>
	</div>

	<!-- Search Interface -->
	<SearchInterface
		onTrackSelect={handleTrackSelect}
		onAlbumSelect={handleAlbumSelect}
		onArtistSelect={handleArtistSelect}
		onPlaylistSelect={handlePlaylistSelect}
	/>
</div>
