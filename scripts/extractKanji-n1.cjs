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
    N1: [
        '丁', '丑', '且', '丘', '丙', '丞', '丹', '乃', '之', '乏',
        '乙', '也', '亀', '井', '亘', '亜', '亥', '亦', '亨', '享',
        '亭', '亮', '仁', '仙', '仮', '仰', '企', '伊', '伍', '伎',
        '伏', '伐', '伯', '伴', '伶', '伽', '但', '佐', '佑', '佳',
        '併', '侃', '侍', '侑', '価', '侮', '侯', '侵', '促', '俊',
        '俗', '保', '修', '俳', '俵', '俸', '倉', '倖', '倣', '倫',
        '倭', '倹', '偏', '健', '偲', '偵', '偽', '傍', '傑', '傘',
        '催', '債', '傷', '僕', '僚', '僧', '儀', '儒', '償', '允',
        '充', '克', '免', '典', '兼', '冒', '冗', '冠', '冴', '冶',
        '准', '凌', '凜', '凝', '凡', '凪', '凱', '凶', '凸', '凹',
        '刀', '刃', '刈', '刑', '削', '剖', '剛', '剣', '剤', '剰',
        '創', '功', '劣', '励', '劾', '勁', '勅', '勘', '勧', '勲',
        '勺', '匁', '匠', '匡', '匿', '升', '卑', '卓', '博', '卯',
        '即', '却', '卸', '厄', '厘', '厳', '又', '及', '叔', '叙',
        '叡', '句', '只', '叶', '司', '吉', '后', '吏', '吐', '吟',
        '呂', '呈', '呉', '哀', '哉', '哲', '唄', '唆', '唇', '唯',
        '唱', '啄', '啓', '善', '喚', '喝', '喪', '喬', '嗣', '嘆',
        '嘉', '嘱', '器', '噴', '嚇', '囚', '圏', '圭', '坑', '坪',
        '垂', '垣', '執', '培', '基', '堀', '堅', '堕', '堤', '堪',
        '塀', '塁', '塊', '塑', '塚', '塾', '墓', '墜', '墨', '墳',
        '墾', '壁', '壇', '壊', '壌', '士', '壮', '壱', '奇', '奈',
        '奉', '奎', '奏', '契', '奔', '奨', '奪', '奮', '奴', '如',
        '妃', '妄', '妊', '妙', '妥', '妨', '姫', '姻', '姿', '威',
        '娠', '娯', '婆', '婿', '媒', '媛', '嫁', '嫌', '嫡', '嬉',
        '嬢', '孔', '孝', '孟', '孤', '宏', '宗', '宙', '宜', '宣',
        '宥', '宮', '宰', '宴', '宵', '寂', '寅', '密', '寛', '寡',
        '寧', '審', '寮', '寸', '射', '尉', '尋', '尚', '尭', '就',
        '尺', '尼', '尽', '尾', '尿', '屈', '展', '属', '履', '屯',
        '岐', '岡', '岬', '岳', '峠', '峡', '峰', '峻', '崇', '崎',
        '崚', '崩', '嵐', '嵩', '嵯', '嶺', '巌', '巡', '巣', '巧',
        '己', '巳', '巴', '巽', '帆', '帝', '帥', '帳', '幕', '幣',
        '幹', '幻', '幽', '庄', '序', '庶', '康', '庸', '廃', '廉',
        '廊', '廷', '弁', '弊', '弐', '弓', '弔', '弘', '弥', '弦',
        '弧', '張', '弾', '彗', '彦', '彩', '彪', '彫', '彬', '彰',
        '影', '往', '征', '径', '徐', '従', '循', '微', '徳', '徴',
        '徹', '忌', '忍', '志', '応', '忠', '怜', '怠 怪', '恒', '恕',
        '恨', '恩', '恭', '恵', '悌', '悔', '悟', '悠', '悦', '悼',
        '惇', '惑', '惜', '惟', '惣', '惨', '惰', '愁', '愉', '愚',
        '慈', '態', '慎', '慕', '慢', '慧', '慨', '慮', '慰', '慶',
        '憂', '憤', '憧', '憩', '憲', '憶', '憾', '懇', '懐', '懲',
        '懸', '我', '戒', '戯', '房', '扇', '扉', '扱', '扶', '批',
        '抄', '把', '抑', '抗', '択', '披', '抵', '抹', '抽', '拍',
        '拐', '拒', '拓', '拘', '拙', '拠', '拡', '括', '拳', '拷',
        '挑', '挙', '振', '挿', '据', '捷', '捺', '授', '掌', '排',
        '控', '推', '措', '掲', '描', '提', '揚', '握', '揮', '援',
        '揺', '搬', '搭', '携', '搾', '摂', '摘', '摩', '撃', '撤',
        '撮', '撲', '擁', '操', '擦', '擬', '攻', '故', '敏', '救',
        '敢', '敦', '整', '敵', '敷', '斉', '斎', '斐', '斗', '斜',
        '斤', '斥', '於', '施', '旋', '旗', '既', '旦', '旨', '旬',
        '旭', '旺', '昂', '昆', '昌', '昭', '是', '昴', '晃', '晋',
        '晏', '晟', '晨', '晶', '智', '暁', '暇', '暉', '暑', '暖',
        '暢', '暦', '暫', '曙', '曹', '朋', '朔', '朕', '朗', '朱',
        '朴', '朽', '杉', '李', '杏', '杜', '条', '松', '析', '枠',
        '枢', '架', '柄', '柊', '某', '染', '柚', '柳', '柾', '栓',
        '栗', '栞', '株', '核', '栽', '桂', '桃', '案', '桐', '桑',
        '桜', '桟', '梅', '梓', '梢', '梧', '梨', '棄', '棋', '棚',
        '棟', '棺', '椋', '椎', '検', '椰', '椿', '楊', '楓', '楠',
        '楼', '概', '榛', '槙', '槻', '槽', '標', '模', '樹', '樺',
        '橘', '檀', '欄', '欣', '欺', '欽', '款', '歓', '殉', '殊',
        '殖', '殴', '殻', '毅', '毬', '氏', '汁', '汐', '江', '汰',
        '汽', '沖', '沙', '没', '沢', '沼', '沿', '泌', '泡', '泣',
        '泰', '洞', '津', '洪', '洲', '洵', '洸', '派', '浄', '浜',
        '浦', '浩', '浪', '浸', '涯', '淑', '淡', '淳', '添', '渇',
        '渉', '渋', '渓', '渚', '渥', '渦', '湧', '源', '溝', '滅',
        '滉', '滋', '滑', '滝', '滞', '漂', '漆', '漏', '漠', '漫',
        '漬', '漱', '漸', '潔', '潜', '潟', '潤', '潮', '澄', '澪',
        '激', '濁', '濫', '瀬', '災', '炉', '炊', '炎', '為', '烈',
        '焦', '煩', '煮', '熊', '熙', '熟', '燎', '燦', '燿', '爵',
        '爽', '爾', '牧', '牲', '犠', '狂', '狙', '狩', '独', '狭',
        '猛', '猟', '猪', '献', '猶', '猿', '獄', '獣', '獲', '玄',
        '率', '玖', '玲', '珠', '班', '琉', '琢', '琳', '琴', '瑚',
        '瑛', '瑞', '瑠', '瑳', '瑶', '璃', '環', '甚', '甫', '甲',
        '畔', '畝', '異', '疎', '疫', '疾', '症', '痘', '痢', '痴',
        '癒', '癖', '皇', '皐', '皓', '盆', '益', '盛', '盟', '監',
        '盤', '盲', '盾', '眉', '看', '眸', '眺', '眼', '睡', '督',
        '睦', '瞬', '瞭', '瞳', '矛', '矢', '矯', '砕', '砲', '硝',
        '硫', '碁', '碑', '碧', '碩', '磁', '磯', '礁', '礎', '祉',
        '祐', '祥', '票', '禄', '禅', '禍', '禎', '秀', '秘', '租',
        '秦', '秩', '称', '稀', '稔', '稚', '稜', '稲', '稼', '稿',
        '穀', '穂', '穏', '穣', '穫', '穴', '窃', '窒', '窮', '窯',
        '竜', '竣', '端', '笙', '笛', '第', '笹', '筋', '策', '箇',
        '節', '範', '篤', '簿', '粋', '粗', '粘', '粛', '糖', '糧',
        '系', '糾', '紀', '紋', '納', '紗', '紘', '級', '紛', '素',
        '紡', '索', '紫', '紬', '累', '紳', '紺', '絃', '結', '絞',
        '絢', '統', '絹', '継', '綜', '維', '綱', '網', '綸', '綺',
        '綾', '緊', '緋', '締', '緩', '緯', '縁', '縄', '縛', '縦',
        '縫', '縮', '繁', '繊', '織', '繕', '繭', '繰', '罰', '罷',
        '羅', '羊', '義', '翁', '翔', '翠', '翻', '翼', '耀', '耐',
        '耗', '耶', '聖', '聡', '聴', '弟', '肖', '肝', '肢', '肥',
        '肪', '肺', '胆', '胎', '胞', '胡', '胤', '胴', '脅', '脈',
        '脚', '脩', '脱', '脹', '腐', '腸', '膜', '膨', '臨', '臭',
        '至', '致', '興', '舌', '舎', '舗', '舜', '舶', '艇', '艦',
        '艶', '芋', '芙', '芝', '芳', '芹', '芽', '苑', '苗', '茂',
        '茄', '茅', '茉', '茎', '茜', '荘', '莉', '莞', '菊', '菌',
        '菖', '菫', '華', '萌', '萩', '葬', '葵', '蒔', '蒼', '蓄',
        '蓉', '蓮', '蔦', '蕉', '蕗', '薦', '薪', '薫', '藍', '藤',
        '藩', '藻', '蘭', '虎', '虐', '虚', '虜', '虞', '虹', '蚊',
        '蚕', '蛇', '蛍', '蛮', '蝶', '融', '衆', '街', '衛', '衝',
        '衡', '衰', '衷', '衿', '袈', '裁', '裂', '裕', '裟', '裸',
        '製', '褐', '褒', '襟', '襲', '覆', '覇', '視', '覧', '訂',
        '討', '託', '訟', '訳', '訴', '診', '証', '詐', '詔', '評',
        '詠', '詢', '詩', '該', '詳', '誇', '誉', '誓', '誕', '誘',
        '誠', '誼', '諄', '請', '諒', '諭', '諮', '諾', '謀', '謁',
        '謄', '謙', '謝', '謡', '謹', '譜', '譲', '護', '豆', '豚',
        '豪', '貞', '貢', '貫', '貴', '賀', '賃', '賄', '賊', '賓',
        '賜', '賠', '賦', '購', '赦', '赳', '赴', '趣', '距', '跳',
        '践', '踏', '躍', '軌', '軸', '較', '載', '輔', '輝', '輩',
        '轄', '辰', '辱', '迅', '迪', '迫', '迭', '透', '逐', '逓',
        '逝', '逮', '逸', '遂', '遇', '遍', '遣', '遥', '遭', '遮',
        '遵', '遷', '遺', '遼', '避', '還', '邑', '那', '邦', '邪',
        '邸', '郁', '郎', '郡', '郭', '郷', '酉', '酌', '酔', '酢',
        '酪', '酬', '酵', '酷 酸', '醜', '醸', '采', '釈', '釣', '鈴',
        '鉛', '鉢', '銃', '銑', '銘', '銭', '鋳', '鋼', '錘', '錠',
        '錦', '錬', '錯', '鍛', '鎌', '鎖', '鎮', '鏡', '鐘', '鑑',
        '閑', '閣', '閥', '閲', '闘', '阻', '阿', '附', '陛', '陣',
        '陥', '陪', '陰', '陳', '陵', '陶', '隆', '隊', '随', '隔',
        '障', '隠', '隣', '隷', '隼', '雄', '雅', '雌', '雛', '離',
        '雰', '雷', '需', '霊', '霜', '霞', '霧', '露', '靖', '鞠',
        '韻', '響', '項', '須', '頌', '頑', '頒', '頻', '顕', '顧',
        '颯', '飢', '飼', '飽', '飾', '養', '餓', '馨', '駄', '駆',
        '駒', '駿', '騎', '騒', '騰', '驚', '髄', '鬼', '魁', '魂',
        '魅', '魔', '鮎', '鮮', '鯉', '鯛', '鯨', '鳩', '鳳', '鴻',
        '鵬', '鶏', '鶴', '鷹', '鹿', '麗', '麟', '麻', '麿', '黎',
        '黙', '黛', '鼓',
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
