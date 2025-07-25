<template>
  <main id="container" class="l-container">
    <RouterView />
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import { useNavbarStore } from '@/navbar/store/navbarStore.js'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()


onMounted(async () => {
  await router.isReady()
  useNavbarStore().updatePath(route)
})
</script>
