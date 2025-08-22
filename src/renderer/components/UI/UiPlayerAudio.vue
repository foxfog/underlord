<template>
	<div class="ui-audioplayer">
		<div class="ui-audioplayer-body">
			<button class="ui-audioplayer-playbtn" @click="togglePlay">
				<template v-if="isPlaying">⏸</template>
				<template v-else>▶</template>
			</button>

			<div v-if="audioLook === 1" class="ui-audioplayer-left">
				<div class="ui-audioplayer-top">
					<div class="ui-audioplayer-timeline">
						<input
							type="range"
							class="ui-range"
							:max="audioDuration"
							v-model="currentTime"
							@input="seekToTime"
						/>
					</div>
				</div>
				<div class="ui-audioplayer-bot">
					<div class="ui-audioplayer-time">
						<div>{{ formattedTime }}</div>/<div>{{ formattedEndTime }}</div>
					</div>
					<div class="ui-audioplayer-volume">
						<input
							type="range"
							class="ui-range"
							:max="1"
							step="0.01"
							v-model="volume"
							@input="changeVolume"
						/>
					</div>
				</div>
			</div>
		</div>

		<audio
			ref="audioPlayer"
			:src="src"
			:autoplay="autoplay"
			@ended="handleAudioEnded"
			@timeupdate="handleTimeUpdate"
			@volumechange="handleVolumeChange"
		></audio>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const props = defineProps({
	src: { type: String, default: '' },
	volumeType: { type: String, default: 'music' }, // common, music, sound, voice
	autoplay: { type: Boolean, default: false },
	audioLook: { type: Number, default: 1 },
	resetOnStop: { type: Boolean, default: false } // Reset timer to beginning when stopping
})

const store = useSettingsStore()
const audioPlayer = ref(null)

const isPlaying = ref(false)
const currentTime = ref(0)
const audioDuration = ref(0)
const durationObtained = ref(false)
const volume = ref(1)

/**
 * Привязка громкости к store по типу
 */
const currentVolume = computed({
	get() {
		switch (props.volumeType) {
			case 'common': return store.audio.commonVolume / 100
			case 'music':  return store.audio.musicVolume / 100
			case 'sound':  return store.audio.soundVolume / 100
			case 'voice':  return store.audio.voiceVolume / 100
			default:       return 1
		}
	},
	set(val) {
		const percent = Math.round(val * 100)
		switch (props.volumeType) {
			case 'common': store.audio.commonVolume = percent; break
			case 'music':  store.audio.musicVolume = percent; break
			case 'sound':  store.audio.soundVolume = percent; break
			case 'voice':  store.audio.voiceVolume = percent; break
		}
	}
})

/**
 * Форматированное время
 */
const formattedTime = computed(() => {
	const minutes = Math.floor(currentTime.value / 60)
	const seconds = Math.floor(currentTime.value % 60)
	return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
})

const formattedEndTime = computed(() => {
	const endMinutes = Math.floor(audioDuration.value / 60)
	const endSeconds = Math.floor(audioDuration.value % 60)
	return `${endMinutes}:${endSeconds < 10 ? '0' : ''}${endSeconds}`
})

/**
 * Управление плеером
 */
function togglePlay() {
	if (!audioPlayer.value) return
	if (isPlaying.value) {
		audioPlayer.value.pause()
		// Reset timer to beginning if resetOnStop prop is true
		if (props.resetOnStop) {
			audioPlayer.value.currentTime = 0
			currentTime.value = 0
		}
		// Notify that test audio stopped
		store.setTestAudioPlaying(false)
	} else {
		audioPlayer.value.play()
		// Notify that test audio started
		store.setTestAudioPlaying(true)
	}
	isPlaying.value = !isPlaying.value
}

function handleAudioEnded() {
	isPlaying.value = false
	// Reset timer to beginning if resetOnStop prop is true
	if (props.resetOnStop && audioPlayer.value) {
		audioPlayer.value.currentTime = 0
		currentTime.value = 0
	}
	// Notify that test audio stopped
	store.setTestAudioPlaying(false)
}

function handleTimeUpdate() {
	if (audioPlayer.value) {
		currentTime.value = audioPlayer.value.currentTime
	}
}

function seekToTime() {
	if (audioPlayer.value) {
		audioPlayer.value.currentTime = currentTime.value
	}
}

function changeVolume() {
	if (audioPlayer.value) {
		audioPlayer.value.volume = volume.value
	}
}

function handleVolumeChange() {
	if (audioPlayer.value) {
		audioPlayer.value.volume = currentVolume.value
	}
}

function setInitialVolume() {
	if (audioPlayer.value) {
		audioPlayer.value.volume = currentVolume.value
	}
}

/**
 * Хук монтирования
 */
onMounted(() => {
	if (!audioPlayer.value) return

	audioPlayer.value.addEventListener('durationchange', () => {
		if (!durationObtained.value) {
			audioDuration.value = audioPlayer.value.duration
			durationObtained.value = true
		}
	})

	setInitialVolume()

	watch(currentVolume, () => {
		handleVolumeChange()
	})
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