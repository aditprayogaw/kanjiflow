<script setup>
import { useKanjiStore } from '../../stores/kanjiStore';
import { Zap, BookOpen } from 'lucide-vue-next';

const kanjiStore = useKanjiStore();
</script>

<template>
    <aside class="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
        <template v-if="kanjiStore.selectedKanji">
            <div class="text-center mb-10 shrink-0">
                <h3 class="text-8xl font-black text-slate-800 mb-4">{{ kanjiStore.selectedKanji.char }}</h3>
                <span
                    class="px-4 py-1.5 bg-indigo-50 text-[#4338CA] rounded-full text-[10px] font-black tracking-widest uppercase">
                    Level {{ kanjiStore.selectedKanji.level }} Kanji
                </span>
            </div>

            <div class="space-y-8 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <section>
                    <h4 class="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-2">Meaning</h4>
                    <p class="text-xl font-bold text-slate-700">{{ kanjiStore.selectedKanji.meaning }}</p>
                </section>

                <div class="grid grid-cols-2 gap-6">
                    <section>
                        <h4 class="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-2">Onyomi</h4>
                        <p class="text-sm font-bold text-slate-600">{{ kanjiStore.selectedKanji.onyomi }}</p>
                    </section>
                    <section>
                        <h4 class="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-2">Kunyomi</h4>
                        <p class="text-sm font-bold text-slate-600">{{ kanjiStore.selectedKanji.kunyomi }}</p>
                    </section>
                </div>

                <div class="bg-indigo-50/40 p-6 rounded-3xl border border-indigo-100/50">
                    <div
                        class="flex items-center gap-2 text-[#4338CA] mb-3 font-black text-[10px] uppercase tracking-wider">
                        <Zap :size="14" fill="currentColor" /> Precision Tip
                    </div>
                    <p class="text-xs text-indigo-900/60 leading-relaxed italic">
                        {{ kanjiStore.selectedKanji.tip || "Draw carefully to match the stroke proportions." }}
                    </p>
                </div>
            </div>

            <button
                class="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#4338CA] transition-all shadow-lg">
                Add to Collection
            </button>
        </template>

        <div v-else class="flex-1 flex flex-col items-center justify-center text-center">
            <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <BookOpen class="text-slate-200" :size="32" />
            </div>
            <p class="text-sm font-bold text-slate-300 uppercase tracking-widest">Select a Kanji<br>to see details</p>
        </div>
    </aside>
</template>