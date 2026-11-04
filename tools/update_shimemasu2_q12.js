const fs = require('fs');

const path = 'public/shimemasu2-quiz/quiz-data.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const q = data.find(x => x.no === 12);
if (q) {
  q.title = '値札: 85円\nA: これ は いくらですか。\nB: _________。';
  q.subTitle = 'Label harga: 85円 — A: Berapakah harga barang ini? / B: _________.';
  q.trans = 'Label harga: 85 Yen\nA: Berapakah harga barang ini?\nB: Harganya 85 Yen.';
  q.trans_rom = 'Nefuda: 85-en. A: Kore wa ikura desu ka. B: Hachijuugo-en desu.';
  q.analisis = '[MNN Bab 3/13 - Satuan Mata Uang Jepang & Cara Menjawab Harga (いくらですか)] Untuk menyatakan dan menjawab harga barang dalam bahasa Jepang, satuan mata uang resmi yang wajib digunakan adalah 円 (dibaca えん / en = Yen). Angka 85 dilafalkan はちじゅうご (hachijuugo) dan diikuti satuan mata uang 円 (en), sehingga menjadi 85円です (hachijuugo-en desu = 85 Yen). Pilihan 80千 salah karena satuan 千 (sen/ribu) tidak lazim berdiri sendiri tanpa satuan mata uang dan nominalnya keliru. Pilihan 80門 salah karena 門 (mon) berarti gerbang pintu/kategori, bukan mata uang Jepang.';

  q.opt_detail = [
    {
      kana: '85円です',
      rom: 'hachijuugo-en desu',
      arti: 'harganya 85 Yen',
      alasan: 'Tepat sekali. Menggunakan satuan mata uang Jepang resmi 円 (en) dengan nominal yang sesuai dengan label harga 85.'
    },
    {
      kana: '80千です',
      rom: 'hachijuusen desu',
      arti: '80 ribu (salah satuan)',
      alasan: 'Salah. Kata 千 (sen) berarti ribuan dan tidak boleh digunakan sebagai pengganti satuan mata uang 円.'
    },
    {
      kana: '80門です',
      rom: 'hachijuumon desu',
      arti: '80 gerbang (salah total)',
      alasan: 'Salah. Kanji 門 (mon) berarti gerbang pintu, bukan satuan mata uang.'
    }
  ];

  q.opt_note = [
    '(hachijuugo-en desu) 85 Yen (benar)',
    '(hachijuusen desu) salah satuan',
    '(hachijuumon desu) salah kanji/satuan'
  ];

  fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
  console.log('Successfully updated question 12 in shimemasu2-quiz!');
}

