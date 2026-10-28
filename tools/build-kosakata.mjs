// tools/build-kosakata.mjs — ekstrak kosakata dari semua quiz-data.json -> public/kosakata.json
// Jalankan: node tools/build-kosakata.mjs
// Output: [{kanji, kana, rom, arti, paket, benar}] — benar=true bila opsi = jawaban soal
import fs from "node:fs";
import path from "node:path";

const root = "public";
const dirs = fs.readdirSync(root, { withFileTypes: true })
  .filter(d => d.isDirectory() && d.name.endsWith("-quiz"))
  .map(d => d.name);

const out = [];

// Kata penghubung/pola kalimat yang menandakan bukan kosakata murni
const SENTENCE_PATTERN = /(?:です|でした|ますか|ました|ません|ましょう|てください|てはいけません|てもいいです|と思います|とおもいます|でしょうか|んですが|から.*まで|さんと|〜|～|・|、|。|\?|!|？|！)/;

// Pola kata respon dialog / kalimat utuh
const DIALOG_STARTERS = /^(?:いいえ|はい|ええ|じゃあ|それでは|すみません|ごめん|おはよう|こんにちは|こんばんは)/;

// Stopword awal terjemahan yang biasanya berupa frasa/instruksi/pilihan teknis
const STOP_ARTI = /^(?:pilihan|opsi|kunci|jawaban|gambar|audio|tuan|nyonya|tidak|bukan|masukkan|membuang|memanggang|jangan|boleh|sesudah|sebelum|sekali|setiap|apakah|bagaimana|kapan|dimana|siapa|kenapa|mengapa|mengisi|mematikan|menyalakan|pergi ke|datang ke)/i;

for (const dir of dirs) {
  const f = path.join(root, dir, "quiz-data.json");
  if (!fs.existsSync(f)) continue;
  let data;
  try {
    data = JSON.parse(fs.readFileSync(f, "utf8"));
  } catch (e) {
    console.log("LEWAT (json rusak):", f);
    continue;
  }
  const items = Array.isArray(data) ? data : (data.items || data.questions || []);

  items.forEach(q => {
    const opts = q.options || [];
    const det = q.opt_detail || [];
    const ans = q.answer;

    opts.forEach((o, i) => {
      const teks = (typeof o === "string" ? o : (o.text || "")).trim();
      const d = det[i] || {};
      const kana = (d.kana || "").trim();
      const rom = (d.rom || "").trim();
      const arti = (d.arti || "").trim();

      if (!teks && !kana) return;

      const fullText = `${teks} ${kana} ${rom} ${arti}`;

      // 1. Lewati jika mengandung angka (angka latin 0-9 atau fullwidth ０-９)
      if (/[0-9０-９]/.test(fullText)) return;

      // 2. Lewati satuan waktu/angka, penomoran, harga, usia murni
      if (/[時分月日曜火水木金土円枚回番線歳才週階個本匹頭羽台]/g.test(teks) && /^(?:\d|[一二三四五六七八九十百千万])/.test(teks)) return;

      // 3. Lewati label teknis atau placeholder kuis
      if (/gambar|audio|tidak disebut|bukan jawaban|kunci jawaban|pengecoh|keliru|bentuk salah|^opsi_?\d?$|^opsi \d$|^pilihan [abc\d]$|^opsi [abc\d]$/i.test(fullText)) return;
      if (/keliru|bentuk salah|salah/i.test(arti)) return;

      // 4. Wajib mengandung huruf Jepang di kana atau teks
      const jp = teks + kana;
      if (!/[぀-ヿ一-鿿々〆]/.test(jp)) return;

      // 5. Tolak jika ada tanda baca kalimat atau pola kalimat / dialog
      if (/[。、?!？！\n\r]/.test(teks) || /[。、?!？！\n\r]/.test(kana)) return;
      if (SENTENCE_PATTERN.test(kana) || SENTENCE_PATTERN.test(teks)) return;
      // Lewati frasa kalimat dengan partikel objek/arah (contoh: を持っていく, をする, に行く)
      if (/[をがにへでと]/.test(teks) && teks.length > 5) return;
      if (/[をがにへでと]/.test(kana) && kana.length > 5) return;
      if (DIALOG_STARTERS.test(kana) || DIALOG_STARTERS.test(teks)) return;

      // 6. Panjang teks maksimal untuk kosakata (hindari kalimat panjang)
      // Kana kosakata murni bahasa Jepang umumnya <= 10 mora (misal: あいさつします = 7 mora)
      if (kana.length > 11 || teks.length > 12) return;

      // 7. Terjemahan arti maksimal 3-4 kata (bukan kalimat penjelas)
      const artiWords = arti.split(/\s+/).filter(Boolean);
      if (artiWords.length > 4) return;
      if (STOP_ARTI.test(arti)) return;

      // 8. Arti harus valid alfabet latin minimal 2 karakter
      if (((arti.match(/[a-zA-Z]{2,}/g) || []).join("")).length < 2) return;

      // 9. Validasi panjang kana minimal (2-3 karakter untuk kata utuh)
      const cleanKana = kana.replace(/[〜～ー・\s]/g, "");
      if (cleanKana.length < 2) return;

      out.push({
        kanji: /[぀-ヿ一-鿿々〆]/.test(teks) ? teks : kana,
        kana: kana || teks,
        rom: rom || "",
        arti: arti || "",
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
  } else {
    seen.set(k, { ...e, paket: [e.paket] });
  }
}

const arr = [...seen.values()].sort((a, b) => (a.kanji || a.kana).localeCompare(b.kanji || b.kana, "ja"));
fs.writeFileSync(
  path.join(root, "kosakata.json"),
  JSON.stringify({ dibuat: new Date().toISOString(), jumlah: arr.length, data: arr }, null, 2)
);

console.log(`Paket: ${dirs.length}, entri mentah: ${out.length}, unik bersih: ${arr.length} -> public/kosakata.json`);
