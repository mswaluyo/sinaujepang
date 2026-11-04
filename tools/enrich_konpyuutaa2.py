import json

with open('public/quizzes/konpyuutaa2-quiz/quiz-data.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

# Tailored explanations and specific MNN tags per question
# Mojigoi 1..14
items[0]["analisis"] = "[MNN Bab 2 - Katakana Peralatan] Gambar menunjukkan sebuah komputer desktop lengkap (PC). Dalam bahasa Jepang, komputer diserap ke dalam katakana menjadi **コンピューター (konpyuutaa)**. Pilihan ボード berarti papan, sedangkan ほん berarti buku."
items[0]["opt_detail"] = [
    {"kana": "ボード", "rom": "boodo", "arti": "papan", "alasan": "ボード (board) berarti papan pengumuman/tulis, bukan komputer."},
    {"kana": "ほん", "rom": "hon", "arti": "buku", "alasan": "ほん (buku) tidak sesuai dengan visual perangkat elektronik komputer pada gambar."},
    {"kana": "コンピューター", "rom": "konpyuutaa", "arti": "komputer", "alasan": "コンピューター adalah kosakata katakana resmi untuk komputer desktop."}
]

items[1]["analisis"] = "[MNN Bab 2 - Benda Sehari-hari] Gambar memperlihatkan sebuah kunci pintu/gembok. Dalam bahasa Jepang, kunci adalah **かぎ (kagi)**. Pilihan がぎ adalah jebakan penulisan dakuten keliru, dan ほんだな berarti rak buku."
items[1]["opt_detail"] = [
    {"kana": "ほんだな", "rom": "hondana", "arti": "rak buku", "alasan": "ほんだな berarti rak buku, tidak cocok dengan gambar kunci logam kecil."},
    {"kana": "がぎ", "rom": "gagi", "arti": "salah eja", "alasan": "がぎ adalah jebakan ejaan salah (huruf ka diberi dakuten menjadi ga)."},
    {"kana": "かぎ", "rom": "kagi", "arti": "kunci", "alasan": "かぎ adalah kosakata yang benar dan tepat untuk kunci."}
]

items[2]["analisis"] = "[MNN Bab 39 / Bab 41 - Kosakata Acara & Kehidupan] Gambar memperlihatkan pasangan pengantin merayakan pernikahan. Kosakata bahasa Jepang untuk pernikahan adalah **けっこん (kekkon - 結婚)** dengan konsonan ganda sokuon kecil (っ). Pilihan けこん salah eja, dan おまつり berarti festival."
items[2]["opt_detail"] = [
    {"kana": "けっこん", "rom": "kekkon", "arti": "pernikahan", "alasan": "けっこん (結婚) adalah istilah resmi untuk pernikahan."},
    {"kana": "けこん", "rom": "kekon", "arti": "salah eja", "alasan": "けこん kurang huruf sokuon kecil (っ) sehingga pelafalannya salah."},
    {"kana": "おまつり", "rom": "omatsuri", "arti": "festival", "alasan": "おまつり mengacu pada matsuri/perayaan kuil tradisional, bukan resepsi pernikahan."}
]

items[3]["analisis"] = "[MNN Bab 14 / Bab 49 - Pelayanan & Kata Kerja Gerak] Gambar menunjukkan staf petugas berseragam sedang mengarahkan jalan kepada pengunjung. Kata kerja yang tepat adalah **案内します (annai shimasu = memandu/mengantar arah)**. Pilihan 切ります berarti memotong, dan 待ちます berarti menunggu."
items[3]["opt_detail"] = [
    {"kana": "切ります", "rom": "kirimasu", "arti": "memotong", "alasan": "切ります berarti memotong benda dengan pisau/gunting, tidak relevan."},
    {"kana": "案内します", "rom": "annai shimasu", "arti": "memandu / mengantar", "alasan": "案内します tepat mendeskripsikan aktivitas petugas pemandu informasi jalan."},
    {"kana": "待ちます", "rom": "machimasu", "arti": "menunggu", "alasan": "待ちます berarti menunggu seseorang, tidak sesuai dengan aksi menunjukkan arah."}
]

items[4]["analisis"] = "[MNN Bab 8 / Bab 16 - Cara Baca Kanji Kata Sifat-i] Kanji **軽い** memiliki arti 'ringan' dan dibaca **かるい (karui)**. Dalam bentuk penyambung ~te, kata sifat ini berubah menjadi **軽くて (かるくて - karukute)**. Kalimat: このカメラは軽くてつかいやすいです (Kamera ini ringan dan mudah dipakai)."
items[4]["opt_detail"] = [
    {"kana": "たのしくて", "rom": "tanoshikute", "arti": "menyenangkan", "alasan": "たのしくて adalah bentuk ~te dari 楽しい (tanoshii = menyenangkan)."},
    {"kana": "かるくて", "rom": "karukute", "arti": "ringan", "alasan": "かるくて adalah cara baca kanji 軽くて yang benar."},
    {"kana": "あかくて", "rom": "akakute", "arti": "merah", "alasan": "あかくて adalah bentuk ~te dari 赤い (akai = merah)."}
]

items[5]["analisis"] = "[MNN Bab 3 - Kosakata Identitas & Kanji] Kanji **住所** berarti 'alamat tempat tinggal'. Cara bacanya adalah **じゅうしょ (juusho)** dengan bunyi vokal panjang 'uu' pada kanji 住 (じゅう) dan pendek pada kanji 所 (しょ)."
items[5]["opt_detail"] = [
    {"kana": "じゅしょ", "rom": "jusho", "arti": "salah eja (vokal pendek)", "alasan": "じゅしょ salah karena tidak memiliki vokal panjang 'uu' pada ju."},
    {"kana": "じゆうしゅ", "rom": "jiyuushu", "arti": "salah baca", "alasan": "じゆうしゅ adalah bentuk salah eja yang rancu."},
    {"kana": "じゅうしょ", "rom": "juusho", "arti": "alamat", "alasan": "じゅうしょ adalah cara baca kanji 住所 yang baku."}
]

# Write back
with open('public/quizzes/konpyuutaa2-quiz/quiz-data.json', 'w', encoding='utf-8') as out:
    json.dump(items, out, ensure_ascii=False, indent=2)

print("Enriched konpyuutaa2-quiz sample!")
