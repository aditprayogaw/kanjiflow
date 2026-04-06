import { defineStore } from 'pinia';
import { ref } from 'vue';
import { normalizeStroke } from '../utils/kanjiNormalizer';
import { compareStrokes } from '../utils/kanjiMatcher';

export const useKanjiStore = defineStore('kanji', () => {
    const strokes = ref([]);
    const recommendations = ref([]);
    const kanjiDatabase = ref(null);
    const isDrawingMode = ref(true);
    const selectedStrokeIdFromList = ref(null);
    const selectedKanji = ref(null);

    // Memuat Database dari Public Folder
    async function loadDatabase() {
        try {
            const response = await fetch('/data/kanji_sample.json');
            if (!response.ok) throw new Error("Database file not found");
            kanjiDatabase.value = await response.json();
            console.log("✅ Database Loaded:", kanjiDatabase.value);
        } catch (error) {
            console.error("❌ Failed to load database:", error);
        }
    }

    // Dipanggil setiap kali user selesai menarik garis di CanvasBoard
    function addStroke(data) {
        console.log("🖊️ New stroke detected. ID:", data.id);

        // data.points sudah dinormalisasi dari CanvasBoard
        strokes.value.push({
            id: data.id,
            points: data.points
        });

        recognize();
    }

    function recognize() {
        if (!kanjiDatabase.value || strokes.value.length === 0) {
            recommendations.value = [];
            return;
        }

        console.log("🧠 Engine: Analyzing strokes...");
        const results = [];

        for (const [char, data] of Object.entries(kanjiDatabase.value)) {
            const score = compareStrokes(strokes.value, data.strokes);

            console.log(`- Comparing with ${char}: Score ${score}`);

            // Threshold: Hanya tampilkan jika skor di atas 20%
            if (score > 20) {
                results.push({
                    char: char,
                    match: score,
                    meaning: data.meanings ? data.meanings[0] : "Unknown",
                    level: data.level || "N/A",
                    onyomi: data.onyomi || "-",
                    kunyomi: data.kunyomi || "-"
                });
            }
        }

        // Urutkan dari skor tertinggi
        recommendations.value = results.sort((a, b) => b.match - a.match);
        console.log("✨ Recommendations updated:", recommendations.value.length, "items found.");
    }

    function removeStroke(id) {
        strokes.value = strokes.value.filter(s => s.id !== id);
        recognize(); // Update ulang prediksi setelah hapus garis
    }

    function clearAll() {
        strokes.value = [];
        recommendations.value = [];
        selectedKanji.value = null;
        console.log("🧹 Canvas & Store Cleared");
    }

    return {
        strokes, recommendations, kanjiDatabase, isDrawingMode,
        selectedStrokeIdFromList, selectedKanji,
        loadDatabase, addStroke, removeStroke, clearAll
    };
});