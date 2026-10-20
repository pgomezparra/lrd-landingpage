<template>
  <header class="o-header">
    <div class="o-header__utility">
      <div class="o-header__utility-inner">
        <div class="o-header__utility-contact">
          <a href="tel:+573158317079" class="o-header__utility-link">
            <span class="o-header__dot"></span>
            315 831 7079
          </a>
          <a href="mailto:secretaria@liceoreydavid.edu.co" class="o-header__utility-link o-header__utility-link--mail">
            secretaria@liceoreydavid.edu.co
          </a>
        </div>
        <div class="o-header__utility-social">
          <a
            href="https://www.instagram.com/colegioliceoreydavid/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram del colegio"
          >
            <img src="@/assets/img/general/instagram.svg" alt="" />
          </a>
          <a
            href="https://www.facebook.com/liceo.rey"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook del colegio"
          >
            <img src="@/assets/img/general/facebook.svg" alt="" />
          </a>
          <a href="#" aria-label="Ingresar a la intranet" @click.prevent="redirectToLogin">
            <img src="@/assets/img/general/login.svg" alt="" />
          </a>
        </div>
      </div>
    </div>

    <div class="o-header__main">
      <div class="m-logo" @click="changeMenu('home', '/')">
        <img src="@/assets/img/logo.png" alt="Logo del Liceo Rey David" class="m-logo__img" />
        <span class="m-logo__text">
          <strong>Liceo Rey David</strong>
          <small>Preescolar · Primaria · Bachillerato</small>
        </span>
      </div>

      <nav class="m-menu" aria-label="Navegación principal">
        <ul class="m-menu__items">
          <li
            v-for="item in menuItems"
            :key="item.name"
            class="m-menu-item"
            :class="{ active: navbarStore.actualMenu === item.name }"
            @click="changeMenu(item.name, item.href)"
          >
            {{ item.label }}
          </li>
        </ul>
      </nav>

      <div class="o-header__actions">
        <a class="o-header__cta" @click="changeMenu('admissions', '/admissions')">Inscripciones</a>
        <button
          class="m-menu-toggle"
          type="button"
          :aria-expanded="isMenuOpen"
          aria-label="Abrir menú de navegación"
          @click="toggleMenu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>

    <div
      :class="[
        'm-menu-mobile',
        !isMenuOpen && !isFirstLoad ? 'is-closing' : '',
        isMenuOpen && !isFirstLoad ? 'is-opening' : ''
      ]"
    >
      <div class="m-menu-mobile__overlay" @click="toggleMenu"></div>
      <div class="m-menu-mobile__panel">
        <div class="m-menu-mobile__head">
          <div class="m-logo m-logo--compact">
            <img src="@/assets/img/logo.png" alt="Logo del Liceo Rey David" class="m-logo__img" />
            <span class="m-logo__text">
              <strong>Liceo Rey David</strong>
              <small>Educación con principios y valores</small>
            </span>
          </div>
          <button class="m-menu-mobile__close" type="button" aria-label="Cerrar menú" @click="toggleMenu">
            ×
          </button>
        </div>

        <nav class="m-menu-mobile__items" aria-label="Navegación móvil">
          <div
            v-for="(item, index) in menuItems"
            :key="item.name"
            class="m-menu-item"
            :class="{ active: navbarStore.actualMenu === item.name }"
            @click="changeMenu(item.name, item.href)"
          >
            <span class="m-menu-item__index">0{{ index + 1 }}</span>
            {{ item.label }}
          </div>
        </nav>

        <div class="m-menu-mobile__footer">
          <div class="m-menu-mobile__social">
            <a
              href="https://www.instagram.com/colegioliceoreydavid/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram del colegio"
            >
              <img src="@/assets/img/general/instagram.svg" alt="" />
            </a>
            <a
              href="https://www.facebook.com/liceo.rey"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook del colegio"
            >
              <img src="@/assets/img/general/facebook.svg" alt="" />
            </a>
          </div>
          <button class="m-menu-mobile__login" type="button" @click="redirectToLogin">
            <img src="@/assets/img/general/login.svg" alt="" />
            Intranet
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useNavbarStore } from '@/navbar/store/navbarStore.js'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const navbarStore = useNavbarStore()
const router = useRouter()
const isMenuOpen = ref(false)
const isFirstLoad = ref(true)

const menuItems = [
  { label: 'Inicio', href: '/', name: 'home' },
  { label: 'Admisiones', href: '/admissions', name: 'admissions' },
  { label: 'Noticias', href: '/news', name: 'public-news' },
  { label: 'PQR', href: '/pqr', name: 'pqr' },
  { label: 'Institucional', href: '/institutional', name: 'institutional' }
]

const changeMenu = (menu, route) => {
  navbarStore.setActualMenu(menu)
  router.push(route)
  if (isMenuOpen.value) {
    toggleMenu()
  }
}

const toggleMenu = () => {
  isFirstLoad.value = false
  isMenuOpen.value = !isMenuOpen.value
}

const redirectToLogin = () => {
  router.push('/admin/home')
}
</script>
