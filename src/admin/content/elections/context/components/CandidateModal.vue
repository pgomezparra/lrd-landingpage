<template>
  <VueFinalModal
    modal-id="candidateModal"
    :class="['confirm-modal', { darkMode: theme === 'dark' }]"
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
      <p class="modal-title">{{ electionsStore.selectedCandidate ? 'Editar' : 'Agregar' }} candidato</p>

      <div class="modal-body">
        <div class="form-group">
          <p>Nombre</p>
          <input
            v-model="candidate.name"
            type="text"
            placeholder="Nombre"
            ref="name"
            @keyup.enter="focusOnNumberList"
          />
        </div>
        <div class="form-group">
          <p>Número</p>
          <input
            v-model="candidate.numberList"
            type="text"
            placeholder="Número"
            ref="numberList"
            @keyup.enter="focusOnType"
          />
        </div>
        <div class="form-group">
          <p>Tipo</p>
          <select v-model="candidate.type" ref="type">
            <option
              v-for="(label, key) in CANDIDATE_TYPES"
              :key="key"
              :value="key"
            >
              {{ label }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <p>Logo</p>
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
              📷 Cargar logo
            </button>
          </div>
        </div>
        <div class="preview" v-if="candidate.logo">
          <div class="img-preview">
            <img :src="candidate.logo" alt="preview" />
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <button class="button-edit" @click="closeModal">Cancelar</button>
        <button class="button-edit" @click="actionToExecute">
          {{ electionsStore.selectedCandidate ? 'Actualizar' : 'Registrar' }}
        </button>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup>
import { useVfm, VueFinalModal } from 'vue-final-modal'
import { computed, nextTick, reactive, ref } from 'vue'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { notifications } from '@/shared/notifications.js'
import { useElectionsStore } from '@/admin/content/elections/context/store/electionsStore.js'
import { CANDIDATE_TYPES } from '@/admin/shared/constants.js'

const vfm = useVfm()
const electionsStore = useElectionsStore()
const preferencesStore = usePreferenceStore()
const theme = computed(() => preferencesStore.theme)

const emit = defineEmits(['refresh'])

const name = ref(null)
const numberList = ref(null)
const type = ref(null)
const fileInput = ref(null)

const candidate = reactive({
  id: '',
  name: '',
  type: '',
  numberList: '',
  logo: '',
  year: preferencesStore.selectedYear
})

const handleFileChange = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
  if (!allowedTypes.includes(file.type)) {
    notifications.notify('Solo se permiten imágenes JPG o PNG')
    event.target.value = ''
    return
  }

  const maxSize = 2 * 1024 * 1024
  if (file.size > maxSize) {
    notifications.notify('La imagen no puede superar 2MB')
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    candidate.logo = reader.result
  }

  reader.readAsDataURL(file)

  event.target.value = ''
}

const focusOnNumberList = () => {
  numberList.value?.focus()
}

const focusOnType = () => {
  type.value?.focus()
}

const beforeOpen = () => {
  clearData()
  if (!electionsStore.selectedCandidate) return
  candidate.id = electionsStore.selectedCandidate.getId()
  candidate.name = electionsStore.selectedCandidate.getName()
  candidate.type = electionsStore.selectedCandidate.getType()
  candidate.numberList = electionsStore.selectedCandidate.getNumberList()
  candidate.logo = electionsStore.selectedCandidate.getLogo()
}

const onOpened = () => {
  nextTick(() => {
    name.value?.focus()
  })
}

const clearData = () => {
  candidate.id = ''
  candidate.name = ''
  candidate.type = ''
  candidate.numberList = ''
  candidate.logo = ''
}

const actionToExecute = async () => {
  if (!validateData()) return

  if (electionsStore.selectedCandidate) {
    await updateCandidate()
  } else {
    await registerCandidate()
  }
}

const registerCandidate = async () => {
  preferencesStore.setLoading(true)
  try {
    const response = await electionsStore.saveCandidate(candidate)
    if (response.status === 201) {
      notifications.notify('El candidato se ha registrado correctamente', 'success')
      closeModal()
      emit('refresh')
    } else {
      notifications.notify('No se pudo registrar el candidato', 'error')
    }
  } catch (error) {
    console.error(`error: ${error}`)
  } finally {
    preferencesStore.setLoading(false)
  }
}

const updateCandidate = async () => {
  preferencesStore.setLoading(true)
  try {
    const response = await electionsStore.updateCandidate(candidate)
    if (response.status === 200) {
      notifications.notify('El candidato se ha actualizado correctamente', 'success')
      closeModal()
      emit('refresh')
    } else {
      notifications.notify('No se pudo actualizar el candidato', 'error')
    }
  } catch (error) {
    console.error(`error: ${error}`)
  } finally {
    preferencesStore.setLoading(false)
  }
}

const validateData = () => {
  if (candidate.name === '') {
    notifications.notify('Debe ingresar el nombre del candidato', 'error')
    return false
  }

  if (candidate.numberList === '') {
    notifications.notify('Debe ingresar el número del candidato', 'error')
    return false
  }

  if (candidate.type === '') {
    notifications.notify('Debe seleccionar el tipo del candidato', 'error')
    return false
  }

  if (candidate.logo === '') {
    notifications.notify('Debe subir al menos una imagen', 'error')
    return false
  }

  return true
}

const onClosed = () => {
  electionsStore.setSelectedCandidate(null)
  clearData()
}

const closeModal = () => {
  vfm.close('candidateModal')
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
