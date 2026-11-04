const fs = require('fs');

const path = 'public/orimasu2-quiz/quiz-data.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const q = data.find(x => x.no === 36);

if (q) {
  q.analisis = '[MNN Bab 4 - Dokkai Keluhan Sakit & Gejala Penyakit (頭が痛い)] Pada bacaan tertulis jelas mengenai gejala yang dirasakan: 「熱が 高くて、頭が 痛いです。病院に 行ったら、インフルエンザでした」 (Demam tinggi dan sakit kepala. Saat pergi ke rumah sakit, ternyata terkena influenza). Jadi ketika terkena influenza, bagian tubuh yang sakit adalah Kepala (頭 / あたま - atama).';

  q.trans = '[ Terjemahan Bacaan ]\nCerita tentang Kondisi Tubuh / Kesehatan\nSejak kemarin malam kondisi tubuh saya buruk. Demam saya tinggi dan kepala saya sakit. Ketika pergi ke rumah sakit, ternyata terkena influenza. Dokter memberi saya obat. Mengenai minuman, dokter berkata: "Air putih atau jus boleh, tetapi tolong minumlah teh." Minumlah obat beserta teh, lalu beristirahatlah dengan tenang.\n\n[ Terjemahan Pertanyaan ]\n(1. Ketika terkena influenza, bagian tubuh apa yang terasa sakit?)';

  q.opt_detail = [
    {
      kana: 'お腹',
      rom: 'onaka',
      arti: 'perut',
      alasan: 'Salah. Di dalam teks tidak disebutkan bahwa perutnya sakit (bukan お腹が痛い).'
    },
    {
      kana: '頭',
      rom: 'atama',
      arti: 'kepala',
      alasan: 'Tepat sekali. Teks secara eksplisit menyebutkan: 「頭が 痛いです」 (kepala sakit).'
    },
    {
      kana: '顔',
      rom: 'kao',
      arti: 'wajah / muka',
      alasan: 'Salah. 顔 (kao) berarti wajah/muka, bukan bagian tubuh yang dikeluhkan sakit pada teks.'
    }
  ];

  q.opt_note = [
    '(onaka) perut',
    '(atama) kepala',
    '(kao) wajah / muka'
  ];

  fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
  console.log('Successfully updated question 36 in orimasu2-quiz!');
}

