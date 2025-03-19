<template>
  <header class="o-header">
    <div class="m-logo">
      <img src="@/assets/img/logo.png" alt="Logo del Colegio" class="m-logo__img" />
      <span class="m-logo__text">Liceo Rey David</span>
    </div>
    <div class="m-menu">
      <ul class="m-menu__items">
        <li v-for="item in menuItems" :key="item.name" class="m-menu-item"
            :class="{ 'active': navbarStore.actualMenu === item.name }"
            @click="changeMenu(item.name, item.href)">
          {{ item.label }}
        </li>
        <li class="m-menu-icon"><a href="https://www.instagram.com/colegioliceoreydavid/" target="_blank"><img
          src="@/assets/img/general/instagram.svg" alt="Instagram" /></a></li>
        <li class="m-menu-icon"><a href="https://www.facebook.com/liceo.rey" target="_blank"><img
          src="@/assets/img/general/facebook.svg" alt="Instagram" /></a></li>
      </ul>
    </div>

    <!-- Mobile Menu Button -->
    <div class="m-menu-toggle" @click="toggleMenu">
      <span class="menu-icon">&#9776;</span>
    </div>

    <!-- Mobile Menu -->
    <div
      :class="['m-menu-mobile', !isMenuOpen && !isFirstLoad ? 'is-closing' : '', isMenuOpen && !isFirstLoad ? 'is-opening' : '']">
      <div class="m-menu-mobile__container">
        <nav class="m-menu-mobile__container__items">
          <div class="m-menu-icon">
            <a @click="toggleMenu" href="https://www.instagram.com/colegioliceoreydavid/" target="_blank">
              <img src="@/assets/img/general/instagram.svg" alt="Instagram" /></a>
            <a @click="toggleMenu" href="https://www.facebook.com/liceo.rey" target="_blank">
              <img src="@/assets/img/general/facebook.svg" alt="Instagram" /></a>
          </div>
          <div
            v-for="item in menuItems"
            :key="item.name"
            :class="['m-menu-item', navbarStore.actualMenu === item.name ? 'active' : '']"
            @click="changeMenu(item.name, item.href)"
          >
            {{ item.label }}
          </div>
        </nav>
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
  { label: 'Historia', href: '/gallery', name: 'gallery' },
  { label: 'Pqr', href: '/pqr', name: 'pqr' },
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
</script>

<style scoped>


.menu-icon {
  font-size: 1.5rem;
}
</style>