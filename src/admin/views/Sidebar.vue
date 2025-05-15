<template>
  <!-- Menú lateral -->
  <div class="sidebar">
    <!-- Información del usuario -->
    <div class="sidebar-user-info">
      <img :src="user?.picture" alt="User Avatar" class="sidebar-user-info__img" />
      <div class="sidebar-user-info__user-details">
        <p>{{ loggedUser?.getName() }}</p>
        <p class="sidebar-user-info__user-details-email">{{ loggedUser?.getEmail() }}</p>
      </div>
    </div>
    <div class="sidebar-year">
      <select class="select-standard" v-model="preferenceStore.selectedYear" @change="handleChangeYear">
        <option v-for="year in preferenceStore.years" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
    </div>
    <!-- Opciones del menú -->
    <div v-if="userStore.user && preferenceStore.selectedYear" class="sidebar-menu-items">
      <div
        class="sidebar-menu-items-container"
        @click="redirectTo('/admin/home')"
        :class="{ 'sidebar-menu-items-container-selected': preferenceStore.selectedMenu === 'home' }"
      >
        <img class="sidebar-menu-items__img" src="@/assets/img/general/home.svg" alt="home" />
        <p>Inicio</p>
      </div>
      <div
        v-if="isValidMenu(['admin'])"
        class="sidebar-menu-items-container"
        :class="{ 'sidebar-menu-items-container-selected': preferenceStore.selectedMenu === 'dashboard' }"
        @click="redirectTo('/admin/dashboard')"
      >
        <img class="sidebar-menu-items__img" src="@/assets/img/general/dashboard.svg" alt="Dashboard" />
        <p>Dashboard</p>
      </div>
      <div
        v-if="isValidMenu(['admin', 'secretary'])"
        class="sidebar-menu-items-container"
        :class="{ 'sidebar-menu-items-container-selected': preferenceStore.selectedMenu === 'payments' }"
        @click="redirectTo('/admin/payments')"
      >
        <img class="sidebar-menu-items__img" src="@/assets/img/general/payment.svg" alt="payment">
        <p>Pagos</p>
      </div>
      <!--      <div @click="toggleSubMenu('content')">-->
      <!--        <div class="sidebar-menu-items-container-new">-->
      <!--          <img class="sidebar-menu-items__img" src="@/assets/img/general/content.svg" alt="c">-->
      <!--          Contenido-->
      <!--          <span :class="{ rotated: preferenceStore.selectedMenu === 'content' }">▼</span>-->
      <!--        </div>-->
      <!--        <div v-if="preferenceStore.selectedMenu === 'content'">-->
      <!--          <p-->
      <!--            @click="redirectTo('/admin/news', 'content')"-->
      <!--            class="submenu-item"-->
      <!--            :class="{ 'submenu-item&#45;&#45;active': preferenceStore.selectedSubMenu === 'news' }"-->
      <!--          >Noticias</p>-->
      <!--          <p-->
      <!--            @click="redirectTo('/admin/announcements', 'content')"-->
      <!--            class="submenu-item"-->
      <!--            :class="{ 'submenu-item&#45;&#45;active': preferenceStore.selectedSubMenu === 'announcements' }"-->
      <!--          >Anuncios</p>-->
      <!--        </div>-->
      <!--      </div>-->
      <div
        v-if="isValidMenu(['admin', 'secretary'])"
        class="sidebar-menu-items-container"
        :class="{ 'sidebar-menu-items-container-selected': preferenceStore.selectedMenu === 'students' }"
        @click="redirectTo('/admin/students')"
      >
        <img class="sidebar-menu-items__img" src="@/assets/img/general/student.svg" alt="student" />
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
        @click="redirectTo('/admin/movements')"
      >
        <img class="sidebar-menu-items__img" src="../../assets/img/general/movements.svg" alt="movement" />
        <p class="menu-item">Movimientos</p>
      </div>
      <div
        v-if="isValidMenu(['admin', 'secretary'])"
        @click="toggleSubMenu('reports')"
      >
        <div class="sidebar-menu-items-container-new">
          <img class="sidebar-menu-items__img" src="@/assets/img/general/reports.svg" alt="c">
          Reportes
          <span :class="{ rotated: preferenceStore.selectedMenu === 'reports' }">▼</span>
        </div>
        <div v-if="preferenceStore.selectedMenu === 'reports'">
          <p
            v-if="isValidMenu(['admin'])"
            @click="redirectTo('/admin/debts', 'content')"
            class="submenu-item"
            :class="{ 'submenu-item--active': preferenceStore.selectedSubMenu === 'debts' }"
          >Deudores</p>
          <p
            v-if="isValidMenu(['admin', 'secretary'])"
            @click="redirectTo('/admin/cash-flow', 'content')"
            class="submenu-item"
            :class="{ 'submenu-item--active': preferenceStore.selectedSubMenu === 'cash-flow' }"
          >Caja</p>
        </div>
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

    <!-- Botón de salir -->
    <div class="sidebar-logout">
      <button @click="closeSession" class="button-logout">
        Cerrar sesión
        <img class="sidebar-logout__icon" src="@/assets/img/general/logout.png" alt="Logout Icon" />
      </button>

    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/admin/general/context/store/userStore.js'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'

const { logout, user } = useAuth0()
const router = useRouter()
const userStore = useUserStore()
const preferenceStore = usePreferenceStore()
const auth0 = useAuth0()

const loggedUser = ref(null)

const isValidMenu = (roles) => {
  return userStore.user.hasRole(roles)
}

const toggleSubMenu = (menuName) => {
  preferenceStore.setSelectedMenu(menuName)
}

const closeSession = () => {
  preferenceStore.setSelectedMenu('home')
  preferenceStore.setSelectedSubMenu('')
  logout({
    logoutParams: {
      returnTo: window.location.origin
    }
  })
}

const redirectTo = (path, menu) => {
  router.push(path)
  const selected = path.replace('/admin/', '')
  if (menu) {
    preferenceStore.setSelectedMenu(menu)
    preferenceStore.setSelectedSubMenu(selected)
  } else {
    preferenceStore.setSelectedMenu(selected)
    preferenceStore.setSelectedSubMenu('')
  }
}

async function validateUser() {
  try {
    const status = await userStore.validateUser()
    if (status !== 200) {
      await router.push('/user-not-found')
    } else {
      loggedUser.value = userStore.user
    }
    return status === 200
  } catch (error) {
    console.error(`error: ${error}`)
  }
}

async function getYears() {
  const status = await preferenceStore.getYears()
  if (status !== 200) {
    await router.push('/without-years')
  }
  return status === 200
}

const handleChangeYear = (event) => {
  preferenceStore.setSelectedYear(parseInt(event.target.value))
}

onMounted(async () => {
  try {
    const isAuthenticated = await auth0.isAuthenticated
    if (!isAuthenticated) {
      await auth0.loginWithRedirect()
      return
    }

    const token = await auth0.getAccessTokenSilently()
    userStore.setToken(token)

    const valid = await validateUser()
    if (!valid) return

    const validYears = await getYears()
    if (!validYears) return

    await preferenceStore.getGrades()
    await preferenceStore.getMonths()

    if (preferenceStore.getSelectedMenu()) {
      preferenceStore.setSelectedMenu(preferenceStore.getSelectedMenu())
    } else {
      preferenceStore.setSelectedMenu('home')
    }

    if (preferenceStore.getSelectedSubMenu()) {
      preferenceStore.setSelectedSubMenu(preferenceStore.getSelectedSubMenu())
    }
  } catch (error) {
    console.error('Error de autenticación:', error)
    await auth0.loginWithRedirect()
  }
})
</script>

<style scoped>
.submenu-item {
  padding: 8px 16px;
  cursor: pointer;
  color: #333;
  transition: background-color 0.2s, color 0.2s;
  border-radius: 4px;
  margin-left: 20px;
}

.submenu-item:not(.submenu-item--active):hover {
  background-color: #f0f0f0;
}

.submenu-item--active {
  background-color: #610e0d;
  color: white;
  font-weight: bold;
}

.rotated {
  transform: rotate(180deg);
}
</style>
