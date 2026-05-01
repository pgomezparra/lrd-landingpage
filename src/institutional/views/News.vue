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
      class="o-news-public__pagination"
    />
    <div class="o-news-public__grid">
      <div v-for="activity in news" :key="activity.getId()" class="o-news-public__card">
        <img :src="activity.getPhotos()[0].getUrl()" alt="Imagen de la noticia" class="o-news-public__image" />
        <div class="o-news-public__content">
          <h2 class="o-news-public__title">{{ activity.getTitle() }}</h2>
          <p class="o-news-public__meta">
            <span>{{ formatDate(activity.getUpdatedAt()) }}</span> · <span>{{ activity.getAuthor() }}</span>
          </p>
          <div class="o-news-public__read-more-container">
            <button class="o-news-public__read-more" @click="seeNewDetail(activity)">
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


