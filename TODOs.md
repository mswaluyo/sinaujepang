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
| 4.3 | `package.json` type | ✅ Benar (`commonjs` + `.mjs`) |
