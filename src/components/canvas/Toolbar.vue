<script setup>
import { useKanjiStore } from '../../stores/kanjiStore';

const kanjiStore = useKanjiStore();
</script>

<template>
    <div class="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-2xl shadow-lg border border-slate-100 flex gap-2 z-20">
        <button @click="kanjiStore.isDrawingMode = true"
            :class="kanjiStore.isDrawingMode ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'"
            class="p-3 rounded-xl transition-all">
            🖌️ </button>
        <button @click="kanjiStore.isDrawingMode = false"
            :class="!kanjiStore.isDrawingMode ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'"
            class="p-3 rounded-xl transition-all">
            🖱️ </button>
        <div class="w-px bg-slate-100 mx-1"></div>
        <button @click="kanjiStore.clearAll()" class="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all">
            🗑️
        </button>
    </div>
</template>