<template>
  <div :class="['l-standard', { darkMode: theme === 'dark' }]">
    <div class="l-standard-title">
      <div>
        <span>Gestión de noticias</span>
      </div>
    </div>
    <div class="header-news">
      <button class="add-button" @click="addActivity">Agregar nueva</button>
    </div>
    <div class="activities-container">
      <div
        v-for="activity in activityStore.activities"
        :key="activity.getId()"
        class="news-card"
        @click="updateActivity(activity)"
      >
        <div class="text">
          <h3>{{ activity.getTitle() }}</h3>
          <p>{{ activity.getDescription() }}</p>
          <div class="meta">
            <small>Última actualización: {{ activity.getUpdatedAtStr() }}</small
            ><br />
            <small>Autor: {{ activity.getAuthor() }}</small>
          </div>
        </div>
        <img :src="activity.getPhotos()[0].getUrl()" alt="image" />
      </div>
    </div>
      <el-pagination
        layout="prev, pager, next"
        :total="activityStore.total"
        :page-size="perPage"
        :current-page="actualPage"
        @update:current-page="handlePageChange"

        :class="['pagination', { darkMode: theme === 'dark' }]"
      />

    <create-activity-modal @refresh="refreshActivities" />
    <update-activity-modal @refresh="refreshActivities" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import 'element-plus/es/components/pagination/style/css'
import { ElPagination } from 'element-plus'
import CreateActivityModal from '@/admin/content/activities/context/components/modals/CreateActivityModal.vue'
import { useVfm } from 'vue-final-modal'
import { useActivityStore } from '@/admin/content/activities/context/store/activityStore.js'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { notifications } from '@/shared/notifications.js'
import { useUserStore } from '@/admin/general/context/store/userStore.js'
import { ACTIVITIES_PER_PAGE } from '@/admin/shared/constants.js'
import UpdateActivityModal from '@/admin/content/activities/context/components/modals/UpdateActivityModal.vue'

const activityStore = useActivityStore()
const preferenceStore = usePreferenceStore()
const userStore = useUserStore()
const perPage = ACTIVITIES_PER_PAGE
const theme = computed(() => preferenceStore.theme)

const vfm = useVfm()

const actualPage = ref(1)

watch(
  () => userStore.token,
  () => {
    searchActivities()
  }
)

const handlePageChange = (newPage) => {
  actualPage.value = newPage
  activityStore.setPage(newPage)
  searchActivities()
}

const refreshActivities = () => {
  actualPage.value = 1
  activityStore.setPage(1)
  searchActivities()
}

const searchActivities = async () => {
  preferenceStore.setLoading(true)
  try {
    const success = await activityStore.searchActivities()
    if (!success) {
      notifications.notify('No se pudieron cargar las actividades', 'error')
    }
  } catch (error) {
    console.error(`error: ${error}`)
  } finally {
    preferenceStore.setLoading(false)
  }
}

function addActivity() {
  vfm.open('createActivityModal')
}

function updateActivity(activity) {
  activityStore.setSelectedActivity(activity)
  vfm.open('updateActivityModal')
}

onMounted(async () => {
  if (!userStore.token) return
  await searchActivities()
})
</script>
