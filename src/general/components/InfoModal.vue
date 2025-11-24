<template>
  <div v-if="isModalOpen" class="m-modal-info">
    <div class="m-modal-info__container">
      <div class="-m-modal-info__container__image-container">
        <img
          src="@/assets/img/general/modalImage.jpg"
          alt="Modal Image"
          class="m-modal-info__container__image-container__image"
        />
      </div>
      <div class="m-modal-info__container__close-btn" @click="closeModal">Cerrar</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import confetti from 'canvas-confetti'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'

const preferenceStore = usePreferenceStore()

const isModalOpen = ref(false)

watch(
  () => preferenceStore.publicPreferences,
  () => {
    if (preferenceStore.publicPreferences.getShowInfoModal()) {
      isModalOpen.value = true
    }
  })

// Function to close the modal
const closeModal = () => {
  preferenceStore.publicPreferences.setShowInfoModal(false)
  isModalOpen.value = false
}

// Optional: Automatically show the modal when the page loads
onMounted(() => {
  isModalOpen.value = !!preferenceStore.publicPreferences?.getShowInfoModal()
  //
  //   const duration = 2 * 1000
  //   const animationEnd = Date.now() + duration
  //   const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 }
  //
  //   function randomInRange(min, max) {
  //     return Math.random() * (max - min) + min
  //   }
  //
  //   const interval = setInterval(function() {
  //     const timeLeft = animationEnd - Date.now()
  //
  //     if (timeLeft <= 0) {
  //       return clearInterval(interval)
  //     }
  //
  //     const particleCount = 50 * (timeLeft / duration)
  //     // since particles fall down, start a bit higher than random
  //     confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
  //     confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
  //   }, 250)
})
</script>
