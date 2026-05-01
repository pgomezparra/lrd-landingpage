<template>
  <div class="l-without-years__container">
    <div class="l-without-years__card">
      <div class="l-without-years__card__icon">
        <img src="@/assets/img/general/error.svg" alt="error" />
      </div>
      <h2>Año no registrado</h2>
      <p>Verifica con el administrador del sistema que no hay ningún año registrado.</p>
      <button class="l-without-years__button" @click="closeSession">Ok</button>
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

