<template>
	<div class="splash-screen">
		<p>Велком</p>
	</div>
</template>

<script setup>
	import { onMounted, onBeforeUnmount } from 'vue'
	import { useRouter } from 'vue-router'
	import { useSettingsStore } from '@/stores/settings'

	const router = useRouter()
	const store = useSettingsStore()
	const splashMusic = 'audio/music/Bloodhound Gang - The Bad Touch.mp3' // путь к музыке для сплешскрина

	onMounted(() => {
		// Сменить трек на сплешевый
		store.setMusicFile(splashMusic)

		setTimeout(() => {
			router.replace('/home')
		}, 6000)

		window.addEventListener('click', () => {
			router.replace('/home')
		}, { once: true })
	})

	onBeforeUnmount(() => {
		// Включить музыку при уходе (оставлено для будущего)
		// if (!store.isMusicPlaying) store.isMusicPlaying = true
		
		// Вернуть дефолтную музыку
		store.setMusicFile(store.defaultMusicFile)
	})
</script>

<style scoped>
.splash-screen {
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	background: black;
	color: white;
	font-size: 2rem;
}
</style>
