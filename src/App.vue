<template>
  <main id="container" class="l-container">
    <RouterView />
  </main>
</template>

<script setup>
import Whatsapp from '@/general/components/Whatsapp.vue'
import { onMounted } from 'vue'
import { useNavbarStore } from '@/navbar/store/navbarStore.js'
import { useRoute, useRouter } from 'vue-router'
import InfoModal from '@/general/components/InfoModal.vue'

const router = useRouter()
const route = useRoute()


onMounted(async () => {
  await router.isReady()
  useNavbarStore().updatePath(route)
})
</script>
