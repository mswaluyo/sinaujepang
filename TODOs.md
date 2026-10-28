# TODO LIST — SinauJepang (soal-jft)

## 📌 Status Umum Proyek
- **Target Hosting:** `sinaujepang` (`https://sinaujepang.web.app`)
- **Total Kategori:** 6 Kategori (`LOLOSYUK`, `AC`, `DN`, `PRINCESS`, `TOKYO OMIYAGE`, `YUCHU`)
- **Total Paket Kuis:** 19 Paket aktif (810 soal)
- **Pipeline CI/CD:** GitHub Actions dengan build otomatis Tailwind CSS

---

## ✅ Item Selesai

| # | Modul / Item | Keterangan |
|---|---|---|
| 1 | CSS Build Pipeline | `npm run build:css` via Tailwind CLI berfungsi normal |
| 2 | Konfigurasi Firebase Hosting | Target tunggal `sinaujepang` di `.firebaserc` & `firebase.json` |
| 3 | Script Loader Kuis (`quiz.html`) | Loader modular (`model.js`, `view.js`, `controller.js`) rapi tanpa dead code |
| 4 | Validasi Data Soal | Tersedia `tools/validate-data.mjs` & `tools/cek-audit.mjs` |
| 5 | Sinkronisasi & Build Kotoba | Script ekstraksi kosakata & matching master (`build-kosakata.mjs`, `build-kotoba.mjs`) |
| 6 | Modul Kanji Explorer | Integrasi stroke order, radikal, dan explorer kanji N5-N4 |
| 7 | Cleanup & Housekeeping File Sementara | Seluruh file scraping MHTML, artefak gambar lama, script ekstraksi sekali pakai telah diarsipkan ke `_arsip/junk/` dan di-ignore di `.gitignore` |
| 8 | Rapikan Dokumentasi Proyek | Standardisasi `PROJECT_CONTEXT.md`, `DEPLOY.md`, `quiz-rules.md`, dan `docs/DOKUMENTASI-SINAUJEPANG.md` |

---

## 🚀 Prioritas Aktif

### 1. Sinkronisasi Data & Master Kotoba
- [ ] Validasi konsistensi entri master: `public/kotoba-kerja.json`, `kotoba-sifat.json`, `kotoba-benda.json`, dan `kotoba-ungkapan.json`.
- [ ] Jalankan `node tools/build-kosakata.mjs` dan `node tools/build-kotoba.mjs` untuk memverifikasi `tools/kotoba-kandidat.json`.
- [ ] Cek audit berkala dengan `node tools/cek-audit.mjs`.

### 2. Kualitas Paket Soal
- [ ] Paket `basu3-quiz`: Pastikan kelengkapan gambar SESI 2 (`images/soal_*.jpg`) dan validitas nomor & opsi.
- [ ] Verifikasi audio choukai pada paket yang memiliki sesi listening (`.m4a` / `.oga` path).

### 3. Pengujian UI/UX & Responsivitas
- [ ] Uji navigasi mobile (layout CBT, lembar soal, kontrol audio, dialog konfirmasi submit).
- [ ] Uji responsivitas halaman kanji explorer (`kanji-explorer.html` & `kanji-tree.html`).
