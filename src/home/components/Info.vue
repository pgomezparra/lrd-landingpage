<template>
  <section class="o-info-home">
    <div class="o-info-home__image-wrapper">
      <img src="@/assets/img/home/headerInfo.webp" alt="Imagen de fondo" class="o-info-home__image">
      <div class="o-info-home__overlay">
        <p class="o-info-home__title">Educación de calidad desde Preescolar hasta Bachillerato</p>
        <span class="o-info-home__subtitle">30 años formando en principios y valores cristianos</span>
        <div class="o-info-home__buttons">
          <div class="a-button" @click="changeMenu('gallery','/gallery')">Nuestra historia</div>
          <!-- <div class="a-button">Contáctanos</div> -->
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useNavbarStore } from '@/navbar/store/navbarStore.js'

const router = useRouter()
const navbarStore = useNavbarStore()

const changeMenu = (menu, route) => {
  navbarStore.setActualMenu(menu)
  router.push(route)
}
</script>