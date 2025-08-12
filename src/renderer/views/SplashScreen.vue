<template>
	<div class="splash-screen">
		<div 
			v-show="currentSection === 0" 
			class="section section-0"
			:class="{ '__show': currentSection === 0 }"
		>
			<div class="_box fp-poscen">
				<div class="title">
					<div class="_name">Дисклеймер</div>
				</div>
				<div class="_text-box">
					<p>Все права защищены. Игра "Underlord" является вымышленной и не имеет отношения к реальным событиям.</p>
					<p>Любое воспроизведение, распространение или использование материалов игры без разрешения правообладателя строго запрещено.</p>
				</div>
			</div>
		</div>

		<div 
			v-show="currentSection === 1" 
			class="section section-1"
			:class="{ '__show': currentSection === 1 }"
		>
			<div class="_box fp-poscen">
				<div class="title">
					<div class="_name">Информация</div>
				</div>
			</div>
		</div>

		<div 
			v-show="currentSection === 2" 
			class="section section-2"
			:class="{ '__show': currentSection === 2 }"
		>
			<div class="_box fp-poscen">
				<div class="title">
					<div class="_name">Underlord</div>
					<div class="_version">0.1</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, onMounted, onBeforeUnmount } from 'vue'
	import { useRouter } from 'vue-router'
	import { useSettingsStore } from '@/stores/settings'

	const router = useRouter()
	const store = useSettingsStore()
	const splashMusic = 'audio/music/Bloodhound Gang - The Bad Touch.mp3'

	// =================== КОНФИГ ===================
	const config = {
		sectionTimes: [0, 0, 0],       // секунды для каждой секции (0 = нет авто)
		controls: {
			keyboard: true,            // включить реакцию на клавиатуру
			mouseClick: false,          // включить реакцию на клик ЛКМ
			anyKey: false,             // true = любая клавиша
			allowedKeys: ['Space', 'Enter', 'ArrowRight'] // если anyKey=false
		}
	}
	// ==============================================

	let timerId = null
	const currentSection = ref(0)

	function goHome() {
		clearTimer()
		removeListeners()
		router.replace('/home')
	}

	function nextSection() {
		clearTimer()
		if (currentSection.value < config.sectionTimes.length - 1) {
			currentSection.value++
			startTimer()
		} else {
			goHome()
		}
	}

	function onKeyDown(e) {
		const { anyKey, allowedKeys } = config.controls
		if (anyKey || allowedKeys.includes(e.code)) {
			nextSection()
		}
	}

	function onClick() {
		nextSection()
	}

	function startTimer() {
		const delay = config.sectionTimes[currentSection.value] * 1000
		if (delay > 0) {
			timerId = setTimeout(nextSection, delay)
		}
	}

	function clearTimer() {
		if (timerId) {
			clearTimeout(timerId)
			timerId = null
		}
	}

	function addListeners() {
		const { keyboard, mouseClick } = config.controls
		if (keyboard) window.addEventListener('keydown', onKeyDown)
		if (mouseClick) window.addEventListener('click', onClick)
	}

	function removeListeners() {
		const { keyboard, mouseClick } = config.controls
		if (keyboard) window.removeEventListener('keydown', onKeyDown)
		if (mouseClick) window.removeEventListener('click', onClick)
	}

	onMounted(() => {
		store.setMusicFile(splashMusic)
		startTimer()
		addListeners()
	})

	onBeforeUnmount(() => {
		clearTimer()
		removeListeners()
		store.setMusicFile(store.defaultMusicFile)
	})
</script>

<style scoped>
	.splash-screen {
		position: absolute;
		inset: 0;
		background: var(--color-black);
		color: var(--color-white);
		._box {
			max-width: 60%;
			.title {
				display: flex;
				flex-direction: column;
				font-size: calc(4 * var(--size));
				font-family: Overlord;
				width: 100%;
				text-align: center;
				._version {
					text-align: right;
					font-size: 0.5em;
					margin-top: -1em;
				}
			}
		}
	}
</style>
