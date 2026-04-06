<script setup>
import { UserCircle } from 'lucide-vue-next';
</script>

<template>
    <header
        class="h-20 bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-30 w-full">
        <div class="flex items-center gap-3">
            <div class="hover:scale-105 transition-transform cursor-pointer flex items-center">
                <img src="/kanjiflow-logo.png" alt="KanjiFlow Logo" class="w-10 h-10 object-contain">
                <h1 class="text-2xl font-black text-[#4338CA] tracking-tight ml-1">KanjiFlow</h1>
            </div>
            <span
                class="px-2 py-0.5 bg-slate-100 text-slate-400 text-[10px] font-black rounded-md uppercase tracking-wider">V1.0.0</span>
        </div>

        <div class="flex items-center gap-8">
            <nav class="flex gap-6 text-sm font-black text-slate-400 uppercase tracking-widest">
                <a href="#" class="text-[#4338CA] border-b-2 border-[#4338CA] pb-1">Workspace</a>
                <a href="#" class="hover:text-slate-800 transition">Library</a>
                <a href="#" class="hover:text-slate-800 transition">Stats</a>
            </nav>

            <button
                class="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-sm transition-all text-slate-600 text-xs font-bold">
                <UserCircle :size="18" class="text-slate-400" />
                Guest Mode
            </button>
        </div>
    </header>
</template>