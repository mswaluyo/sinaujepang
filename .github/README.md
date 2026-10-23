# CI/CD — GitHub Actions (Firebase Hosting)

Pipeline otomatis deploy ke Firebase Hosting.

> **Untuk AI Agent:** Baca `deploy.md` (root) bagian **§0. Deployment Protocol** sebelum menjalankan pekerjaan deploy. Hindari pengulangan langkah yang sudah dikonfirmasi (Firebase login, tool eksekusi).

---

## ⚙️ Setup (1 x)

### 1. Buat repository & push kode
```powershell
git remote add origin https://github.com/username/soal-jft.git
git push -u origin main
```

### 2. Setup Secret
Di GitHub → Settings → Secrets and variables → Actions:

| Secret | Value | Keterangan |
|---|---|---|
| `FIREBASE_TOKEN` | Kaggle token (firebase-tools) | API token firebase |
| `FIREBASE_SERVICE_ACCOUNT` | JSON service account (opsional) | Untuk action hosting-deploy |

**Cara dapat FIREBASE_TOKEN:**
```powershell
firebase login:ci
# → copy token yang muncul
```

### 3. Push ulang
```powershell
git add .github/workflows/deploy.yml .github/README.md
git commit -m "Add CI/CD workflow"
git push origin main
```

---

## 🚀 Cara Kerja

| Trigger | Action |
|---|---|
| `push` ke `main` | Build + Deploy |
| `pull_request` ke `main` | Build only (no deploy) |

> Note: `pull_request` hanya builds, tidak deploy. Deploy hanya on `push` ke `main`.

---

## 📝 Script

```bash
# Manual deploy (opsional)
firebase deploy --only hosting
```

---

## 🛡️ Security

- `FIREBASE_TOKEN` → GitHub Secret (never commit)
- `FIREBASE_SERVICE_ACCOUNT` → JSON (opsional)
- `GITHUB_TOKEN` → Firebase token (auto-generated)

---

## 📦 File Yang Di-deploy

```
public/
├── index.html
├── login.html
├── hasil.html
├── quiz.html
├── *_quiz/          # 14 paket kuis
└── assets/          # CSS, JS, gambar, audio
```
