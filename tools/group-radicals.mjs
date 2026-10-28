import fs from 'fs';
import path from 'path';

// Pemetaan 7 Posisi/Grup Radikal Tradisional Jepang
// 1. へん (Hen / Sisi Kiri)
// 2. つくり (Tsukuri / Sisi Kanan)
// 3. かんむり (Kanmuri / Sisi Atas)
// 4. あし (Ashi / Sisi Bawah)
// 5. かまえ (Kamae / Bingkai / Keliling)
// 6. たれ (Tare / Sisi Atas Menjuntai ke Kiri)
// 7. にょう (Nyou / Sisi Kiri Menjuntai ke Bawah)
// 8. ひとえ (Hitoe / Karakter Utuh / Dasar)

const RADICAL_POSITIONS = {
  // へん (Hen - Kiri)
  "人": { grup: "へん (Hen - Sisi Kiri)", nama: "にんべん (ninben - orang)", strokeRad: 2 },
  "亻": { grup: "へん (Hen - Sisi Kiri)", nama: "にんべん (ninben - orang)", strokeRad: 2 },
  "手": { grup: "へん (Hen - Sisi Kiri)", nama: "てへん (tehen - tangan)", strokeRad: 3 },
  "扌": { grup: "へん (Hen - Sisi Kiri)", nama: "てへん (tehen - tangan)", strokeRad: 3 },
  "水": { grup: "へん (Hen - Sisi Kiri)", nama: "さんずい (sanzui - air)", strokeRad: 3 },
  "氵": { grup: "へん (Hen - Sisi Kiri)", nama: "さんずい (sanzui - air)", strokeRad: 3 },
  "木": { grup: "へん (Hen - Sisi Kiri)", nama: "きへん (kihen - pohon)", strokeRad: 4 },
  "火": { grup: "へん (Hen - Sisi Kiri)", nama: "ひへん (hihen - api)", strokeRad: 4 },
  "土": { grup: "へん (Hen - Sisi Kiri)", nama: "つちへん (tsuchihen - tanah)", strokeRad: 3 },
  "言": { grup: "へん (Hen - Sisi Kiri)", nama: "ごんべん (gonben - ucapan/bahasa)", strokeRad: 7 },
  "金": { grup: "へん (Hen - Sisi Kiri)", nama: "かねへん (kanehen - logam/emas)", strokeRad: 8 },
  "糸": { grup: "へん (Hen - Sisi Kiri)", nama: "いとへん (itohen - benang)", strokeRad: 6 },
  "女": { grup: "へん (Hen - Sisi Kiri)", nama: "おんなへん (onnahen - wanita)", strokeRad: 3 },
  "日": { grup: "へん (Hen - Sisi Kiri)", nama: "ひへん (hihen - matahari/hari)", strokeRad: 4 },
  "月": { grup: "へん (Hen - Sisi Kiri)", nama: "つきへん (tsukihen - bulan/daging)", strokeRad: 4 },
  "車": { grup: "へん (Hen - Sisi Kiri)", nama: "くるまへん (kurumahen - kendaraan)", strokeRad: 7 },
  "足": { grup: "へん (Hen - Sisi Kiri)", nama: "あしへん (ashihen - kaki)", strokeRad: 7 },
  "目": { grup: "へん (Hen - Sisi Kiri)", nama: "めへん (mehen - mata)", strokeRad: 5 },
  "耳": { grup: "へん (Hen - Sisi Kiri)", nama: "みみへん (mimihen - telinga)", strokeRad: 6 },
  "食": { grup: "へん (Hen - Sisi Kiri)", nama: "しょくへん (shokuhen - makanan)", strokeRad: 9 },
  "貝": { grup: "へん (Hen - Sisi Kiri)", nama: "かいへん (kaihen - kerang/harta)", strokeRad: 7 },
  "禾": { grup: "へん (Hen - Sisi Kiri)", nama: "のぎへん (nogihen - bulir padi)", strokeRad: 5 },
  "弓": { grup: "へん (Hen - Sisi Kiri)", nama: "ゆみへん (yumihen - busur)", strokeRad: 3 },
  "牛": { grup: "へん (Hen - Sisi Kiri)", nama: "うしへん (ushihen - sapi)", strokeRad: 4 },
  "方": { grup: "へん (Hen - Sisi Kiri)", nama: "ほうへん (houhen - arah)", strokeRad: 4 },
  "示": { grup: "へん (Hen - Sisi Kiri)", nama: "しめすへん (shimesuhen - ritual/dewa)", strokeRad: 5 },
  "阜": { grup: "へん (Hen - Sisi Kiri)", nama: "こざとへん (kozatohen - bukit/tinggi)", strokeRad: 3 },
  "彳": { grup: "へん (Hen - Sisi Kiri)", nama: "ぎょうにんべん (gyouninben - langkah jalan)", strokeRad: 3 },
  "魚": { grup: "へん (Hen - Sisi Kiri)", nama: "うおへん (uohen - ikan)", strokeRad: 11 },
  "馬": { grup: "へん (Hen - Sisi Kiri)", nama: "うまへん (umahen - kuda)", strokeRad: 10 },
  "玉": { grup: "へん (Hen - Sisi Kiri)", nama: "たまへん (tamahen - permata)", strokeRad: 5 },

  // つくり (Tsukuri - Kanan)
  "刀": { grup: "つくり (Tsukuri - Sisi Kanan)", nama: "りっとう / かたな (pedang)", strokeRad: 2 },
  "刂": { grup: "つくり (Tsukuri - Sisi Kanan)", nama: "りっとう (pedang)", strokeRad: 2 },
  "力": { grup: "つくり (Tsukuri - Sisi Kanan)", nama: "ちから (kekuatan/tenaga)", strokeRad: 2 },
  "攴": { grup: "つくり (Tsukuri - Sisi Kanan)", nama: "ぼくづくり (pukul/tindakan)", strokeRad: 4 },
  "欠": { grup: "つくり (Tsukuri - Sisi Kanan)", nama: "あくび (menguap/kurang)", strokeRad: 4 },
  "見": { grup: "つくり (Tsukuri - Sisi Kanan)", nama: "みる (melihat)", strokeRad: 7 },
  "頁": { grup: "つくり (Tsukuri - Sisi Kanan)", nama: "おおがい (kepala/halaman)", strokeRad: 9 },

  // かんむり (Kanmuri - Atas)
  "宀": { grup: "かんむり (Kanmuri - Sisi Atas)", nama: "うかんむり (atap rumah)", strokeRad: 3 },
  "艸": { grup: "かんむり (Kanmuri - Sisi Atas)", nama: "くさかんむり (rumput/tanaman)", strokeRad: 3 },
  "艹": { grup: "かんむり (Kanmuri - Sisi Atas)", nama: "くさかんむり (rumput/tanaman)", strokeRad: 3 },
  "雨": { grup: "かんむり (Kanmuri - Sisi Atas)", nama: "あめかんむり (hujan/cuaca)", strokeRad: 8 },
  "竹": { grup: "かんむり (Kanmuri - Sisi Atas)", nama: "たけかんむり (bambu)", strokeRad: 6 },
  "穴": { grup: "かんむり (Kanmuri - Sisi Atas)", nama: "あなかんむり (lubang/gua)", strokeRad: 5 },

  // あし (Ashi - Bawah)
  "心": { grup: "あし (Ashi - Sisi Bawah)", nama: "したごころ / こころ (hati/perasaan)", strokeRad: 4 },
  "儿": { grup: "あし (Ashi - Sisi Bawah)", nama: "ひとあし (kaki manusia)", strokeRad: 2 },
  "灬": { grup: "あし (Ashi - Sisi Bawah)", nama: "れっか / れんが (api di bawah)", strokeRad: 4 },

  // かまえ (Kamae - Keliling / Bingkai)
  "囗": { grup: "かまえ (Kamae - Bingkai Keliling)", nama: "くにがまえ (kotak mengelilingi)", strokeRad: 3 },
  "門": { grup: "かまえ (Kamae - Bingkai Keliling)", nama: "もんがまえ (pintu gerbang)", strokeRad: 8 },
  "冂": { grup: "かまえ (Kamae - Bingkai Keliling)", nama: "まきがまえ (bingkai terbuka)", strokeRad: 2 },
  "凵": { grup: "かまえ (Kamae - Bingkai Keliling)", nama: "かんにょう (kotak bawah)", strokeRad: 2 },
  "行": { grup: "かまえ (Kamae - Bingkai Keliling)", nama: "ぎょうがまえ (jalan)", strokeRad: 6 },
  "气": { grup: "かまえ (Kamae - Bingkai Keliling)", nama: "きがまえ (uap/udara)", strokeRad: 4 },

  // たれ (Tare - Menjuntai dari Atas ke Kiri)
  "广": { grup: "たれ (Tare - Menjuntai Atas-Kiri)", nama: "まだれ (rumah condong)", strokeRad: 3 },
  "疒": { grup: "たれ (Tare - Menjuntai Atas-Kiri)", nama: "やまいだれ (penyakit/sakit)", strokeRad: 5 },
  "尸": { grup: "たれ (Tare - Menjuntai Atas-Kiri)", nama: "しかばね (tubuh/atap)", strokeRad: 3 },
  "戸": { grup: "たれ (Tare - Menjuntai Atas-Kiri)", nama: "とだれ (daun pintu)", strokeRad: 4 },

  // にょう (Nyou - Menjuntai dari Kiri ke Bawah)
  "辶": { grup: "にょう (Nyou - Menjuntai Kiri-Bawah)", nama: "しんにょう (jalan/perpindahan)", strokeRad: 3 },
  "走": { grup: "にょう (Nyou - Menjuntai Kiri-Bawah)", nama: "そうにょう (berlari)", strokeRad: 7 },

  // ひとえ / Dasar (Bentuk Utuh Mandiri)
  "一": { grup: "ひとえ (Karakter Dasar / Utuh)", nama: "いち (satu)", strokeRad: 1 },
  "二": { grup: "ひとえ (Karakter Dasar / Utuh)", nama: "に (dua)", strokeRad: 2 },
  "十": { grup: "ひとえ (Karakter Dasar / Utuh)", nama: "じゅう (sepuluh)", strokeRad: 2 },
  "八": { grup: "ひとえ (Karakter Dasar / Utuh)", nama: "はち (delapan)", strokeRad: 2 },
  "口": { grup: "ひとえ (Karakter Dasar / Utuh)", nama: "くち (mulut)", strokeRad: 3 },
  "大": { grup: "ひとえ (Karakter Dasar / Utuh)", nama: "だい (besar)", strokeRad: 3 },
  "小": { grup: "ひとえ (Karakter Dasar / Utuh)", nama: "しょう (kecil)", strokeRad: 3 },
  "山": { grup: "ひとえ (Karakter Dasar / Utuh)", nama: "やま (gunung)", strokeRad: 3 },
  "子": { grup: "ひとえ (Karakter Dasar / Utuh)", nama: "こ (anak)", strokeRad: 3 },
  "文": { grup: "ひとえ (Karakter Dasar / Utuh)", nama: "ぶん (tulisan)", strokeRad: 4 },
  "父": { grup: "ひとえ (Karakter Dasar / Utuh)", nama: "ちち (ayah)", strokeRad: 4 },
  "止": { grup: "ひとえ (Karakter Dasar / Utuh)", nama: "とめる (berhenti)", strokeRad: 4 },
  "田": { grup: "ひとえ (Karakter Dasar / Utuh)", nama: "た (sawah)", strokeRad: 5 },
  "白": { grup: "ひとえ (Karakter Dasar / Utuh)", nama: "しろ (putih)", strokeRad: 5 },
  "生": { grup: "ひとえ (Karakter Dasar / Utuh)", nama: "せい (lahir/hidup)", strokeRad: 5 },
  "立": { grup: "ひとえ (Karakter Dasar / Utuh)", nama: "たつ (berdiri)", strokeRad: 5 },
  "肉": { grup: "ひとえ (Karakter Dasar / Utuh)", nama: "にく (daging)", strokeRad: 6 },
  "風": { grup: "ひとえ (Karakter Dasar / Utuh)", nama: "かぜ (angin)", strokeRad: 9 },
  "高": { grup: "ひとえ (Karakter Dasar / Utuh)", nama: "たかい (tinggi)", strokeRad: 10 },
  "里": { grup: "ひとえ (Karakter Dasar / Utuh)", nama: "さと (kampung)", strokeRad: 7 },
  "矢": { grup: "ひとえ (Karakter Dasar / Utuh)", nama: "や (panah)", strokeRad: 5 }
};

export function buildGroupedKanjiDatabase() {
  const inputPath = path.join('public', 'kanji-jft-a2.json');
  const kanjiList = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

  const enrichedList = kanjiList.map(item => {
    const rad = item.radical || "Lainnya";
    const pos = RADICAL_POSITIONS[rad] || {
      grup: "ひとえ (Karakter Dasar / Utuh)",
      nama: item.radName || rad,
      strokeRad: 4
    };

    return {
      ...item,
      grupRadikal: pos.grup,
      namaRadikal: pos.nama,
      strokeRadikal: pos.strokeRad
    };
  });

  // Urutan hierarki grup resmi
  const GRUP_ORDER = [
    "へん (Hen - Sisi Kiri)",
    "つくり (Tsukuri - Sisi Kanan)",
    "かんむり (Kanmuri - Sisi Atas)",
    "あし (Ashi - Sisi Bawah)",
    "かまえ (Kamae - Bingkai Keliling)",
    "たれ (Tare - Menjuntai Atas-Kiri)",
    "にょう (Nyou - Menjuntai Kiri-Bawah)",
    "ひとえ (Karakter Dasar / Utuh)"
  ];

  // Sorting bertingkat:
  // 1. Grup Radikal (urutan resmi 7 posisi)
  // 2. Radikal (berdasarkan abjad/simbol radikal)
  // 3. Jumlah Coretan Kanji (sedikit ke banyak: ASC)
  enrichedList.sort((a, b) => {
    const idxA = GRUP_ORDER.indexOf(a.grupRadikal);
    const idxB = GRUP_ORDER.indexOf(b.grupRadikal);
    if (idxA !== idxB) return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);

    if (a.radical !== b.radical) return a.radical.localeCompare(b.radical, 'ja');

    return a.stroke - b.stroke;
  });

  fs.writeFileSync(inputPath, JSON.stringify(enrichedList, null, 2), 'utf8');

  console.log(`=== DATABASE KANJI DENGAN GRUP RADIKAL SELESAI ===`);
  console.log(`Total Kanji: ${enrichedList.length}`);
  console.log(`Grup Radikal: ${GRUP_ORDER.length}`);
}

buildGroupedKanjiDatabase();
