<template>
  <Navbar />
  <div class="l-home">
    <main>
      <info />
      <announcements />
      <highlights />
      <levels />
    </main>
    <Footer />
  </div>
  <whatsapp />
  <info-modal />
</template>

<script setup>
import Info from '@/home/components/Info.vue'
import Highlights from '@/home/components/Highlights.vue'
import Announcements from '@/home/components/Announcements.vue'
import Levels from '@/home/components/Levels.vue'
import Footer from '@/general/components/Footer.vue'
import Navbar from '@/navbar/components/NavBar.vue'
import InfoModal from '@/general/components/InfoModal.vue'
import Whatsapp from '@/general/components/Whatsapp.vue'
</script>
