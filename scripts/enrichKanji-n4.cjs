const axios = require('axios');
const fs = require('fs-extra');

// Sesuaikan path ke file hasil ekstraksi tadi
const INPUT_PATH = './public/data/kanji/kanji_N4.json';
const OUTPUT_PATH = './public/data/kanji/output/n4_complete.json';

async function enrich() {
    try {
        const rawData = await fs.readJson(INPUT_PATH);
        const characters = rawData.characters;
        const kanjiList = Object.keys(characters);
        const enrichedDb = {};

        console.log(`\n✨ Sinkronisasi data untuk ${kanjiList.length} Kanji...`);

        for (const char of kanjiList) {
            try {
                // TAMBAHKAN HEADER DI SINI AGAR TIDAK KENA 403
                const response = await axios.get(`https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(char)}`, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.1'
                    }
                });

                const data = response.data.data[0];

                if (data) {
                    const meaning = data.senses[0].english_definitions;
                    const reading = data.japanese[0].reading || "";

                    enrichedDb[char] = {
                        ...characters[char],
                        meaning: [meaning[0]],
                        readings: {
                            onyomi: "Check Dictionary",
                            kunyomi: reading
                        },
                        tip: `The kanji '${char}' means ${meaning[0]}.`
                    };
                    console.log(`✅ Sinkron: ${char} (${meaning[0]})`);
                }

                // Jeda sedikit lebih lama (800ms) agar lebih aman dari blokir
                await new Promise(resolve => setTimeout(resolve, 800));

            } catch (err) {
                console.error(`❌ Gagal sinkron ${char}: ${err.message}`);
                enrichedDb[char] = characters[char];
            }
        }

        await fs.outputJson(OUTPUT_PATH, {
            ...rawData,
            characters: enrichedDb
        }, { spaces: 2 });

        console.log(`\n🏆 BERHASIL! Database lengkap siap digunakan.`);
        console.log(`📂 Lokasi: ${OUTPUT_PATH}`);

    } catch (error) {
        console.error("❌ Error Fatal:", error.message);
    }
}

enrich();