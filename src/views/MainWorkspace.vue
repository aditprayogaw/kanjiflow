<script setup>
import SidebarNav from '../components/layout/SidebarNav.vue';
import HeaderApp from '../components/layout/HeaderApp.vue';
import FooterApp from '../components/layout/FooterApp.vue';
import StrokeLayers from '../components/canvas/StrokeLayers.vue';
import CanvasBoard from '../components/canvas/CanvasBoard.vue';
import RecommendationBar from '../components/search/RecommendationBar.vue';
import KanjiDetail from '../components/search/KanjiDetail.vue';

import { onMounted } from 'vue';
import { useKanjiStore } from '../stores/kanjiStore';

const kanjiStore = useKanjiStore();

onMounted(async () => {
    await kanjiStore.loadDatabase();
});
</script>

<template>
    <div class="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-900">

        <SidebarNav />

        <div class="flex-1 flex flex-col min-w-0">
            <HeaderApp />

            <main class="flex-1 p-6 grid grid-cols-[320px_1fr_340px] gap-6 items-start">
                <div class="h-[calc(100vh-200px)] sticky top-28">
                    <StrokeLayers />
                </div>

                <div class="flex flex-col gap-6">
                    <div
                        class="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-center min-h-125">
                        <CanvasBoard />
                    </div>
                    <RecommendationBar />
                </div>

                <KanjiDetail class="sticky top-24" />
            </main>

            <FooterApp />
        </div>
    </div>
</template>