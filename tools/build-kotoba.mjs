// tools/build-kotoba.mjs — saring kotoba DASAR dari kosakata.json -> public/assets/js/kotoba-data.js
// Kotoba dasar = 1 kata (tanpa spasi) + frasa pendek <= 3 kata tanpa pola kalimat
// (tanpa です/ます/ください/ましょう/ desu/masu/kudasai, tanpa angka, tanpa tanda baca kalimat).
// Jalankan: node tools/build-kotoba.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, "..");
const src = JSON.parse(fs.readFileSync(path.join(ROOT, "public", "kosakata.json"), "utf8"));
const KALIMAT = /(です|ます|ください|ましょう|ませんか|たいです|ほしい|なくて|なくちゃ|なさい|しなさい|[。、？！?.!])/;
let buangKalimat = 0, buangAngka = 0;
const out = [];
for (const e of (src.data || [])) {
  const kata = (e.kanji || e.kana || "").trim();
  const kana = (e.kana || "").trim();
  const arti = (e.arti || "").trim();
  if (!kata || !arti) continue;
  const nKata = kata.split(/\s+/).filter(Boolean).length;
  if (KALIMAT.test(kata) || KALIMAT.test(kana)) { buangKalimat++; continue; }
  // Kata dasar: harus diawali huruf Jepang (kanji/kana), bukan latin/angka
  if (!/^[぀-ヿ一-鿿々〆]/.test(kata)) { buangKalimat++; continue; }
  // Bentuk -mashita (lampau) bukan kotoba dasar; kata dasarnya ada di entri masu/dictionary
  if (/ました$/.test(kana)) { buangKalimat++; continue; }
  // Buang opsi pengecoh salah-eja (artinya menandai bukan kata baku)
  if (/salah eja|bukan kata baku|pengecoh/i.test(arti)) { buangKalimat++; continue; }
  // Maksimal 2 kata; frasa 3 kata (mis. Gedung olahraga kota) bukan kotoba dasar
  if (nKata > 2) { buangKalimat++; continue; }
  // Buang pola waktu/angka: mengandung digit + penanda waktu/satuan
  if (/[0-9０-９]/.test(kata) && /[時分月日曜火水木金土円枚回番線歳才週時間分じふんがつにち]/.test(kata)) { buangAngka++; continue; }
  out.push({ k: kata, kana, r: e.rom || "", a: arti, p: (e.paket || []).map(p => p.replace("-quiz", "")) });
}
out.sort((a, b) => a.k.localeCompare(b.k, "ja"));
const js = "// kotoba-data.js — KOTOBA DASAR hasil saring otomatis dari soal (jangan edit manual).\n"
  + "// Dibuat: " + new Date().toISOString() + " | jumlah: " + out.length + "\n"
  + "// Regenerasi: node tools/build-kotoba.mjs (baca: public/kosakata.json)\n"
  + "window.KOTOBA_DASAR = "
  + JSON.stringify(out.map(o => [o.k, o.kana, o.r, o.a, o.p.join(",")])) + ";\n"
  + "// Format per entri: [kata, kana, romaji, arti, \"paket1,paket2\"]\n";
fs.writeFileSync(path.join(ROOT, "public", "assets", "js", "kotoba-data.js"), js);
console.log(`kosakata: ${src.jumlah} -> kotoba dasar: ${out.length} (buang kalimat: ${buangKalimat}, angka: ${buangAngka})`);
