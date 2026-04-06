<script setup>
import { useKanjiStore } from '../../stores/kanjiStore';
import { Trash2, Hash } from 'lucide-vue-next';

const kanjiStore = useKanjiStore();

const handleDelete = (id) => {
    kanjiStore.removeStroke(id);
};
</script>

<template>
    <div
        class="w-[320px] bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
        <div class="flex items-center justify-between mb-6 shrink-0">
            <h2 class="text-xl font-black text-slate-800 tracking-tight">Stroke Layers</h2>
            <span class="px-2.5 py-1 bg-indigo-50 text-[#4338CA] rounded-lg text-[10px] font-black uppercase">
                {{ kanjiStore.strokes.length }}
            </span>
        </div>

        <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 pb-4">
            <div v-for="(s, index) in kanjiStore.strokes" :key="s.id"
                @click="kanjiStore.selectedStrokeIdFromList = s.id" :class="kanjiStore.selectedStrokeIdFromList === s.id
                    ? 'border-indigo-400 bg-indigo-50/80 shadow-sm ring-1 ring-indigo-100'
                    : 'border-transparent bg-slate-50 hover:bg-slate-100'"
                class="group flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all cursor-pointer">
                <div class="flex items-center gap-3">
                    <div :class="kanjiStore.selectedStrokeIdFromList === s.id ? 'bg-[#4338CA] text-white' : 'bg-white text-slate-400'"
                        class="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 transition-colors">
                        <Hash :size="12" />
                    </div>
                    <div class="flex flex-col">
                        <span class="text-xs font-black text-slate-700">Stroke #{{ index + 1 }}</span>
                        <span class="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Vector Path</span>
                    </div>
                </div>

                <button @click.stop="handleDelete(s.id)"
                    class="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 :size="14" />
                </button>
            </div>

            <div v-if="kanjiStore.strokes.length === 0"
                class="py-20 text-center border-2 border-dashed border-slate-50 rounded-3xl shrink-0">
                <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-loose">
                    Draw something<br>to start
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Scrollbar tipis ala macOS */
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}
</style>