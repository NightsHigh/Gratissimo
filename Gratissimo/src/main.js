import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { restoreSession } from './auth'
import '@fontsource-variable/montserrat'
import '@fontsource/montserrat-alternates'
import './kit/tokens.scss'
import './app.scss'

// Henter brugeren igen, hvis der ligger et token i cookien.
restoreSession()

createApp(App).use(router).mount('#app')