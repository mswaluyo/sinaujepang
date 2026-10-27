# TODO LIST — SinauJepang (soal-jft)

## ✅ Selesai (11 item)
| # | Item | Status |
|---|------|--------|
| 1 | CSS build pipeline (`npm run build:css`) | ✅ Selesai |
| 2 | Firebase config (target: `sinaujepang`) | ✅ Selesai |
| 3 | Script loading quiz.html (tidak ada dead code) | ✅ Selesai |
| 4 | Hapus target `utama` (duplikat `sinaujepang`) | ✅ Selesai |
| 5 | Test script `npm test` (16 paket / 679 soal) | ✅ Selesai |
| 6 | `tools/validate-data.mjs` (validasi data soal) | ✅ Selesai |
| 7 | `DEPLOY.md` (target name) | ✅ Selesai |
| 8 | CI/CD workflow (auto build CSS) | ✅ Selesai |
| 9 | Todo list clean-up | ✅ Selesai |
| 10 | Review tools audit (`cek-audit.mjs`, `merge-audit.mjs`) | ✅ Selesai (split BAGIAN 1/2) |
| 11 | Review firestore.rules `ownerEmail` | ✅ No bug (logika benar) |
| 12 | `package.json` type | ✅ Benar (`commonjs` + `.mjs` isolates) |

> **Catatan Keamanan 4.1:** Firebase config web app adalah **publik** (bukan rahasia). Keamanan utama: Firestore Rules, Firebase Auth, custom claims.

## 🔧 Prioritas 1 — Firebase Hosting config
| # | Item | Status |
|---|------|--------|
| 1.1 | Tambahkan `target: "sinaujepang"` | ✅ Selesai |
| 1.2 | Hapus target redundan `utama` | ✅ Selesai |
| 1.3 | Verifikasi mapping target → workflow | ✅ Selesai |

## 🔧 Prioritas 2 — Script loading quiz.html
| # | Item | Status |
|---|------|--------|
| 2.1 | Semua 10 script diperlukan (tidak ada dead code) | ✅ Selesai |
| 2.2 | Hapus `view2.js` | ✅ Dipakai (fbHTML) |
| 2.3 | Hapus `tool2.js` / `tool3.js` | N/A |

## 🔧 Prioritas 3 — Tooling & CI/CD
| # | Item | Status |
|---|------|--------|
| 3.1 | `test` script | ✅ Selesai |
| 3.2 | Review audit tools (`cek-audit.mjs`, `merge-audit.mjs`) | ✅ Selesai |
| 3.3 | `DEPLOY.md` (target) | ✅ Selesai |

## 🔧 Prioritas 4 — Keamanan & kualitas
| # | Item | Status |
|---|------|--------|
| 4.1 | Firebase config hardcode (`login.html`) | ✅ *Tanpa risiko* (publik) |
| 4.2 | Review `firestore.rules` `ownerEmail` | ✅ No bug |
## 🌱 POTENSI PERBAIKAN (sebelum deploy akhir)

### 🧹 1. Cleanup & Housekeeping (peringkat: tinggi)
| # | Item | Keterangan | Status |
|---|------|-----------|--------|
| 1.1 | Hapus build artifacts & temp files | `bundle/`, `output/`, `node_modules/`, `part_*.part`, `extracted_*`, `*.jpeg/png`, `temp.txt`, `check-assets.js`, `check-mhtml.js`, `check-quiz.js`, `extract-html.js`, `extract-kosakata.js`, `fix.js`, `inspect-html.js`, `organize-images.js`, `old_test.txt` | ⏳ Belum |
| 1.2 | Update `.gitignore` | Tambahkan pola exclusion untuk `bundle/`, `output/`, `node_modules/`, `*.part`, `extracted_*`, `temp.txt`, `*.log` | ⏳ Belum |
| 1.3 | Review & deduplicate 174 untracked files | Buat daftar kelas: (a) build artifacts, (b) test/scratch scripts, (c) new feature files, (d) vcs-ghost | ⏳ Belum |

### 📊 2. Data Quality & Master Files (peringkat: tinggi)
| # | Item | Keterangan | Status |
|---|------|-----------|--------|
| 2.1 | Sync master kotoba files | `public/kotoba-kerja.json`, `kotoba-sifat.json`, `kotoba-benda.json`, `kotoba-ungkapan.json` — review keakuratannya setelah *modified* | ⏳ Belum |
| 2.2 | Validasi `kosakata.json` | Pastikan kosakata terambil dari soal → sinkron dengan master files (tool: `node tools/build-kosakata.mjs`) | ⏳ Belum |
| 2.3 | Audit `quiz-data.json` paket | Cek satu per satu: id uniqueness, opsi, audio, gambar, explanation | ⏳ Belum |
| 2.4 | Review `kotoba-noun.js` | File ini *modified* — pastikan logikanya konsisten dengan master kotoba | ⏳ Belum |

### 🌐 3. Frontend & UX (peringkat: sedang)
| # | Item | Keterangan | Status |
|---|------|-----------|--------|
| 3.1 | Verify modified HTML pages | `public/index.html`, `public/kanji.html`, `public/kotoba.html` — pastikan tidak *broken* layout & JS | ⏳ Belum |
| 3.2 | Verify modified JS controllers | `site-layout.js`, `quiz-route.js`, `package-config.js` — pastikan routing & layout bearworking | ⏳ Belum |
| 3.3 | Mobile responsiveness | Test di HP: grid (`md:grid-cols-*`), form, audio controls | ⏳ Belum |
| 3.4 | Explorer pages | `kanji-explorer.html`, `kanji-tree.html` — test render & search | ⏳ Belum |

### ⚙️ 4. Tools & CI/CD (peringkat: sedang)
| # | Item | Keterangan | Status |
|---|------|-----------|--------|
| 4.1 | Pre-commit hook | Buat script `tools/pre-commit.mjs` untuk auto-format & lint minimal | ⏳ Belum |
| 4.2 | CI/CD data validation | Tambahkan `npm test` / `node tools/validate-data.mjs` di workflow `.github/workflows/deploy.yml` | ⏳ Belum |
| 4.3 | Document MHTML import | Update `DEPLOY.md` & README dengan fitur baru *direct MHTML upload* | ⏳ Belum |
| 4.4 | Add `tools/logger.mjs` | Centralized logger untuk tools agar output konsisten | ⏳ Belum |

### 🚀 5. Deployment & Operations (peringkat: rendah)
| # | Item | Keterangan | Status |
|---|------|-----------|--------|
| 5.1 | Firebase target verify | `firebase.json` & `.firebaserc` — pastikan `target: "sinaujepang"` aktif | ⏳ Belum |
| 5.2 | Test CI pipeline | Trigger manual deploy via GitHub Actions → pulang ke Firebase Hosting | ⏳ Belum |
| 5.3 | Review `firestore.rules` | Setelah perubahan auth/audit tools, verifikasi ownership rules | ⏳ Belum |
| 5.4 | `firebase.json` | Pastikan hosting includes all needed files & rewrites | ⏳ Belum |


## 📚 6. Menambahkan Soal (Jalur Panduan) (peringkat: sedang)
| # | Item | Keterangan | Status |
|---|------|-----------|--------|
| 6.1 | Dokumentasi jalur GUI | Ratifikasi proses "Tambah Soal" di `admin.html` → tab Soal (cek `window._aInitSoal`) | ⏳ Belum |
| 6.2 | Dokumentasi jalur manual | Simpan ke `public/<paket>-quiz/quiz-data.json` sesuai skema pada `quiz-rules.md` | ⏳ Belum |
| 6.3 | Validasi format `quiz-data.json` | Buat script `tools/validate-quiz.mjs` yang cek: `no` unik, `options` 3, `answer` 0–2, `analisis` format `[MNN Bab X - Topik]` | ⏳ Belum |
| 6.4 | Test soal baru | Masukkan 1 soal percobaan di paket `hare2-quiz`, jalankan `npm test`, hapus jika rusak | ⏳ Belum |
| 6.5 | Sinkronkan `kotoba-kerja.json` | Jika soal baru mengandung kata kerja baru, tambahkan ke `public/kotoba-kerja.json` | ⏳ Belum |



## 8. Basu3 — Aturan & Data Soal

- [ ] `quiz-rules.md`: `section` (4 sesi), `mnn` (4 tipe), `opt_detail`/`opt_note` jelas.
- [ ] `public/basu3-quiz/quiz-data.json`: perbaiki `kunci_id` no=2 & no=5; tambah opsi no=21 (opsi jadi 3).
- [ ] `public/basu3-quiz/sesi2.json` (14 soal SESI 2) dimasukkan ke `quiz-data.json` (no 22–35, SESI 2 : HYOUGEN).
- [ ] Isi `img` SESI 2 dari aset yang tersedia: no=22,24,25,26,27,30,31,33,34,35 → `images/soal_*.jpg`.
