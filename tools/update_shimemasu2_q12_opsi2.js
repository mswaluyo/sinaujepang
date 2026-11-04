const fs = require('fs');

const path = 'public/shimemasu2-quiz/quiz-data.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const q12 = data.find(q => q.no === 12);

if (q12) {
  // Update sesuai Opsi 2 (Tanpa tanda kurung siku sesuai instruksi sebelumnya)
  q12.title = `スーパーの やさい うりば:
・トマト: 100円
・きゅうり: 85円

きゅうり は いくらですか。`;

  q12.subTitle = "Area sayur di supermarket: Tomat 100 Yen, Timun 85 Yen. Berapakah harga timun?";
  q12.trans = `Area sayuran di supermarket:
・Tomat: 100 Yen
・Timun: 85 Yen

Pertanyaan: Berapakah harga timun?
Jawaban: 85 Yen.`;
  q12.trans_rom = "Suupaa no yasai uriba: Tomato: 100-en, Kyuuri: 85-en. Kyuuri wa ikura desu ka. Hachijuugo-en desu.";
  
  q12.analisis = "[MNN Bab 3 - Satuan Mata Uang & Informasi Harga Barang] Berdasarkan teks label harga sayuran di supermarket: 'きゅうり: 85円' (Timun: 85 Yen). Maka jawaban untuk pertanyaan 'きゅうり は いくらですか' (Berapakah harga timun?) adalah 85円です (hachijuugo-en desu). Pilihan 80千 salah karena satuan ribuan (千) tidak berdiri sendiri sebagai mata uang dan nominalnya keliru. Pilihan 80門 salah karena 門 berarti gerbang, bukan satuan mata uang Jepang.";

  q12.opt_detail = [
    {
      kana: "85円です",
      rom: "hachijuugo-en desu",
      arti: "harganya 85 Yen",
      alasan: "Tepat sekali. Pada daftar harga tercantum 'きゅうり: 85円', dijawab dengan satuan mata uang Jepang 円 (en) menjadi 85円です."
    },
    {
      kana: "80千です",
      rom: "hachijuusen desu",
      arti: "80 ribu (salah satuan)",
      alasan: "Salah. Kata 千 (sen) berarti ribuan dan nominalnya 80 bukan 85, serta tidak lazim digunakan tanpa satuan mata uang resmi 円."
    },
    {
      kana: "80門です",
      rom: "hachijuumon desu",
      arti: "80 gerbang (salah total)",
      alasan: "Salah. Kanji 門 (mon) berarti gerbang/pintu masuk, bukan satuan mata uang."
    }
  ];

  q12.opt_note = [
    "(harganya 85 Yen)",
    "(80 ribu (salah satuan))",
    "(80 gerbang (salah total))"
  ];
}

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log('Q12 shimemasu2 berhasil diperbarui ke Opsi 2');

