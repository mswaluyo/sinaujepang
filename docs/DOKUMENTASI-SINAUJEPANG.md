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
| Total kategori | 6 |
| Total paket kuis | 19 |
| Total soal | 810 |

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

### 1. LOLOSYUK (6 paket, 343 soal)
| Nama | Slug | Soal |
|---|---|---|
| GAKUSEI | `gakusei-quiz` | 56 |
| HARE | `hare-quiz` | 60 |
| MAGARIMASU | `magarimasu-quiz` | 52 |
| ORIMASU | `orimasu-quiz` | 57 |
| TOMEMASU | `tomemasu-quiz` | 55 |
| KONPYUUTAA | `konpyuutaa-quiz` | 63 |

### 2. AC (1 paket, 46 soal)
| Nama | Slug | Soal |
|---|---|---|
| HARE2 | `hare2-quiz` | 46 |

### 3. DN (2 paket, 53 soal)
| Nama | Slug | Soal |
|---|---|---|
| HASHIHASAMI | `hashi-quiz` | 25 |
| JINJA | `jinja-quiz` | 28 |

### 4. PRINCESS (4 paket, 137 soal)
| Nama | Slug | Soal |
|---|---|---|
| BASU | `basu-quiz` | 26 |
| BASU 3 | `basu3-quiz` | 72 |
| TAMAGO | `tamago-quiz` | 26 |
| HABURASHI | `haburashi-quiz` | 25 |

### 5. TOKYO OMIYAGE (4 paket, 150 soal)
| Nama | Slug | Soal |
|---|---|---|
| KUTSU SHITA | `kutsushita-quiz` | 46 |
| SHATSU | `shatsu-quiz` | 48 |
| KAGI | `kagi-quiz` | 36 |
| AOI TORI | `aoi-quiz` | 29 |

### 6. YUCHU (2 paket, 81 soal)
| Nama | Slug | Soal |
|---|---|---|
| KUROI INU | `kuroi-quiz` | 47 |
| AKAI KASA | `akai-quiz` | 34 |

---
**Total Keseluruhan:** 6 Kategori | 19 Paket Kuis | 810 Soal
