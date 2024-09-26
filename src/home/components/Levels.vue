<template>
  <section class="o-levels-home">
    <div class="o-levels-home__container">
      <h2 class="o-levels-home__container__title">Nuestros Niveles Educativos</h2>
      <div class="o-levels-home__container__cards">
        <div class="m-level-card" v-for="level in levels" :key="level.title">
          <div class="m-level-card__content">
            <img
              :src="level.image"
              :alt="level.title"
              class="m-level-card__content__image"
            />
            <h3 class="m-level-card__content__title">{{ level.title }}</h3>
            <p class="m-level-card__content__description">{{ level.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import KinderLevel from '@/assets/img/home/kinderLevel.webp'
import PrimaryLevel from '@/assets/img/home/primaryLevel.webp'
import SecondaryLevel from '@/assets/img/home/secondaryLevel.webp'

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
</script>