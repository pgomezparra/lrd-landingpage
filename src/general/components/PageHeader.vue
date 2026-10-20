<template>
  <section class="o-page-header">
    <div class="o-page-header__pattern" aria-hidden="true"></div>
    <div class="o-page-header__inner">
      <span v-if="eyebrow" class="o-page-header__eyebrow">{{ eyebrow }}</span>
      <h1 class="o-page-header__title">{{ title }}</h1>
      <p v-if="subtitle" class="o-page-header__subtitle">{{ subtitle }}</p>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  eyebrow: {
    type: String,
    default: ''
  }
})
</script>
