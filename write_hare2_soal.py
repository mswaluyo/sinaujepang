import json

data = [
    {
        "no": 1,
        "section": "SESI 2 : HYOUGEN",
        "title": "",
        "img": "",
        "options": [
            {
                "text": "Hafal saja tanpa paham",
                "kana": "",
                "rom": "",
                "arti": "Menghemat usaha hanya menghafal"
            },
            {
                "text": "Pahami konteks materi",
                "kana": "",
                "rom": "",
                "arti": "Mengerti makna dan konteks belajar"
            },
            {
                "text": "Lompat ke materi berikutnya",
                "kana": "",
                "rom": "",
                "arti": "Melompat ke materi selanjutnya tanpa mengerti"
            }
        ],
        "answer": 1,
        "score": "0/4",
        "trans": "Jangan sekadar menghafal, tetapi pahami setiap materi.",
        "trans_rom": "Jangan sekadar menghafal, tetapi pahami setiap materi.",
        "mnn": "MNN Bab X - Prinsip Belajar",
        "analisis": "Kunci jawaban sesuai instruksi form Google UPDATE.",
        "opt_detail": [
            {
                "kana": "",
                "rom": "",
                "arti": "",
                "alasan": "Salah: harus paham, bukan hanya hafalan"
            },
            {
                "kana": "",
                "rom": "",
                "arti": "",
                "alansa": "Sahih: sesuai instruksi pahami setiap materi"
            },
            {
                "kana": "",
                "rom": "",
                "arti": "",
                "alansa": "Salah: tidak relevan dengan konteks soal"
            }
        ],
        "opt_note": ["(tada) hanya", "(yoku) baik", "(tsugi) selanjutnya"],
        "kunci_id": "Pahami konteks materi"
    }
]

with open("d:/soal-jft/public/hare2-quiz/quiz-data.json", "w", encoding="utf8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Sukses menulis file soal nomor 1")