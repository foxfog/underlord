<!-- src/renderer/components/sounds/BgMusic.vue -->

<template>
	<audio ref="audioPlayer" id="bgmusic" autoplay loop>
		<source :src="currentMusicFile"/>
	</audio>
</template>

<script setup>
import { ref, watch, onMounted, computed, nextTick } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const audioPlayer = ref(null)
const volumeInterval = ref(null)
const fadeInOutLock = ref(false)

const store = useSettingsStore()

const currentMusicFile = computed(() => store.currentMusicFile)
const isMusicPlaying = computed(() => store.isMusicPlaying)
const musicVolume = computed(() => {
	const common = store.audio.commonVolume / 100
	const music = store.audio.musicVolume / 100
	return Math.max(0, Math.min(1, +(common * music).toFixed(2)))
})

watch(isMusicPlaying, (newValue) => {
	if (newValue) {
		playMusicWithFadeIn()
	} else {
		pauseMusicWithFadeOut()
	}
})

watch(musicVolume, (newVolume) => {
	if (audioPlayer.value) {
		audioPlayer.value.volume = newVolume
	}
})

// Следим за сменой трека с плавным затуханием и началом
watch(currentMusicFile, async (newFile, oldFile) => {
	if (!audioPlayer.value) return
	if (fadeInOutLock.value) return
	fadeInOutLock.value = true
	await pauseMusicWithFadeOut(true) // true = не ставить на паузу, только затухание
	try {
		audioPlayer.value.pause()
	} catch {}
	audioPlayer.value.currentTime = 0
	audioPlayer.value.load()
	await nextTick()
	if (isMusicPlaying.value) {
		await playMusicWithFadeIn()
	}
	fadeInOutLock.value = false
})

onMounted(async () => {
	if (!audioPlayer.value) return
	audioPlayer.value.volume = musicVolume.value
	audioPlayer.value.addEventListener('ended', () => {
		if (isMusicPlaying.value) {
			playMusicWithFadeIn()
		}
	})
	// Стартовое состояние
	if (isMusicPlaying.value) {
		await playMusicWithFadeIn()
	} else {
		try {
			audioPlayer.value.pause()
		} catch {}
	}
})

async function playMusicWithFadeIn() {
	clearInterval(volumeInterval.value)
	if (!audioPlayer.value) return
	audioPlayer.value.volume = 0
	try {
		await audioPlayer.value.play()
	} catch {}
	volumeInterval.value = setInterval(() => {
		if (audioPlayer.value.volume < musicVolume.value) {
			audioPlayer.value.volume = Math.min(audioPlayer.value.volume + 0.01, musicVolume.value)
		} else {
			clearInterval(volumeInterval.value)
		}
	}, 25)
}

function pauseMusicWithFadeOut(onlyFade = false) {
	return new Promise(resolve => {
		clearInterval(volumeInterval.value)
		if (!audioPlayer.value) return resolve()
		volumeInterval.value = setInterval(async () => {
			if (audioPlayer.value.volume > 0.01) {
				audioPlayer.value.volume = Math.max(audioPlayer.value.volume - 0.01, 0)
			} else {
				clearInterval(volumeInterval.value)
				if (!onlyFade) {
					try {
						audioPlayer.value.pause()
					} catch {}
				}
				resolve()
			}
		}, 25)
	})
}
</script>
