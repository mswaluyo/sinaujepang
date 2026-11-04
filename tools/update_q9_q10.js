const fs = require('fs');

const path = 'public/orimasu2-quiz/quiz-data.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// Update Soal 9
const q9 = data.find(x => x.no === 9);
if (q9) {
  q9.title = '_____ を 着ます。';
  q9.subTitle = '(Memakai _____.)';
  q9.trans = 'Memakai pakaian / baju.';
  q9.trans_rom = '_____ o kimasu.';
}

// Update Soal 10
const q10 = data.find(x => x.no === 10);
if (q10) {
  q10.title = '今は _____ に います。';
  q10.subTitle = '(Saat ini saya berada di _____.)';
  q10.trans = 'Sekarang saya sedang berada di toko.';
  q10.trans_rom = 'Ima wa _____ ni imasu.';
  q10.analisis = '[MNN Bab 10 - Pola Keberadaan [Tempat] に います & Seleksi Kategori Kanji] Soal rumpang ini menguji pemahaman struktur keberadaan mahluk hidup: [Lokasi Fasilitas/Tempat] に います. Dari ketiga pilihan kanji: 足 (ashi - kaki/anggota tubuh), 店 (mise - toko/tempat fisik), dan 予定 (yotei - jadwal/rencana/konsep abstrak), hanya 店 yang merupakan kata benda tempat. Kalimat lengkap: 「今は 店に います」 = \'Sekarang saya sedang berada di toko\'.';
}

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully updated questions 9 & 10 to rumpang format!');

