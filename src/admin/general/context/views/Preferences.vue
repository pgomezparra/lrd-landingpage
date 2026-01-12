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
    <div class="preferences-grid">
      <!-- Ajustes públicos -->
      <div class="preferences-card">
        <h3 class="preferences-card__title">Ajustes públicos</h3>

        <div class="preferences-switch">
          <span>Mostrar modal</span>
          <label class="switch">
            <input type="checkbox" v-model="publicSettings.showInfoModal" />
            <span class="slider"></span>
          </label>
        </div>
        <div class="preferences-switch">
          <span>Elecciones activas</span>
          <label class="switch">
            <input type="checkbox" v-model="publicSettings.activeElections" />
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- Ajustes privados -->
      <div class="preferences-card">
        <h3 class="preferences-card__title">Ajustes privados</h3>

        <div class="preferences-switch">
          <span>Mostrar información</span>
          <label class="switch">
            <input type="checkbox" v-model="privateSettings.showInfo" />
            <span class="slider"></span>
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

<style scoped>
.preferences-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 24px;
}

/* Mobile */
@media (max-width: 768px) {
  .preferences-grid {
    grid-template-columns: 1fr;
  }
}

.preferences-card {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 20px;
}

.preferences-card__title {
  margin-bottom: 16px;
  font-weight: 600;
}

.preferences-switch {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

/* Switch */
.switch {
  position: relative;
  width: 42px;
  height: 22px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  inset: 0;
  background-color: #444;
  border-radius: 999px;
  transition: 0.3s;
}

.slider::before {
  content: '';
  position: absolute;
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: 0.3s;
}

.switch input:checked + .slider {
  background-color: #7a0c0c;
}

.switch input:checked + .slider::before {
  transform: translateX(20px);
}
</style>
