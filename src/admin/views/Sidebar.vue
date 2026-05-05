<template>
  <div :class="[`theme--${preferenceStore.theme}`]">
    <button class="hamburger" @click="isSidebarOpen = !isSidebarOpen">
      <img src="@/assets/img/general/hamburguer.svg" alt="hamburguer" />
    </button>
    <div
      class="sidebar"
      :class="{ 'sidebar--open': isSidebarOpen, darkMode: preferenceStore.theme === 'dark' }"
    >
      <div class="sidebar-user-info">
        <img :src="user?.picture" alt="User Avatar" class="sidebar-user-info__img" />
        <div class="sidebar-user-info__user-details">
          <p>{{ loggedUser?.getName() }}</p>
          <p class="sidebar-user-info__user-details-email">{{ loggedUser?.getEmailShort() }}</p>
        </div>
      </div>

      <div class="sidebar-year">
        <select
          class="select-standard"
          v-model="preferenceStore.selectedYear"
          @change="handleChangeYear"
        >
          <option v-for="year in preferenceStore.years" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
        <button
          v-if="userStore.user && preferenceStore.selectedYear"
          :disabled="!isValidMenu(['admin'])"
          class="sidebar-year__button"
          @click="handleAddYear"
        >
          +
        </button>
      </div>

      <div v-if="userStore.user && preferenceStore.selectedYear" class="sidebar-menu-items">
        <div
          class="sidebar-menu-items-container"
          :class="{
            'sidebar-menu-items-container-selected': preferenceStore.selectedMenu === 'home'
          }"
          @click="redirectTo('/admin/home', 'home')"
        >
          <img class="sidebar-menu-items__img" src="@/assets/img/general/home.svg" alt="home" />
          <p class="menu-item">Inicio</p>
        </div>

        <div
          v-if="isValidMenu(['admin', 'general_secretary'])"
          class="sidebar-menu-items-container"
          :class="{
            'sidebar-menu-items-container-selected': preferenceStore.selectedMenu === 'dashboard'
          }"
          @click="redirectTo('/admin/dashboard', 'dashboard')"
        >
          <img
            class="sidebar-menu-items__img"
            src="@/assets/img/general/dashboard.svg"
            alt="dashboard"
          />
          <p class="menu-item">Dashboard</p>
        </div>

        <div
          v-if="isValidMenu(['admin', 'secretary'])"
          class="sidebar-menu-items-container"
          :class="{
            'sidebar-menu-items-container-selected': preferenceStore.selectedMenu === 'payments'
          }"
          @click="redirectTo('/admin/payments', 'payments')"
        >
          <img
            class="sidebar-menu-items__img"
            src="@/assets/img/general/payment.svg"
            alt="payments"
          />
          <p class="menu-item">Pagos</p>
        </div>
        <div
          v-if="isValidMenu(['admin', 'content_manager', 'elections'])"
          class="sidebar-menu-items-container-new"
          :class="{
            'sidebar-menu-items-container-selected': preferenceStore.selectedMenu === 'content'
          }"
          @click="toggleSubMenu('content')"
        >
          <img
            class="sidebar-menu-items__img"
            src="@/assets/img/general/content.svg"
            alt="content"
          />
          <p class="menu-item">Contenido</p>
          <svg 
            class="chevron-icon" 
            :class="{ 'chevron-icon--rotated': preferenceStore.selectedMenu === 'content' }" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2"
          >
            <polyline points="6,9 12,15 18,9" />
          </svg>
        </div>
        <div v-if="preferenceStore.selectedMenu === 'content'">
          <p
            v-if="isValidMenu(['admin', 'content_manager'])"
            @click="redirectTo('/admin/news', 'content')"
            class="submenu-item"
            :class="{ 'submenu-item--active': preferenceStore.selectedSubMenu === 'news' }"
          >
            Noticias
          </p>
          <p
            v-if="isValidMenu(['admin', 'elections'])"
            @click="redirectTo('/admin/school-government', 'content')"
            class="submenu-item"
            :class="{
              'submenu-item--active': preferenceStore.selectedSubMenu === 'school-government'
            }"
          >
            Gobierno escolar
          </p>
          <!--          <p-->
          <!--            @click="redirectTo('/admin/announcements', 'content')"-->
          <!--            class="submenu-item"-->
          <!--            :class="{ 'submenu-item&#45;&#45;active': preferenceStore.selectedSubMenu === 'announcements' }"-->
          <!--          >Anuncios</p>-->
        </div>
        <div
          v-if="isValidMenu(['admin', 'secretary'])"
          class="sidebar-menu-items-container"
          :class="{
            'sidebar-menu-items-container-selected': preferenceStore.selectedMenu === 'students'
          }"
          @click="redirectTo('/admin/students', 'students')"
        >
          <img
            class="sidebar-menu-items__img"
            src="@/assets/img/general/student.svg"
            alt="students"
          />
          <p class="menu-item">Estudiantes</p>
        </div>
        <div
          v-if="isValidMenu(['admin', 'general_secretary'])"
          class="sidebar-menu-items-container"
          :class="{
            'sidebar-menu-items-container-selected': preferenceStore.selectedMenu === 'employees'
          }"
          @click="redirectTo('/admin/employees', 'employees')"
        >
          <img
            class="sidebar-menu-items__img"
            src="@/assets/img/general/employee.svg"
            alt="employee"
          />
          <p class="menu-item">Empleados</p>
        </div>
        <div
          v-if="isValidMenu(['admin', 'secretary'])"
          class="sidebar-menu-items-container"
          :class="{
            'sidebar-menu-items-container-selected': preferenceStore.selectedMenu === 'movements'
          }"
          @click="redirectTo('/admin/movements', 'movements')"
        >
          <img
            class="sidebar-menu-items__img"
            src="@/assets/img/general/movements.svg"
            alt="movements"
          />
          <p class="menu-item">Movimientos</p>
        </div>

        <div
          v-if="isValidMenu(['admin', 'secretary', 'general_secretary'])"
          class="sidebar-menu-items-container-new"
          :class="{
            'sidebar-menu-items-container-selected': preferenceStore.selectedMenu === 'reports'
          }"
          @click="toggleSubMenu('reports')"
        >
          <img
            class="sidebar-menu-items__img"
            src="@/assets/img/general/reports.svg"
            alt="reports"
          />
          <p class="menu-item">Reportes</p>
          <svg 
            class="chevron-icon" 
            :class="{ 'chevron-icon--rotated': preferenceStore.selectedMenu === 'reports' }" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2"
          >
            <polyline points="6,9 12,15 18,9" />
          </svg>
        </div>

        <div v-if="preferenceStore.selectedMenu === 'reports'">
          <p
            v-if="isValidMenu(['admin', 'general_secretary'])"
            class="submenu-item"
            :class="{ 'submenu-item--active': preferenceStore.selectedSubMenu === 'debts' }"
            @click="redirectTo('/admin/debts', 'reports')"
          >
            Deudores
          </p>

          <p
            v-if="isValidMenu(['admin', 'secretary', 'general_secretary'])"
            class="submenu-item"
            :class="{ 'submenu-item--active': preferenceStore.selectedSubMenu === 'cash-flow' }"
            @click="redirectTo('/admin/cash-flow', 'reports')"
          >
            Caja
          </p>
        </div>
        <!--      <div-->
        <!--        v-if="isValidMenu(['admin', 'coordinator'])"-->
        <!--        class="sidebar-menu-items-container"-->
        <!--        :class="{ 'sidebar-menu-items-container-selected': preferenceStore.selectedMenu === 'pqrs' }"-->
        <!--        @click="redirectTo('/admin/pqrs')"-->
        <!--      >-->
        <!--        <img class="sidebar-menu-items__img" src="@/assets/img/general/pqrs.svg" alt="pqrs" />-->
        <!--        <p class="menu-item">PQRS</p>-->
        <!--      </div>-->
        <div
          v-if="isValidMenu(['admin', 'general_secretary'])"
          class="sidebar-menu-items-container-new"
          :class="{
            'sidebar-menu-items-container-selected': preferenceStore.selectedMenu === 'settings'
          }"
          @click="toggleSubMenu('settings')"
        >
          <img class="sidebar-menu-items__img" src="@/assets/img/general/gear.svg" alt="settings" />
          <p class="menu-item">Ajustes</p>
          <svg 
            class="chevron-icon" 
            :class="{ 'chevron-icon--rotated': preferenceStore.selectedMenu === 'settings' }" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2"
          >
            <polyline points="6,9 12,15 18,9" />
          </svg>
        </div>
        <div v-if="preferenceStore.selectedMenu === 'settings'">
          <p
            v-if="isValidMenu(['admin', 'general_secretary'])"
            class="submenu-item"
            :class="{
              'submenu-item--active': preferenceStore.selectedSubMenu === 'payment-values'
            }"
            @click="redirectTo('/admin/payment-values', 'settings')"
          >
            Tarifas
          </p>
          <p
            v-if="isValidMenu(['admin'])"
            class="submenu-item"
            :class="{
              'submenu-item--active': preferenceStore.selectedSubMenu === 'preferences'
            }"
            @click="redirectTo('/admin/preferences', 'settings')"
          >
            Preferencias
          </p>
        </div>
      </div>

      <div class="sidebar-logout">
        <button @click="closeSession" class="button-logout">
          <span>Cerrar sesión</span>
          <svg class="sidebar-logout__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16,17 21,12 16,7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
        <div>
          <button class="theme-toggle" @click="preferenceStore.toggleTheme()" :title="preferenceStore.theme === 'dark' ? 'Modo claro' : 'Modo oscuro'">
            <svg v-if="preferenceStore.theme === 'dark'" class="theme-toggle__icon" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <svg v-else class="theme-toggle__icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/admin/general/context/store/userStore.js'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'

const { logout, user, getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0()
const router = useRouter()
const userStore = useUserStore()
const preferenceStore = usePreferenceStore()
const loggedUser = ref(null)
const isSidebarOpen = ref(false)
preferenceStore.initializePreferences()
const isValidMenu = (roles) => userStore.user.hasRole(roles)

const toggleSubMenu = (menuName) => {
  preferenceStore.setSelectedMenu(menuName)
}

const handleAddYear = async () => {
  preferenceStore.setLoading(true)
  try {
    await preferenceStore.saveYear()
  } catch (error) {
    console.error(error)
  } finally {
    preferenceStore.setLoading(false)
  }
}

const closeSession = () => {
  preferenceStore.setSelectedMenu('home')
  preferenceStore.setSelectedSubMenu('')
  logout({ logoutParams: { returnTo: window.location.origin } })
}

const redirectTo = (path, menu) => {
  router.push(path)
  isSidebarOpen.value = false
  const selected = path.replace('/admin/', '')
  if (menu) {
    preferenceStore.setSelectedMenu(menu)
    preferenceStore.setSelectedSubMenu(selected)
  } else {
    preferenceStore.setSelectedMenu(selected)
    preferenceStore.setSelectedSubMenu('')
  }
}

const handleChangeYear = (event) => {
  preferenceStore.setSelectedYear(parseInt(event.target.value))
}

const validateUser = async () => {
  const status = await userStore.validateUser()
  if (status !== 200) {
    await router.push('/user-not-found')
    return false
  }
  loggedUser.value = userStore.user
  return true
}

const getYears = async () => {
  const status = await preferenceStore.getYears()
  if (status !== 200) {
    await router.push('/without-years')
    return false
  }
  return true
}

onMounted(async () => {
  const auth = await isAuthenticated
  if (!auth) {
    await loginWithRedirect()
    return
  }
  const token = await getAccessTokenSilently()
  userStore.setToken(token)

  preferenceStore.setLoading(true)
  try {
    if (!(await validateUser())) return
    if (!(await getYears())) return

    await preferenceStore.getGrades()
    await preferenceStore.getMonths()
  } catch (error) {
    console.error(error)
  } finally {
    preferenceStore.setLoading(false)
  }

  preferenceStore.setSelectedMenu(preferenceStore.getSelectedMenu() || 'home')
  preferenceStore.setSelectedSubMenu(preferenceStore.getSelectedSubMenu() || '')
})
</script>
