<template>
  <div class="app-layout" v-if="auth0.isAuthenticated">
    <!-- Menú lateral -->
    <sidebar />

    <!-- Contenedor dinámico -->
    <main class="content" id="private-content">
      <router-view />
      <ModalsContainer />
    </main>
    <loading-overlay />
  </div>
</template>

<script setup>
import Sidebar from '@/admin/views/Sidebar.vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { onMounted } from 'vue'
import LoadingOverlay from '@/admin/views/LoadingOverlay.vue'
import { ModalsContainer } from 'vue-final-modal'
import { useAccessToken } from '@/admin/shared/utils/useAccessToken.js'
import { setAuthHandlers } from '@/shared/axios.js'

const auth0 = useAuth0()
const { getAccessToken, redirectToLogin } = useAccessToken()

setAuthHandlers({
  refreshToken: () => getAccessToken({ cacheMode: 'off' }),
  onUnauthorized: redirectToLogin
})

onMounted(async () => {
  try {
    await getAccessToken()
  } catch (error) {
    console.error('Error al obtener token:', error)
  }
})

</script>
