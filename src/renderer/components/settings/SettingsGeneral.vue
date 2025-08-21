<template>
	<section>
		<h3>General</h3>
		<div class="option">
			<label>Язык:</label>
			<select v-model="store.general.language" @change="onLanguageChange">
				<option v-for="lang in availableLanguages" :key="lang" :value="lang">
					{{ lang.toUpperCase() }}
				</option>
			</select>
		</div>
	</section>
</template>

<script setup>
import { useSettingsStore } from '@/stores/settings'

const store = useSettingsStore()
const availableLanguages = ['ru', 'en']

function onLanguageChange() {
	store.setLanguage(store.general.language)
}
</script>
