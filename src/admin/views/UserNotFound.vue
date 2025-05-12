<template>
  <div class="not-found-container">
    <div class="error-card">
      <div>
        <img src="@/assets/img/general/error.svg" alt="error" />
      </div>
      <h2>Usuario no registrado</h2>
      <p>Verifica tus credenciales o comunícate con soporte.</p>
      <button class="login-button" @click="closeSession">Ok</button>
    </div>
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'

const { logout } = useAuth0()
const preferenceStore = usePreferenceStore()

const closeSession = () => {
  preferenceStore.setSelectedMenu('home')
  preferenceStore.setSelectedSubMenu('')
  console.log('logout ', window.location.origin)
  logout({
    logoutParams: {
      returnTo: window.location.origin
    }
  })
}
</script>

<style scoped>
.not-found-container {
  width: 100vw;
  height: 100vh;
  background-image: url("@/assets/img/background/circuit-board.svg");
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-card {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  width: 90%;
}

h2 {
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  color: #333;
}

p {
  font-size: 1rem;
  color: #666;
  margin-bottom: 1.5rem;
}

.login-button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.login-button:hover {
  background-color: #2563eb;
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
}
</style>