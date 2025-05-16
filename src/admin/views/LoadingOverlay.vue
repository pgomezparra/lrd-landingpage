<template>
  <div v-if="preferenceStore.loading" class="overlay">
    <div class="spinner"></div>
  </div>
</template>

<script setup>
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'

const preferenceStore = usePreferenceStore()

</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* cambia a #000 con opacidad para oscuro */
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  border: 6px solid #f3f3f3;
  border-top: 6px solid #610e0d; /* tu color institucional */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>