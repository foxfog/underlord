<!-- src/rendere/App.vue -->

<template>
	<router-view />
	<div class="test-text">Тест</div>
	<BgMusic />
</template>

<script setup>
	import { watchEffect } from 'vue'
	import { useSettingsStore } from '@/stores/settings'
	import BgMusic from '@/components/sounds/BgMusic.vue'

	const store = useSettingsStore()

	watchEffect(() => {
		const [w, h] = String(store.video.resolution || '1920x1080').split('x')
		document.documentElement.style.setProperty('--layout-width', w ? w + 'px' : '1920px')
		document.documentElement.style.setProperty('--layout-height', h ? h + 'px' : '1080px')
	})
</script>

<style>
	.test-text {
		font-size: calc(1 * var(--size));
	}
</style>