<template>
  <div v-if="isModalOpen" class="m-modal-info">
    <div class="m-modal-info__container">
      <div class="-m-modal-info__container__image-container">
        <img src="@/assets/img/general/modalImage.webp" alt="Modal Image"
             class="m-modal-info__container__image-container__image">
      </div>
      <div class="m-modal-info__container__close-btn" @click="closeModal">Cerrar</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import confetti from 'canvas-confetti'

// Modal state
const isModalOpen = ref(false)

// Function to close the modal
const closeModal = () => {
  isModalOpen.value = false
}

// Optional: Automatically show the modal when the page loads
onMounted(() => {
   isModalOpen.value = true
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

<style scoped>
/* Backdrop with opacity */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* Dark backdrop */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Make sure it's above all content */
  transition: opacity 0.3s ease;
}

/* Modal container */
.modal-container {
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: auto;
  max-width: 70vw;
  max-height: 80dvh;
  //background-color: yellow;
}

.image-container {
  height: 100%;
  //background-color: red;
}

/* Image inside the modal */
.modal-image {
  max-width: 100%;
  max-height: calc(80dvh - 3rem);
  object-fit: cover;
  margin-bottom: 1rem;
}

/* Close button */
.close-btn {
  background-color: #610e0d; /* You can use any color you want */
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.close-btn:hover {
  background-color: #a30e0c; /* Darken the button on hover */
}
</style>
