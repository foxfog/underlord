<template>
	<section>
		<h3>Audio</h3>
		<div class="option">
			<label>Общая громкость: {{ store.audio.commonVolume }}%</label>
			<input type="range" min="0" max="100" v-model.number="store.audio.commonVolume" />
			<UiPlayerAudio :src="testAudio.music" volumeType="common" :resetOnStop="true" />
		</div>
		<div class="option">
			<label>Музыка: {{ store.audio.musicVolume }}%</label>
			<input type="range" min="0" max="100" v-model.number="store.audio.musicVolume" />
			<UiPlayerAudio :src="testAudio.music" volumeType="music" :resetOnStop="true" />
		</div>
		<div class="option">
			<label>Звуки: {{ store.audio.soundVolume }}%</label>
			<input type="range" min="0" max="100" v-model.number="store.audio.soundVolume" />
			<UiPlayerAudio :src="testAudio.sound" volumeType="sound" :resetOnStop="true" />
		</div>
		<div class="option">
			<label>Голос: {{ store.audio.voiceVolume }}%</label>
			<input type="range" min="0" max="100" v-model.number="store.audio.voiceVolume" />
			<UiPlayerAudio :src="testAudio.voice" volumeType="voice" :resetOnStop="true" />
		</div>
	</section>
</template>

<script setup>
	import { useSettingsStore } from '@/stores/settings'
	import UiPlayerAudio from '@/components/UI/UiPlayerAudio.vue'

	const store = useSettingsStore()
	const testAudio = {
		music: 'audio/test/music/Bella Poarch - Build a Bitch (mp3cut.net).mp3',
		sound: 'audio/test/sound/1-108.mp3',
		voice: 'audio/test/voice/tuturu_1.mp3'
	}
</script>
