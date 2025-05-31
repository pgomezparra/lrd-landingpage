<template>
  <Navbar />
  <div class="l-gallery">
    <h1 class="l-gallery__title">Últimas Noticias</h1>
    <el-pagination
      layout="prev, pager, next"
      :total="total"
      :page-size="perPage"
      :current-page="page"
      @update:current-page="handlePageChange"
      class="pagination"
    />
    <div class="news-grid">
      <div v-for="activity in news" :key="activity.getId()" class="news-card">
        <img :src="activity.getPhotos()[0].getUrl()" alt="Imagen de la noticia" class="news-image" />
        <div class="news-content">
          <h2 class="news-title">{{ activity.getTitle() }}</h2>
          <p class="news-meta">
            <span>{{ formatDate(activity.getUpdatedAt()) }}</span> · <span>{{ activity.getAuthor() }}</span>
          </p>
          <div class="read-more-container">
            <button class="read-more" @click="seeNewDetail(activity)">
              Ver detalle
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
  <whatsapp />
  <new-detail-modal />
</template>
<script setup>

import Navbar from '@/navbar/components/NavBar.vue'
import Footer from '@/general/components/Footer.vue'
import Whatsapp from '@/general/components/Whatsapp.vue'
import { ref, onMounted, markRaw } from 'vue'
import { ElPagination } from 'element-plus'
import 'element-plus/es/components/pagination/style/css'
import { NEWS_PER_PAGE } from '@/shared/constants.js'
import { useActivityStore } from '@/admin/content/activities/context/store/activityStore.js'
import NewDetailModal from '@/institutional/components/news/NewDetailModal.vue'
import { useVfm } from 'vue-final-modal'

const activityStore = useActivityStore()
const vfm = useVfm()

const news = ref([])
const page = ref(1)
const total = ref(1)

const perPage = NEWS_PER_PAGE

const handlePageChange = (newValue) => {
  page.value = newValue
  getNews()
}

const truncate = (text, maxLength) => {
  return text.length > maxLength ? text.slice(0, maxLength) + '…' : text
}

const formatDate = (isoDate) => {
  return new Date(isoDate).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const seeNewDetail = (activity) => {
  activityStore.setSelectedActivity(activity)
  vfm.open('newDetailModal')
}

const getNews = async () => {
  try {
    const response = await activityStore.getPublicActivities(page.value)
    if (response.status === 200) {
      news.value = response.activities.map(activity => markRaw(activity))
      total.value = response.total
    }
  } catch (error) {
    console.error(`error: ${error}`)
  }
}

onMounted(async () => getNews())
</script>

<style scoped>
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-template-rows: auto auto;
  gap: 1.5rem;
  padding: 0 10%;
  align-items: center;
}

.news-card {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.news-image {
  width: 100%;
  height: 10rem;
  object-fit: cover;
}

.news-content {
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.news-title {
  font-size: 1.2rem;
  margin-bottom: 0.125rem;
  color: #222;
}

.news-meta {
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 0.75rem;
}

.read-more-container {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.read-more {
  all: unset;
  align-self: flex-start;
  font-weight: bold;
  color: #610e0d;
  cursor: pointer;
  padding-bottom: 0.5rem;
  text-align: right;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem;
}

::v-deep(.el-pagination .el-pager .number.is-active) {
  color: #610e0d !important;
}

::v-deep(.el-pagination .el-pager .number:hover) {
  color: #610e0d !important;
}

::v-deep(.el-pagination .btn-prev:hover),
::v-deep(.el-pagination .btn-next:hover) {
  color: #610e0d !important;
}

@media (max-width: 48rem) {
  .news-grid {
    padding: 0 5%;
  }
}
</style>
