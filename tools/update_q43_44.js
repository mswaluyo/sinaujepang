const fs = require('fs');

const path = 'public/orimasu2-quiz/quiz-data.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// Update Soal 43
const q43 = data.find(x => x.no === 43);
if (q43) {
  q43.title = `[ Bacaan ]
[ dokkai ]
メールの おしらせ
田中さんからの メールです。
今、10時です。田中さんと 会う 時間は 11時です。
日付と 詳しい 時間は、この メールに 書いてあります。
メールの 11時の 下を 見て ください。

[ Pertanyaan ]
1. Tanaka-san to au jikan wa nanji desu ka? (Pukul berapa waktu bertemu dengan Tanaka-san?)`;

  q43.subTitle = '(1. Pukul berapa janji bertemu dengan Tanaka-san?)';

  q43.trans = `[ Terjemahan Bacaan ]
Pemberitahuan melalui Email
Ini adalah email dari Tanaka-san.
Sekarang pukul 10:00. Waktu untuk bertemu dengan Tanaka-san adalah pukul 11:00.
Tanggal dan rincian waktu tertulis di dalam email ini.
Silakan lihat bagian di bawah tulisan pukul 11:00 pada email tersebut.

[ Terjemahan Pertanyaan ]
(1. Pukul berapakah waktu untuk bertemu dengan Tanaka-san?)`;

  q43.analisis = '[MNN Bab 4 - Dokkai Jam Pertemuan (会う時間)] Kalimat kedua teks email secara tegas menyatakan waktu pertemuan: 「今、10時です。田中さんと 会う 時間は 11時です」 (Sekarang jam 10. Waktu untuk bertemu Tanaka-san adalah pukul 11:00). Maka waktu janji bertemu yang tepat adalah pukul 11:00 (11時 / じゅういちじ). Pukul 10:00 adalah waktu saat ini saat membaca/menulis email.';

  q43.opt_detail = [
    {
      kana: '11:30',
      rom: 'juuichiji sanjuppun',
      arti: 'pukul 11:30',
      alasan: 'Salah. Angka menit 30 sama sekali tidak tertulis pada teks email.'
    },
    {
      kana: '11:00',
      rom: 'juuichiji',
      arti: 'pukul 11:00',
      alasan: 'Tepat sekali. Teks menyatakan secara eksplisit: 「田中さんと 会う 時間は 11時です」 (Waktu bertemu Tanaka-san pukul 11:00).'
    },
    {
      kana: '10:00',
      rom: 'juuji',
      arti: 'pukul 10:00',
      alasan: 'Salah. Pukul 10:00 adalah waktu sekarang (今、10時です), bukan jam janji bertemu.'
    }
  ];

  q43.opt_note = [
    '(11:30) pengecoh waktu',
    '(11:00) waktu janji temu',
    '(10:00) waktu sekarang'
  ];
}

// Update Soal 44
const q44 = data.find(x => x.no === 44);
if (q44) {
  q44.title = `[ Bacaan ]
[ dokkai ]
メールの おしらせ
田中さんからの メールです。
今、10時です。田中さんと 会う 時間は 11時です。
日付と 詳しい 時間は、この メールに 書いてあります。
メールの 11時の 下を 見て ください。

[ Pertanyaan ]
2. Di bagian mana tanggal dan waktu detail tertulis?`;

  q44.subTitle = '(2. Di mana rincian tanggal dan jam janji temu tertulis?)';

  q44.trans = `[ Terjemahan Bacaan ]
Pemberitahuan melalui Email
Ini adalah email dari Tanaka-san.
Sekarang pukul 10:00. Waktu untuk bertemu dengan Tanaka-san adalah pukul 11:00.
Tanggal dan rincian waktu tertulis di dalam email ini.
Silakan lihat bagian di bawah tulisan pukul 11:00 pada email tersebut.

[ Terjemahan Pertanyaan ]
(2. Di bagian manakah rincian tanggal dan waktu tertulis?)`;

  q44.analisis = '[MNN Bab 10 - Dokkai Posisi Petunjuk Teks (〜の下)] Kalimat terakhir teks memberikan petunjuk lokasi secara jelas: 「メールの 11時の 下を 見て ください」 (Tolong lihat bagian di bawah tulisan jam 11 pada email). Kata penunjuk posisi 下 (shita) berarti "bawah", sehingga posisi detail tanggal dan jam berada di bawah tulisan jam 11:00.';

  q44.opt_detail = [
    {
      kana: 'ada dibawah jam',
      rom: '11-ji no shita',
      arti: 'ada di bawah jam (11:00)',
      alasan: 'Tepat sekali. Teks menginstruksikan: 「11時の 下を 見て ください」 (Silakan lihat di bawah jam 11).'
    },
    {
      kana: 'ada di tengah email',
      rom: 'meeru no mannaka',
      arti: 'ada di tengah email',
      alasan: 'Salah. Tidak disebutkan kata posisi tengah (真ん中 - mannaka).'
    },
    {
      kana: 'ada di atas email',
      rom: 'meeru no ue',
      arti: 'ada di atas email',
      alasan: 'Salah. Petunjuk mengarahkan ke bawah (下 - shita), bukan ke atas (上 - ue).'
    }
  ];

  q44.opt_note = [
    '(ada dibawah jam) sesuai instruksi 11時の下',
    '(ada di tengah email) pengecoh posisi',
    '(ada di atas email) pengecoh posisi'
  ];
}

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully updated questions 43 & 44 in orimasu2-quiz!');

