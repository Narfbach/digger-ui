<!-- Literally unused because it doesn't work -->

<script lang="ts">
	import type { AudioQuality } from '$lib/types';
	import { playerStore } from '$lib/stores/player';
	import { Settings, Check } from 'lucide-svelte';

	let isOpen = $state(false);
	const disabledQualities = new Set<AudioQuality>(['HI_RES_LOSSLESS', 'HI_RES']);

	const qualities: { value: AudioQuality; label: string; description: string }[] = [
		{
			value: 'HI_RES_LOSSLESS',
			label: 'Hi-Res Lossless',
			description: '24/44.1kHz to 24/192kHz FLAC'
		},
		{ value: 'HI_RES', label: 'Hi-Res', description: 'up to 96 kHz MQA' },
		{ value: 'LOSSLESS', label: 'Lossless', description: '16-bit/44.1 kHz FLAC' },
		{ value: 'HIGH', label: 'High', description: '320k AAC' },
		{ value: 'LOW', label: 'Low', description: '96k AAC' }
	];

	function isQualityDisabled(quality: AudioQuality): boolean {
		return disabledQualities.has(quality);
	}

	function selectQuality(quality: AudioQuality) {
		if (isQualityDisabled(quality)) {
			return;
		}
		playerStore.setQuality(quality);
		isOpen = false;
	}

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function handleClickOutside(event: MouseEvent) {
		if (isOpen && !(event.target as Element).closest('.quality-selector')) {
			isOpen = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<div class="quality-selector relative">
	<button
		onclick={toggleDropdown}
		class="flex items-center gap-2 border border-[#003311] bg-black px-4 py-2 text-[#00b82e] font-mono transition-all hover:border-[#00ff41] hover:text-[#00ff41]"
		aria-label="Select audio quality"
	>
		<Settings size={18} />
		<span class="text-sm">
			{qualities.find((q) => q.value === $playerStore.quality)?.label || 'Quality'}
		</span>
	</button>

	{#if isOpen}
		<div
			class="absolute right-0 z-50 mt-2 w-64 overflow-hidden border border-[#00ff41] bg-black shadow-[0_0_20px_rgba(0,255,65,0.3)]"
		>
			<div class="border-b border-[#003311] p-2">
				<h3 class="text-sm font-semibold text-[#00ff41] font-mono uppercase">[ AUDIO QUALITY ]</h3>
			</div>
			<div class="py-1">
				{#each qualities as quality}
					<button
						onclick={() => selectQuality(quality.value)}
						class="flex w-full items-start gap-3 px-4 py-3 text-left transition-all hover:bg-[#001100] disabled:cursor-not-allowed disabled:text-[#003311] disabled:opacity-60 disabled:hover:bg-black"
						disabled={isQualityDisabled(quality.value)}
						aria-disabled={isQualityDisabled(quality.value)}
						title={isQualityDisabled(quality.value) ? 'Not available in this build' : undefined}
					>
						<div class="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center">
							{#if $playerStore.quality === quality.value}
								<Check size={18} class="text-[#00ff41]" />
							{/if}
						</div>
						<div class="flex-1">
							<div class="text-sm font-medium text-[#00b82e] font-mono">{quality.label}</div>
							<div
								class={`text-xs font-mono ${isQualityDisabled(quality.value) ? 'text-[#003311]' : 'text-[#006622]'}`}
							>
								{quality.description}
								{#if isQualityDisabled(quality.value)}
									<span class="ml-1 text-[10px] tracking-wide text-[#003311] uppercase"
										>Unavailable</span
									>
								{/if}
							</div>
						</div>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
