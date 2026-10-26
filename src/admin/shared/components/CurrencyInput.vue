<template>
  <div class="currency-input">
    <span class="currency-input__symbol" aria-hidden="true">$</span>
    <input
      class="currency-input__field"
      ref="inputRef"
      type="text"
      inputmode="numeric"
      autocomplete="off"
      :value="formattedValue"
      :disabled="disabled"
      :placeholder="placeholder"
      @input="onInput"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: 0
  },
  placeholder: {
    type: String,
    default: '0'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const inputRef = ref(null)

const focus = () => inputRef.value?.focus()

defineExpose({ focus })

const formatValue = (value) => {
  const number = Number(value)
  return (Number.isFinite(number) ? Math.trunc(number) : 0).toLocaleString('es-CO')
}

const formattedValue = computed(() => formatValue(props.modelValue))

const onInput = (event) => {
  const digits = event.target.value.replace(/\D/g, '').slice(0, 10)
  const value = digits ? Number(digits) : 0

  event.target.value = formatValue(value)
  emit('update:modelValue', value)
}
</script>
