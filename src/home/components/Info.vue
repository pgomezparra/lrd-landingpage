<template>
  <section class="o-info-home">
    <div class="o-info-home__media">
      <img src="@/assets/img/home/headerInfo.webp" alt="Estudiantes del Liceo Rey David" class="o-info-home__image" />
    </div>
    <div class="o-info-home__scrim"></div>

    <div class="o-info-home__content">
      <span class="o-info-home__eyebrow">Liceo Rey David</span>
      <h1 class="o-info-home__title">
        Educación de calidad desde <span>Preescolar hasta Bachillerato</span>
      </h1>
      <p class="o-info-home__subtitle">
        30 años formando en principios y valores cristianos, con acompañamiento cercano a cada
        familia.
      </p>

      <div class="o-info-home__buttons">
        <button
          type="button"
          class="o-info-home__button o-info-home__button--primary"
          @click="changeMenu('admissions', '/admissions')"
        >
          Proceso de admisión
        </button>
        <button
          type="button"
          class="o-info-home__button o-info-home__button--ghost"
          @click="changeMenu('gallery', '/gallery')"
        >
          Nuestra historia
        </button>
      </div>

      <dl class="o-info-home__stats">
        <div class="o-info-home__stat">
          <dt>30</dt>
          <dd>años de trayectoria</dd>
        </div>
        <div class="o-info-home__stat">
          <dt>3</dt>
          <dd>niveles educativos</dd>
        </div>
        <div class="o-info-home__stat">
          <dt>100%</dt>
          <dd>formación en valores</dd>
        </div>
      </dl>
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
