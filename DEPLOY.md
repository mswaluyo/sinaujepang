# 🚀 Panduan Deploy — SinauJepang

## 📊 Arsitektur

```
d:\soal-jft\public\   →  Firebase Hosting  →  https://sinaujepang.web.app
        ↓
    git push            →  GitHub            →  https://github.com/mswaluyo/sinaujepang
```

---

## 1. Deploy & Workflow CI/CD

### Prasyarat
- Repository GitHub: `https://github.com/mswaluyo/sinaujepang`
- Secret `FIREBASE_TOKEN` sudah diatur di GitHub Actions (Settings → Secrets and variables → Actions)
- Firebase CLI lokal (opsional untuk deploy langsung): `npm install -g firebase-tools` (sudah login: `firebase login:list`)

### Alur Deploy Otomatis (CI/CD)
```powershell
# 1. Edit file di d:\soal-jft\public\
# 2. Build CSS jika mengubah class Tailwind baru
npm run build:css

# 3. Commit & push ke GitHub
git add <file-terkait>
git commit -m "pesan perubahan yang jelas"
git push origin main

# 4. GitHub Actions otomatis mem-build CSS dan deploy ke Firebase Hosting
# - Cek status: https://github.com/mswaluyo/sinaujepang/actions
```

### Deploy Manual (CLI Langsung)
```powershell
npm run build:css
firebase deploy --only hosting
```

---

## 2. Menambah Soal Baru — Deteksi Ulang Kotoba

Kosakata yang tampil di halaman `/kotoba` & Kanji Explorer dibaca dari **file master kotoba** hasil build, bukan langsung dari `quiz-data.json`. Setelah menambah atau mengubah soal, jalankan langkah berikut agar kata baru terdeteksi:

### Alur Lengkap Build Kotoba & Kanji
```powershell
# 1. Tambah/edit soal di public/<paket>-quiz/quiz-data.json atau lewat admin.html

# 2. Ekstrak ulang kosakata dari seluruh kuis -> public/kosakata.json
node tools/build-kosakata.mjs

# 3. Cocokkan ke master -> regenerate file situs + laporan kandidat
node tools/build-kotoba.mjs

# 4. (Opsional) Propagate ke modul Kanji Explorer
node tools/build-kanji.mjs
node tools/build-rad.mjs
node tools/build-explorer.mjs

# 5. Verifikasi integritas data
node tools/cek-audit.mjs

# 6. Build CSS & Deploy
npm run build:css
git add .
git commit -m "feat: tambah paket/soal baru & build kotoba"
git push origin main
```

### Review Kandidat Kotoba Baru
Hasil build menulis laporan ke `tools/kotoba-kandidat.json` berisi kosakata dari soal yang belum terdaftar di file master:
- `alasan: "kata kerja (X -> Y) belum ada di master"`
- `alasan: "kata baru belum ada di master"`

Jika kata tersebut layak dimasukkan ke kamus hafalan, tambahkan entri ke file master terkait di `public/`:
- **Kata kerja:** `public/kotoba-kerja.json` (`{"kanji":"...","kana":"...","rom":"...","arti":"..."}`)
- **Kata sifat:** `public/kotoba-sifat.json`
- **Kata benda:** `public/kotoba-benda.json`
- **Ungkapan/frasa:** `public/kotoba-ungkapan.json`

> **Catatan Penting:** 
> - Verba cukup didaftarkan dalam bentuk dasar `-masu` (bentuk `-mashita`, `-masen`, `-te` otomatis dikenali oleh converter).
> - File master menang mutlak atas tampilan di web.
> - Jangan jalankan ulang `tools/seed-master.mjs` karena akan menimpa file master yang sudah ada.

---

## 3. Konfigurasi Firebase

### Detail Project
| Item | Nilai |
|---|---|
| Project ID | `sinau-jepang` |
| Site Hosting | `sinaujepang` (target: `sinaujepang`) |
| Live URL | `https://sinaujepang.web.app` |
| Public Folder | `public/` |

### File Konfigurasi Firebase
- `.firebaserc` : Pemetaan alias target hosting `sinaujepang`.
- `firebase.json` : Konfigurasi hosting, cache header, dan rewrites.
- `firestore.rules` : Aturan izin baca/tulis data skor/attempt pengguna.

### Cache Policy (`firebase.json`)
| File | Cache-Control |
|---|---|
| `*.json` | `max-age=300` (5 menit) |
| `assets/**` | `max-age=3600, stale-while-revalidate=86400` (1 jam) |

---

## 4. Struktur File Proyek

```
d:\soal-jft\
├── public/                    # Root Firebase Hosting
│   ├── index.html             # Dashboard / Beranda kuis
│   ├── login.html             # Login Google Auth
│   ├── hasil.html             # Tampilan skor & analisis hasil kuis
│   ├── cetak.html             # Cetak sertifikat / lembar hasil
│   ├── quiz.html              # Core CBT engine (SPA router)
│   ├── kanji.html             # Modul kanji
│   ├── kotoba.html            # Modul kosakata
│   ├── paket-sesi.json        # Mapping sesi soal per paket
│   ├── assets/
│   │   ├── css/               # tailwind.css & quiz.css
│   │   └── js/                # Controller, model, view, indexeddb, firebase-init
│   └── <paket>-quiz/          # Folder paket kuis (quiz-data.json + aset gambar/audio)
├── tools/                     # Skrip utilitas audit, build kotoba & kanji
├── docs/                      # Dokumentasi komprehensif sistem
├── .github/workflows/         # CI/CD GitHub Actions deploy pipeline
├── PROJECT_CONTEXT.md         # Konteks arsitektur & skema data
├── quiz-rules.md              # Standar format & aturan penulisan soal kuis
└── TODOs.md                   # Roadmap & log progress pengerjaan
```

---

## 5. Troubleshooting Umum

| Masalah | Penyebab & Solusi |
|---|---|
| CI/CD Gagal | Cek token di GitHub Secrets (`FIREBASE_TOKEN`) atau status build Tailwind. |
| Perubahan CSS tidak tampil | Jalankan `npm run build:css` sebelum commit. Pastikan class Tailwind ada di template. |
| Web tidak update setelah deploy | Lakukan hard refresh (`Ctrl + Shift + R`) atau clear browser cache. |
| Skor tidak tersimpan | Cek koneksi Firebase Auth & status fallback ke IndexedDB lokal. |
| Soal baru tidak memunculkan kotoba | Jalankan build kotoba: `node tools/build-kosakata.mjs` lalu `node tools/build-kotoba.mjs`. |
