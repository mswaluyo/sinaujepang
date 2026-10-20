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
      // Lewati opsi non-kosakata (soal listening berbasis gambar/audio)
      const kan = (teks || "") + " " + (d.kana || "") + " " + (d.rom || "") + " " + (d.arti || "");
      if (/gambar|audio|tidak disebut|bukan jawaban|kunci jawaban/i.test(kan)) return;
      if (!d.kana && !d.arti) return;
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
