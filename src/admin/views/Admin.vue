<template>
  <div class="app-layout" v-if="auth0.isAuthenticated">
    <!-- Menú lateral -->
    <sidebar />

    <!-- Contenedor dinámico -->
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Sidebar from '@/admin/views/Sidebar.vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { onMounted } from 'vue'

const auth0 = useAuth0()

onMounted(async () => {
  try {
    const isAuthenticated = auth0.isAuthenticated.value
    if (!isAuthenticated) {
      await auth0.loginWithRedirect()
    }
  } catch (error) {
    console.error('Error de autenticación:', error)
    await auth0.loginWithRedirect()
  }
})

</script>
