<template>
	<section>
		<h3>Video</h3>
		<div class="option">
			<label>Режим экрана:</label>
			<select v-model="fullscreenMode" @change="onFullscreenModeChange">
				<option :value="false">Оконный</option>
				<option :value="true">Полноэкранный</option>
			</select>
		</div>
		<div class="option">
			<label>Разрешение:</label>
			<select v-model="store.video.resolution" @change="onResolutionChange">
				<option v-for="res in availableResolutions" :key="res" :value="res">
					{{ res }}
				</option>
			</select>
		</div>
		<div class="option">
			<button @click="toggleFullscreenBtn">
				{{ store.video.fullscreen ? 'Выйти из полноэкранного' : 'Перейти в полноэкранный' }}
			</button>
		</div>
	</section>
</template>

<script setup>
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const store = useSettingsStore()
const availableResolutions = [
	'800x600',
	'1280x720',
	'1920x1080',
	'2560x1440'
]

const fullscreenMode = computed({
	get: () => !!store.video.fullscreen,
	set: v => { store.video.fullscreen = v }
})

function onFullscreenModeChange() {
	window.electronAPI.setFullscreen(store.video.fullscreen)
	if (!store.video.fullscreen) {
		window.electronAPI.setResolution(store.video.resolution)
	}
}

function onResolutionChange() {
	store.setResolution(store.video.resolution)
	if (!store.video.fullscreen) {
		window.electronAPI.setResolution(store.video.resolution)
	}
}

function toggleFullscreenBtn() {
	store.video.fullscreen = !store.video.fullscreen
	onFullscreenModeChange()
}
</script>
