<template>
  <div class="app-layout" v-if="auth0.isAuthenticated">
    <!-- Menú lateral -->
    <sidebar />

    <!-- Contenedor dinámico -->
    <main class="content">
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

const auth0 = useAuth0()

onMounted(async () => {
  try {
    await auth0.getAccessTokenSilently()
  } catch (error) {
    console.error('Error al obtener token:', error)

    if (error.error === 'login_required') {
      await auth0.loginWithRedirect({
        appState: { target: window.location.pathname }
      })
    }
  }
})

</script>
