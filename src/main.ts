import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './style.css'
import App from './App.vue'

gsap.registerPlugin(ScrollTrigger)

createApp(App).use(createPinia()).mount('#app')
