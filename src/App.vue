<template>
  <transition name="fade" mode="out-in">
    
    <LandingPage 
      v-if="currentView === 'landing'" 
      @start="currentView = 'app'" 
    />

    <MainWorkspace 
      v-else-if="currentView === 'app'" 
      @back="currentView = 'landing'"
    />

  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useKanjiStore } from './stores/kanjiStore';
import LandingPage from './views/LandingPage.vue';
import MainWorkspace from './views/MainWorkspace.vue';

const kanjiStore = useKanjiStore();
const currentView = ref('landing'); // Halaman awal selalu landing

onMounted(() => {
  // Database di-load di latar belakang agar saat masuk app sudah siap
  kanjiStore.loadAllDatabase();
});
</script>

<style>
/* Efek transisi antar halaman */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Reset CSS dasar agar landing page terlihat clean */
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
</style>