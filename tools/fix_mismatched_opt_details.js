const fs = require('fs');

const path = 'public/shimemasu2-quiz/quiz-data.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// 1. Perbaiki No. 20 (もちましょうか | てつだいましょうか | 元気ですか)
const q20 = data.find(q => q.no === 20);
if (q20) {
  q20.opt_detail = [
    {
      kana: "もちましょうか",
      rom: "mochimashou ka",
      arti: "Maukah saya bawakan? (mochimashou ka)",
      alasan: "Tepat sekali. Gambar/situasi menunjukkan seseorang keberatan membawa barang bawaan. Pola tawaran membawakan barang secara sopan adalah もちましょうか (Maukah saya bawakan?)."
    },
    {
      kana: "てつだいましょうか",
      rom: "tetsudaimashou ka",
      arti: "Maukah saya bantu?",
      alasan: "Kurang spesifik. Dalam konteks melihat seseorang memegang barang bawaan berat, ungkapan paling tepat dan natural adalah membawakan barangnya (もちましょうか)."
    },
    {
      kana: "元気ですか",
      rom: "genki desu ka",
      arti: "Apakah Anda sehat / apa kabar?",
      alasan: "Salah. 元気ですか adalah sapaan menanyakan kabar kesehatan, tidak cocok digunakan saat menawarkan bantuan pada barang bawaan yang dijawab 'はい、お願いします'."
    }
  ];
  q20.opt_note = [
    "(Maukah saya bawakan? (mochimashou ka))",
    "(Maukah saya bantu?)",
    "(Apakah Anda sehat / apa kabar?)"
  ];
}

// 2. Perbaiki No. 21 (もられた | きられた | たてられた)
const q21 = data.find(q => q.no === 21);
if (q21) {
  q21.opt_detail = [
    {
      kana: "もられた",
      rom: "morareta",
      "arti": "Dituangkan / disajikan (bukan pasif bangunan)",
      alasan: "Salah. Kata 盛る (moru) digunakan untuk menyajikan/menuangkan makanan ke mangkuk, tidak bisa untuk mendirikan bangunan."
    },
    {
      kana: "きられた",
      rom: "kirareta",
      "arti": "Dipotong / ditebang",
      alasan: "Salah. 切られた (kirareta) adalah bentuk pasif dari 切る (memotong/menebang), tidak relevan dengan pembangunan gedung oleh arsitek."
    },
    {
      kana: "たてられた",
      rom: "taterareta",
      "arti": "Dibangun (taterareta)",
      alasan: "Tepat sekali. Bentuk pasif (ukemi) dari 建てる (tateru = membangun) adalah 建てられた (taterareta = dibangun), berpasangan tepat dengan penanda pembuat arsitek (によって)."
    }
  ];
  q21.opt_note = [
    "(Dituangkan / disajikan)",
    "(Dipotong / ditebang)",
    "(Dibangun (taterareta))"
  ];
}

// 3. Perbaiki No. 22 (わけるようななりました | でかけるようになりました | かけるようになりました)
const q22 = data.find(q => q.no === 22);
if (q22) {
  q22.opt_detail = [
    {
      kana: "わけるようななりました",
      rom: "wakeru you na narimashita",
      arti: "Bentuk salah secara tata bahasa",
      alasan: "Salah. Partikelnya keliru (menggunakan な bukannya に) dan kata kerja 分ける berarti membagi/memisahkan, bukan menulis."
    },
    {
      kana: "でかけるようになりました",
      rom: "dekakeru you ni narimashita",
      arti: "Menjadi bisa bepergian keluar",
      alasan: "Salah. 出かける berarti pergi ke luar rumah, tidak masuk akal dengan objek jumlah huruf kanji (漢字が 500字)."
    },
    {
      kana: "かけるようになりました",
      rom: "kakeru you ni narimashita",
      arti: "Menjadi bisa menulis (kakeru you ni narimashita)",
      alasan: "Tepat sekali. Bentuk potensial dari 書く (menulis) adalah 書ける (bisa menulis). Digabung dengan ように なりました untuk menyatakan perubahan kemampuan dari belum bisa menjadi bisa."
    }
  ];
  q22.opt_note = [
    "(Bentuk salah secara tata bahasa)",
    "(Menjadi bisa bepergian keluar)",
    "(Menjadi bisa menulis (kakeru you ni narimashita))"
  ];
}

// 4. Perbaiki No. 33 (2回 | 1回 | 3回)
const q33 = data.find(q => q.no === 33);
if (q33) {
  q33.opt_detail = [
    {
      kana: "2回",
      rom: "ni-kai",
      arti: "2 kali sehari (2回)",
      alasan: "Tepat sekali. Dokter menginstruksikan aturan minum obat dengan jelas: 'これは 1日に 2回 飲んで ください' (Ini diminum 2 kali sehari)."
    },
    {
      kana: "1回",
      rom: "ik-kai",
      arti: "1 kali sehari",
      alasan: "Salah. Dokter tidak mengatakan diminum 1 kali sehari."
    },
    {
      kana: "3回",
      rom: "san-kai",
      arti: "3 kali sehari",
      alasan: "Salah. Pasien mengonfirmasi '朝と晩' (pagi dan malam hari), yang berarti 2 kali, bukan 3 kali."
    }
  ];
  q33.opt_note = [
    "(2 kali sehari (2回))",
    "(1 kali sehari)",
    "(3 kali sehari)"
  ];
}

// 5. Perbaiki No. 34 (Joging | Istirahat/Tidur | Yoga)
const q34 = data.find(q => q.no === 34);
if (q34) {
  q34.opt_detail = [
    {
      kana: "Joging",
      rom: "jogingu",
      arti: "Berlari joging",
      alasan: "Salah. Dokter tidak menyarankan aktivitas fisik berat seperti joging saat sedang sakit."
    },
    {
      kana: "Istirahat/Tidur",
      rom: "yasumu / neru",
      arti: "Istirahat dan tidur yang cukup",
      alasan: "Tepat sekali. Dokter menyarankan agar lekas sembuh: '早く治すためにはしっかり休むことが大切です。今日はしっかり寝ていてください' (Penting untuk istirahat, hari ini tidurlah yang cukup)."
    },
    {
      kana: "Yoga",
      rom: "yoga",
      arti: "Senam yoga",
      alasan: "Salah. Percakapan tidak menyebutkan senam yoga sama sekali."
    }
  ];
  q34.opt_note = [
    "(Berlari joging)",
    "(Istirahat dan tidur yang cukup)",
    "(Senam yoga)"
  ];
}

// 6. Perbaiki No. 35 (lari ke tepi sungai | Pakai helem | Berlindung di bawah meja)
const q35 = data.find(q => q.no === 35);
if (q35) {
  q35.opt_detail = [
    {
      kana: "lari ke tepi sungai",
      rom: "kawa no soba e nigeru",
      arti: "Lari ke tepi sungai",
      alasan: "Salah. Mengungsi ke tepi sungai saat gempa berisiko bahaya longsor atau luapan air, tidak disarankan."
    },
    {
      kana: "Pakai helem",
      rom: "herumetto wo kaburu",
      arti: "Memakai helm",
      alasan: "Salah. Pengumuman tidak menyebutkan mencari helm terlebih dahulu saat gempa baru berguncang."
    },
    {
      kana: "Berlindung di bawah meja",
      rom: "tsukue no shita ni hairu",
      arti: "Berlindung di bawah meja yang kokoh",
      alasan: "Tepat sekali. Langkah awal saat gempa: '近くに丈夫な机がある場合は、すぐにその下に入ってください。そして、両手でしっかりと頭を隠して姿勢を低く保ってください' (Segera masuk ke bawah meja kokoh dan lindungi kepala)."
    }
  ];
  q35.opt_note = [
    "(Lari ke tepi sungai)",
    "(Memakai helm)",
    "(Berlindung di bawah meja yang kokoh)"
  ];
}

// 7. Perbaiki No. 36 (Lapangan | Samping bangunan | Tepi laut)
const q36 = data.find(q => q.no === 36);
if (q36) {
  q36.opt_detail = [
    {
      kana: "Lapangan",
      rom: "hiroba",
      arti: "Lapangan luas di luar gedung (広場)",
      alasan: "Tepat sekali. Pengumuman evakuasi setelah guncangan berhenti: 'ゆっくりと建物から出て、外の広い広場へ避難してください' (Keluarlah perlahan dari gedung dan mengungsilah ke lapangan terbuka yang luas)."
    },
    {
      kana: "Samping bangunan",
      rom: "tatemono no tonari",
      arti: "Di samping bangunan gedung",
      alasan: "Salah. Berada di samping gedung sangat berbahaya karena risiko tertimpa runtuhan tembok atau kaca jendela."
    },
    {
      kana: "Tepi laut",
      rom: "kaigan",
      arti: "Di tepi pantai/laut",
      alasan: "Salah. Mendekati laut pascagempa sangat membahayakan keselamatan karena risiko gelombang tsunami."
    }
  ];
  q36.opt_note = [
    "(Lapangan luas di luar gedung (広場))",
    "(Di samping bangunan gedung)",
    "(Di tepi pantai/laut)"
  ];
}

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log('Berhasil memperbaiki sinkronisasi opsi dan analisis pada soal 20, 21, 22, 33, 34, 35, 36');

