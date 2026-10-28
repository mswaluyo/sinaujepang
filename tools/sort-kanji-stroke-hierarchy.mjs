import fs from 'fs';
import path from 'path';

// 11 Kategori Grup Radikal Resmi dari Kanji Explorer (public/assets/js/kanji.js)
const EXPLORER_CATEGORIES = [
  { id: "tubuh_anatomi", title: "Tubuh & Anatomi", icon: "👤", items: ["目", "耳", "口", "鼻", "首", "身", "心", "手", "足", "歯", "自", "尸", "面", "爪", "血", "舌", "骨", "皮", "毛", "肉", "力", "又", "頁"] },
  { id: "manusia_relasi", title: "Manusia & Relasi", icon: "👥", items: ["人", "女", "子", "父", "氏", "大", "小", "老", "臣"] },
  { id: "alam_elemen", title: "Alam & Elemen", icon: "🌿", items: ["日", "月", "夕", "風", "雨", "気", "气", "木", "水", "火", "土", "石", "山", "川", "玄", "冫"] },
  { id: "hewan", title: "Hewan", icon: "🐾", items: ["犬", "牛", "馬", "鳥", "魚", "羊", "虫", "角", "羽", "貝", "豕", "隹"] },
  { id: "tumbuhan", title: "Tumbuhan & Makanan", icon: "🌾", items: ["艸", "禾", "米", "竹", "瓜", "麦", "食"] },
  { id: "bangunan_transportasi", title: "Bangunan & Tempat", icon: "🏠", items: ["門", "宀", "戸", "穴", "里", "邑", "谷", "厂", "广", "囗", "田"] },
  { id: "alat", title: "Alat & Benda", icon: "⚔️", items: ["刀", "金", "糸", "衣", "巾", "斤", "缶", "皿", "矢", "玉", "弓", "斗", "片", "瓦", "革", "韋", "車", "舟", "王", "辰", "匕", "凵", "匚", "弋", "戈"] },
  { id: "aksi", title: "Aksi & Gerak", icon: "🏃", items: ["用", "行", "走", "辵", "辶", "止", "欠", "方", "入", "立", "彳"] },
  { id: "garis", title: "Garis Dasar", icon: "〰️", items: ["一", "丶", "丿", "亅", "丨", "二", "八", "十"] },
  { id: "bentuk", title: "Bentuk & Bingkai", icon: "🔷", items: ["亠", "冂", "厶", "曰", "乙", "攴", "攵", "冖", "凵"] },
  { id: "sifat_keadaan", title: "Sifat & Keadaan", icon: "✨", items: ["見", "飛", "高", "白", "音", "干", "黒", "青", "色", "西", "甘", "香", "文", "言", "寸", "彡", "示"] }
];

// Jumlah Coretan Resmi Tiap Radikal (Kangxi Radicals Stroke Count)
const RADICAL_STROKES = {
  // 1 Coretan
  "一": 1, "丨": 1, "丶": 1, "丿": 1, "乙": 1, "亅": 1,
  // 2 Coretan
  "二": 2, "亠": 2, "人": 2, "儿": 2, "入": 2, "八": 2, "冂": 2, "冖": 2, "冫": 2, "几": 2, "凵": 2, "刀": 2, "力": 2, "勹": 2, "匕": 2, "匚": 2, "十": 2, "卜": 2, "卩": 2, "厂": 2, "厶": 2, "又": 2,
  // 3 Coretan
  "口": 3, "囗": 3, "土": 3, "士": 3, "夂": 3, "夕": 3, "大": 3, "女": 3, "子": 3, "宀": 3, "寸": 3, "小": 3, "尢": 3, "尸": 3, "屮": 3, "山": 3, "川": 3, "工": 3, "己": 3, "巾": 3, "干": 3, "幺": 3, "广": 3, "廴": 3, "弋": 3, "弓": 3, "ヨ": 3, "彡": 3, "彳": 3, "辶": 3,
  // 4 Coretan
  "心": 4, "戈": 4, "戸": 4, "手": 4, "支": 4, "攴": 4, "文": 4, "斗": 4, "斤": 4, "方": 4, "无": 4, "日": 4, "曰": 4, "月": 4, "木": 4, "欠": 4, "止": 4, "歹": 4, "殳": 4, "毋": 4, "比": 4, "毛": 4, "氏": 4, "气": 4, "水": 4, "火": 4, "爪": 4, "父": 4, "爻": 4, "爿": 4, "片": 4, "牙": 4, "牛": 4, "犬": 4, "王": 4, "玉": 4,
  // 5 Coretan
  "玄": 5, "玉": 5, "瓜": 5, "瓦": 5, "甘": 5, "生": 5, "用": 5, "田": 5, "疋": 5, "疒": 5, "癶": 5, "白": 5, "皮": 5, "皿": 5, "目": 5, "矛": 5, "矢": 5, "石": 5, "示": 5, "禾": 5, "穴": 5, "立": 5,
  // 6 Coretan
  "竹": 6, "米": 6, "糸": 6, "缶": 6, "网": 6, "羊": 6, "羽": 6, "老": 6, "而": 6, "耒": 6, "耳": 6, "聿": 6, "肉": 6, "臣": 6, "自": 6, "至": 6, "臼": 6, "舌": 6, "舟": 6, "艮": 6, "色": 6, "艸": 6, "虍": 6, "虫": 6, "血": 6, "行": 6, "衣": 6, "襾": 6, "西": 6,
  // 7 Coretan
  "見": 7, "角": 7, "言": 7, "谷": 7, "豆": 7, "豕": 7, "豸": 7, "貝": 7, "赤": 7, "走": 7, "足": 7, "身": 7, "車": 7, "辛": 7, "辰": 7, "辵": 7, "邑": 7, "酉": 7, "釆": 7, "里": 7, "阜": 7,
  // 8 Coretan
  "金": 8, "長": 8, "門": 8, "阜": 8, "隶": 8, "隹": 8, "雨": 8, "青": 8, "非": 8,
  // 9 Coretan
  "面": 9, "革": 9, "韋": 9, "韭": 9, "音": 9, "頁": 9, "風": 9, "飛": 9, "食": 9, "首": 9, "香": 9,
  // 10 Coretan
  "馬": 10, "骨": 10, "高": 10, "髟": 10, "鬥": 10, "鬯": 10, "鬲": 10, "鬼": 10,
  // 11 Coretan
  "魚": 11, "鳥": 11, "鹵": 11, "鹿": 11, "麦": 11, "麻": 11,
  // 12 Coretan
  "黄": 12, "黍": 12, "黒": 12, "黹": 12,
  // 14 Coretan
  "鼻": 14,
  // 15 Coretan
  "歯": 15
};

// Peta Radikal -> Kategori ID & Title
const RAD_MAP = {};
EXPLORER_CATEGORIES.forEach((cat, catIdx) => {
  cat.items.forEach((rad) => {
    RAD_MAP[rad] = {
      catId: cat.id,
      catTitle: `${cat.icon} ${cat.title}`,
      catOrder: catIdx
    };
  });
});

export function sortKanjiByGroupRadicalStroke() {
  const inputPath = path.join('public', 'kanji-jft-a2.json');
  const kanjiList = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

  const enrichedList = kanjiList.map(item => {
    const rad = item.radical || "一";
    const mapped = RAD_MAP[rad] || {
      catId: "lainnya",
      catTitle: "🌐 Radikal Lainnya",
      catOrder: 99
    };

    const strokeRadikal = RADICAL_STROKES[rad] || 3;

    return {
      ...item,
      grupRadikal: mapped.catTitle,
      grupId: mapped.catId,
      grupOrder: mapped.catOrder,
      strokeRadikal: strokeRadikal
    };
  });

  // ATURAN SORTING KETAT SESUAI INSTRUKSI:
  // 1. Grup Radikal (berdasarkan urutan resmi kategori di Kanji Explorer)
  // 2. Radikal (berdasarkan JUMLAH CORETAN RADIKAL dari yang PALING SEDERHANA: ASC)
  // 3. Kanji (berdasarkan JUMLAH CORETAN KANJI dari yang PALING SEDERHANA: ASC)
  enrichedList.sort((a, b) => {
    // 1. Grup Radikal
    if (a.grupOrder !== b.grupOrder) {
      return a.grupOrder - b.grupOrder;
    }

    // 2. Radikal: Coretan Radikal Tersedikit -> Terbanyak (ASC)
    if (a.strokeRadikal !== b.strokeRadikal) {
      return a.strokeRadikal - b.strokeRadikal;
    }

    // Jika coretan radikal sama, kelompokkan radikal yang sama berdampingan
    if (a.radical !== b.radical) {
      return a.radical.localeCompare(b.radical, 'ja');
    }

    // 3. Kanji: Coretan Kanji Tersedikit -> Terbanyak (ASC)
    return a.stroke - b.stroke;
  });

  fs.writeFileSync(inputPath, JSON.stringify(enrichedList, null, 2), 'utf8');

  console.log('=== KANJI BERHASIL DISORTIR BERTINGKAT ===');
  console.log('1. Grup Radikal (Kanji Explorer)');
  console.log('2. Coretan Radikal (Paling Sederhana -> Rumit)');
  console.log('3. Coretan Kanji (Paling Sederhana -> Rumit)');
}

sortKanjiByGroupRadicalStroke();
