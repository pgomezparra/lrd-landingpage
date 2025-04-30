import './assets/scss/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createAuth0 } from '@auth0/auth0-vue'
import { createVfm } from 'vue-final-modal'
import VueDatePicker from '@vuepic/vue-datepicker'
import VueSweetalert2 from 'vue-sweetalert2'

import App from './App.vue'
import router from './router/index.js'

import 'vue-final-modal/style.css'
import '@vuepic/vue-datepicker/dist/main.css'
import 'sweetalert2/dist/sweetalert2.min.css'


const app = createApp(App)

const vfm = createVfm()


app.component('VueDatePicker', VueDatePicker)
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
      },
      cacheLocation: 'localstorage'
      // useRefreshTokens: true
    })
  )
  .use(vfm)
  .use(VueSweetalert2)

app.mount('#app')
