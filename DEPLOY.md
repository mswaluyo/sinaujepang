# ≡ƒÜÇ Panduan Deploy ΓÇö SinauJepang

## ≡ƒôè Arsitektur

```
d:\soal-jft\public\   →  Firebase Hosting  →  https://sinaujepang.web.app
       ↓
   git push            →  GitHub            →  https://github.com/mswaluyo/sinaujepang
```

---

## 1. Deploy Manual (Tanpa CI/CD)

### Prasyarat
- Firebase CLI terinstall: `npm install -g firebase-tools`
- Firebase token: `firebase login:ci`
- GitHub Action secret `FIREBASE_TOKEN` di repo (Settings → Secrets → Actions)

### Langkah
```powershell
# 1. Edit file di d:\soal-jft\public\
# 2. Commit & push ke GitHub
git add public/index.html
git commit -m "pesan perubahan"
git push origin main

# 3. GitHub Actions otomatis deploy ke Firebase Hosting
# - Cek status: https://github.com/mswaluyo/sinaujepang/actions
# - Dokumentasi CI/CD lengkap: .github/README.md
```

---

## 1b. Menambah Soal Baru ΓÇö Deteksi Ulang Kotoba

Kosakata tampil di halaman kotoba (`/kotoba`, dulu `/hafal`) & Kanji Explorer **bukan** dibaca langsung dari soal, tapi dari **file master kotoba** hasil build. Jadi setelah menambah soal, jalankan langkah ini agar kata baru terdeteksi.

### Alur lengkap

```powershell
# 1. Tambah/edit soal (admin.html atau langsung file <paket>-quiz/quiz-data.json)

# 2. Ekstrak ulang kosakata dari semua soal -> public/kosakata.json
node tools/build-kosakata.mjs

# 3. Cocokkan ke master -> regenerate file situs + laporan kandidat
node tools/build-kotoba.mjs

# 4. (Opsional) propagate ke Kanji Explorer
node tools/build-kanji.mjs
node tools/build-rad.mjs
node tools/build-explorer.mjs

# 5. Verifikasi tidak ada yang rusak
node tools/cek-audit.mjs

# 6. Deploy
npm run build:css          # hanya jika mengedit class Tailwind di HTML/JS
firebase deploy --only hosting
```

### Review kandidat (penting!)

Hasil build menulis laporan ke **`tools/kotoba-kandidat.json`** ΓÇö berisi semua kata dari soal yang **belum ada di master**:

- `alasan: "kata kerja (X -> Y) belum ada di master"` → verba dengan wujud baru (mis. πÇ£πü╛πü¢πéô, bentuk kamus)
- `alasan: "kata baru belum ada di master"` → nomina/sifat/frasa baru

**Kalau kata itu layak dihafal**, tambahkan ke file master yang sesuai lalu build ulang (langkah 3):

| Jenis | File master | Skema entri |
|---|---|---|
| Kata kerja | `public/kotoba-kerja.json` | `{"kanji":"µ╢êπüùπü╛πüÖ","kana":"πüæπüùπü╛πüÖ","rom":"keshimasu","arti":"mematikan"}` |
| Kata sifat | `public/kotoba-sifat.json` | `{"kanji":"Θ¥Öπüï","kana":"πüùπüÜπüï","rom":"shizuka","arti":"tenang"}` |
| Kata benda | `public/kotoba-benda.json` | `{"kanji":"µ£║","kana":"πüñπüÅπüê","rom":"tsukue","arti":"meja"}` |
| Ungkapan/frasa | `public/kotoba-ungkapan.json` | `{"kanji":"πéêπéìπüùπüÅπüèΘíÿπüäπüùπü╛πüÖ","kana":"πéêπéìπüùπüÅπüèπü¡πüîπüäπüùπü╛πüÖ","rom":"yoroshiku onegai shimasu","arti":"mohon bantuannya"}` |

### Aturan penting

- **Verba cukup satu bentuk `-masu`** ΓÇö wujud lain di soal (πÇ£πü╛πüùπüƒ, πÇ£πü╛πü¢πéô, πÇ£πü╛πüùπéçπüå, bentuk kamus) otomatis dikenali lewat konversi, tidak perlu ditulis manual.
- **File master menang mutlak** ΓÇö kalau ada kata salah tampil, betulkan langsung di file master (sekali benar, selamanya benar), jangan di soal.
- **Kandidat yang tidak Anda pindahkan ke master** tidak akan tampil di situs ΓÇö aman dibiarkan; laporan hanya alat bantu review.
- `node tools/seed-master.mjs` hanya untuk membuat master awal ΓÇö **jangan dijalankan lagi** (menimpa editan Anda).

---


### Prasyarat
- Repository GitHub: `https://github.com/mswaluyo/sinaujepang`
- Secret `FIREBASE_TOKEN` sudah di-set di GitHub
  - GitHub → Settings → Secrets and variables → Actions
  - Name: `FIREBASE_TOKEN`
  - Value: token dari `firebase login:ci`

### Konfigurasi Firebase

### Project
| Item | Nilai |
|------|-------|
| Project ID | `sinau-jepang` |
| Site | `sinaujepang` |
| URL | `https://sinaujepang.web.app` |
| Public folder | `d:\soal-jft\public\` |

## 2. Konfigurasi Firebase

### Project
| Item | Nilai |
|---|---|
| Project ID | `sinau-jepang` |
| Site | `sinaujepang` |
| URL | `https://sinaujepang.web.app` |
| Public folder | `d:\soal-jft\public\` |

### File Konfigurasi Firebase
- **File `.firebaserc` WAJIB di-commit ke Git** (gunakan `git add -f .firebaserc` jika terabaikan oleh `.gitignore`). File ini berisi pemetaan target `hosting:sinaujepang` yang dibutuhkan GitHub Actions.
- `firebase.json` tetap di-commit seperti biasa.

### Cache Policy (`firebase.json`)
| File | Cache-Control |
|---|---|
| `*.json` | `max-age=300` (5 menit) |
| `assets/**` | `max-age=3600, stale-while-revalidate=86400` (1 jam) |

### Firestore Rules (`firestore.rules`)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{databaseId}/documents {
    match /attempts/{docId} {
      allow read, write: if request.auth != null;
      allow update: if request.auth != null
                    && request.resource.data['createdAt'] == null;
    }
  }
}
```

---

## 3. Struktur File

```
d:\soal-jft\public\
├── index.html              # Dashboard/beranda
├── login.html              # Login Google
├── hasil.html              # Lembar hasil skor
├── quiz.html               # Shell kuis (SPA router)
├── favicon.ico, favicon.svg
├── paket-sesi.json
├── assets/
│   ├── css/
│   │   ├── tailwind.css    # Build output
│   │   └── quiz.css        # Custom styles
│   └── js/
│       ├── indexeddb.js    # IndexedDB utility
│       ├── firebase-init.js # Firebase init + fujiScore API
│       ├── model.js         # QuizRepository + QuizModel
│       ├── view.js          # QuizView dasar
│       ├── view2.js         # QuizView lanjutan (feedback)
│       ├── controller.js    # QuizController tab
│       ├── controller2.js   # QuizController render + jawab
│       ├── controller3.js   # QuizController timer + boot
│       ├── score-cards.js   # Badge skor di homepage
│       ├── quiz-route.js    # Router per paket
│       └── tailwind-config.js
└── <paket>-quiz/           # 14 paket kuis
    ├── quiz-data.json      # Data soal
    └── assets/             # Gambar + audio
```

---

## 4. Catatan Penting: Tailwind CSS Build

**Setiap kali menambah class Tailwind baru di file JS/HTML**, jalankan build CSS sebelum commit:

```powershell
npm run build:css
```

**Kenapa?** Tailwind mem-purge class yang tidak terdeteksi saat build. Jika menambah class baru di JS (contoh: `grid-cols-3`) tanpa rebuild, class tersebut **tidak ada di CSS** → layout rusak.

**Alur kerja yang benar:**
```
1. Edit file JS/HTML (tambah class Tailwind baru)
2. npm run build:css          ΓåÉ WAJIB sebelum commit
3. git add .
4. git commit -m "pesan"
5. git push origin main       ΓåÉ CI/CD auto-deploy
```

**Catatan:** CI/CD **jakin** menjalankan `npm run build:css` sebelum deploy. Tailwind purging class secara otomatis; jangan khawatir soal file CSS yang sudah di-commit ΓÇö CI meng-generate ulang CSSnya dari `src/input.css` di setiap push.

---

## 5. Troubleshooting

| Masalah | Solusi |
|---|---|
| CI/CD gagal | Cek `FIREBASE_TOKEN` di GitHub Secrets |
| Token expired | Jalankan `firebase login:ci`, update secret |
| Website tidak update | Hard refresh: `Ctrl+Shift+R` |
| Data skor hilang | Cek Firestore rules & IndexedDB fallback |
| CSS tidak berubah | Jalankan `npm run build:css` sebelum deploy |

---

## 6. Firebase Free Tier (Spark Plan)

| Layanan | Batas |
|---|---|
| Hosting | Unlimited |
| Firestore | 1 GB storage, 50k read/day, 20k write/day |
| Authentication | Unlimited |
| Analytics | 500 events/hari |
| Storage | Γ¥î Tidak dipakai (butuh billing) |

---

## 0. Deployment Protocol for AI Agent

### ⚠️ Known Environment Constraints
> **Tidak mengulang langkah yang sudah konfirmasi sebelumnya.**

1. **Firebase CLI sudah di-set**
   - `firebase login:list` → **mswaluyo@gmail.com** (sudah login)
   - **Tidak** mengulang `firebase login:ci` jika Sudah terkonfigurasi
2. **Alat eksekusi perintah** (`run_commands`) **bermasalah / tidak berfungsi**
   - Jangan meminta user menjalankan command yang bisa dieksekusi AI
   - Jangan menggunakan DAYTONA tanpa persetujuan eksplisit
3. **CI/CD otomatis**
   - Push ke `main` → GitHub Actions build+deploy otomatis
   - Deploy selesai jika CI/CD di GitHub Actions **berhasil** (status: green)

### ✅ Workflow yang Benar
```powershell
# 1. Edit file di d:\soal-jft\public\
# 2. Commit & push ke GitHub
cd /d d:/soal-jft
git add <file>
git commit -m "pesan perubahan"
git push origin main

# 3. GitHub Actions otomatis deploy
#    - Cek status: https://github.com/mswaluyo/sinaujepang/actions
#    - Selesai jika CI/CD status = success (purple/green check)
```

### 🚫 Yang JANGAN DIJALANKAN oleh AI
| Skenario | Seharusnya | Jangan |
|----------|-----------|--------|
| Firebase belum login | Cek `firebase login:list` | Jalankan `firebase login:ci` |
| run_commands error | Catat sebagai kendala, lanjut solusi lain | Ulangi command yang gagal |
| DAYTONA tidak diminta | Hanya pakai jika diizinkan user | Sarankan DAYTONA otomatis |
| Ada perubahan file | Baca file dulu, lakukan fix | Tulis ulang tanpa baca |

### 📋 Checklist Sebelum Deploy
- [ ] `git status` → hanya file yang dimaksud yang ditambahkan
- [ ] `git log -1` → pesan commit jelas
- [ ] `firebase login:list` → login sebagai `mswaluyo@gmail.com`
- [ ] CI/CD config: `.github/workflows/deploy.yml` ada dan benar

---

## 7. Commit Terakhir

| Commit | Pesan |
|---|---|
| `330d927` | CI: add CI env flag for deploy step |
| `f2e16f9` | Fix hasil pin: center dot on bar |
| `0389a8e` | Fix hasil: wait for fujiScore AND fujiUser |
| `0b68b8e` | Fix hasil: read Firestore first |
| `c8ac564` | Fix score data: async save/load |
| `bbb4929` | Fix: load indexeddb.js in hasil/login |
| `a17dc7a` | Fix hasil.html: async IndexedDB load |
| `b148d59` | Enhance score badge: benar/total, secs |
| `3c093e2` | Fix IndexedDB: getItem/removeItem keyPath |
| `dce014d` | Fix logout: immediate redirect |
