import './assets/scss/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createAuth0 } from '@auth0/auth0-vue'

import App from './App.vue'
import router from './router/index.js'

const app = createApp(App)

app
  .use(createPinia())
  .use(router)
  .use(
    createAuth0({
      domain: import.meta.env.VITE_AUTH0_DOMAIN,
      clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: 'openid profile email'
      }
      // cacheLocation: 'localstorage',
      // useRefreshTokens: true
    })
  )

app.mount('#app')
