<!-- src/renderer/views/Settings.vue -->

<template>
	<div class="page-area __dark">
		<div class="content-area">
			<div class="settings-panel">
				<div class="tabs">
					<button :class="{ active: activeSection === 'audio' }" @click="activeSection = 'audio'">Audio</button>
					<button :class="{ active: activeSection === 'general' }" @click="activeSection = 'general'">General</button>
					<button :class="{ active: activeSection === 'video' }" @click="activeSection = 'video'">Video</button>
				</div>
				<SettingsAudio v-show="activeSection === 'audio'" />
				<SettingsGeneral v-show="activeSection === 'general'" />
				<SettingsVideo v-show="activeSection === 'video'" />
				<div class="buttons">
					<button @click="saveSettings">💾 Сохранить</button>
					<button @click="resetToDefault">🔄 Сбросить по умолчанию</button>
				</div>
			</div>
		</div>
		<div class="menu-area __static">
			<MainMenu />
		</div>
	</div>
</template>

<script setup>
	import { ref } from 'vue'
	import MainMenu from '@/components/MainMenu.vue'
	import SettingsAudio from '@/components/settings/SettingsAudio.vue'
	import SettingsGeneral from '@/components/settings/SettingsGeneral.vue'
	import SettingsVideo from '@/components/settings/SettingsVideo.vue'
	import { useSettingsStore } from '@/stores/settings'

	const store = useSettingsStore()
	const activeSection = ref('audio')

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
	}
</script>

<style scoped>
	.settings-panel {
		max-width: 600px;
		margin: 2rem auto;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		height: 100%;
    	overflow: auto;
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