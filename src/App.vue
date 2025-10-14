<template>
  <main id="container" class="l-container">
    <RouterView />
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import { useNavbarStore } from '@/navbar/store/navbarStore.js'
import { useRoute, useRouter } from 'vue-router'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'

const router = useRouter()
const route = useRoute()
const preferenceStore = usePreferenceStore()

onMounted(async () => {
  await router.isReady()
  useNavbarStore().updatePath(route)
  await preferenceStore.getPublicPreferences()
})
</script>
