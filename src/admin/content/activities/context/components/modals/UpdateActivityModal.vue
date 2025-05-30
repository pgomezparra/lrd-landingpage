<template>
  <VueFinalModal
    modal-id="updateActivityModal"
    class="confirm-modal"
    content-class="confirm-modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
    :click-to-close="false"
    :esc-to-close="false"
    @beforeOpen="beforeOpen"
    @opened="onOpened"
    @closed="onClosed"
  >
    <div>
      <p class="modal-title">Editar actividad</p>

      <div class="modal-body">
        <div class="form-group">
          <p>Título</p>
          <input
            v-model="activity.title"
            type="text"
            placeholder="Título"
            ref="title"
            @keyup.enter="focusOnDescription"
          >
        </div>
        <div class="form-group">
          <p>Descripción</p>
          <textarea
            v-model="activity.description"
            class="textAreaPayment"
            placeholder="Descripción"
            rows="3"
            ref="description"
          ></textarea>
        </div>
        <div class="form-group">
          <p>Imágenes (máx. 5)</p>
          <div class="upload-wrapper">
            <input
              ref="fileInput"
              type="file"
              multiple
              accept="image/*"
              @change="handleFileChange"
              style="display: none"
            />
            <button type="button" class="upload-btn" @click="fileInput?.click()">
              📷 Subir imágenes (máx. 5)
            </button>
          </div>
        </div>
        <div class="preview">
          <div
            v-for="(url, index) in activity.actualImages"
            :key="index"
            class="img-preview"
          >
            <img :src="url" alt="preview" />
            <button type="button" class="remove-btn" @click="removeActualImage(index)">×</button>
          </div>
          <div
            v-for="(file, index) in activity.newImages"
            :key="`${index}-new`"
            class="img-preview"
          >
            <img :src="file.preview" alt="preview" />
            <button type="button" class="remove-btn" @click="removeImage(index)">×</button>
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <button class="button-edit" @click="closeModal">Cancelar</button>
        <button class="button-edit" @click="updateActivity">Editar</button>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup>
import { useVfm, VueFinalModal } from 'vue-final-modal'
import { nextTick, reactive, ref } from 'vue'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { notifications } from '@/shared/notifications.js'
import { useActivityStore } from '@/admin/content/activities/context/store/activityStore.js'

const vfm = useVfm()
const activityStore = useActivityStore()
const preferencesStore = usePreferenceStore()

const emit = defineEmits(['refresh'])

const title = ref(null)
const description = ref(null)
const fileInput = ref(null)

const activity = reactive({
  id: '',
  title: '',
  description: '',
  actualImages: [],
  newImages: []
})


const handleFileChange = event => {
  const files = Array.from(event.target.files)

  if (files.length + activity.actualImages.length + activity.newImages.length > 5) {
    alert('Solo se permiten hasta 5 imágenes.')
    return
  }

  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = () => {
      activity.newImages.push({
        file,
        preview: reader.result
      })
    }
    reader.readAsDataURL(file)
  })

  event.target.value = ''
}

const removeActualImage = index => {
  activity.actualImages.splice(index, 1)
}

const removeImage = index => {
  activity.newImages.splice(index, 1)
}

const focusOnDescription = () => {
  description.value?.focus()
}

const beforeOpen = () => {
  clearData()
  if (!activityStore.selectedActivity) return
  activity.id = activityStore.selectedActivity.getId()
  activity.title = activityStore.selectedActivity.getTitle()
  activity.description = activityStore.selectedActivity.getDescription()
  activity.actualImages = activityStore.selectedActivity.getPhotos().map(image => (image.getUrl()))
}

const onOpened = () => {
  nextTick(() => {
    title.value?.focus()
  })
}

const clearData = () => {
  activity.id = ''
  activity.title = ''
  activity.description = ''
  activity.actualImages = []
  activity.newImages = []
}

const updateActivity = async () => {
  if (!validateData()) return

  preferencesStore.setLoading(true)
  try {
    const response = await activityStore.updateActivity(activity)
    if (response.status === 200) {
      notifications.notify('La actividad se ha actualizado correctamente', 'success')
      closeModal()
      emit('refresh')
    } else {
      notifications.notify('No se pudo actualizar la actividad', 'error')
    }
  } catch (error) {
    console.error(`error: ${error}`)
  } finally {
    preferencesStore.setLoading(false)
  }
}

const validateData = () => {
  if (activity.title === '') {
    notifications.notify('Debe ingresar el título de la actividad', 'error')
    return false
  }

  if (activity.description === '') {
    notifications.notify('Debe ingresar la descripción de la actividad', 'error')
    return false
  }

  if (activity.newImages.length === 0 && activity.actualImages.length === 0) {
    notifications.notify('Debe subir al menos una imagen', 'error')
    return false
  }

  return true
}

const onClosed = () => {
  clearData()
}

const closeModal = () => {
  vfm.close('updateActivityModal')
}

</script>

<style scoped>
.preview {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.img-preview {
  position: relative;
  width: 80px;
  height: 80px;
}

.img-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.remove-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  background: red;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-weight: bold;
  cursor: pointer;
  line-height: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.upload-wrapper {
  margin: 1rem 0;
}

.upload-btn {
  background-color: #5a5aff;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background-color 0.2s ease-in-out;
}

.upload-btn:hover {
  background-color: #4949e7;
}
</style>

