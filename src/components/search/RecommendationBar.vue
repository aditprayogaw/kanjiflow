<script setup>
import { useKanjiStore } from '../../stores/kanjiStore';
import { Trophy, Info } from 'lucide-vue-next';

const kanjiStore = useKanjiStore();

// Fungsi untuk menangani klik pada hasil prediksi
const handleSelect = (kanji) => {
    kanjiStore.selectedKanji = kanji;
};
</script>

<template>
    <div
        class="w-full bg-white/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all duration-500">
        
        <div class="flex items-center justify-between mb-6 px-2">
            <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Trophy :size="12" class="text-amber-400 shadow-sm" />
                Predicted Kanji Matches
            </h4>

            <div class="flex items-center gap-2">
                <span v-if="kanjiStore.recommendations.length > 0" class="flex h-2 w-2">
                    <span class="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span class="text-[10px] font-black text-indigo-400 uppercase tracking-wider">
                    {{ kanjiStore.recommendations.length > 0 ? 'Engine Active' : 'Waiting for Input' }}
                </span>
            </div>
        </div>

        <div class="min-h-35">
            <template v-if="kanjiStore.recommendations.length > 0">
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <div v-for="kanji in kanjiStore.recommendations" :key="kanji.char" 
                        @click="handleSelect(kanji)"
                        :class="kanjiStore.selectedKanji?.char === kanji.char ? 'border-[#4338CA] bg-indigo-50/30 ring-2 ring-indigo-50' : 'border-slate-100 bg-white'"
                        class="group relative h-32 rounded-3xl border-2 flex flex-col items-center justify-center gap-1 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        
                        <div class="absolute -top-2 -right-2 bg-[#4338CA] text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-lg z-10">
                            {{ kanji.match }}%
                        </div>

                        <span class="text-4xl font-black text-slate-800 group-hover:scale-110 transition-transform duration-300">
                            {{ kanji.char }}
                        </span>

                        <div class="flex flex-col items-center mt-1">
                            <span class="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                {{ kanji.meaning }}
                            </span>
                            <div class="flex items-center gap-1 mt-1">
                                <div :class="kanji.match > 80 ? 'bg-emerald-400' : 'bg-amber-400'"
                                    class="w-1 h-1 rounded-full"></div>
                                <span class="text-[9px] font-bold text-slate-400 italic tracking-tight">Level {{ kanji.level }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <div v-else
                class="w-full border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center py-12 bg-slate-50/50">
                <div class="text-slate-300 italic text-[10px] font-black uppercase tracking-[0.2em] text-center px-4 leading-relaxed">
                    <Info :size="16" class="mx-auto mb-2 opacity-30" />
                    Start drawing on the canvas<br>to see predictions
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    height: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 20px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
}
</style>