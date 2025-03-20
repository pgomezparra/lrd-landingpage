<template>
  <div class="app-layout">
    <!-- Menú lateral -->
    <aside class="sidebar">
      <!-- Información del usuario -->
      <div class="user-info">
        <img :src="user?.picture" alt="User Avatar" class="user-avatar" />
        <div class="user-details">
          <h2>{{ user?.name }}</h2>
          <p>{{ user?.email }}</p>
        </div>
      </div>

      <!-- Opciones del menú -->
      <nav class="menu-items">
        <ul>
          <li @click="redirectToDashBoard" class="menu-item">Dashboard</li>
          <li @click="redirectToPayments" class="menu-item">Pagos</li>

          <!-- Menú con submenús -->
          <li class="menu-item">
            <div @click="toggleSubMenu('content')" class="menu-title">
              Contenido
              <span :class="{ rotated: openSubMenus.content }">▼</span>
            </div>
            <ul v-if="openSubMenus.content" class="submenu">
              <li @click="redirectToNews" class="submenu-item">Noticias</li>
              <li @click="redirectToAnnouncements" class="submenu-item">Anuncios</li>
            </ul>
          </li>

          <li @click="redirectToStudents" class="menu-item">Estudiantes</li>
        </ul>
      </nav>

      <!-- Botón de salir -->
      <div class="logout">
        <a @click="closeSession" href="#">
          <span>Salir</span>
          <img class="logout-icon" src="@/assets/img/general/logout.svg" alt="Logout Icon" />
        </a>
      </div>
    </aside>

    <!-- Contenedor dinámico -->
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useRouter } from 'vue-router'

const { logout, user } = useAuth0()
const router = useRouter()

// Controla los submenús abiertos
const openSubMenus = ref({
  content: false // Submenú para "Contenido"
})

// Función para alternar la visibilidad de los submenús
const toggleSubMenu = (menuName) => {
  openSubMenus.value[menuName] = !openSubMenus.value[menuName]
}

const closeSession = () => {
  logout({
    logoutParams: {
      returnTo: window.location.origin
    }
  })
}

const redirectToDashBoard = () => {
  router.push('/admin/dashboard')
}
const redirectToPayments = () => {
  router.push('/admin/payments')
}
const redirectToNews = () => {
  router.push('/admin/news')
}
const redirectToAnnouncements = () => {
  router.push('/admin/announcements')
}
const redirectToStudents = () => {
  router.push('/admin/students')
}
</script>

<style scoped>
/* Estilos generales */
.app-layout {
  display: flex;
  height: 100vh;
  width: 100%;
}

/* Menú lateral */
.sidebar {
  width: 250px;
  background-color: #2c3e50; /* Color del fondo del menú */
  color: #ecf0f1; /* Color del texto */
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Asegura que logout esté abajo */
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.user-details h2 {
  font-size: 16px;
  margin: 5px 0;
}

.user-details p {
  font-size: 14px;
  margin: 0;
  color: #bdc3c7;
  text-align: center;
}

/* Opciones del menú */
.menu-items ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.menu-item {
  cursor: pointer;
  font-size: 18px;
  padding: 10px;
  width: 100%;
  text-align: left;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.menu-item:hover {
  background-color: #34495e;
}

.menu-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.submenu {
  list-style: none;
  padding: 0;
  margin: 10px 0 0 15px;
}

.submenu-item {
  cursor: pointer;
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.submenu-item:first-child {
  margin-top: 1rem;
}

.submenu-item:hover {
  background-color: #34495e;
}

.rotated {
  transform: rotate(180deg);
}

/* Botón de salir */
.logout {
  text-align: center;
  margin-top: auto; /* Posiciona al final del menú */
}

.logout a {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ecf0f1;
  text-decoration: none;
  gap: 10px;
}

.logout a:hover {
  color: #bdc3c7;
}

.logout-icon {
  width: 1rem;
}
</style>