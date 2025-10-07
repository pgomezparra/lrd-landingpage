<template>
  <button class="hamburger" @click="isSidebarOpen = !isSidebarOpen">
    <img src="@/assets/img/general/hamburguer.svg" alt="hamburguer" />
  </button>
  <div class="sidebar" :class="{ 'sidebar--open': isSidebarOpen }">

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
        <option
          v-for="year in preferenceStore.years"
          :key="year"
          :value="year"
        >
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
        :class="{ 'sidebar-menu-items-container-selected': preferenceStore.selectedMenu === 'home' }"
        @click="redirectTo('/admin/home', 'home')"
      >
        <img class="sidebar-menu-items__img" src="@/assets/img/general/home.svg" alt="home" />
        <p class="menu-item">Inicio</p>
      </div>

      <div
        v-if="isValidMenu(['admin', 'general_secretary'])"
        class="sidebar-menu-items-container"
        :class="{ 'sidebar-menu-items-container-selected': preferenceStore.selectedMenu === 'dashboard' }"
        @click="redirectTo('/admin/dashboard', 'dashboard')"
      >
        <img class="sidebar-menu-items__img" src="@/assets/img/general/dashboard.svg" alt="dashboard" />
        <p class="menu-item">Dashboard</p>
      </div>

      <div
        v-if="isValidMenu(['admin', 'secretary'])"
        class="sidebar-menu-items-container"
        :class="{ 'sidebar-menu-items-container-selected': preferenceStore.selectedMenu === 'payments' }"
        @click="redirectTo('/admin/payments', 'payments')"
      >
        <img class="sidebar-menu-items__img" src="@/assets/img/general/payment.svg" alt="payments" />
        <p class="menu-item">Pagos</p>
      </div>
      <div
        v-if="isValidMenu(['admin', 'content_manager'])"
        class="sidebar-menu-items-container-new"
        :class="{ 'sidebar-menu-items-container-selected': preferenceStore.selectedMenu === 'content' }"
        @click="toggleSubMenu('content')"
      >
        <img class="sidebar-menu-items__img" src="@/assets/img/general/content.svg" alt="content">
        <p class="menu-item">Contenido</p>
        <span :class="{ rotated: preferenceStore.selectedMenu === 'content' }">▼</span>
      </div>
      <div v-if="preferenceStore.selectedMenu === 'content'">
        <p
          @click="redirectTo('/admin/news', 'content')"
          class="submenu-item"
          :class="{ 'submenu-item--active': preferenceStore.selectedSubMenu === 'news' }"
        >Noticias</p>
        <!--          <p-->
        <!--            @click="redirectTo('/admin/announcements', 'content')"-->
        <!--            class="submenu-item"-->
        <!--            :class="{ 'submenu-item&#45;&#45;active': preferenceStore.selectedSubMenu === 'announcements' }"-->
        <!--          >Anuncios</p>-->
      </div>
      <div
        v-if="isValidMenu(['admin', 'secretary'])"
        class="sidebar-menu-items-container"
        :class="{ 'sidebar-menu-items-container-selected': preferenceStore.selectedMenu === 'students' }"
        @click="redirectTo('/admin/students', 'students')"
      >
        <img class="sidebar-menu-items__img" src="@/assets/img/general/student.svg" alt="students" />
        <p class="menu-item">Estudiantes</p>
      </div>
      <!--      <div-->
      <!--        class="sidebar-menu-items-container"-->
      <!--        :class="{ 'sidebar-menu-items-container-selected': preferenceStore.selectedMenu === 'employees' }"-->
      <!--        @click="redirectTo('/admin/employees')"-->
      <!--      >-->
      <!--        <img class="sidebar-menu-items__img" src="@/assets/img/general/student.svg" alt="employee" />-->
      <!--        <p class="menu-item">Empleados</p>-->
      <!--      </div>-->
      <div
        v-if="isValidMenu(['admin', 'secretary'])"
        class="sidebar-menu-items-container"
        :class="{ 'sidebar-menu-items-container-selected': preferenceStore.selectedMenu === 'movements' }"
        @click="redirectTo('/admin/movements', 'movements')"
      >
        <img class="sidebar-menu-items__img" src="@/assets/img/general/movements.svg" alt="movements" />
        <p class="menu-item">Movimientos</p>
      </div>

      <div
        v-if="isValidMenu(['admin', 'secretary'])"
        class="sidebar-menu-items-container-new"
        :class="{ 'sidebar-menu-items-container-selected': preferenceStore.selectedMenu === 'reports' }"
        @click="toggleSubMenu('reports')"
      >
        <img class="sidebar-menu-items__img" src="@/assets/img/general/reports.svg" alt="reports" />
        <p class="menu-item">Reportes</p>
        <span :class="{ rotated: preferenceStore.selectedMenu === 'reports' }">▼</span>
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
          v-if="isValidMenu(['admin', 'secretary'])"
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
      <!--      <div-->
      <!--        class="sidebar-menu-items-container"-->
      <!--        :class="{ 'sidebar-menu-items-container-selected': preferenceStore.selectedMenu === 'settings' }"-->
      <!--        @click="redirectTo('/admin/settings')"-->
      <!--      >-->
      <!--        <img class="sidebar-menu-items__img" src="@/assets/img/general/student.svg" alt="settings" />-->
      <!--        <p class="menu-item">Configuraciones</p>-->
      <!--      </div>-->
    </div>

    <div class="sidebar-logout">
      <button @click="closeSession" class="button-logout">
        Cerrar sesión
        <img class="sidebar-logout__icon" src="@/assets/img/general/logout.png" alt="logout" />
      </button>
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
