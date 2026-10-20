// tools/build-explorer.mjs — gabung kanji-data.js + rad-data.js + kotoba-*.js
// menjadi SATU file statis: public/assets/js/explorer-data.js
// Isi final per radikal: {kana, romaji, arti, kanji: [{ch, bacaan, arti, vocab:[{k,kana,rom,a,asal}]}]}
// Halaman kanji.html HANYA membaca file ini (tidak render mentah file sumber).
// Jalankan: node tools/build-explorer.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, "..");
const loadArr = f => {
  const t = fs.readFileSync(path.join(ROOT, "public", "assets", "js", f), "utf8");
  return JSON.parse(t.slice(t.indexOf("["), t.lastIndexOf(";")));
};
const loadObj2 = f => {
  const t = fs.readFileSync(path.join(ROOT, "public", "assets", "js", f), "utf8");
  const m = t.match(/window\.RAD_DATA = (\{.*?\});/s);
  const m2 = t.match(/window\.RAD_OF = (\{.*?\});/s);
  return { RAD: JSON.parse(m[1]), OF: JSON.parse(m2[1]) };
};
const KN = loadArr("kanji-data.js");
const KMAP = Object.fromEntries(KN.map(e => [e[0], { bacaan: e[1], arti: e[2] }]));
const { RAD, OF } = loadObj2("rad-data.js");
const KOTOBA = [];
for (const f of ["kotoba-verb.js", "kotoba-adj.js", "kotoba-noun.js"])
  loadArr(f).forEach(e => KOTOBA.push({ k: e[0], kana: e[1], rom: e[2], a: e[3], asal: e[5] || "" }));
const byKanji = {};
for (const w of KOTOBA) {
  // Taut langsung: karakter kanji di kata ATAU di asal gabungannya
  const chars = new Set([...w.k, ...(w.asal || "")].filter(c => KMAP[c] && /[一-鿿々〆]/.test(c)));
  for (const ch of chars) (byKanji[ch] = byKanji[ch] || []).push(w);
}
for (const ch of Object.keys(byKanji))
  byKanji[ch] = byKanji[ch].sort((a, b) => a.k.length - b.k.length).slice(0, 8)
    .map(w => ({ k: w.k, kana: w.kana, rom: w.rom, a: w.a, asal: w.asal }));
const out = {};
for (const [r, d] of Object.entries(RAD)) {
  out[r] = {
    kana: d.kana || "", romaji: d.romaji || "", arti: d.arti || "",
    kanji: (d.kanji || []).filter(ch => KMAP[ch]).map(ch => ({
      ch, bacaan: KMAP[ch].bacaan || "", arti: KMAP[ch].arti || "",
      vocab: byKanji[ch] || [],
    })),
  };
}
const js = "// explorer-data.js — DATA FINAL Kanji Explorer (hasil build, jangan edit manual).\n"
  + "// Dibuat: " + new Date().toISOString() + " | radikal: " + Object.keys(out).length + "\n"
  + "// Regenerasi: node tools/build-explorer.mjs\n"
  + "window.EXPLORER_DATA = " + JSON.stringify(out) + ";\n";
fs.writeFileSync(path.join(ROOT, "public", "assets", "js", "explorer-data.js"), js);
const nv = Object.values(out).reduce((n, r) => n + r.kanji.reduce((m, k) => m + k.vocab.length, 0), 0);
console.log(`radikal: ${Object.keys(out).length}, kosakata tertaut: ${nv}`);
