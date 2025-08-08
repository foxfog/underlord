<!-- src/rendere/App.vue -->

<template>
	<router-view />
	<BgMusic />
</template>

<script>
	import BgMusic from '@/components/sounds/BgMusic.vue'

	export default {
		components: {
			BgMusic
		}
	}
</script>