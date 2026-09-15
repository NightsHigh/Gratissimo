import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@fontsource-variable/montserrat'
import '@fontsource/montserrat-alternates'
import './kit/tokens.scss'
import './app.scss'

createApp(App).use(router).mount('#app')