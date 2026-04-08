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
    N3: [
        '与', '両', '乗', '予', '争', '互', '亡', '交', '他', '付',
        '件', '任', '伝', '似', '位', '余', '例', '供', '便', '係',
        '信', '倒', '候', '値', '偉', '側', '偶', '備', '働', '優',
        '光', '全', '共', '具', '内', '冷', '処', '列', '初', '判',
        '利', '到', '制', '刻', '割', '加', '助', '努', '労', '務',
        '勝', '勤', '化', '単', '危', '原', '参', '反', '投', '取',
        '受', '可', '号', '合', '向', '君', '否', '吸', '吹', '告',
        '呼', '命', '和', '商', '喜', '回', '因', '困', '園', '在',
        '報', '増', '声', '変', '夢', '太', '夫', '失', '好', '妻',
        '娘', '婚', '婦', '存', '宅', '守', '完', '官', '定', '実',
        '客', '害', '容', '宿', '寄', '富', '寒', '寝', '察', '対',
        '局', '居', '差', '市', '師', '席', '常', '平', '幸', '幾',
        '座', '庭', '式', '引', '当', '形', '役', '彼', '徒', '得',
        '御', '必', '忘', '忙', '念', '怒', '怖', '性', '恐', '恥',
        '息', '悲', '情', '想', '愛', '感', '慣', '成', '戦', '戻',
        '所', '才', '打', '払', '投', '折', '抜', '抱', '押', '招',
        '指', '捕', '掛', '探', '支', '放', '政', '敗', '散', '数',
        '断', '易', '昔', '昨', '晩', '景', '晴', '暗', '暮', '曲',
        '更', '最', '望', '期', '未', '末', '束', '杯', '果', '格',
        '構', '様', '権', '横', '機', '欠', '次', '欲', '歯', '歳',
        '残', '段', '殺', '民', '求', '決', '治', '法', '泳', '洗',
        '活', '流', '浮', '消', '深', '済', '渡', '港', '満', '演',
        '点', '然', '煙', '熱', '犯', '状', '猫', '王', '現', '球',
        '産', '由', '申', '留', '番', '疑', '疲', '痛', '登', '皆',
        '盗', '直', '相', '眠', '石', '破', '確', '示', '礼', '祖',
        '神', '福', '科', '程', '種', '積', '突', '窓', '笑', '等',
        '箱', '米', '精', '約', '組', '経', '給', '絵', '絶', '続',
        '緒', '罪', '置', '美', '老', '耳', '職', '育', '背', '能',
        '腹', '舞', '船', '良', '若', '苦', '草', '落', '葉', '薬',
        '術', '表', '要', '規', '覚', '観', '解', '記', '訪', '許',
        '認', '誤', '説', '調', '談', '論', '識', '警', '議', '負',
        '財', '貧', '責', '費', '資', '新', '越', '路', '身', '辞',
        '込', '迎', '返', '迷', '追', '退', '逃', '途', '速', '連',
        '進', '遅', '遊', '過', '達', '違', '遠', '適', '選', '部',
        '都', '配', '酒', '閉', '関', '阪', '降', '限', '除', '険',
        '陽', '際', '雑', '難', '雪', '静', '非', '面', '靴', '頂',
        '頭', '頼', '顔', '願', '類', '飛', '首', '馬', '髪', '鳴',
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
