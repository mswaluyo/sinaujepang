// tools/build-kanji.mjs — daftar KANJI dari semua quiz-data.json -> public/assets/js/kanji-data.js
// Tiap kanji: karakter, bacaan (kana dari kotoba yg memuatnya), arti (dari kotoba),
// contoh kata (s.d. 3 dari kotoba-data), paket. Cara baca on/kun tidak ditebak —
// kolom bacaan diisi dari data kana yang sudah ada (jujur, bukan karangan).
// Jalankan: node tools/build-kanji.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));

// Peta kanji -> radikal (radikal utama penyusun, gaya explorer radikal).
// Format: "KANJI": ["radikal", "nama radikal"]
const RAD = {
  "一": ["一", "satu"], "二": ["二", "dua"], "三": ["三", "tiga"],
  "人": ["人", "orang"], "休": ["人", "orang"], "仕": ["人", "orang"], "使": ["人", "orang"], "住": ["人", "orang"], "作": ["人", "orang"],
  "入": ["入", "masuk"], "八": ["八", "delapan"],
  "刀": ["刀", "pedang"], "切": ["刀", "pedang"], "分": ["刀", "pedang"],
  "力": ["力", "kekuatan"], "勉": ["力", "kekuatan"], "動": ["力", "kekuatan"], "働": ["力", "kekuatan"],
  "水": ["水", "air"], "泳": ["水", "air"], "沖": ["水", "air"], "汚": ["水", "air"], "湖": ["水", "air"], "洗": ["水", "air"], "浴": ["水", "air"], "濯": ["水", "air"],
  "火": ["火", "api"], "煮": ["火", "api"],
  "木": ["木", "pohon"], "休2": ["木", "pohon"], "林": ["木", "pohon"], "校": ["木", "pohon"],
  "日": ["日", "matahari"], "明": ["日", "matahari"], "曜": ["日", "matahari"], "晴": ["日", "matahari"], "時": ["日", "matahari"], "映": ["日", "matahari"],
  "月": ["月", "bulan"], "有": ["月", "bulan"], "服": ["月", "bulan"], "朝": ["月", "bulan"],
  "田": ["田", "sawah"], "男": ["田", "sawah"], "町": ["田", "sawah"],
  "目": ["目", "mata"], "見": ["目", "mata"], "覚": ["目", "mata"], "眠": ["目", "mata"],
  "耳": ["耳", "telinga"], "聞": ["耳", "telinga"], "職": ["耳", "telinga"],
  "口": ["口", "mulut"], "古": ["口", "mulut"], "問": ["口", "mulut"], "味": ["口", "mulut"], "命": ["口", "mulut"],
  "手": ["手", "tangan"], "持": ["手", "tangan"], "指": ["手", "tangan"], "拾": ["手", "tangan"], "掃": ["手", "tangan"],
  "足": ["足", "kaki"], "走": ["足", "kaki"], "起": ["足", "kaki"], "超": ["足", "kaki"],
  "車": ["車", "kendaraan"], "転": ["車", "kendaraan"], "輸": ["車", "kendaraan"], "連": ["車", "kendaraan"],
  "言": ["言", "ucapan"], "話": ["言", "ucapan"], "語": ["言", "ucapan"], "読": ["言", "ucapan"], "試": ["言", "ucapan"], "計": ["言", "ucapan"],
  "金": ["金", "emas"], "銀": ["金", "emas"], "錢": ["金", "emas"],
  "食": ["食", "makan"], "飲": ["食", "makan"], "飯": ["食", "makan"],
  "雨": ["雨", "hujan"], "雪": ["雨", "hujan"], "雲": ["雨", "hujan"], "電": ["雨", "hujan"], "雷": ["雨", "hujan"], "曇": ["雨", "hujan"],
  "魚": ["魚", "ikan"],
  "鳥": ["鳥", "burung"], "鶏": ["鳥", "burung"],
  "馬": ["馬", "kuda"], "駅": ["馬", "kuda"],
  "虫": ["虫", "serangga"], "蚊": ["虫", "serangga"],
  "心": ["心", "hati"], "思": ["心", "hati"], "急": ["心", "hati"], "怪": ["心", "hati"], "憩": ["心", "hati"],
  "女": ["女", "perempuan"], "好": ["女", "perempuan"], "始": ["女", "perempuan"], "妻": ["女", "perempuan"],
  "子": ["子", "anak"], "学": ["子", "anak"], "字": ["子", "anak"],
  "宀": ["宀", "atap"], "家": ["宀", "atap"], "室": ["宀", "atap"], "宿": ["宀", "atap"], "寒": ["宀", "atap"], "寝": ["宀", "atap"],
  "广": ["广", "atap miring"], "店": ["广", "atap miring"], "度": ["广", "atap miring"], "座": ["广", "atap miring"],
  "門": ["門", "gerbang"], "問2": ["門", "gerbang"], "間": ["門", "gerbang"], "開": ["門", "gerbang"], "閉": ["門", "gerbang"],
  "山": ["山", "gunung"], "岩": ["山", "gunung"], "岸": ["山", "gunung"],
  "川": ["川", "sungai"], "州": ["川", "sungai"],
  "田2": ["田", "sawah"],
};
// Normalisasi: kunci duplikat (休2, 問2, 田2) dipetakan ke kanji aslinya
const RADN = {};
for (const [k, v] of Object.entries(RAD)) {
  const kanji = k.replace(/2$/, "");
  if (!RADN[kanji]) RADN[kanji] = v;
}
const ROOT = path.join(HERE, "..");
const KK = /[一-鿿々〆]/;

// Muat kotoba (sumber kana+arti+contoh)
const kotoba = [];
for (const f of ["kotoba-verb.js", "kotoba-adj.js", "kotoba-noun.js"]) {
  try {
    const t = fs.readFileSync(path.join(ROOT, "public", "assets", "js", f), "utf8");
    const a = JSON.parse(t.slice(t.indexOf("["), t.lastIndexOf(";")));
    a.forEach(e => kotoba.push({ k: e[0], kana: e[1], a: e[3], p: String(e[4] || "").split(",").filter(Boolean) }));
  } catch (e) { console.log("LEWAT:", f); }
}
// Peta kanji -> {baca:Set, artiCount:Map, contoh:[], paket:Set}
const M = new Map();
for (const w of kotoba) {
  const chars = [...new Set((w.k.match(new RegExp(KK.source, "g")) || []))];
  for (const c of chars) {
    if (!M.has(c)) M.set(c, { baca: new Set(), arti: new Map(), contoh: [], paket: new Set() });
    const o = M.get(c);
    if (w.kana) o.baca.add(w.kana);
    if (w.a) o.arti.set(w.a, (o.arti.get(w.a) || 0) + 1);
    if (o.contoh.length < 3) o.contoh.push(w.k);
    (w.p || []).forEach(p => o.paket.add(p));
  }
}
const arr = [...M.entries()].map(([c, o]) => [
  c,
  [...o.baca].slice(0, 3).join("・"),
  [...o.arti.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(x => x[0]).join(" / "),
  o.contoh.join("、"),
  [...o.paket].join(","),
]).sort((a, b) => a[0].localeCompare(b[0], "ja"));
const js = "// kanji-data.js — DAFTAR KANJI hasil ekstrak otomatis dari kotoba (jangan edit manual).\n"
  + "// Dibuat: " + new Date().toISOString() + " | jumlah: " + arr.length + "\n"
  + "// Regenerasi: node tools/build-kanji.mjs\n"
  + "window.KANJI_DATA = " + JSON.stringify(arr) + ";\n"
  + "// Format per entri: [kanji, bacaan, arti, \"contoh1、contoh2\", \"paket1,paket2\"]\n";
fs.writeFileSync(path.join(ROOT, "public", "assets", "js", "kanji-data.js"), js);
console.log(`kotoba: ${kotoba.length} -> kanji unik: ${arr.length}`);
console.log(JSON.stringify(arr.slice(0, 8)));
