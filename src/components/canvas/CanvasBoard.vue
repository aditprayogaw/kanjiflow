<script setup>
import { onMounted, ref, watch } from 'vue';
import * as fabric from 'fabric';
import { useKanjiStore } from '../../stores/kanjiStore';
import { Pencil, MousePointer2, Eraser, RotateCcw } from 'lucide-vue-next';

const kanjiStore = useKanjiStore();
const canvasRef = ref(null);
let canvas = null;

onMounted(() => {
    kanjiStore.isDrawingMode = true;

    canvas = new fabric.Canvas(canvasRef.value, {
        isDrawingMode: true,
        width: 450,
        height: 450,
        backgroundColor: '#ffffff',
        selectionColor: 'rgba(67, 56, 202, 0.05)',
        selectionBorderColor: '#4338CA',
        selectionLineWidth: 1
    });

    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.width = 5;
    canvas.freeDrawingBrush.color = '#1e293b';

    canvas.on('path:created', (e) => {
        const path = e.path;
        const id = Date.now();

        path.set({
            id: id,
            selectable: false, // Default false agar tidak ganggu saat menggambar
            evented: false,    // Default false
            hasControls: true,
            cornerColor: '#4338CA',
            cornerStyle: 'circle',
            cornerSize: 8,
            transparentCorners: false,
            borderColor: '#4338CA',
        });

        // PENTING: Kirim data yang dibutuhkan Store
        kanjiStore.addStroke({
            id: id,
            pathData: path.path,
            fabricObject: path
        });
    });

    // Sinkronisasi Seleksi (Canvas -> Store)
    const updateSelection = (e) => {
        const selected = e.selected?.[0] || e.target;
        if (selected?.id) kanjiStore.selectedStrokeIdFromList = selected.id;
    };

    canvas.on('selection:created', updateSelection);
    canvas.on('selection:updated', updateSelection);
    canvas.on('selection:cleared', () => {
        kanjiStore.selectedStrokeIdFromList = null;
    });
});

// Watcher: Pencil vs Select Mode
watch(() => kanjiStore.isDrawingMode, (val) => {
    if (!canvas) return;
    canvas.isDrawingMode = val;

    if (val) {
        canvas.discardActiveObject();
        canvas.getObjects().forEach(obj => {
            obj.set({ selectable: false, evented: false });
        });
    } else {
        canvas.getObjects().forEach(obj => {
            obj.set({ selectable: true, evented: true });
        });
    }
    canvas.renderAll();
});

// Watcher: Hapus dari Sidebar (Sidebar -> Canvas)
watch(() => kanjiStore.strokes, (newStrokes) => {
    if (!canvas) return;
    const canvasObjects = canvas.getObjects();
    const storeIds = newStrokes.map(s => s.id);

    canvasObjects.forEach(obj => {
        if (obj.id && !storeIds.includes(obj.id)) {
            canvas.remove(obj);
        }
    });
    canvas.renderAll();
}, { deep: true });

// Watcher: Pilih dari Sidebar (Sidebar -> Canvas Highlight)
watch(() => kanjiStore.selectedStrokeIdFromList, (newId) => {
    if (!canvas || kanjiStore.isDrawingMode) return;
    const obj = canvas.getObjects().find(o => o.id === newId);
    if (obj) {
        canvas.setActiveObject(obj);
        canvas.renderAll();
    }
});

const deleteSelected = () => {
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length) {
        activeObjects.forEach(obj => kanjiStore.removeStroke(obj.id));
        canvas.discardActiveObject();
    }
};

const clearCanvas = () => {
    if (canvas) {
        canvas.clear();
        canvas.backgroundColor = '#ffffff';
        kanjiStore.clearAll();
    }
};
</script>

<template>
    <div class="flex flex-col items-center w-full">
        <div
            class="relative bg-white p-1 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100">
            <canvas ref="canvasRef" class="rounded-4xl"></canvas>

            <div
                class="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-slate-200/50 z-20">
                <button @click="kanjiStore.isDrawingMode = true"
                    :class="kanjiStore.isDrawingMode ? 'bg-[#4338CA] text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:text-slate-600'"
                    class="p-2.5 rounded-xl transition-all duration-200">
                    <Pencil :size="18" :stroke-width="2.5" />
                </button>

                <button @click="kanjiStore.isDrawingMode = false"
                    :class="!kanjiStore.isDrawingMode ? 'bg-[#4338CA] text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:text-slate-600'"
                    class="p-2.5 rounded-xl transition-all duration-200">
                    <MousePointer2 :size="18" :stroke-width="2.5" />
                </button>

                <div class="w-px h-6 bg-slate-100 mx-1"></div>

                <button @click="deleteSelected" class="p-2.5 text-slate-400 hover:text-red-500 transition-colors"
                    title="Hapus yang dipilih">
                    <Eraser :size="18" :stroke-width="2.5" />
                </button>

                <button @click="clearCanvas" class="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Reset Kanvas">
                    <RotateCcw :size="18" :stroke-width="2.5" />
                </button>
            </div>
        </div>

        <p class="mt-4 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
            Precision Vector Ink
        </p>
    </div>
</template>