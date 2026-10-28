# PROJECT CONTEXT: Sinau Jepang / Fuji Manabi

## 1. Ringkasan Proyek
- Nama Platform: Sinau Jepang / Fuji Manabi
- Live URL: https://sinaujepang.web.app/
- Deskripsi: Web App Edukasi & CBT Engine Simulasi Soal JFT-Basic A2 dan JLPT N5 (Moji-Goi, Bunpou, Dokkai, Choukai/Listening).

## 2. Tech Stack
- Frontend: HTML5, CSS3 (Tailwind CSS via custom config), Vanilla JS (ES6+).
- Backend & Hosting: Firebase Hosting, Firebase Auth, Firebase Init (`assets/js/firebase-init.js`).
- Local Storage: IndexedDB (`assets/js/indexeddb.js`) & LocalStorage untuk menyimpan progres/skor sementara.
- Audio Formats: .m4a, .oga (diutamakan .mp3/.m4a untuk kompatibilitas cross-browser).

## 3. Peta Struktur File Krusial
- Main Routes / Views:
  - `public/index.html` : Dashboard & daftar paket kuis.
  - `public/quiz.html` : Engine utama pelaksanaan ujian/kuis CBT.
  - `public/kanji.html` & `public/kotoba.html` : Modul pembalajaran Kanji & Kosakata.
  - `public/hasil.html` & `public/cetak.html` : Halaman evaluasi skor & cetak sertifikat/hasil.
- Core JS Controllers & Models:
  - `public/assets/js/quiz-route.js` & `package-config.js` : Dynamic routing paket kuis.
  - `public/assets/js/model.js` : Fetching `quiz-data.json` & state management.
  - `public/assets/js/view.js` / `view2.js` : DOM Rendering engine untuk soal, timer, & pilihan.
  - `public/assets/js/controller.js` / `controller2.js` / `controller3.js` : Event handler, timer, audio control, submit logic.
- Structure Data Paket Kuis (`public/<package-name>-quiz/`):
  - `quiz-data.json` : Database soal spesifik paket tersebut.
  - `assets/audio/` & `assets/` : Gambar pendukung & audio listening.

## 4. Skema Data Kuis (`quiz-data.json`)
```json
{
  "packageName": "string",
  "questions": [
    {
      "id": "string",
      "section": "moji_goi | bunpou | dokkai | choukai",
      "question": "string / HTML",
      "image": "string (relative path) | null",
      "audio": "string (relative path) | null",
      "options": ["string", "string", "string", "string"],
      "answer": 0,
      "explanation": "string"
    }
  ]
}