<template>
  <div class="app-layout">
    <!-- Menú lateral -->
    <sidebar />

    <!-- Contenedor dinámico -->
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Sidebar from '@/admin/views/Sidebar.vue'

</script>
