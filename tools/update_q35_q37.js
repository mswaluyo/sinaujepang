const fs = require('fs');

const path = 'public/orimasu2-quiz/quiz-data.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// Update Soal 35
const q35 = data.find(x => x.no === 35);
if (q35) {
  q35.title = `[ Bacaan ]
[ dokkai ]
今日、新しい 店が オープンしました。
いろいろな 品物を 売っています。
今、5000円以上 買い物を した 人に、新しい コップを プレゼントします。
また、店に 来た 全員に、タオルを 無料で あげます。
コップは 買い物を した 人だけですが、タオルは だれでも もらえます。

[ Pertanyaan ]
1. 店に 来た 人は、何を 無料で（ただで）もらえますか。
(Barang apa yang bisa didapatkan secara gratis oleh orang yang datang ke toko?)`;

  q35.subTitle = '(1. Barang apa yang bisa didapatkan secara gratis oleh semua pengunjung toko?)';

  q35.trans = `[ Terjemahan Bacaan ]
Hari ini, toko baru telah resmi dibuka (grand opening).
Kami menjual beraneka macam barang kebutuhan.
Saat ini, bagi siapa saja yang berbelanja senilai 5.000 Yen ke atas, kami memberikan hadiah berupa cangkir (gelas) baru.
Selain itu, kepada SEMUA orang yang datang berkunjung ke toko, kami membagikan HANDUK secara GRATIS (muryou de).
Cangkir hanya untuk orang yang berbelanja, tetapi handuk bisa didapatkan oleh siapa saja.

[ Terjemahan Pertanyaan ]
(1. Barang apa yang bisa didapatkan secara gratis oleh setiap orang yang datang ke toko?)`;

  q35.analisis = '[MNN Bab 24 - Dokkai Pemberian Hadiah Promosi (無料で あげます / だれでも もらえます)] Teks bacaan membedakan dua jenis hadiah promosi pembukaan toko: (1) Cangkir (コップ) hanya untuk yang berbelanja di atas 5.000 Yen (5000円以上 買い物をした人だけ); (2) Handuk (タオル) diberikan secara GRATIS tanpa syarat belanja kepada siapa saja/semua pengunjung yang datang: 「店に 来た 全員に、タオルを 無料で あげます。タオルは だれでも もらえます」. Maka barang yang didapatkan secara gratis oleh pengunjung adalah Handuk (タオル - taoru).';

  q35.opt_detail = [
    {
      kana: 'テント',
      rom: 'tento',
      arti: 'tenda (kemah)',
      alasan: 'Salah. Di dalam teks sama sekali tidak menyebutkan kata tenda kemah (テント).'
    },
    {
      kana: 'オープン',
      rom: 'oopun',
      arti: 'buka / grand opening',
      alasan: 'Salah. オープン (open) adalah kata kerja serapan untuk pembukaan toko, bukan barang fisik yang dibagikan.'
    },
    {
      kana: 'タオル',
      rom: 'taoru',
      arti: 'handuk',
      alasan: 'Tepat sekali. Teks menegaskan: 「店に 来た 全員に、タオルを 無料で あげます」 (Kepada semua pengunjung toko, handuk diberikan gratis).'
    }
  ];

  q35.opt_note = [
    '(tento) tenda kemah',
    '(oopun) pembukaan toko',
    '(taoru) handuk (hadiah gratis)'
  ];
}

// Update Soal 37
const q37 = data.find(x => x.no === 37);
if (q37) {
  q37.title = `[ Bacaan ]
[ dokkai ]
体調の おはなし
昨日の 夜から 体調が 悪いです。熱が 高くて、頭が 痛いです。病院に 行ったら、インフルエンザでした。先生は 薬を くれました。飲み物に ついて 先生は 「水や ジュースも いいですが、お茶を 飲んでください」と 言いました。薬と お茶を 飲んで、ゆっくり 休んで ください。

[ Pertanyaan ]
2. 先生（医者）は 何を 飲むように 言いましたか。
(Minuman apa yang disarankan dokter untuk diminum?)`;

  q37.subTitle = '(2. Minuman apa yang dianjurkan oleh dokter untuk diminum?)';

  q37.trans = `[ Terjemahan Bacaan ]
Cerita tentang Kondisi Kesehatan
Sejak kemarin malam kondisi fisik saya memburuk. Demam saya tinggi dan kepala terasa sakit. Ketika pergi memeriksakan diri ke rumah sakit, ternyata terkena influenza. Dokter memberi saya obat. Mengenai minuman, dokter menasihati: "Air putih atau jus boleh saja, tetapi tolong minumlah teh hangat (ocha)." Minumlah obat beserta teh, lalu beristirahatlah dengan tenang.

[ Terjemahan Pertanyaan ]
(2. Minuman apa yang diminta/dianjurkan oleh dokter untuk diminum?)`;

  q37.analisis = '[MNN Bab 4 - Dokkai Instruksi Dokter (~てください)] Pada kalimat kutipan ucapan dokter tertulis secara spesifik petunjuk yang harus dijalankan: 「飲み物に ついて 先生は 『水や ジュースも いいですが、お茶を 飲んでください』と 言いました」 (Mengenai minuman, dokter berkata: "Air putih dan jus memang boleh, TETAPI tolong minumlah teh hangat"). Partikel が (tetapi) mengalihkan penekanan dari air/jus ke minuman yang diprioritaskan/diminta, yaitu Teh (お茶 / おちゃ - ocha). Kalimat penutup juga menegaskan kembali: 「薬と お茶を 飲んで、ゆっくり 休んで ください」.';

  q37.opt_detail = [
    {
      kana: '水',
      rom: 'mizu',
      arti: 'air putih',
      alasan: 'Kurang tepat. Meskipun dokter mengatakan air boleh (水もいいですが), instruksi tegas yang diutamakan memakai bentuk ~てください adalah meminum teh (お茶を飲んでください).'
    },
    {
      kana: 'お茶',
      rom: 'ocha',
      arti: 'teh (hangat)',
      alasan: 'Tepat sekali. Dokter meminta secara langsung: 「お茶を 飲んでください」 (Tolong minumlah teh) dan 「薬と お茶を 飲んで」 (Minumlah obat dan teh).'
    },
    {
      kana: 'ジュース',
      rom: 'juusu',
      arti: 'jus',
      alasan: 'Kurang tepat. Dokter menyatakan jus boleh saja sebagai opsi sekunder, bukan instruksi utama yang diminta untuk diminum.'
    }
  ];

  q37.opt_note = [
    '(mizu) air putih (opsi pelengkap)',
    '(ocha) teh (anjuran utama dokter)',
    '(juusu) jus (opsi pelengkap)'
  ];
}

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully updated questions 35 & 37 in orimasu2-quiz!');

