<script lang="ts">
	import SearchInterface from '$lib/components/SearchInterface.svelte';
	import DiscoverSection from '$lib/components/DiscoverSection.svelte';
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
	<div class="relative py-12 text-center">
		<!-- Glitch effect container -->
		<div class="relative inline-block">
			<h1
				class="matrix-glow relative mb-4 font-['Orbitron'] text-6xl font-black tracking-wider md:text-7xl"
				style="font-family: 'Orbitron', monospace;"
			>
				<span class="text-[#00ff41]">&gt;</span>
				<span class="text-[#00ff41]">{data.title}</span>
				<span class="animate-pulse text-[#00ff41]">_</span>
			</h1>
		</div>

		<div class="mb-6 flex items-center justify-center gap-3">
			<div class="h-px w-16 bg-[#00ff41] opacity-50"></div>
			<p class="font-mono text-sm tracking-[0.3em] text-[#00b82e] uppercase">
				[ MUSIC FOR EVERYONE ]
			</p>
			<div class="h-px w-16 bg-[#00ff41] opacity-50"></div>
		</div>

		<!-- Version badge -->
		<div
			class="inline-block border border-[#003311] bg-[#001100] px-4 py-1 font-mono text-xs text-[#00b82e]"
		>
			VERSION 1.2.0
		</div>
	</div>

	<!-- Search Interface -->
	<SearchInterface
		onTrackSelect={handleTrackSelect}
		onAlbumSelect={handleAlbumSelect}
		onArtistSelect={handleArtistSelect}
		onPlaylistSelect={handlePlaylistSelect}
	/>

	<!-- Discover Section -->
	<DiscoverSection />
</div>
