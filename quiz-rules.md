# **Panduan & Standar Format Pembuatan Soal Kuis (SinauJepang)**

Dokumen ini adalah acuan standar struktur data dan validasi pembuatan paket soal kuis CBT di platform SinauJepang (`public/<paket>-quiz/quiz-data.json`).

---

## 1. Field Wajib Setiap Soal

| Field | Tipe | Deskripsi & Nilai Standar |
|---|---|---|
| `no` | Number | Nomor urut soal unik (mulai dari 1 berurutan). |
| `section` | String | Sesi ujian: `"SESI 1 : MOJIGOI"`, `"SESI 2 : HYOUGEN"`, `"SESI 3 : CHOUKAI"`, atau `"SESI 4 : DOKKAI"`. |
| `title` | String | Teks pertanyaan, kalimat dialog, atau kalimat soal dalam bahasa Jepang. **Khusus Soal Bergambar Murni**: kosongkan `""` agar UI tidak menampilkan teks instruksi mentah, dan fokus pada gambar. |
| `img` | String | Path relatif gambar (contoh: `"images/soal_1.jpg"` atau `"assets/q1.jpg"`), atau string kosong `""` jika tanpa gambar. |
| `link` / `audio` | String | Path relatif audio listening (contoh: `"assets/audio_c1.wav"` atau `"assets/audio/no_1.m4a"`). |
| `options` | Array | Array 3 pilihan jawaban: `[{ "text": "...", "img": "" }, ...]`. |
| `answer` | Number | Indeks jawaban yang benar (`0`, `1`, atau `2`). |
| `score` | String | Nilai bobot soal: `"0/4"`. |
| `trans` | String | Terjemahan bahasa Indonesia untuk soal/dialog. **Untuk Soal Bergambar**: berisi deskripsi visual konteks gambar (contoh: `"Gambar menunjukkan seorang penumpang yang sedang melangkah turun dari pintu bus."`). |
| `trans_rom` | String | Romaji untuk soal, atau `"-"` jika tidak diperlukan atau untuk soal bergambar. |
| `mnn` | String | Kategori Minna no Nihongo / tipe soal: `"Mojigoi"`, `"Hyougen"`, `"Choukai"`, atau `"Dokkai"`. |
| `analisis` | String | Penjelasan pembahasan jawaban komprehensif, diawali tag: `"[MNN Bab X - Topik / Pola Tata Bahasa] ..."`, menguraikan alasan logis kunci jawaban dan partikel/kata yang terkait. |
| `opt_detail` | Array | Array 3 objek rincian opsi: `[{ "kana": "...", "rom": "...", "arti": "...", "alasan": "..." }, ...]`. |
| `opt_note` | Array | Array 3 string catatan ringkas per opsi berformat romaji & arti: `["(romaji) arti ringkas", ...]`. |
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

1. **Soal Gambar (Moji-Goi / Dokkai Visual):**
   - `title`: Berikan string kosong `""` (atau deskripsi singkat), hindari teks mentah "Perhatikan gambar berikut".
   - `img`: Berisi path relatif gambar yang valid (contoh: `"assets/q1.jpg"`).
   - `trans`: Deskripsi jelas dari objek visual pada gambar (contoh: `"Gambar menampilkan fasilitas taman publik dengan pepohonan, bangku, dan jalan setapak."`).
   - `trans_rom`: Diberikan `"-"`.
   - `analisis`: Diawali tag `[MNN Bab X - Topik]`, menjelaskan analisis makna visual, pembentukan kanji, atau tata bahasa terkait.
   - `opt_detail`: Masing-masing opsi diuraikan makna kanji/kosakata dan alasan mengapa cocok atau tidak cocok dengan gambar.
   - `opt_note`: Ringkasan cepat bacaan romaji & arti per opsi, contoh: `["(kouen) taman", "(taifuu) badai topan", "(isha) dokter"]`.

2. **Soal Teks Murni (Moji-Goi Nomor 6 s.d. 10 - Tanpa Gambar):**
   - **Tujuan Ujian Resmi**: Sengaja **TIDAK menggunakan gambar** agar peserta tidak menebak arti dari gambar, melainkan diuji kompetensi linguistik murni:
     1. **Cara Baca Kanji (*Kanji Yomi*)**: Menguji pelafalan on'yomi/kun'yomi yang tepat (contoh: `[ 質問 ]` dibaca `しつもん` vs `しすもん`) dan kepekaan vokal panjang/pendek (*chouon*) (contoh: `[ 近所 ]` dibaca pendek `きんじょ`, bukan panjang `きんじょう`).
     2. **Sufiks Waktu & Kalender**: Menguji pembedaan penanggalan bulan `がつ` (contoh: `9がつ`) vs hari `ようび` vs rentang durasi `げつ`.
     3. **Aturan Kolokasi Pasangan Kata (*Collocation*)**: Menguji pasangan kata kerja yang menuntut kata benda spesifik (contoh: predikat `きます` [memakai baju atas] wajib berpasangan dengan `ふく`, bukan `ずぼん` [memakai pakaian bawah = `はきます`] atau `ぼうし` [memakai topi = `かぶります`]).
     4. **Kategori Kata & Pola Struktur Keberadaan**: Menguji seleksi kata benda tempat pada pola `[Tempat] に います` (contoh: `店` [toko] vs `足` [anggota tubuh] vs `予定` [jadwal/abstrak]).
   - `title` berisi kalimat utama Jepang dengan tanda kurung `（　）` atau penanda `[ Kanji ]`.
   - `img` berupa string kosong `""`.
   - `trans` berisi terjemahan utuh bahasa Indonesia dari kalimat soal.
   - `analisis` membedah pola partikel, aturan kolokasi, cara baca on'yomi/kun'yomi, serta membongkar jebakan fonetik.

3. **Soal Percakapan / Dialog (Hyougen):**
   - `title` berisi dialog percakapan pembicara A dan B yang menuntut respon balasan wajar sesuai tingkat kesopanan (keigo / desu-masu).

4. **Soal Audio (Choukai):**
   - `audio` / `link` mengarah ke file audio listening yang valid di paket terkait (contoh: `"assets/audio_c1.wav"`).
   - `title` berisi pertanyaan seputar isi rekaman audio percakapan.

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
