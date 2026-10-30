# PROJECT CONTEXT: Sinau Jepang / Fuji Manabi

## 1. Ringkasan Proyek
- Nama Platform: Sinau Jepang / Fuji Manabi
- Live URL: https://sinaujepang.web.app/ (Target Project Firebase: `sinau-jepang` / Site: `sinaujepang`)
- Catatan Penting Deploy: Web ini **TIDAK** di-deploy ke https://nihongo-course.web.app/. Jangan pernah gunakan target atau project `nihongo-course`.
- Deskripsi: Web App Edukasi & CBT Engine Simulasi Soal JFT-Basic A2 dan JLPT N5 (Moji-Goi, Bunpou, Dokkai, Choukai/Listening).

## 2. Tech Stack
- Frontend: HTML5, CSS3 (Tailwind CSS via custom config), Vanilla JS (ES6+).
- Backend & Hosting: Firebase Hosting, Firebase Auth, Firebase Init (`assets/js/firebase-init.js`).
- Local Storage: IndexedDB (`assets/js/indexeddb.js`) & LocalStorage untuk menyimpan progres/skor sementara.
- Audio Formats: .m4a, .oga, .mp3 untuk listening.

## 3. Peta Struktur File Krusial
- Main Routes / Views:
  - `public/index.html` : Dashboard & daftar paket kuis.
  - `public/quiz.html` : Engine utama pelaksanaan ujian/kuis CBT.
  - `public/kanji.html` & `public/kotoba.html` : Modul pembelajaran Kanji & Kosakata.
  - `public/hasil.html` & `public/cetak.html` : Halaman evaluasi skor & cetak sertifikat/hasil.
- Core JS Controllers & Models:
  - `public/assets/js/quiz-route.js` & `package-config.js` : Dynamic routing & konfigurasi paket kuis.
  - `public/assets/js/model.js` : Fetching `quiz-data.json` & state management.
  - `public/assets/js/view.js` / `view2.js` : DOM Rendering engine untuk soal, timer, & feedback.
  - `public/assets/js/controller.js` / `controller2.js` / `controller3.js` : Event handler, timer, audio control, submit logic.
- Structure Data Paket Kuis (`public/<package-name>-quiz/`):
  - `quiz-data.json` : Database soal spesifik paket tersebut.
  - `assets/` & `audio/` : Gambar pendukung & audio listening.

## 4. Skema Data Kuis (`quiz-data.json`)
Setiap paket kuis (`public/<paket>-quiz/quiz-data.json`) menggunakan array of objects:
```json
[
  {
    "no": 1,
    "section": "SESI 1 : MOJIGOI | SESI 2 : HYOUGEN | SESI 3 : CHOUKAI | SESI 4 : DOKKAI",
    "title": "string (teks soal/dialog)",
    "img": "string (relative path atau empty string)",
    "link": "string (opsional audio listening)",
    "options": [
      { "text": "string", "img": "string" }
    ],
    "answer": 0,
    "score": "0/4",
    "trans": "string (terjemahan Indonesia)",
    "trans_rom": "string (romaji atau '-')",
    "mnn": "Mojigoi | Hyougen | Choukai | Dokkai",
    "analisis": "string ([MNN Bab X - Topik] penjelasan...)",
    "opt_detail": [
      { "kana": "string", "rom": "string", "arti": "string", "alasan": "string" }
    ],
    "opt_note": ["string", "string", "string"],
    "kunci_id": "string (opsi teks benar)"
  }
]
```
