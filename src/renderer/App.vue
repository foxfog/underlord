<!-- src/rendere/App.vue -->

<template>
	<router-view />
	<BgMusic />
</template>

<script setup>
	import BgMusic from '@/components/sounds/BgMusic.vue'
</script>