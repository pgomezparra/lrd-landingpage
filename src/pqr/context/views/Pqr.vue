<template>
  <div class="l-pqr">
    <main>
      <div class="l-pqr__container">
        <h1 class="l-pqr__container__title">Peticiones, Quejas y Reclamos</h1>
        <section class="o-pqr-form">
          <span>Nombre completo</span>
          <input v-model="form.name" type="text" placeholder="Ingrese su nombre completo" />

          <span>Correo electrónico</span>
          <input v-model="form.email" type="text" placeholder="Ingrese su correo electrónico" />

          <span>Su petición, queja o reclamo</span>
          <textarea v-model="form.message" rows="5" placeholder="Escriba aquí su PQR"></textarea>

          <p v-if="error" class="o-pqr-form__message">{{ error }}</p>
          <p v-if="success" class="o-pqr-form__message">{{ success }}</p>
          <button @click="createPqr">Enviar PQR</button>
        </section>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Footer from '@/general/components/Footer.vue'
import { usePqrStore } from '@/pqr/context/store/pqrStore.js'

const pqrStore = usePqrStore()

const form = ref({
  name: '',
  email: '',
  message: ''
})

const error = ref('')
const success = ref('')

const createPqr = async () => {
  if (!form.value.name || !form.value.email || !form.value.message) {
    error.value = 'Por favor complete todos los campos.'
    success.value = ''
    return
  }

  try {
    error.value = ''
    const successResponse = await pqrStore.createPqr(form.value.name, form.value.email, form.value.message)
    if (successResponse) {
      success.value = 'PQR enviada con éxito.'
      form.value = { name: '', email: '', message: '' }
    } else error.value = 'Ocurrió un error al enviar la PQR. Por favor, intente de nuevo.'
  } catch (err) {
    error.value = 'Ocurrió un error al enviar la PQR. Por favor, intente de nuevo.'
    success.value = ''
  }
}
</script>