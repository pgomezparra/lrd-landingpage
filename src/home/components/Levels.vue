<template>
  <section class="o-levels-home">
    <div class="o-levels-home__container">
      <div class="o-levels-home__head">
        <span class="o-levels-home__eyebrow">Oferta educativa</span>
        <h2 class="o-levels-home__container__title">Nuestros niveles educativos</h2>
        <p class="o-levels-home__subtitle">
          Un recorrido continuo que acompaña a los estudiantes en cada etapa de su formación.
        </p>
      </div>

      <div class="o-levels-home__container__cards">
        <article v-for="(level, index) in levels" :key="level.title" class="m-level-card">
          <div class="m-level-card__media">
            <img :src="level.image" :alt="level.title" class="m-level-card__content__image" />
            <span class="m-level-card__number">0{{ index + 1 }}</span>
          </div>
          <div class="m-level-card__content">
            <h3 class="m-level-card__content__title">{{ level.title }}</h3>
            <p class="m-level-card__content__description">{{ level.description }}</p>
            <button type="button" class="m-level-card__action" @click="goToAdmissions">
              Conocer más
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useNavbarStore } from '@/navbar/store/navbarStore.js'
import KinderLevel from '@/assets/img/home/kinderLevel.webp'
import PrimaryLevel from '@/assets/img/home/primaryLevel.webp'
import SecondaryLevel from '@/assets/img/home/secondaryLevel.webp'

const router = useRouter()
const navbarStore = useNavbarStore()

const levels = [
  {
    title: 'Preescolar',
    description: 'Educación inicial para niños de 3 a 5 años',
    image: KinderLevel
  },
  {
    title: 'Primaria',
    description: 'Formación básica para niños de 6 a 11 años',
    image: PrimaryLevel
  },
  {
    title: 'Bachillerato',
    description: 'Educación media para jóvenes de 12 a 17 años',
    image: SecondaryLevel
  }
]

const goToAdmissions = () => {
  navbarStore.setActualMenu('admissions')
  router.push('/admissions')
}
</script>
