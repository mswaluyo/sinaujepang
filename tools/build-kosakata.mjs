// tools/build-kosakata.mjs — ekstrak kosakata dari semua quiz-data.json -> public/kosakata.json
// Jalankan: node tools/build-kosakata.mjs
// Output: [{kanji, kana, rom, arti, paket, benar}] — benar=true bila opsi = jawaban soal
import fs from "node:fs";
import path from "node:path";

const root = "public";
const dirs = fs.readdirSync(root, { withFileTypes: true }).filter(d => d.isDirectory() && d.name.endsWith("-quiz")).map(d => d.name);
const out = [];
for (const dir of dirs) {
  const f = path.join(root, dir, "quiz-data.json");
  if (!fs.existsSync(f)) continue;
  let data;
  try { data = JSON.parse(fs.readFileSync(f, "utf8")); } catch (e) { console.log("LEWAT (json rusak):", f); continue; }
  const items = Array.isArray(data) ? data : (data.items || data.questions || []);
  items.forEach(q => {
    const opts = q.options || [];
    const det = q.opt_detail || [];
    const ans = q.answer;
    opts.forEach((o, i) => {
      const teks = typeof o === "string" ? o : (o.text || "");
      const d = det[i] || {};
      if (!teks && !d.kana) return;
      const kan = (teks || "") + " " + (d.kana || "") + " " + (d.rom || "") + " " + (d.arti || "");
      // Lewati opsi non-kosakata (listening gambar/audio, pengecoh, label teknis)
      if (/gambar|audio|tidak disebut|bukan jawaban|kunci jawaban|pengecoh|^opsi_?\d?$|^opsi \d$|^pilihan [abc\d]$|^opsi [abc\d]$/i.test(kan)) return;
      if (!d.kana && !d.arti) return;
      // Wajib mengandung huruf Jepang (hiragana/katakana/kanji) di kana ATAU teks
      const jp = (teks || "") + (d.kana || "");
      if (!/[぀-ヿ一-鿿々〆]/.test(jp)) return;
      // Lewati entri waktu/angka murni (jam, tanggal, yen, lembar, menit, lantai, umur)
      // — ini pola kalimat, bukan kosakata hafalan. Syarat lolos: kana mengandung
      // minimal 2 huruf Jepang non-angka/waktu ATAU arti mengandung kata kerja/sifat/benda.
      const STOP = /^(jam|pukul|tanggal|hari|bulan|tahun|menit|detik|yen|lembar|batang|lantai|halaman|pintu|saluran|bus|jadwal|acara|opsi|pilihan|posisi|kunci|cara|orang|gula|saluran)/i;
      if (STOP.test((d.arti || "").trim())) return;
      // Arti harus mengandung minimal 2 huruf latin (bukan angka/titik saja)
      if (((d.arti || "").match(/[a-zA-Z]{2,}/g) || []).join("").length < 2) return;
      // Kana: buang pola waktu/angka; sisa huruf Jepang minimal 3 (kata beneran)
      const kanaN = (d.kana || "").replace(/[0-9０-９:：／\/\.\s時分月日曜火水木金土円枚回番線歳才週分ぷんじふんがつにちようび〜～ー・]/g, "");
      if ((kanaN.match(/[぀-ヿ一-鿿]/g) || []).length < 3) return;
      out.push({
        kanji: teks || "",
        kana: d.kana || "",
        rom: d.rom || "",
        arti: d.arti || "",
        paket: dir,
        benar: ans != null ? i === ans : false,
      });
    });
  });
}
// Dedup: kanji+kana+arti sama -> gabung paket
const seen = new Map();
for (const e of out) {
  const k = (e.kanji + "|" + e.kana + "|" + e.arti).toLowerCase();
  if (seen.has(k)) {
    const p = seen.get(k);
    if (!p.paket.includes(e.paket)) p.paket.push(e.paket);
    p.benar = p.benar || e.benar;
  } else seen.set(k, { ...e, paket: [e.paket] });
}
const arr = [...seen.values()].sort((a, b) => (a.kanji || a.kana).localeCompare(b.kanji || b.kana, "ja"));
fs.writeFileSync(path.join(root, "kosakata.json"), JSON.stringify({ dibuat: new Date().toISOString(), jumlah: arr.length, data: arr }, null, 1));
console.log(`Paket: ${dirs.length}, entri mentah: ${out.length}, unik: ${arr.length} -> public/kosakata.json`);
