import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { restoreSession } from './auth'
import '@fontsource-variable/montserrat'
import '@fontsource/montserrat-alternates'
import './kit/tokens.scss'
import './app.scss'

// Get user again hvis a token is inside the cookie
restoreSession()

createApp(App).use(router).mount('#app')