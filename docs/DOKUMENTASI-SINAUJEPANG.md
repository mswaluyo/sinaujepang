# 📘 Dokumentasi SinauJepang (Portal Latihan JFT-Basic)

> Portal simulasi CBT (Computer Based Test) untuk latihan **JFT-Basic** – bahasa Jepang (N5–N4 level).  
> Deploy ke: **https://sinaujepang.web.app**

---

## 1. Ringkasan Portal

| Item | Nilai |
|---|---|
| Nama portal | **SinauJepang** |
| Tujuan | Latihan simulasi **JFT-Basic** (Bahasa Jepang – Basic) |
| URL | `https://sinaujepang.web.app` |
| Repository | `https://github.com/mswaluyo/sinaujepang` |
| Deploy | Firebase Hosting (CI/CD via GitHub Actions) |
| Auth | Google Sign-In |
| Password gerbang | `Lolosyuk` (bukan gerbang aplikasi, hanya metadata `package.json`) |
| Total kategori | 5 |
| Total paket kuis | 17 |
| Total soal | 742 |

---

## 2. Arsitektur & Struktur File

```text
d:\soal-jft\
├── public/                    # Halaman statis (Firebase Hosting root)
│   ├── index.html             # Beranda + kategori + kartu skor
│   ├── login.html             # Login Google
│   ├── quiz.html              # Simulasi CBT (SPA router)
│   ├── hasil.html             # Skor & laporan
│   ├── admin.html             # Panel edit soal
│   ├── paket-sesi.json        # Peta sesi (S1–S4) per paket
│   └── <paket>-quiz/
│       └── quiz-data.json     # Data soal per paket
├── public/assets/js/          # Logika frontend
│   ├── package-config.js      # Daftar kategori + paket (homepage)
│   ├── quiz-route.js          # Router: /quiz.html?p={slug}-quiz
│   ├── model.js               # Fetch quiz, simpan/load skor, validasi
│   ├── controller.js          # Render, jawab, skor
│   ├── score-cards.js         # Badge skor di homepage
│   └── admin-data.js          # Panel admin: list, edit, tambah soal
├── tools/                     # Skrip utilitas
├── .firebase/                 # Konfigurasi Firebase
├── .github/workflows/deploy.yml # CI/CD deploy ke Firebase
├── package.json               # Metadata + script build
└── deploy.md                  # Panduan deploy
```

---

## 3. Cara Kerja Sistem

### 3.1 Alur Login & Simulasi

```text
1. Klik "Mulai Simulasi" → login via Google
2. Sistem simpan progress ke IndexedDB (tanpa blokir UI)
3. Data async disinkronkan ke Firestore (jika login)
4. Selesai → tampilkan skor, level, & analisis
5. Unduh PDF dari hasil/kartu paket
```

### 3.2 Alur Deploy

```text
1. Edit file di public/
2. npm run build:css  (jika mengedit class Tailwind)
3. git add     (file terkait)
4. git commit  (pesan jelas)
5. git push origin main
6. GitHub Actions → Firebase Hosting otomatis deploy
7. Selesai jika CI/CD status = success (purple/green check)
```

---

## 4. Kategori & Paket Kuis

### ✨ LOLOSYUK (6 paket)
| Nama | S1 | S2 | S3 | S4 | Soal |
|---|---|---|---|---|---|
| GAKUSEI | 17 | 13 | 12 | 14 | 56 |
| HARE | 19 | 16 | 12 | 13 | 60 |
| MAGARIMASU | 18 | 10 | 12 | 12 | 52 |
| ORIMASU | 19 | 14 | 10 | 14 | 57 |
| TOMEMASU | 18 | 11 | 14 | 12 | 55 |
| KONPYUUTAA | 17 | 15 | 17 | 14 | 63 |
| **Total** | **108** | **79** | **77** | **89** | **343** |

### ✨ AC (1 paket baru)
| Nama | S1 | S2 | S3 | S4 | Soal |
|---|---|---|---|---|---|
| HARE2 | – | – | – | – | 46 |
```
