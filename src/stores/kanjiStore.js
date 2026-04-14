import { defineStore } from 'pinia';
import { ref } from 'vue';
import { compareStrokes } from '../utils/kanjiMatcher';

export const useKanjiStore = defineStore('kanji', () => {
    const strokes = ref([]);
    const recommendations = ref([]);

    const kanjiDatabase = ref({});
    const strokeIndex = ref({}); // 🔥 INDEXING

    const selectedKanji = ref(null);

    // =========================
    // 🚀 LOAD ALL DATABASE
    // =========================
    async function loadAllDatabase() {
        try {
            const levels = ['n5', 'n4', 'n3', 'n2', 'n1'];
            let combined = {};

            for (const level of levels) {
                const res = await fetch(`/data/kanji/output/${level}_complete.json`);
                const data = await res.json();

                combined = { ...combined, ...data.characters };
            }

            kanjiDatabase.value = combined;

            console.log("✅ Total Kanji:", Object.keys(combined).length);

            // 🔥 Build index setelah load
            buildIndex(combined);

        } catch (error) {
            console.error("❌ Gagal load database:", error);
        }
    }

    // =========================
    // 🔥 BUILD INDEX (PENTING)
    // =========================
    function buildIndex(data) {
        const index = {};

        for (const [char, d] of Object.entries(data)) {
            const count = d.strokes.length;

            if (!index[count]) index[count] = [];

            index[count].push({
                char,
                data: d
            });
        }

        strokeIndex.value = index;

        console.log("⚡ Index siap:", Object.keys(index).length, "stroke groups");
    }

    // =========================
    // ✍️ TAMBAH STROKE
    // =========================
    function addStroke(data) {
        strokes.value.push({
            id: data.id,
            points: data.points
        });

        recognize();
    }

    // =========================
    // 🧠 RECOGNITION ENGINE
    // =========================
    function recognize() {
        if (strokes.value.length === 0) {
            recommendations.value = [];
            return;
        }

        const inputCount = strokes.value.length;

        // 🔥 Ambil kandidat dari index (±2 stroke)
        const candidates = [];

        for (let i = inputCount - 2; i <= inputCount + 2; i++) {
            if (strokeIndex.value[i]) {
                candidates.push(...strokeIndex.value[i]);
            }
        }

        const results = [];

        for (const item of candidates) {
            const score = compareStrokes(strokes.value, item.data.strokes);

            if (score > 15) {
                results.push({
                    char: item.char,
                    match: Math.round(score),
                    meaning: item.data.meaning?.[0] || "No meaning",
                    level: item.data.level || "-",
                    onyomi: item.data.readings?.onyomi || "-",
                    kunyomi: item.data.readings?.kunyomi || "-"
                });
            }
        }

        // 🔥 Ambil TOP 5
        recommendations.value = results
            .sort((a, b) => b.match - a.match)
            .slice(0, 5);
    }

    // =========================
    // ❌ HAPUS STROKE
    // =========================
    function removeStroke(id) {
        strokes.value = strokes.value.filter(s => s.id !== id);
        recognize();
    }

    // =========================
    // 🧹 CLEAR
    // =========================
    function clearAll() {
        strokes.value = [];
        recommendations.value = [];
        selectedKanji.value = null;
    }

    return {
        strokes,
        recommendations,
        kanjiDatabase,
        strokeIndex,
        selectedKanji,

        loadAllDatabase,
        addStroke,
        removeStroke,
        clearAll
    };
});