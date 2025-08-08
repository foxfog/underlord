<template>
	<div class="splash-screen">
		<div class="title _poscen">
			<div class="_name">Underlord</div>
			<div class="_version">0.1</div>
		</div>
	</div>
</template>

<script setup>
	import { onMounted, onBeforeUnmount } from 'vue'
	import { useRouter } from 'vue-router'
	import { useSettingsStore } from '@/stores/settings'

	const router = useRouter()
	const store = useSettingsStore()
	const splashMusic = 'audio/music/Bloodhound Gang - The Bad Touch.mp3' // путь к музыке для сплешскрина

	function goHome() {
		window.removeEventListener('click', onClick)
		window.removeEventListener('keydown', onKeyDown)
		router.replace('/home')
	}

	function onClick() {
		goHome()
	}

	function onKeyDown(e) {
		if (e.code === 'Space' || e.key === ' ' || e.code === 'Enter' || e.key === 'Enter') {
			goHome()
		}
		// иначе не повторяем слушатель, чтобы не было двойного перехода
	}

	onMounted(() => {
		// Сменить трек на сплешевый
		store.setMusicFile(splashMusic)

		/*setTimeout(() => {
			router.replace('/home')
		}, 6000)*/

		window.addEventListener('click', onClick, { once: true })
		window.addEventListener('keydown', onKeyDown, { once: true })
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
		background: var(--color-black);
		color: var(--color-white);
		.title {
			display: flex;
			flex-direction: column;
			font-size: calc(4 * var(--size));
			font-family: Overlord;
			._name {
				
			}
			._version {
				text-align: right;
				font-size: 0.5em;
			}
		}
	}
</style>
