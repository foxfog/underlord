<template>
	<div class="ui-player-audio">
		<div class="audio-info">
			<span class="audio-title">{{ currentTrackName }}</span>
			<span v-if="isPlaying" class="audio-status">▶</span>
			<span v-else class="audio-status">⏸</span>
		</div>
		<div class="audio-controls">
			<button @click="toggleMusic">
				{{ isPlaying ? 'Пауза' : 'Воспроизвести' }}
			</button>
			<input
				type="range"
				min="0"
				max="100"
				v-model.number="store.audio.musicVolume"
				:title="'Громкость музыки: ' + store.audio.musicVolume + '%'"
			/>
			<span>{{ store.audio.musicVolume }}%</span>
		</div>
		<button @click="playTest" :disabled="!src">
			▶️ Тест
		</button>
		<span v-if="isPlaying" class="audio-status">Воспроизведение...</span>
	</div>
</template>

<script setup>
	import { computed, ref, watch } from 'vue'
	import { useSettingsStore } from '@/stores/settings'

	const props = defineProps({
		src: String,
		volumeType: {
			type: String,
			default: 'music' // music, sound, voice, common
		}
	})

	const store = useSettingsStore()
	const audio = ref(null)
	const isPlaying = ref(false)

	const volume = computed(() => {
		switch (props.volumeType) {
			case 'common': return (store.audio.commonVolume ?? 100) / 100
			case 'music':  return (store.audio.musicVolume ?? 100) / 100
			case 'sound':  return (store.audio.soundVolume ?? 100) / 100
			case 'voice':  return (store.audio.voiceVolume ?? 100) / 100
			default:       return 1
		}
	})

	function toggleMusic() {
		store.toggleMusic()
	}

	const currentTrackName = computed(() => {
		// Показываем только имя файла без пути и расширения
		const file = store.currentMusicFile || ''
		return file.split('/').pop()?.replace(/\.[^/.]+$/, '') || '—'
	})

	function playTest() {
		if (!props.src) return
		if (audio.value) {
			audio.value.pause()
			audio.value.currentTime = 0
		}
		audio.value = new Audio(props.src)
		audio.value.volume = volume.value
		isPlaying.value = true
		audio.value.onended = () => { isPlaying.value = false }
		audio.value.onerror = () => { isPlaying.value = false }
		audio.value.play()
	}

	watch(volume, (v) => {
		if (audio.value) audio.value.volume = v
	})
</script>

<style scoped>
	.ui-player-audio {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: flex-start;
		padding: 0.5rem 1rem;
		background: rgba(0,0,0,0.2);
		border-radius: 8px;
		font-size: 1rem;
	}
	.audio-info {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.audio-title {
		font-weight: bold;
	}
	.audio-status {
		font-size: 1.2em;
	}
	.audio-controls {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	input[type="range"] {
		width: 100px;
	}
</style>