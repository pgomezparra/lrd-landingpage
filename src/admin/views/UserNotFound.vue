<template>
  <div class="l-user-not-found__container">
    <div class="l-user-not-found__card">
      <div class="l-user-not-found__card__icon">
        <img src="@/assets/img/general/error.svg" alt="error" />
      </div>
      <h2>Usuario no registrado</h2>
      <p>Verifica tus credenciales o comunícate con soporte.</p>
      <button class="l-user-not-found__button" @click="closeSession">Ok</button>
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

