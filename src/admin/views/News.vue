<template>
  <loading-overlay />
  <div class="l-standard">
    <div class="l-standard-title">
      <div>
        <span>Gestión de noticias</span>
      </div>
    </div>
    <div class="header">
      <button class="add-button" @click="addActivity">Agregar nueva</button>
    </div>
    <div class="activities-container">
      <div v-for="activity in activityStore.activities" :key="activity.getId()" class="news-card"
           @click="updateActivity(activity)">
        <div class="text">
          <h3>{{ activity.getTitle() }}</h3>
          <p>{{ activity.getDescription() }}</p>
          <div class="meta">
            <small>Última actualización: {{ activity.getUpdatedAtStr() }}</small><br />
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
      class="pagination"
    />
    <create-activity-modal @refresh="refreshActivities" />
    <update-activity-modal @refresh="refreshActivities" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import 'element-plus/es/components/pagination/style/css'
import { ElPagination } from 'element-plus'
import CreateActivityModal from '@/admin/content/activities/context/components/modals/CreateActivityModal.vue'
import { useVfm } from 'vue-final-modal'
import LoadingOverlay from '@/admin/views/LoadingOverlay.vue'
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

const vfm = useVfm()

const actualPage = ref(1)

watch(
  () => userStore.token,
  () => {
    searchActivities()
  })

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

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.add-button {
  background-color: #0057d8;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.activities-container {
  max-height: calc(100vh - 16rem);
  overflow-y: auto;
  padding-right: 8px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.news-card {
  height: 9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9f9f9;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #f0f0f0;
  }
}

.news-card img {
  width: 7rem;
  height: 7rem;
  object-fit: cover;
  border-radius: 4px;
}

.news-card h3 {
  margin: 0 0 4px;
}

.news-card p {
  margin: 0;
  color: #555;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.text {
  flex: 1;
  margin-right: 12px;
}

.meta {
  margin-top: 8px;
  font-size: 0.85rem;
  color: #777;
  display: flex;
  flex-direction: column;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>