<template>
  <div v-if="preferenceStore.loading" class="a-loading-overlay">
    <div class="a-loading-overlay__spinner"></div>
  </div>
</template>

<script setup>
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'

const preferenceStore = usePreferenceStore()

</script>

