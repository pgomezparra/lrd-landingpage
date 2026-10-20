<template>
  <section class="o-announcements-home">
    <div class="o-announcements-home__inner">
      <div class="o-announcements-home__head">
        <div>
          <span class="o-announcements-home__eyebrow">Actualidad</span>
          <h2 class="o-announcements-home__title">Anuncios y eventos</h2>
        </div>
        <div class="o-announcements-home__controls">
          <button type="button" aria-label="Anterior" @click="prevSlide">←</button>
          <button type="button" aria-label="Siguiente" @click="nextSlide">→</button>
        </div>
      </div>

      <div class="o-announcements-home__slider">
        <div
          class="m-announcements-slider"
          :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
        >
          <article
            v-for="(announcement, index) in announcements"
            :key="index"
            class="m-announcements-slider__slide"
            :class="{ 'is-clickable': announcement.link }"
            @click="redirectTo(announcement.link)"
          >
            <img
              :src="announcement.image"
              :alt="announcement.title"
              class="m-announcements-slider__slide__img"
            />
            <div class="m-announcements-slider__overlay">
              <span class="m-announcements-slider__slide__tag">Información importante</span>
              <h3 class="m-announcements-slider__slide__title">{{ announcement.title }}</h3>
              <span v-if="announcement.link" class="m-announcements-slider__slide__link">
                Ver más
                <span aria-hidden="true">→</span>
              </span>
            </div>
          </article>
        </div>
      </div>

      <div class="o-announcements-home__dots">
        <button
          v-for="(announcement, index) in announcements"
          :key="`dot-${index}`"
          type="button"
          :class="{ active: currentSlide === index }"
          :aria-label="`Ir al anuncio ${index + 1}`"
          @click="currentSlide = index"
        ></button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import SupplyList from '@/assets/img/home/supplyLists.webp'
import CulturalWeek from '@/assets/img/home/culturalWeek.webp'
import Elections from '@/assets/img/home/elections.webp'
import { useRouter } from 'vue-router'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'

const router = useRouter()
const preferenceStore = usePreferenceStore()

watch(
  () => preferenceStore.publicPreferences,
  (newVal) => {
    if (newVal.getActiveElections()) {
      announcements.value.unshift({
        title: 'Elecciones de gobierno escolar',
        image: Elections,
        link: '/elections'
      })
    }
  }
)

const currentSlide = ref(0)
const announcements = ref([
  { title: `Listas de útiles ${new Date().getFullYear()}`, image: SupplyList, link: 'school-supply-lists' },
  { title: 'Semana Cultural - 30 sep al 06 oct', image: CulturalWeek, link: '' }
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

onMounted(() => {
  if (!preferenceStore.publicPreferences) return
  if (preferenceStore.publicPreferences.getActiveElections()) {
    announcements.value.unshift({
      title: 'Elecciones de gobierno escolar',
      image: Elections,
      link: '/elections'
    })
  }
})
</script>
