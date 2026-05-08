<template>
  <div class="custom-select" :class="{ 'custom-select--dark': isDarkMode }">
    <div
      class="custom-select__trigger input-height-sm"
      @click.stop="toggleDropdown"
    >
      <span class="custom-select__value">{{ selectedLabel }}</span>
      <svg class="custom-select__arrow" :class="{ 'custom-select__arrow--open': isOpen }" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6,9 12,15 18,9" />
      </svg>
    </div>
    <div v-if="isOpen" class="custom-select__dropdown" ref="dropdownRef">
      <div
        v-for="option in options"
        :key="getValue(option)"
        class="custom-select__option"
        @click.stop="selectOption(option)"
      >
        {{ getLabel(option) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePreferenceStore } from '@/admin/general/context/store/preferenceStore.js'
import { useCustomSelect } from '@/admin/shared/utils/customSelect.js'

const props = defineProps({
  modelValue: {
    type: [Number, String, Object],
    default: null
  },
  options: {
    type: Array,
    required: true
  },
  labelKey: {
    type: String,
    default: 'label'
  },
  valueKey: {
    type: String,
    default: 'value'
  },
  placeholder: {
    type: String,
    default: 'Seleccionar...'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const preferenceStore = usePreferenceStore()
const { registerDropdown, unregisterDropdown, closeAllDropdowns, handleClickOutside } = useCustomSelect()
const isOpen = ref(false)
const dropdownRef = ref(null)

const isDarkMode = computed(() => preferenceStore.theme === 'dark')

const closeThisDropdown = () => {
  isOpen.value = false
}

const getValue = (option) => {
  if (typeof option === 'object' && option !== null) {
    return option[props.valueKey]
  }
  return option
}

const getLabel = (option) => {
  if (typeof option === 'object' && option !== null) {
    return option[props.labelKey]
  }
  return option
}

const selectedLabel = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined || props.modelValue === 0) {
    return props.placeholder
  }
  const selected = props.options.find(opt => getValue(opt) === props.modelValue)
  return selected ? getLabel(selected) : props.placeholder
})

const toggleDropdown = (event) => {
  if (props.disabled) return
  event.stopPropagation()

  if (isOpen.value) {
    isOpen.value = false
    unregisterDropdown(closeThisDropdown)
  } else {
    closeAllDropdowns()
    isOpen.value = true
    registerDropdown(closeThisDropdown)
  }
}

const selectOption = (option) => {
  emit('update:modelValue', getValue(option))
  emit('change', getValue(option))
  isOpen.value = false
  unregisterDropdown(closeThisDropdown)
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  unregisterDropdown(closeThisDropdown)
  document.removeEventListener('click', handleClickOutside)
})
</script>