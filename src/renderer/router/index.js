import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/Home.vue'

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
		id: 0,
		path: '/',
		name: 'splash',
		component: () => import('@/views/SplashScreen.vue')
		},
		{
			id: 1,
			name: 'home',
			path: '/home',
			component: HomeView
		},
		{
			id: 2,
			name: 'settings',
			path: '/settings',
			component: () => import('@/views/Settings.vue')
		},
		{
			id: 3,
			name: 'test',
			path: '/test',
			component: () => import('@/views/TestPage.vue')
		},
	]
})

export default router