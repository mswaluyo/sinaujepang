const fs = require('fs');

const path = 'public/orimasu2-quiz/quiz-data.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const q = data.find(x => x.no === 42);

if (q) {
  q.analisis = '[MNN Bab 27/Dokkai Lokasi Keberadaan (今、どこにいますか)] Pada kalimat terakhir teks bacaan secara eksplisit tertulis keberadaan pembicara saat ini: 「今、私は 旅館の 部屋で 休んで います」 (Sekarang, saya sedang beristirahat di kamar Ryokan / penginapan tradisional Jepang). Oleh karena itu, tempat pembicara berada sekarang adalah di Ryokan (旅館 / りょかん - ryokan).';

  q.trans = '[ Terjemahan Bacaan ]\nCerita tentang Perjalanan / Liburan\nHari ini cuacanya bagus.\nPada pagi hari, saya telah mendaki gunung.\nSiang nanti, saya akan pergi melihat danau / air terjun (air).\nRyokan (penginapan tradisional Jepang) terletak di depan stasiun.\nSekarang, saya sedang beristirahat di dalam kamar Ryokan.\n\n[ Terjemahan Pertanyaan ]\n(2. Sekarang saya sedang berada di mana?)';

  q.opt_detail = [
    {
      kana: 'りょかん',
      rom: 'ryokan',
      arti: 'penginapan tradisional Jepang (Ryokan)',
      alasan: 'Tepat sekali. Kalimat terakhir menyatakan secara jelas: 「今、私は 旅館の 部屋で 休んで います」 (Sekarang saya sedang beristirahat di kamar Ryokan).'
    },
    {
      kana: 'ホテル',
      rom: 'hoteru',
      arti: 'hotel gaya barat',
      alasan: 'Salah. Di dalam teks tempat menginapnya adalah 旅館 (ryokan), bukan hotel bergaya barat (ホテル).'
    },
    {
      kana: 'ぎんこう',
      rom: 'ginkou',
      arti: 'bank',
      alasan: 'Salah. ぎんこう (銀行) adalah kantor bank, sama sekali tidak disebutkan pada teks perjalanan ini.'
    }
  ];

  q.opt_note = [
    '(ryokan) penginapan tradisional Jepang',
    '(hoteru) hotel',
    '(ginkou) bank'
  ];

  fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
  console.log('Successfully updated question 42 in orimasu2-quiz!');
}

