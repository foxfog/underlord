// src/renderer/mixins/mixinBgMusic.js

import { useSettingsStore } from '@/stores/settings'

export const mixinBgMusic = {
	props: {
		enableMusic: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			settingsStore: null,
		}
	},
	computed: {
		isMusicPlaying() {
			return this.settingsStore?.isMusicPlaying
		},
	},
	created() {
		this.settingsStore = useSettingsStore()
		this.toggleBackgroundMusic()
	},
	methods: {
		toggleBackgroundMusic() {
			if (!this.settingsStore) return
			if (this.enableMusic) {
				if (!this.isMusicPlaying) this.settingsStore.toggleMusic()
			} else {
				if (this.isMusicPlaying) this.settingsStore.toggleMusic()
			}
		},
	},
}
