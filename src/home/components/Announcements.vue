<template>
  <section class="o-announcements-home">
    <p class="o-announcements-home__title">Anuncios y Eventos</p>
    <div class="o-announcements-home__slider">
      <div class="m-announcements-slider" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div v-for="(announcement, index) in announcements" :key="index" class="m-announcements-slider__slide"
             :style="announcement.link ? { cursor: 'pointer' } : {}">
          <img :src="announcement.image" :alt="announcement.title" class="m-announcements-slider__slide__img"
               @click="redirectTo(announcement.link)" />
          <span class="m-announcements-slider__slide__title">{{ announcement.title }}</span>
        </div>
      </div>
      <div @click="prevSlide" class="a-button__prev-slide">←</div>
      <div @click="nextSlide" class="a-button__next-slide">→</div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import Placeholder from '@/assets/img/placeholder.svg'
import CulturalWeek from '@/assets/img/home/culturalWeek.webp'
import SupplyList from '@/assets/img/home/supplyLists.webp'
import { useRouter } from 'vue-router'

const router = useRouter()

const currentSlide = ref(0)
const announcements = ref([
  { title: 'Listas de útiles 2025', image: SupplyList, link: 'school-supply-lists' },
  { title: 'Semana Cultural - 30 sep al 06 oct', image: CulturalWeek, link: '' }
  // { title: 'Nuevos talleres extracurriculares', image: Placeholder }
])

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % announcements.value.length
}

const prevSlide = () => {
  currentSlide.value =
    (currentSlide.value - 1 + announcements.value.length) % announcements.value.length
}

const redirectTo = (link) => {
  if (link) {
    router.push(link)
  }
}
</script>

