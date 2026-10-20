// tools/build-kotoba.mjs — pipeline master-kurasi.
// SUMBER KEBENARAN = 4 file master (edit ini saja):
//   public/kotoba-kerja.json    verba  (kanji, kana, rom, arti)
//   public/kotoba-sifat.json    sifat  (kanji, kana, rom, arti)
//   public/kotoba-benda.json    benda  (kanji, kana, rom, arti)
//   public/kotoba-ungkapan.json frasa  (kanji, kana, rom, arti)
// kosakata.json (ekstraksi soal) hanya untuk menambah daftar paket
// dan menulis laporan kandidat -> tools/kotoba-kandidat.json.
// Verba di soal (〜ます/〜ました/〜ません/〜ましょう/kamus) dinormalkan
// ke bentuk -masu lalu dicocokkan ke master. Jalankan:
//   node tools/build-kotoba.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, "..");
const KOS = path.join(ROOT, "public", "kosakata.json");
const PUB = path.join(ROOT, "public");
const OUT = path.join(PUB, "assets", "js");

// ---------- master ----------
const bacaMaster = f => {
  const p = path.join(PUB, f);
  if (!fs.existsSync(p)) { console.error("MASTER HILANG: " + f + " (jalankan tools/seed-master.mjs)"); process.exit(1); }
  return JSON.parse(fs.readFileSync(p, "utf8")).map(e => ({
    kanji: (e.kanji || e.kana || "").trim(),
    kana: (e.kana || "").trim(),
    rom: (e.rom || "").trim(),
    arti: (e.arti || "").trim(),
    paket: new Set(e.paket || []),
  }));
};
const master = {
  V: bacaMaster("kotoba-kerja.json"),
  A: bacaMaster("kotoba-sifat.json"),
  N: bacaMaster("kotoba-benda.json"),
  U: bacaMaster("kotoba-ungkapan.json"),
};

// ---------- normalisasi verba ke bentuk -masu ----------
// -masen/-mashita/-mashou -> -masu; bentuk kamus godan/ichidan/aru/kuru/suru -> -masu.
function toMasu(kana) {
  let k = kana;
  if (/ませんでした$/.test(k)) return k.replace(/ませんでした$/, "ます");
  if (/ました$/.test(k)) return k.replace(/ました$/, "ます");
  if (/ません$/.test(k)) return k.replace(/ません$/, "ます");
  if (/ましょう$/.test(k)) return k.replace(/ましょう$/, "ます");
  const map = {
    "う": "います", "く": "きます", "ぐ": "ぎます", "す": "します", "つ": "ちます",
    "ぬ": "にます", "ぶ": "びます", "む": "みます", "る": "ります",
    "える": "えます", "ける": "けます", "げる": "げます", "せる": "せます",
    "てる": "てます", "ねる": "ねます", "へる": "へます", "める": "めます",
    "れる": "れます", "いる": "います", "きる": "きます", "ぎる": "ぎます",
    "しる": "します", "じる": "じます", "ちる": "ちます", "にる": "にます",
    "ひる": "ひます", "びる": "びます", "みる": "みます",
    "する": "します", "くる": "きます", "いく": "いきます", "ゆく": "ゆきます",
    "ある": "あります", "わかる": "わかります",
  };
  const keys = Object.keys(map).sort((a, b) => b.length - a.length); // pola panjang dulu
  for (const akhir of keys) {
    const ganti = map[akhir];
    if (k.endsWith(akhir) && k.length > akhir.length) return k.slice(0, -akhir.length) + ganti;
  }
  return null;
}

// ---------- indeks master ----------
const romKey = s => s.toLowerCase().replace(/[\s'’-]/g, "");
const idxKana = new Map();  // kana -> {e, j}
const idxRom = new Map();   // romaji tanpa spasi -> {e, j}
for (const j of ["V", "A", "N", "U"]) {
  for (const e of master[j]) {
    if (e.kana && !idxKana.has(e.kana)) idxKana.set(e.kana, { e, j });
    if (e.rom && !idxRom.has(romKey(e.rom))) idxRom.set(romKey(e.rom), { e, j });
  }
}

// ---------- pemrosesan kandidat dari soal ----------
const KAL = /です|ます|ました|ません|ましょう|ください|ますか|ませんか|たいです|ており|います|ありません|いました/;
const buangKata = /^(ありがつね|ありがとねです|はい、いいえです|おだいじに)/;
const src = fs.existsSync(KOS) ? JSON.parse(fs.readFileSync(KOS, "utf8")) : { data: [] };
const kandidat = new Map(); // key -> entri laporan
let cocok = 0, dibuang = 0;

for (const e of src.data || []) {
  const kata = (e.kata || "").trim();
  const kana = (e.kana || "").trim();
  const rom = (e.rom || "").trim();
  const arti = (e.arti || "").trim();
  const paket = (e.paket || []).map(p => p.replace("-quiz", ""));
  if (!kana || !arti) continue;

  // 1) cocok exact kana (semua jenis)
  let hit = idxKana.get(kana);
  // 2) verba: wujud lain -> -masu
  if (!hit && /(ませんでした|ました|ません|ましょう|ます)$/.test(kana)) {
    const m = toMasu(kana);
    if (m && idxKana.get(m)?.j === "V") hit = idxKana.get(m);
  }
  // 3) pembanding romaji (mis. kana berhuruf kanji di soal)
  if (!hit && rom) hit = idxRom.get(romKey(rom));
  if (hit) {
    cocok++;
    paket.forEach(p => hit.e.paket.add(p));
    continue;
  }

  // bukan master -> laporan kandidat (buang noise)
  if (/[a-zA-Z]/.test(kata + kana)) { dibuang++; continue; }
  if (buangKata.test(kana) || buangKata.test(kata)) { dibuang++; continue; }
  if (KAL.test(kata) && /(ます|です)。/.test(kata)) { dibuang++; continue; }
  if (!/^[぀-ヿ々〆一-鿿]/.test(kana)) { dibuang++; continue; } // diawali huruf JP
  const masu = toMasu(kana);
  const key = masu || kana;
  if (!kandidat.has(key)) {
    kandidat.set(key, {
      kana: masu || kana, kanaAsli: kana, rom, arti,
      alasan: masu && masu !== kana
        ? "kata kerja (" + kana + " -> " + masu + ") belum ada di master"
        : "kata baru belum ada di master",
      paket: [...new Set(paket)],
    });
  } else {
    paket.forEach(p => { if (!kandidat.get(key).paket.includes(p)) kandidat.get(key).paket.push(p); });
  }
}

// ---------- laporan kandidat ----------
const kandArr = [...kandidat.values()].sort((a, b) => a.kana.localeCompare(b.kana, "ja"));
fs.writeFileSync(path.join(HERE, "kotoba-kandidat.json"),
  JSON.stringify({ jumlah: kandArr.length, data: kandArr }, null, 1), "utf8");

// ---------- tulis file situs ----------
const pack = arr => arr
  .map(e => [e.kanji || e.kana, e.kana, e.rom, e.arti, [...e.paket].join(","), ""])
  .sort((a, b) => a[1].localeCompare(b[1], "ja"));
const tulis = (f, arr, j) => {
  fs.writeFileSync(path.join(OUT, f),
    "window.KOTOBA_" + j + "=" + JSON.stringify(pack(arr)) + ";\n", "utf8");
  console.log(f.padEnd(14) + " " + String(arr.length).padStart(4) + " entri");
};
tulis("kotoba-verb.js", master.V, "VERB");
tulis("kotoba-adj.js", master.A, "ADJ");
tulis("kotoba-noun.js", master.N, "NOUN");
tulis("kotoba-ungk.js", master.U, "UNGK");
const dasar = [...master.V, ...master.A, ...master.N, ...master.U].map(e => [e.kana, e.arti]);
fs.writeFileSync(path.join(OUT, "kotoba-data.js"),
  "window.KOTOBA_DASAR=" + JSON.stringify(dasar) + ";\n", "utf8");
const pakets = [...new Set([...master.V, ...master.A, ...master.N, ...master.U].flatMap(e => [...e.paket]))].sort();
console.log("kotoba-data.js  " + dasar.length + " entri | pakets: " + pakets.join(", "));
console.log("kandidat baru: " + kandArr.length + " (tools/kotoba-kandidat.json) | noise dibuang: " + dibuang);

