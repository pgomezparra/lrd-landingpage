<template>
  <div class="l-standard">
    <div class="l-standard-title">
      <p>Tarifas escolares</p>
      <p class="l-standard-title__text">
        Configuración de valores de matrícula y pensión
      </p>
    </div>
    <div class="l-standard-payment-values-buttons">
      <button class="l-standard-payment-values-buttons__button" @click="updateValues">Guardar valores</button>
    </div>
    <div class="l-standard-container-payments">
      <table class="o-payment-values-table">
        <thead>
        <tr>
          <th>Grado</th>
          <th>Matrícula</th>
          <th>Pensión</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(value, index) in values" :key="value.gradeId">
          <td>{{ value.grade }}</td>
          <td><input class="o-payment-values-table__input" type="text" inputmode="numeric" v-model="values[index].registration" /></td>
          <td><input class="o-payment-values-table__input" type="text" inputmode="numeric" v-model="values[index].pension" /></td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { onMounted, reactive, watch } from 'vue'

const preferenceStore = usePreferenceStore()

const values = reactive([])

watch(() => preferenceStore.grades, async () => {
  await setInitialValues()
})

watch(() => preferenceStore.selectedYear, async () => {
  await setInitialValues()
})

const updateValues = async () => {
  preferenceStore.setLoading(true)
  try {
    await preferenceStore.savePaymentValues(values)
  } catch (error) {
    console.error(`error: ${error}`)
  } finally {
    preferenceStore.setLoading(false)
  }
}

const setInitialValues = async () => {
  values.splice(0, values.length)

  const paymentValues = await preferenceStore.getPaymentValues(0, preferenceStore.selectedYear)

  paymentValues.forEach(value => {
    const grade = preferenceStore.grades.find(grade => grade.getId() === value.getGradeId())
    values.push({
      gradeId: value.getGradeId(),
      registration: value.getRegistration(),
      pension: value.getPension(),
      year: preferenceStore.selectedYear,
      grade: grade.getGrade()
    })
  })
}

onMounted(async () => {
  if (preferenceStore.grades.length === 0) return
  await setInitialValues()
})
</script>
