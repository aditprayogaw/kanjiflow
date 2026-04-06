<script setup>
import { LayoutGrid, History, Star, Settings } from 'lucide-vue-next';
</script>

<template>
    <aside
        class="w-20 bg-white border-r border-slate-100 flex flex-col items-center py-8 gap-10 sticky top-0 h-screen shrink-0 z-40">
        <div class="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-[#4338CA] shadow-sm">
            <LayoutGrid :size="24" :stroke-width="2.5" />
        </div>

        <div class="flex flex-col gap-8 text-slate-300 flex-1 mt-4">
            <button class="hover:text-[#4338CA] hover:bg-indigo-50 p-2 rounded-xl transition-all duration-200">
                <History :size="24" />
            </button>
            <button class="hover:text-[#4338CA] hover:bg-indigo-50 p-2 rounded-xl transition-all duration-200">
                <Star :size="24" />
            </button>
        </div>

        <button
            class="text-slate-300 hover:text-slate-500 p-2 hover:bg-slate-50 rounded-xl transition-all duration-200">
            <Settings :size="24" />
        </button>
    </aside>
</template>