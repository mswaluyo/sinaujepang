# TODO LIST — SinauJepang (soal-jft)

## 📌 Status Umum Proyek
- **Target Hosting:** `sinaujepang` (`https://sinaujepang.web.app`)
- **Total Kategori:** 6 Kategori (`LOLOSYUK`, `AC`, `DN`, `PRINCESS`, `TOKYO OMIYAGE`, `YUCHU`)
- **Total Paket Kuis:** 18 Paket aktif (797 soal)
- **Pipeline CI/CD:** GitHub Actions dengan build otomatis Tailwind CSS

---

## ✅ Item Selesai

| # | Modul / Item | Keterangan |
|---|---|---|
| 1 | CSS Build Pipeline | `npm run build:css` via Tailwind CLI berfungsi normal |
| 2 | Konfigurasi Firebase Hosting | Target tunggal `sinaujepang` di `.firebaserc` & `firebase.json` |
| 3 | Script Loader Kuis (`quiz.html`) | Loader modular (`model.js`, `view.js`, `controller.js`) rapi dan mendukung format slug fleksibel `[a-z0-9_-]+-quiz` |
| 4 | Validasi Data Soal | Tersedia `tools/validate-data.mjs` & `tools/cek-audit.mjs` (Semua 18 paket lulus validasi 100%) |
| 5 | Sinkronisasi & Build Kotoba | Script ekstraksi kosakata & matching master (`build-kosakata.mjs`, `build-kotoba.mjs`) |
| 6 | Modul Kanji Explorer & JFT A2 | Integrasi stroke order, radikal, 336 kanji N5-N4, tab Hyougen & Dokkai aktif di `jft-a2.html` |
| 7 | Cleanup & Housekeeping File Sementara | Seluruh file scraping MHTML, artefak gambar lama, script ekstraksi sekali pakai telah diarsipkan ke `_arsip/junk/` dan di-ignore di `.gitignore` |
| 8 | Rapikan Dokumentasi Proyek | Standardisasi `PROJECT_CONTEXT.md`, `DEPLOY.md`, `quiz-rules.md`, dan `docs/DOKUMENTASI-SINAUJEPANG.md` |
| 9 | Standarisasi Opsi LOLOSYUK | 20 soal rumpang di paket `magarimasu`, `orimasu`, `tomemasu`, dan `konpyuutaa` telah dilengkapi menjadi 3 pilihan ganda standar CBT A2 |
| 10 | Kelengkapan Asset Gambar & Audio | Salin kelengkapan gambar `hare2-quiz` dari `hare-quiz`, verifikasi 56 gambar & 15 audio `basu3-quiz` |

---

## 🚀 Prioritas Aktif

### 1. Sinkronisasi Data & Master Kotoba
- [x] Validasi konsistensi entri master: `public/kotoba-kerja.json`, `kotoba-sifat.json`, `kotoba-benda.json`, dan `kotoba-ungkapan.json`.
- [x] Jalankan `node tools/build-kosakata.mjs` dan `node tools/build-kotoba.mjs` untuk memverifikasi `tools/kotoba-kandidat.json`.
- [x] Cek audit berkala dengan `node tools/cek-audit.mjs`.

### 2. Kualitas Paket Soal
- [x] Paket `basu3-quiz`: Pastikan kelengkapan gambar SESI 2 (`images/soal_*.jpg`), audio (`assets/audio/`), nomor & opsi.
- [x] Paket `hare2-quiz`: Lengkapi 20 aset gambar lokal yang sebelumnya belum tersalin.
- [x] Verifikasi audio choukai pada paket yang memiliki sesi listening (`.m4a` / `.oga` path).

### 3. Pengujian UI/UX & Responsivitas
- [ ] Uji navigasi mobile (layout CBT, lembar soal, kontrol audio, dialog konfirmasi submit).
- [ ] Uji responsivitas halaman kanji explorer (`kanji-explorer.html`, `kanji-tree.html`, `jft-a2.html`).
