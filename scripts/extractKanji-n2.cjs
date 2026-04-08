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
    N2: [
        '並', '丸', '久', '乱', '乳', '乾', '了', '介', '仏', '令',
        '仲', '伸', '伺', '低', '依', '個', '倍', '停', '傾', '像',
        '億', '兆', '児', '党', '兵', '冊', '再', '凍', '刊', '刷',
        '券', '刺', '則', '副', '劇', '効', '勇', '募', '勢', '包',
        '匹', '区', '卒', '協', '占', '印', '卵', '厚', '双', '叫',
        '召', '史', '各', '含', '周', '咲', '喫', '営', '団', '囲',
        '固', '圧', '坂', '均', '型', '埋', '城', '域', '塔', '塗',
        '塩', '境', '央', '奥', '姓', '委', '季', '孫', '宇', '宝',
        '寺', '封', '専', '将', '尊', '導', '届', '層', '岩', '岸',
        '島', '州', '巨', '巻', '布', '希', '帯', '帽', '幅', '干',
        '幼', '庁', '床', '底', '府', '庫', '延', '弱', '律', '復',
        '快', '恋', '患', '悩', '憎', '戸', '承', '技', '担', '拝',
        '拾', '挟', '捜', '捨', '掃', '掘', '採', '接', '換', '損',
        '改', '敬', '旧', '昇', '星', '普', '暴', '曇', '替', '札',
        '机', '材', '村', '板', '林', '枚', '枝', '枯', '柔', '柱',
        '査', '栄', '根', '械', '棒', '森', '植', '極', '橋', '欧',
        '武', '歴', '殿', '毒', '比', '毛', '氷', '永', '汗', '汚',
        '池', '沈', '河', '沸', '油', '況', '泉', '泊', '波', '泥',
        '浅', '浴', '涙', '液', '涼', '混', '清', '減', '温', '測',
        '湖', '湯', '湾', '湿', '準', '溶', '滴', '漁', '濃', '濯',
        '灯', '灰', '炭', '無', '焼', '照', '燃', '燥', '爆', '片',
        '版', '玉', '珍', '瓶', '甘', '畜', '略', '畳', '療', '皮',
        '皿', '省', '県', '短', '砂', '硬', '磨', '祈', '祝', '祭',
        '禁', '秒', '移', '税', '章', '童', '競', '竹', '符', '筆',
        '筒', '算', '管', '築', '簡', '籍', '粉', '粒', '糸', '紅',
        '純', '細', '紹', '絡', '綿', '総', '緑', '線', '編', '練',
        '績', '缶', '署', '群', '羽', '翌', '耕', '肌', '肩', '肯',
        '胃', '胸', '脂', '脳', '腕', '腰', '膚', '臓', '臣', '舟',
        '航', '般', '芸', '荒', '荷', '菓', '菜', '著', '蒸', '蔵',
        '薄', '虫', '血', '衣', '袋', '被', '装', '裏', '補', '複',
        '角', '触', '訓', '設', '詞', '詰', '誌', '課', '諸', '講',
        '谷', '豊', '象', '貝', '貨', '販', '貯', '貿', '賞', '賢',
        '贈', '超', '跡', '踊', '軍', '軒', '軟', '軽', '輪', '輸',
        '辛', '農', '辺', '述', '逆', '造', '郊', '郵', '量', '針',
        '鈍', '鉄', '鉱', '銅', '鋭', '録', '門', '防', '陸', '隅',
        '階', '隻', '雇', '雲', '零', '震', '革', '順', '預', '領',
        '額', '香', '駐', '骨', '麦', '黄', '鼻', '齢',
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
