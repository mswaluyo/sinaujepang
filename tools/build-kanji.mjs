// tools/build-kanji.mjs — daftar KANJI dari semua quiz-data.json -> public/assets/js/kanji-data.js
// Tiap kanji: karakter, bacaan (kana dari kotoba yg memuatnya), arti (dari kotoba),
// contoh kata (s.d. 3 dari kotoba-data), paket. Cara baca on/kun tidak ditebak —
// kolom bacaan diisi dari data kana yang sudah ada (jujur, bukan karangan).
// Jalankan: node tools/build-kanji.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
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
