# **Panduan & Standar Format Pembuatan Soal Kuis (SinauJepang)**

Dokumen ini adalah acuan standar struktur data dan validasi pembuatan paket soal kuis CBT di platform SinauJepang (`public/<paket>-quiz/quiz-data.json`).

---

## 1. Field Wajib Setiap Soal

| Field | Tipe | Deskripsi & Nilai Standar |
|---|---|---|
| `no` | Number | Nomor urut soal unik (mulai dari 1 berurutan). |
| `section` | String | Sesi ujian: `"SESI 1 : MOJIGOI"`, `"SESI 2 : HYOUGEN"`, `"SESI 3 : CHOUKAI"`, atau `"SESI 4 : DOKKAI"`. |
| `title` | String | Teks pertanyaan, kalimat dialog, atau kalimat soal dalam bahasa Jepang. |
| `img` | String | Path relatif gambar (contoh: `"images/soal_1.jpg"`), atau string kosong `""` jika tanpa gambar. |
| `link` | String | (Opsional / Choukai) Path relatif audio listening (contoh: `"assets/audio/no_1.m4a"`). |
| `options` | Array | Array 3 pilihan jawaban: `[{ "text": "...", "img": "" }, ...]`. |
| `answer` | Number | Indeks jawaban yang benar (`0`, `1`, atau `2`). |
| `score` | String | Nilai bobot soal: `"0/4"`. |
| `trans` | String | Terjemahan bahasa Indonesia untuk soal/dialog. |
| `trans_rom` | String | Romaji untuk soal, atau `"-"` jika tidak diperlukan. |
| `mnn` | String | Kategori Minna no Nihongo / tipe soal: `"Mojigoi"`, `"Hyougen"`, `"Choukai"`, atau `"Dokkai"`. |
| `analisis` | String | Penjelasan pembahasan jawaban, diawali format: `"[MNN Bab X - Topik] ..."`. |
| `opt_detail` | Array | Array 3 objek rincian opsi: `[{ "kana": "...", "rom": "...", "arti": "...", "alasan": "..." }, ...]`. |
| `opt_note` | Array | Array 3 string catatan singkat per opsi: `["...", "...", "..."]`. |
| `kunci_id` | String | Teks pilihan benar dalam bahasa Jepang (harus sama persis dengan `options[answer].text`). |

---

## 2. Struktur Detail Pilihan Jawaban (`options`, `opt_detail`, `opt_note`)

Setiap soal memiliki 3 opsi dengan pasangan rincian analisis:
1. `options`: 3 elemen array `{ "text": "...", "img": "..." }`.
2. `opt_detail`: 3 elemen array `{ "kana": "...", "rom": "...", "arti": "...", "alasan": "..." }`.
3. `opt_note`: 3 string catatan per opsi.

```json
"options": [
  { "text": "はい、そうです", "img": "" },
  { "text": "いいえ、ちがいます", "img": "" },
  { "text": "わかりません", "img": "" }
],
"opt_detail": [
  { "kana": "はい、そうです", "rom": "hai, sou desu", "arti": "Ya, benar", "alasan": "Tepat untuk mengiyakan pertanyaan." },
  { "kana": "いいえ、ちがいます", "rom": "iie, chigaimasu", "arti": "Bukan, salah", "alasan": "Konteks kalimat adalah afirmatif." },
  { "kana": "わかりません", "rom": "wakarimasen", "arti": "Tidak tahu", "alasan": "Kurang tepat sesuai respon dialog." }
],
"opt_note": [
  "Jawaban tepat",
  "Pilihan pengecoh",
  "Pilihan kurang tepat"
]
```

---

## 3. Tipe Soal Berdasarkan Format

1. **Soal Gambar (Moji-Goi / Choukai):**
   - `img` terisi path gambar.
   - Deskripsi visual diletakkan di `analisis` atau `trans`.
2. **Soal Teks / Kosakata / Partikel:**
   - `title` berisi kalimat utama Jepang dengan tanda kurung `（　）`.
   - `img` berupa string kosong `""`.
3. **Soal Percakapan / Dialog:**
   - `title` berisi dialog pembicara A dan B.
4. **Soal Audio (Choukai):**
   - `link` mengarah ke file audio listening yang valid di paket terkait.

---

## 4. Checklist Validasi Sebelum Submit Soal Baru

- [ ] `no` berurutan tanpa ada nomor yang melompat atau terduplikasi.
- [ ] `section` sesuai salah satu dari 4 sesi standar (MOJIGOI, HYOUGEN, CHOUKAI, DOKKAI).
- [ ] `options` memiliki tepat 3 pilihan jawaban.
- [ ] `answer` valid bernilai 0, 1, atau 2.
- [ ] `kunci_id` sama persis dengan teks opsi di indeks `answer`.
- [ ] `opt_detail` memiliki tepat 3 elemen dengan properti lengkap (`kana`, `rom`, `arti`, `alasan`).
- [ ] `opt_note` memiliki tepat 3 elemen string.
- [ ] `analisis` memiliki penjelasan komprehensif diawali `[MNN Bab X - ...]`.
- [ ] Jalankan audit validasi: `node tools/validate-data.mjs` atau `node tools/cek-audit.mjs`.
