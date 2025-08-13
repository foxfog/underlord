<template>
	<MainMenu />
	<div class="settings-panel">

		<!-- Переключатели -->
		<div class="tabs">
			<button 
				:class="{ active: activeSection === 'audio' }" 
				@click="activeSection = 'audio'"
			>
				Audio
			</button>
			<button 
				:class="{ active: activeSection === 'general' }" 
				@click="activeSection = 'general'"
			>
				General
			</button>
			<button 
				:class="{ active: activeSection === 'video' }" 
				@click="activeSection = 'video'"
			>
				Video
			</button>
		</div>

		<!-- Audio -->
		<section v-show="activeSection === 'audio'">
			<h3>Audio</h3>
			<div class="option">
				<label>Общая громкость: {{ store.audio.commonVolume }}%</label>
				<input type="range" min="0" max="100" v-model.number="store.audio.commonVolume" />
			</div>
			<div class="option">
				<label>Музыка: {{ store.audio.musicVolume }}%</label>
				<input type="range" min="0" max="100" v-model.number="store.audio.musicVolume" />
			</div>
			<div class="option">
				<label>Звуки: {{ store.audio.soundVolume }}%</label>
				<input type="range" min="0" max="100" v-model.number="store.audio.soundVolume" />
			</div>
			<div class="option">
				<label>Голос: {{ store.audio.voiceVolume }}%</label>
				<input type="range" min="0" max="100" v-model.number="store.audio.voiceVolume" />
			</div>
		</section>

		<!-- General -->
		<section v-show="activeSection === 'general'">
			<h3>General</h3>
			<div class="option">
				<label>Язык:</label>
				<select v-model="store.general.language" @change="onLanguageChange">
					<option 
						v-for="lang in availableLanguages" 
						:key="lang" 
						:value="lang"
					>
						{{ lang.toUpperCase() }}
					</option>
				</select>
			</div>
		</section>

		<!-- Video -->
		<section v-show="activeSection === 'video'">
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
		</section>

		<!-- Buttons -->
		<div class="buttons">
			<button @click="saveSettings">💾 Сохранить</button>
			<button @click="resetToDefault">🔄 Сбросить по умолчанию</button>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed } from 'vue'
	import MainMenu from '@/components/MainMenu.vue'
	import { useSettingsStore } from '@/stores/settings'

	const store = useSettingsStore()
	const activeSection = ref('audio')

	// Варианты разрешений и языков
	const availableResolutions = [
		'800x600',
		'1280x720',
		'1920x1080',
		'2560x1440'
	]
	const availableLanguages = [
		'ru',
		'en'
	]

	const fullscreenMode = computed({
		get: () => !!store.video.fullscreen,
		set: v => { store.video.fullscreen = v }
	})

	function onFullscreenModeChange() {
		window.electronAPI.setFullscreen(store.video.fullscreen)
		// Если выходим из полноэкранного — применить выбранное разрешение
		if (!store.video.fullscreen) {
			window.electronAPI.setResolution(store.video.resolution)
		}
	}

	function onResolutionChange() {
		store.setResolution(store.video.resolution)
		if (!store.video.fullscreen) {
			window.electronAPI.setResolution(store.video.resolution)
		}
		// layout vars теперь обновляются только в App.vue
	}

	function onLanguageChange() {
		store.setLanguage(store.general.language)
		// Здесь можно добавить вызов ipc для применения языка, если потребуется
	}

	async function saveSettings() {
		const current = await window.electronAPI.getSettings()
		const updated = {
			...current,
			audio: { ...store.audio },
			general: { ...store.general },
			video: { ...store.video }
		}
		window.electronAPI.saveSettings(JSON.parse(JSON.stringify(updated)))
	}

	async function resetToDefault() {
		const def = await window.electronAPI.getSettings('default')
		store.audio = { ...def.audio }
		store.general = { ...def.general }
		store.video = { ...def.video }
		await saveSettings()
		onFullscreenModeChange()
	}

</script>

<style scoped>
	.settings-panel {
		max-width: 600px;
		margin: 2rem auto;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	/* Кнопки переключения секций */
	.tabs {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}
	.tabs button {
		padding: 0.5rem 1rem;
		border: 1px solid #ccc;
		border-radius: 6px;
		background: #f5f5f5;
		cursor: pointer;
	}
	.tabs button.active {
		background: #007bff;
		color: white;
		border-color: #007bff;
	}

	section {
		border: 1px solid #ccc;
		border-radius: 8px;
		padding: 1rem;
	}

	.option {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.buttons {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin-top: 1rem;
	}
</style>