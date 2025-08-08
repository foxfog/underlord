// src/renderer/stores/settings.js
import { defineStore } from 'pinia'

let _SettingsStore = null

export function initSettingsStore(settings) {
	if (_SettingsStore) return // уже инициализирован

	_SettingsStore = defineStore('settings', {
		state: () => ({
			isMusicPlaying: true,
			defaultMusicFile: 'audio/music/Called_Upon.ogg',
			currentMusicFile: 'audio/music/Called_Upon.ogg',

			audio: {
				...(settings?.audio ?? {}),
				commonVolume: settings?.audio?.commonVolume ?? 97,
				musicVolume: settings?.audio?.musicVolume ?? 100,
				soundVolume: settings?.audio?.soundVolume ?? 100,
				voiceVolume: settings?.audio?.voiceVolume ?? 100,
			},

			controls: {
				...(settings?.controls ?? {}),
				keyboardLayout: settings?.controls?.keyboardLayout ?? 'default',
			},

			general: {
				...(settings?.general ?? {}),
				language: settings?.general?.language ?? 'ru',
				langs: settings?.general?.langs ?? ['ru', 'en'],
			},

			video: {
				...(settings?.video ?? {}),
				fullscreen: settings?.video?.fullscreen ?? false,
			},
		}),

		getters: {
			commonVolume: (state) => state.audio.commonVolume / 100,

			getVolume: (state) => (name) => {
				const common = state.audio.commonVolume / 100
				const volume = state.audio[name] / 100
				return (common * volume).toFixed(2)
			},
		},

		actions: {
			toggleMusic() {
				this.isMusicPlaying = !this.isMusicPlaying
			},
			setMusicFile(file) {
				this.currentMusicFile = file
			},

			updateVolumeByName({ name, newValue }) {
				if (this.audio[name] !== undefined) {
					this.audio[name] = newValue
				}
			},

			setFullscreen(value) {
				this.video.fullscreen = value
			},

			setLanguage(lang) {
				this.general.language = lang
			},

			setKeyboardLayout(layout) {
				this.controls.keyboardLayout = layout
			},
		}
	})
}

export function useSettingsStore() {
	if (!_SettingsStore) {
		throw new Error('SettingsStore is not initialized. Call initSettingsStore(settings) before using useSettingsStore().')
	}
	return _SettingsStore()
}
