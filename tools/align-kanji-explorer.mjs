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

export function alignKanjiWithExplorerCategories() {
  const inputPath = path.join('public', 'kanji-jft-a2.json');
  const kanjiList = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

  const enrichedList = kanjiList.map(item => {
    const rad = item.radical || "一";
    const mapped = RAD_MAP[rad] || {
      catId: "lainnya",
      catTitle: "🌐 Radikal Lainnya",
      catOrder: 99,
      radOrder: 99
    };

    return {
      ...item,
      grupRadikal: mapped.catTitle,
      grupId: mapped.catId,
      grupOrder: mapped.catOrder,
      radOrder: mapped.radOrder
    };
  });

  // Urutan Shortasi yang diminta:
  // 1. Grup Radikal (berdasarkan urutan resmi kategori di Kanji Explorer)
  // 2. Radikal (berdasarkan urutan radikal dalam grup di Kanji Explorer)
  // 3. Jumlah Coretan Kanji (dari paling sederhana: ASC)
  enrichedList.sort((a, b) => {
    if (a.grupOrder !== b.grupOrder) return a.grupOrder - b.grupOrder;
    if (a.radOrder !== b.radOrder) return a.radOrder - b.radOrder;
    if (a.radical !== b.radical) return a.radical.localeCompare(b.radical, 'ja');
    return a.stroke - b.stroke;
  });

  fs.writeFileSync(inputPath, JSON.stringify(enrichedList, null, 2), 'utf8');

  console.log('=== KANJI BERHASIL DISELARASKAN DENGAN KANJI EXPLORER ===');
  console.log(`Total Kanji: ${enrichedList.length}`);
  console.log(`Kategori Kanji Explorer Terpakai: ${[...new Set(enrichedList.map(k => k.grupRadikal))].length}`);
}

alignKanjiWithExplorerCategories();
