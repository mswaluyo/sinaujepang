// tools/fix-all-kanji-a2.mjs
import fs from 'fs';
import path from 'path';
import { KANJI_REPAIR_DICT } from './kanji-dict-full.mjs';

// Kategori Resmi Kanji Explorer
const EXPLORER_CATEGORIES = [
  { id: "tubuh_anatomi", title: "Tubuh & Anatomi", icon: "👤", items: ["目", "耳", "口", "鼻", "首", "身", "心", "手", "足", "歯", "自", "尸", "面", "爪", "血", "舌", "骨", "皮", "毛", "肉", "力", "又", "頁", "疒"] },
  { id: "manusia_relasi", title: "Manusia & Relasi", icon: "👥", items: ["人", "亻", "女", "子", "父", "氏", "大", "小", "老", "臣", "毋", "儿"] },
  { id: "alam_elemen", title: "Alam & Elemen", icon: "🌿", items: ["日", "月", "夕", "風", "雨", "気", "气", "木", "水", "火", "土", "石", "山", "川", "玄", "冫", "阜"] },
  { id: "hewan", title: "Hewan", icon: "🐾", items: ["犬", "牛", "馬", "鳥", "魚", "羊", "虫", "角", "羽", "貝", "豕", "隹", "鹿"] },
  { id: "tumbuhan", title: "Tumbuhan & Makanan", icon: "🌾", items: ["艸", "禾", "米", "竹", "瓜", "麦", "食", "鹵"] },
  { id: "bangunan_transportasi", title: "Bangunan & Tempat", icon: "🏠", items: ["門", "宀", "戸", "穴", "里", "邑", "谷", "厂", "广", "囗", "田"] },
  { id: "alat", title: "Alat & Benda", icon: "⚔️", items: ["刀", "金", "糸", "衣", "巾", "斤", "缶", "皿", "矢", "玉", "弓", "斗", "片", "瓦", "革", "韋", "車", "舟", "王", "辰", "匕", "凵", "匚", "弋", "戈", "几", "卩", "工"] },
  { id: "aksi", title: "Aksi & Gerak", icon: "🏃", items: ["用", "行", "走", "辵", "辶", "止", "欠", "方", "入", "立", "彳", "攴", "殳"] },
  { id: "garis", title: "Garis Dasar", icon: "〰️", items: ["一", "丶", "丿", "亅", "丨", "二", "八", "十"] },
  { id: "bentuk", title: "Bentuk & Bingkai", icon: "🔷", items: ["亠", "冂", "厶", "曰", "乙", "攵", "冖", "己", "襾"] },
  { id: "sifat_keadaan", title: "Sifat & Keadaan", icon: "✨", items: ["見", "飛", "高", "白", "音", "干", "黒", "青", "色", "西", "甘", "香", "文", "言", "寸", "彡", "示", "非", "生"] }
];

// Stroke Radikal Resmi
const RADICAL_STROKES = {
  "一": 1, "丨": 1, "丶": 1, "丿": 1, "乙": 1, "亅": 1,
  "二": 2, "亠": 2, "人": 2, "亻": 2, "儿": 2, "入": 2, "八": 2, "冂": 2, "冖": 2, "冫": 2, "几": 2, "凵": 2, "刀": 2, "力": 2, "勹": 2, "匕": 2, "匚": 2, "十": 2, "卜": 2, "卩": 2, "厂": 2, "厶": 2, "又": 2,
  "口": 3, "囗": 3, "土": 3, "士": 3, "夂": 3, "夕": 3, "大": 3, "女": 3, "子": 3, "宀": 3, "寸": 3, "小": 3, "尢": 3, "尸": 3, "屮": 3, "山": 3, "川": 3, "工": 3, "己": 3, "巾": 3, "干": 3, "幺": 3, "广": 3, "廴": 3, "弋": 3, "弓": 3, "ヨ": 3, "彡": 3, "彳": 3, "辶": 3,
  "心": 4, "戈": 4, "戸": 4, "手": 4, "支": 4, "攴": 4, "文": 4, "斗": 4, "斤": 4, "方": 4, "无": 4, "日": 4, "曰": 4, "月": 4, "木": 4, "欠": 4, "止": 4, "歹": 4, "殳": 4, "毋": 4, "比": 4, "毛": 4, "氏": 4, "气": 4, "水": 4, "火": 4, "爪": 4, "父": 4, "爻": 4, "爿": 4, "片": 4, "牙": 4, "牛": 4, "犬": 4, "王": 4, "玉": 4,
  "玄": 5, "瓜": 5, "瓦": 5, "甘": 5, "生": 5, "用": 5, "田": 5, "疋": 5, "疒": 5, "癶": 5, "白": 5, "皮": 5, "皿": 5, "目": 5, "矛": 5, "矢": 5, "石": 5, "示": 5, "禾": 5, "穴": 5, "立": 5,
  "竹": 6, "米": 6, "糸": 6, "缶": 6, "网": 6, "羊": 6, "羽": 6, "老": 6, "而": 6, "耒": 6, "耳": 6, "聿": 6, "肉": 6, "臣": 6, "自": 6, "至": 6, "臼": 6, "舌": 6, "舟": 6, "艮": 6, "色": 6, "艸": 6, "虍": 6, "虫": 6, "血": 6, "行": 6, "衣": 6, "襾": 6, "西": 6,
  "見": 7, "角": 7, "言": 7, "谷": 7, "豆": 7, "豕": 7, "豸": 7, "貝": 7, "赤": 7, "走": 7, "足": 7, "身": 7, "車": 7, "辛": 7, "辰": 7, "辵": 7, "邑": 7, "酉": 7, "釆": 7, "里": 7, "阜": 7,
  "金": 8, "長": 8, "門": 8, "隶": 8, "隹": 8, "雨": 8, "青": 8, "非": 8,
  "面": 9, "革": 9, "韋": 9, "韭": 9, "音": 9, "頁": 9, "風": 9, "飛": 9, "食": 9, "首": 9, "香": 9,
  "馬": 10, "骨": 10, "高": 10, "髟": 10, "鬥": 10, "鬯": 10, "鬲": 10, "鬼": 10,
  "魚": 11, "鳥": 11, "鹵": 11, "鹿": 11, "麦": 11, "麻": 11
};

// Peta Radikal -> Kategori ID & Title
const RAD_MAP = {};
EXPLORER_CATEGORIES.forEach((cat, catIdx) => {
  cat.items.forEach((rad, radIdx) => {
    RAD_MAP[rad] = {
      catId: cat.id,
      catTitle: `${cat.icon} ${cat.title}`,
      catOrder: catIdx,
      radOrder: radIdx
    };
  });
});

export function runFullRepair() {
  const inputPath = path.join('public', 'kanji-jft-a2.json');
  const kanjiList = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

  let repairedCount = 0;

  const updatedList = kanjiList.map(item => {
    let current = { ...item };

    // 1. Perbaiki jika ada di KANJI_REPAIR_DICT
    if (KANJI_REPAIR_DICT[current.kanji]) {
      const fix = KANJI_REPAIR_DICT[current.kanji];
      current.stroke = fix.stroke;
      current.radical = fix.radical;
      current.radName = fix.radName;
      current.namaRadikal = fix.radName;
      current.arti = fix.arti;
      current.on = fix.on;
      current.kun = fix.kun;
      repairedCount++;
    }

    // 2. Perbaiki kanji 話 yang vocab[1] nya hilang kana
    if (current.kanji === '話') {
      current.vocab = current.vocab.map(v => {
        if (v.kanji === '電話します' && !v.kana) {
          return { ...v, kana: 'でんわします' };
        }
        return v;
      });
    }

    // 3. Bersihkan vocab duplikat di tiap kanji
    const seen = new Set();
    const cleanVocab = [];
    (current.vocab || []).forEach(v => {
      const key = `${v.kanji}|${v.kana}|${v.arti}`;
      if (!seen.has(key)) {
        seen.add(key);
        cleanVocab.push(v);
      }
    });
    current.vocab = cleanVocab;

    // 4. Update grup kategori & stroke radikal
    const rad = current.radical;
    const mapped = RAD_MAP[rad] || {
      catId: "lainnya",
      catTitle: "🌐 Radikal Lainnya",
      catOrder: 99,
      radOrder: 99
    };

    current.grupRadikal = mapped.catTitle;
    current.grupId = mapped.catId;
    current.grupOrder = mapped.catOrder;
    current.radOrder = mapped.radOrder;
    current.strokeRadikal = RADICAL_STROKES[rad] || current.strokeRadikal || 3;
    if (!current.namaRadikal) current.namaRadikal = current.radName;

    return current;
  });

  // 5. Urutkan secara presisi:
  // - grupOrder ASC
  // - strokeRadikal ASC (radikal coretan paling sedikit dulu)
  // - radical (kelompokkan radikal identik)
  // - stroke ASC (kanji tunggal coretan paling sedikit dulu)
  updatedList.sort((a, b) => {
    if (a.grupOrder !== b.grupOrder) return a.grupOrder - b.grupOrder;
    if (a.strokeRadikal !== b.strokeRadikal) return a.strokeRadikal - b.strokeRadikal;
    if (a.radical !== b.radical) return a.radical.localeCompare(b.radical, 'ja');
    return a.stroke - b.stroke;
  });

  fs.writeFileSync(inputPath, JSON.stringify(updatedList, null, 2), 'utf8');

  console.log(`=== PERBAIKAN SELESAI ===`);
  console.log(`Total Kanji dalam file : ${updatedList.length}`);
  console.log(`Kanji yang diperbaiki  : ${repairedCount}`);
  console.log(`Kanji kategori Lainnya : ${updatedList.filter(d => d.grupId === 'lainnya').length}`);
}

runFullRepair();
