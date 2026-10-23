@echo off
setlocal enabledelayedexpansion
(
echo [
echo   {
echo     "no": 1,
echo     "section": "SESI 2 : HYOUGEN",
echo     "title": "",
echo     "img": "",
echo     "options": [
echo       {
echo         "text": "Hafal saja tanpa paham",
echo         "kana": "",
echo         "rom": "",
echo         "arti": "Menghemat usaha hanya menghafal"
echo       },
echo       {
echo         "text": "Pahami konteks materi",
echo         "kana": "",
echo         "rom": "",
echo         "arti": "Mengerti makna dan konteks belajar"
echo       },
echo       {
echo         "text": "Lompat ke materi berikutnya",
echo         "kana": "",
echo         "rom": "",
echo         "arti": "Melompat ke materi selanjutnya tanpa mengerti"
echo       }
echo     ],
echo     "answer": 1,
echo     "score": "0/4",
echo     "trans": "Jangan sekadar menghafal, tetapi pahami setiap materi.",
echo     "trans_rom": "Jangan sekadar menghafal, tetapi pahami setiap materi.",
echo     "mnn": "MNN Bab X - Prinsip Belajar",
echo     "analisis": "Kunci jawaban sesuai instruksi form Google UPDATE.",
echo     "opt_detail": [
echo       {
echo         "kana": "",
echo         "rom": "",
echo         "arti": "",
echo         "alasan": "Salah: harus paham, bukan hanya hafalan"
echo       },
echo       {
echo         "kana": "",
echo         "rom": "",
echo         "arti": "",
echo         "alansa": "Sahih: sesuai instruksi pahami setiap materi"
echo       },
echo       {
echo         "kana": "",
echo         "rom": "",
echo         "arti": "",
echo         "alansa": "Salah: tidak relevan dengan konteks soal"
echo       }
echo     ],
echo     "opt_note": ["(tada) hanya", "(yoku) baik", "(tsugi) selanjutnya"],
echo     "kunci_id": "Pahami konteks materi"
echo   },
echo   {
echo     "no": 2,
echo     "section": "SESI 2 : HYOUGEN",
echo     "title": "",
echo     "img": "",
echo     "options": [
echo       {
echo         "text": "Ulangi tanpa henti",
echo         "kana": "",
echo         "rom": "",
echo         "arti": "Mengulang tanpa henti"
echo       },
echo       {
echo         "text": "Ulangi secara konsisten",
echo         "kana": "",
echo         "rom": "",
echo         "arti": "Latihan konsisten sampai mantap"
echo       },
echo       {
echo         "text": "Uji diri sekali",
echo         "kana": "",
echo         "rom": "",
echo         "arti": "Menguji diri satu kali"
echo       }
echo     ],
echo     "answer": 1,
echo     "score": "0/4",
echo     "trans": "Ulangi semua latihan secara konsisten sampai mantap.",
echo     "trans_rom": "Ulagai semu raburai kousei ni made mantap.",
echo     "mnn": "MNN Bab X - Konsistensi Latihan",
echo     "analisis": "Kunci jawaban sesuai instruksi ulang secara konsisten.",
echo     "opt_detail": [
echo       {
echo         "kana": "",
echo         "rom": "",
echo         "arti": "",
echo         "alasan": "Salah: harus secara konsisten, tanpa henti"
echo       },
echo       {
echo         "kana": "",
echo         "rom": "",
echo         "arti": "",
echo         "alansa": "Salah: kata tidak tepat"
echo       },
echo       {
echo         "kana": "",
echo         "rom": "",
echo         "arti": "",
echo         "alansa": "Sahih: sesuai kata kunci 'sampai mantap'"
echo       }
echo     ],
echo     "opt_note": ["(kenkou) sehat", "(mantai) mantap"],
echo     "kunci_id": "Ulangi konsisten sampai mantap"
echo   }
echo ]
) > "d:/soal-jft/public/hare2-quiz/quiz-data.json"
endlocal
echo File created successfully