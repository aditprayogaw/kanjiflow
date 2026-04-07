'use strict';

/**
 * KanjiFlow - KanjiVG Extractor
 * Ekstraksi massal XML KanjiVG ke JSON berdasarkan level JLPT.
 *
 * Usage:
 *   node scripts/extractKanji.cjs
 *
 * Output:
 *   ./output/kanji_N5.json, kanji_N4.json, ..., kanji_N1.json
 *
 * Dependencies:
 *   npm install fast-xml-parser fs-extra
 */

const { XMLParser } = require('fast-xml-parser');
const fs = require('fs-extra');
const path = require('path');

// ---------------------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------------------

const INPUT_FILE = path.resolve('./scripts/kanjivg.xml');
const OUTPUT_DIR = path.resolve('./public/data/kanji');

// ---------------------------------------------------------------------------
// JLPT CHARACTER LISTS
// Ganti/tambah karakter sesuai kebutuhan.
// ---------------------------------------------------------------------------

const JLPT_LISTS = {
    N5: [
        '一', '七', '万', '三', '上', '下', '中', '九', '二', '五',
        '人', '今', '休', '何', '先', '入', '八', '六', '円', '出',
        '分', '前', '北', '十', '千', '午', '半', '南', '友', '右',
        '名', '四', '国', '土', '外', '大', '天', '女', '子', '学',
        '小', '山', '川', '左', '年', '後', '日', '時', '書', '月',
        '木', '本', '来', '东', '校', '母', '毎', '気', '水', '火',
        '父', '生', '男', '白', '百', '聞', '行', '西', '見', '話',
        '語', '読', '車', '金', '長', '間', '雨', '電', '食', '高',
    ]
};

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

/**
 * Rekursif: kumpulkan semua `d` attribute dari semua <path> dalam node
 * Urutan sesuai kemunculan di XML (depth-first).
 */
function collectPaths(node) {
    const strokes = [];

    if (!node || typeof node !== 'object') return strokes;

    // Jika node ini adalah array (fast-xml-parser menghasilkan array jika >1 sibling)
    if (Array.isArray(node)) {
        for (const child of node) {
            strokes.push(...collectPaths(child));
        }
        return strokes;
    }

    // Ambil 'd' jika ada (ini adalah <path>)
    if (node[':@'] && node[':@']['@_d']) {
        strokes.push(node[':@']['@_d']);
    } else if (node['@_d']) {
        strokes.push(node['@_d']);
    }

    // Rekursi ke child <path> dan <g>
    if (node.path) strokes.push(...collectPaths(node.path));
    if (node.g) strokes.push(...collectPaths(node.g));

    return strokes;
}

/**
 * Dari node <kanji>, cari elemen karakter (kvg:element) dan kumpulkan strokes.
 * Mengembalikan { char, strokes } atau null jika tidak ditemukan.
 */
function extractFromKanjiNode(kanjiNode) {
    // Struktur fast-xml-parser dengan attributeNamePrefix '@_':
    // kanjiNode = { '@_id': 'kvg:kanji_XXXX', g: { '@_kvg:element': '日', path: [...], g: [...] } }

    let gNode = kanjiNode.g;
    if (!gNode) return null;

    // Kadang gNode bisa array jika ada beberapa <g> di level atas
    if (Array.isArray(gNode)) gNode = gNode[0];

    const char = gNode['@_kvg:element'] || gNode['@_element'] || null;
    if (!char) return null;

    const strokes = collectPaths(gNode);

    return { char, strokes };
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------

async function main() {
    console.log('╔══════════════════════════════════════╗');
    console.log('║   KanjiFlow — KanjiVG XML Extractor  ║');
    console.log('╚══════════════════════════════════════╝\n');

    // 1. Baca file XML
    if (!await fs.pathExists(INPUT_FILE)) {
        console.error(`❌ File tidak ditemukan: ${INPUT_FILE}`);
        console.error('   Pastikan kanjivg.xml berada di folder ./scripts/');
        process.exit(1);
    }

    console.log(`📂 Membaca file: ${INPUT_FILE}`);
    const xmlContent = await fs.readFile(INPUT_FILE, 'utf-8');
    console.log(`   Ukuran file: ${(xmlContent.length / 1024 / 1024).toFixed(2)} MB\n`);

    // 2. Parse XML sekali ke memori
    console.log('⚙️  Parsing XML...');
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        // Agar sibling tag dengan nama sama dijadikan array
        isArray: (tagName) => ['kanji', 'g', 'path'].includes(tagName),
    });

    const parsed = parser.parse(xmlContent);
    const kanjiNodes = parsed?.kanjivg?.kanji;

    if (!kanjiNodes || kanjiNodes.length === 0) {
        console.error('❌ Tidak ada node <kanji> ditemukan. Periksa struktur XML.');
        process.exit(1);
    }

    console.log(`   ✅ Total node <kanji> di XML: ${kanjiNodes.length.toLocaleString()}\n`);

    // 3. Build lookup map: char → strokes  (parse sekali, query cepat)
    console.log('🗂️  Membangun lookup map karakter...');
    const charMap = new Map(); // Map<char, string[]>

    for (const kanjiNode of kanjiNodes) {
        const result = extractFromKanjiNode(kanjiNode);
        if (result && result.strokes.length > 0) {
            // Jika karakter muncul lebih dari sekali, ambil yang pertama
            if (!charMap.has(result.char)) {
                charMap.set(result.char, result.strokes);
            }
        }
    }

    console.log(`   ✅ Total karakter unik di map: ${charMap.size.toLocaleString()}\n`);

    // 4. Pastikan output dir ada
    await fs.ensureDir(OUTPUT_DIR);

    // 5. Proses setiap level JLPT
    for (const [level, charList] of Object.entries(JLPT_LISTS)) {
        console.log(`━━━ Level ${level} (${charList.length} karakter target) ${'━'.repeat(30)}`);

        const output = {
            level,
            characters: {},
        };

        let found = 0;
        let notFound = 0;
        const missing = [];

        for (const char of charList) {
            const strokes = charMap.get(char);
            if (strokes) {
                output.characters[char] = {
                    strokes,
                    meanings: ['Pending Sync'],
                    readings: { onyomi: [], kunyomi: [] },
                };
                found++;
                process.stdout.write(`  ✔ ${char} (${strokes.length} strokes)  `);
            } else {
                notFound++;
                missing.push(char);
            }
        }

        console.log('\n');

        // Summary per level
        console.log(`  📊 Ditemukan : ${found} / ${charList.length}`);
        if (missing.length > 0) {
            console.log(`  ⚠️  Tidak ada : ${missing.join('  ')}`);
        }

        // Tulis JSON
        const outFile = path.join(OUTPUT_DIR, `kanji_${level}.json`);
        await fs.writeJson(outFile, output, { spaces: 2 });
        console.log(`  💾 Disimpan  : ${outFile}\n`);
    }

    console.log('╔══════════════════════════════════════╗');
    console.log('║         Ekstraksi Selesai! ✅         ║');
    console.log('╚══════════════════════════════════════╝');
}

main().catch(err => {
    console.error('\n❌ Fatal error:', err.message);
    process.exit(1);
});
