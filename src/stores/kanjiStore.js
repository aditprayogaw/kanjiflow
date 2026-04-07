import { defineStore } from 'pinia';
import { ref } from 'vue';
import { compareStrokes } from '../utils/kanjiMatcher';

export const useKanjiStore = defineStore('kanji', () => {
    const strokes = ref([]);
    const recommendations = ref([]);
    const kanjiDatabase = ref(null);
    const isDrawingMode = ref(true);
    const selectedStrokeIdFromList = ref(null);
    const selectedKanji = ref(null);

    // Memuat Database
    async function loadDatabase() {
        try {
            // Gunakan path absolut dari public folder
            const response = await fetch('/data/kanji/output/n5_complete.json');
            const data = await response.json();
            kanjiDatabase.value = data.characters;
            console.log("✅ Database N5 Terintegrasi:", Object.keys(kanjiDatabase.value).length, "Kanji");
        } catch (error) {
            console.error("❌ Gagal load database:", error);
        }
    }

    function addStroke(data) {
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

        const results = [];

        for (const [char, data] of Object.entries(kanjiDatabase.value)) {
            // Bandingkan coretan user dengan coretan di database
            const score = compareStrokes(strokes.value, data.strokes);

            if (score > 15) { // Threshold diturunkan sedikit agar lebih sensitif
                results.push({
                    char: char,
                    match: Math.round(score),
                    // SESUAIKAN: Di JSON kita pakai 'meaning' (array), ambil indeks [0]
                    meaning: data.meaning && data.meaning.length > 0 ? data.meaning[0] : "No meaning",
                    level: data.level || "N5",
                    // SESUAIKAN: Di JSON kita pakai objek 'readings'
                    onyomi: data.readings?.onyomi || "-",
                    kunyomi: data.readings?.kunyomi || "-",
                    tip: data.tip || ""
                });
            }
        }

        // Urutkan dari skor tertinggi
        recommendations.value = results.sort((a, b) => b.match - a.match);
    }

    function removeStroke(id) {
        strokes.value = strokes.value.filter(s => s.id !== id);
        recognize();
    }

    function clearAll() {
        strokes.value = [];
        recommendations.value = [];
        selectedKanji.value = null;
    }

    return {
        strokes, recommendations, kanjiDatabase, isDrawingMode,
        selectedStrokeIdFromList, selectedKanji,
        loadDatabase, addStroke, removeStroke, clearAll
    };
});