// tools/build-rad.mjs — bangun public/assets/js/rad-data.js dari tools/rad-data.mjs + kanji-data.js
// Format RAD_DATA: {rad: {kana, romaji, arti, kanji:[...]}}, RAD_OF: {kanji: rad}
// Jalankan: node tools/build-rad.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { M, nama } from "./rad-data.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, "..");
const t = fs.readFileSync(path.join(ROOT, "public", "assets", "js", "kanji-data.js"), "utf8");
const KN = JSON.parse(t.slice(t.indexOf("["), t.lastIndexOf(";"))).map(e => e[0]);
const byRad = {};
for (const [ch, r] of Object.entries(M)) {
  (byRad[r] = byRad[r] || []).push(ch);
}
// kana+romaji tiap radikal: dari kana kotoba bila radikal = kanji mandiri, else "-"
const kotoba = [];
for (const f of ["kotoba-verb.js", "kotoba-adj.js", "kotoba-noun.js"]) {
  try {
    const s = fs.readFileSync(path.join(ROOT, "public", "assets", "js", f), "utf8");
    JSON.parse(s.slice(s.indexOf("["), s.lastIndexOf(";"))).forEach(e => kotoba.push({ k: e[0], kana: e[1], r: e[2] }));
  } catch (e) {}
}
const kanaOf = r => {
  const w = kotoba.find(w => w.k === r);
  return w ? { kana: w.kana, romaji: w.r } : { kana: "", romaji: "" };
};
const RAD = {};
for (const [r, ks] of Object.entries(byRad)) {
  const ky = kanaOf(r);
  RAD[r] = { kana: ky.kana, romaji: ky.romaji, arti: nama[r] || "", kanji: [...new Set(ks)].sort() };
}
const OF = {};
for (const [ch, r] of Object.entries(M)) OF[ch] = r;
const miss = KN.filter(c => !M[c]);
const js = "// rad-data.js — DAFTAR RADIKAL hasil build (jangan edit manual). Edit: tools/rad-data.mjs\n"
  + "// Dibuat: " + new Date().toISOString() + " | radikal: " + Object.keys(RAD).length + "\n"
  + "// Regenerasi: node tools/build-rad.mjs\n"
  + "window.RAD_DATA = " + JSON.stringify(RAD) + ";\n"
  + "window.RAD_OF = " + JSON.stringify(OF) + ";\n";
fs.writeFileSync(path.join(ROOT, "public", "assets", "js", "rad-data.js"), js);
console.log(`radikal: ${Object.keys(RAD).length}, kanji terpetakan: ${Object.keys(OF).length}/${KN.length}, belum: ${miss.length}`);
if (miss.length) console.log("BELUM: " + miss.join(""));
