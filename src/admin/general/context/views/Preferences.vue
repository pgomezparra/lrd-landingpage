<template>
  <div class="l-standard">
    <div class="l-standard-title">
      <p>Preferencias</p>
      <p class="l-standard-title__text">
        Configuración de parámetros generales
      </p>
    </div>
    <div class="l-standard-payment-values-buttons">
      <button class="l-standard-payment-values-buttons__button" @click="updateValues">Guardar</button>
    </div>
    <div class="l-preferences__grid">
      <!-- Ajustes públicos -->
      <div class="l-preferences__card">
        <h3 class="l-preferences__card__title">Ajustes públicos</h3>

        <div class="l-preferences__switch">
          <span>Mostrar modal</span>
          <label class="l-preferences__toggle">
            <input type="checkbox" v-model="publicSettings.showInfoModal" />
            <span class="l-preferences__toggle-slider"></span>
          </label>
        </div>
        <div class="l-preferences__switch">
          <span>Elecciones activas</span>
          <label class="l-preferences__toggle">
            <input type="checkbox" v-model="publicSettings.activeElections" />
            <span class="l-preferences__toggle-slider"></span>
          </label>
        </div>
      </div>

      <!-- Ajustes privados -->
      <div class="l-preferences__card">
        <h3 class="l-preferences__card__title">Ajustes privados</h3>

        <div class="l-preferences__switch">
          <span>Mostrar información</span>
          <label class="l-preferences__toggle">
            <input type="checkbox" v-model="privateSettings.showInfo" />
            <span class="l-preferences__toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { onMounted, reactive, watch } from 'vue'

const preferenceStore = usePreferenceStore()

const publicSettings = reactive({
  type: 'public',
  showInfoModal: false,
  activeElections: false
})

const privateSettings = reactive({
  type: 'private',
  showInfo: false
})

watch(
  () => preferenceStore.selectedYear,
  async () => {
    await setValues()
  }
)

const updateValues = async () => {
  preferenceStore.setLoading(true)
  try {
    await preferenceStore.savePreferences(publicSettings, privateSettings)
  } catch (error) {
    console.error(`error: ${error}`)
  } finally {
    preferenceStore.setLoading(false)
  }
}

const setValues = async () => {
  try {
    await preferenceStore.getPreferences()
    publicSettings.showInfoModal = preferenceStore.publicPreferences.getShowInfoModal()
    publicSettings.activeElections = preferenceStore.publicPreferences.getActiveElections()
  } catch (error) {
    console.error(`error: ${error}`)
  }
}

onMounted(async () => {
  if (!preferenceStore.selectedYear) return
  await setValues()
})
</script>


