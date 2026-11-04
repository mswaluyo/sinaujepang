const fs = require('fs');

const path = 'public/shimemasu2-quiz/quiz-data.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// 1. Pemetaan Ulang Sesi HYOUGEN (No. 14 - 28)
// Sesuai penamaan aset resmi _arsip/SHIMEMASU2:
// - No. 14 (Hyougen #1) -> assets/h1.jpg
// - No. 15 (Hyougen #2) -> assets/h2.png
// - No. 16 (Hyougen #3) -> assets/h3.png
// - No. 17 (Hyougen #4) -> tidak bergambar
// - No. 18 (Hyougen #5) -> tidak bergambar
// - No. 19 (Hyougen #6) -> tidak bergambar
// - No. 20 (Hyougen #7) -> tidak bergambar
// - No. 21 (Hyougen #8) -> assets/h8.jpg (Membawakan tas koper berat / mochimashou ka)
// - No. 22 (Hyougen #9) -> assets/h9.jpg (Kuil kuno bersejarah / taterareta)
// - No. 23 (Hyougen #10) -> tidak bergambar
// - No. 24 (Hyougen #11) -> tidak bergambar
// - No. 25 (Hyougen #12) -> assets/h12.jpg (Dua orang bicarakan rekan sakit / chotto shinpai)
// - No. 26 (Hyougen #13) -> assets/h13.jpg (Menawarkan buah pisang / banana)
// - No. 27 (Hyougen #14) -> tidak bergambar
// - No. 28 (Hyougen #15) -> assets/h15.png (Buku kamus bertanya arti kata / wakaranai)

const hyougenMap = {
  14: 'assets/h1.jpg',
  15: 'assets/h2.png',
  16: 'assets/h3.png',
  17: '',
  18: '',
  19: '',
  20: '',
  21: 'assets/h8.jpg',
  22: 'assets/h9.jpg',
  23: '',
  24: '',
  25: 'assets/h12.jpg',
  26: 'assets/h13.jpg',
  27: '',
  28: 'assets/h15.png'
};

for (let no = 14; no <= 28; no++) {
  const q = data.find(i => i.no === no);
  if (q) {
    q.img = hyougenMap[no];
  }
}

// 2. Pemetaan Ulang Sesi DOKKAI (No. 41 - 52)
// Pola nama file 2 angka = 2 nomor soal:
// - No. 41 (Dokkai #1) -> assets/d1.png
// - No. 42 (Dokkai #2) -> assets/d1.png (atau d1 untuk 1 & 2)
// - No. 43 (Dokkai #3) -> assets/d3-4.png
// - No. 44 (Dokkai #4) -> assets/d3-4.png
// - No. 45 (Dokkai #5) -> assets/d5-6.png
// - No. 46 (Dokkai #6) -> assets/d5-6.png
// - No. 47 (Dokkai #7) -> assets/d7-8.png
// - No. 48 (Dokkai #8) -> assets/d7-8.png
// - No. 49 (Dokkai #9) -> assets/d9-10.png
// - No. 50 (Dokkai #10) -> assets/d9-10.png
// - No. 51 (Dokkai #11) -> assets/d11-12.png
// - No. 52 (Dokkai #12) -> assets/d11-12.png

const dokkaiMap = {
  41: 'assets/d1.png',
  42: 'assets/d1.png',
  43: 'assets/d3-4.png',
  44: 'assets/d3-4.png',
  45: 'assets/d5-6.png',
  46: 'assets/d5-6.png',
  47: 'assets/d7-8.png',
  48: 'assets/d7-8.png',
  49: 'assets/d9-10.png',
  50: 'assets/d9-10.png',
  51: 'assets/d11-12.png',
  52: 'assets/d11-12.png'
};

for (let no = 41; no <= 52; no++) {
  const q = data.find(i => i.no === no);
  if (q) {
    q.img = dokkaiMap[no];
  }
}

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log('Berhasil memperbarui pemetaan aset gambar sesi Hyougen & Dokkai di quiz-data.json');

