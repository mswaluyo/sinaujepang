# 🚀 Panduan Deploy — SinauJepang

## 📊 Arsitektur

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

### Langkah
```powershell
# 1. Edit file di d:\soal-jft\public\
# 2. Commit & push ke GitHub
git add public/index.html
git commit -m "pesan perubahan"
git push origin main

# 3. Deploy ke Firebase Hosting
firebase deploy --only hosting --token <FIREBASE_TOKEN>

# 4. Buka https://sinaujepang.web.app (hard refresh: Ctrl+Shift+R)
```

---

## 2. Deploy Otomatis (CI/CD GitHub Actions)

### Prasyarat
- Repository GitHub: `https://github.com/mswaluyo/sinaujepang`
- Secret `FIREBASE_TOKEN` sudah di-set di GitHub
  - GitHub → Settings → Secrets and variables → Actions
  - Name: `FIREBASE_TOKEN`
  - Value: token dari `firebase login:ci`

### Langkah
```powershell
# 1. Edit file di d:\soal-jft\public\
git add public/index.html
git commit -m "pesan perubahan"
git push origin main

# 2. GitHub Actions otomatis:
#    - Checkout code
#    - Setup Node.js
#    - npm ci
#    - npm run build:css
#    - npm install -g firebase-tools
#    - firebase deploy --only hosting
# 3. Cek status: https://github.com/mswaluyo/sinaujepang/actions
```

---

## 3. Konfigurasi Firebase

### Project
| Item | Nilai |
|---|---|
| Project ID | `sinau-jepang` |
| Site | `sinaujepang` |
| URL | `https://sinaujepang.web.app` |
| Public folder | `d:\soal-jft\public\` |

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

## 4. Struktur File

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
| Storage | ❌ Tidak dipakai (butuh billing) |

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
