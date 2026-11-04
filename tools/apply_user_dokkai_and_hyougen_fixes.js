const fs = require('fs');

const path = 'public/shimemasu2-quiz/quiz-data.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// 1. Soal No. 17: pasang gambar h4.jpg
const q17 = data.find(i => i.no === 17);
if (q17) {
  q17.img = "assets/h4.jpg";
}

// 2. Soal No. 19: pasang gambar h7.jpg
const q19 = data.find(i => i.no === 19);
if (q19) {
  q19.img = "assets/h7.jpg";
}

// 3. Soal No. 21: sesuaikan analisis soal (pertanyaan pasif kuil/bangunan bersejarah: せかい に よって___そうです / 有名な建築家によって___そうです)
const q21 = data.find(i => i.no === 21);
if (q21) {
  // Tetap pertahankan teks soal sesuai lembar CBT / naskah
  q21.title = "せかい に よって___そうです";
  q21.subTitle = "(Kabarnya [dibangun] oleh...)";
  q21.trans = "Kabarnya (kuil/gedung bersejarah ini) dibangun oleh...";
  q21.trans_rom = "Sekai ni yotte taterareta sou desu.";
  q21.analisis = "[MNN Bab 37 - Kalimat Pasif (Ukemi) ~ni yotte & Bentuk Desas-Desus ~sou desu] Gambar menunjukkan bangunan kuil bersejarah. Pola kalimat pasif untuk pembuatan/pendirian bangunan menggunakan penanda pelaku agen (によって) dan kata kerja pasif dari 建てる (tateru - membangun) yaitu 建てられた (taterareta - dibangun). Akhiran そうです menandakan informasi desas-desus/kabar (katanya/kabarnya dibangun oleh...).";
  q21.opt_detail = [
    {
      kana: "もられた",
      rom: "morareta",
      arti: "Disajikan / dituangkan",
      alasan: "Salah. Kata 盛る (moru) digunakan untuk menumpuk/menyajikan makanan di mangkuk, bukan mendirikan bangunan."
    },
    {
      kana: "きられた",
      rom: "kirareta",
      arti: "Dipotong / ditebang",
      alasan: "Salah. 切られた (kirareta) adalah bentuk pasif dari 切る (memotong/menebang), tidak cocok untuk konstruksi bangunan."
    },
    {
      kana: "たてられた",
      rom: "taterareta",
      arti: "Dibangun (taterareta)",
      alasan: "Tepat sekali. Bentuk pasif (ukemi) dari kata kerja 建てる (tateru = membangun) adalah 建てられた (taterareta = dibangun), yang menjadi pasangan baku dengan penanda konstruksi ~によって."
    }
  ];
  q21.opt_note = [
    "(Disajikan / dituangkan)",
    "(Dipotong / ditebang)",
    "(Dibangun (taterareta))"
  ];
}

// 4. Soal No. 22: sesuaikan title menjadi "5000 かんじを_____"
const q22 = data.find(i => i.no === 22);
if (q22) {
  q22.title = "5000 かんじを_____";
  q22.subTitle = "(Sekarang sudah [menjadi bisa menulis] 5000 kanji.)";
  q22.trans = "Sekarang sudah menjadi bisa menulis 5000 kanji.";
  q22.trans_rom = "Gosen kanji wo kakeru you ni narimashita.";
  q22.analisis = "[MNN Bab 36 - Perubahan Kemampuan (~you ni narimashita)] Kalimat '5000 かんじを_____' menyatakan perubahan kemampuan yang sebelumnya belum bisa menjadi bisa. Kata kerja bentuk potensial dari 書く (kaku - menulis) adalah 書ける (kakeru - bisa menulis). Digabungkan dengan pola ように なりました menjadi かけるように なりました (telah menjadi bisa menulis).";
  q22.opt_detail = [
    {
      kana: "わけるようななりました",
      rom: "wakeru you na narimashita",
      arti: "Bentuk salah secara tata bahasa",
      alasan: "Salah. Partikel penyambungnya keliru (menggunakan な dan bukan に) serta kata kerja 分ける berarti membagi/memisahkan."
    },
    {
      kana: "でかけるようになりました",
      rom: "dekakeru you ni narimashita",
      arti: "Menjadi bisa bepergian keluar",
      alasan: "Salah. Kata kerja 出かける berarti bepergian/keluar rumah, tidak nyambung dengan objek huruf kanji (かんじを)."
    },
    {
      kana: "かけるようになりました",
      rom: "kakeru you ni narimashita",
      arti: "Menjadi bisa menulis (kakeru you ni narimashita)",
      alasan: "Tepat sekali. Kata kerja bentuk potensial 書ける (bisa menulis) bergabung dengan ように なりました untuk menyatakan keberhasilan mencapai kemampuan menulis 5000 kanji."
    }
  ];
  q22.opt_note = [
    "(Bentuk salah secara tata bahasa)",
    "(Menjadi bisa bepergian keluar)",
    "(Menjadi bisa menulis (kakeru you ni narimashita))"
  ];
}

// 5. Soal No. 41 sampai 52 (Dokkai):
// Karena sudah ada gambar berisi informasi lengkap, soal tidak perlu terjemahan naskah panjang di title.
// Cukup pertanyaan murni yang ringkas, sedangkan analisa jawaban dan opsi dibuat lengkap dan mendalam.

const dokkaiUpdates = {
  41: {
    title: "Ada SMS berisi ajakan\nIngin pergi kemana?",
    subTitle: "Berdasarkan gambar SMS di atas, ingin pergi ke mana?",
    trans: "Ada SMS berisi ajakan. Ingin pergi ke mana?",
    analisis: "[Dokkai - Analisis Teks Pesan SMS (Gambar d1.png)] Pada gambar pesan singkat (SMS), A-san secara jelas mengirimkan ajakan: '来週の土曜日、どこかの町へ行きませんか' (Hari Sabtu minggu depan, maukah pergi ke suatu kota?). Kemudian B-san menyetujui ajakan tersebut: 'いいですね！ぜひ行きましょう' (Bagus ya! Ayo kita pergi). Maka tujuan yang dituju sesuai ajakan adalah ke kota (Ke kota / 町).",
    opt_detail: [
      {
        kana: "Ke kota",
        rom: "machi e",
        arti: "Ke kota (町)",
        alasan: "Tepat sekali. Teks pada gambar SMS tertulis lugas: 'どこかの町へ行きませんか' (Maukah pergi ke suatu kota?), sehingga destinasi yang diajak adalah ke kota."
      },
      {
        kana: "Ke laut",
        rom: "umi e",
        arti: "Ke laut (海)",
        alasan: "Salah. Pada gambar pesan SMS sama sekali tidak disebutkan laut (海 - umi) maupun pantai."
      },
      {
        kana: "Ke desa",
        rom: "mura e",
        arti: "Ke desa (村)",
        alasan: "Salah. Pesan SMS secara spesifik menyebut '町' (kota), bukan desa (村 - mura)."
      }
    ]
  },
  42: {
    title: "Ingin melakukan apa disana?",
    subTitle: "Berdasarkan gambar SMS di atas, apa yang ingin dilakukan di sana?",
    trans: "Ingin melakukan apa di sana?",
    analisis: "[Dokkai - Analisis Maksud Aktivitas (Gambar d1.png)] Pada pesan kelanjutan di gambar SMS, B-san mengutarakan tujuannya: 'その町には店がたくさんありますから、買い物をしたいです。新しい服を買いたいです' (Karena di kota itu ada banyak toko, saya ingin berbelanja. Saya ingin membeli baju baru). Kata kuncinya adalah 買い物 (berbelanja pakaian baru).",
    opt_detail: [
      {
        kana: "kencan",
        rom: "deeto",
        arti: "Kencan santai",
        alasan: "Salah. Teks SMS tidak membicarakan kencan romantis, melainkan pergi mencari toko baju."
      },
      {
        kana: "jalan-jalan",
        rom: "sanpo",
        arti: "Jalan-jalan santai",
        alasan: "Kurang tepat. Meskipun pergi bersama, tujuan utama spesifik yang ditegaskan B-san adalah berbelanja (買い物をしたい)."
      },
      {
        kana: "Berbelanja",
        rom: "kaimono",
        arti: "Berbelanja (買い物)",
        alasan: "Tepat sekali. B-san secara tegas menyatakan di SMS: '買い物をしたいです。新しい服を買いたいです' (Saya ingin belanja membeli baju baru)."
      }
    ]
  },
  43: {
    title: "Mendapat kado dari siapa?",
    subTitle: "Berdasarkan kartu ucapan pada gambar di atas, kado hadiah didapat dari siapa?",
    trans: "Mendapat kado dari siapa?",
    analisis: "[Dokkai - Analisis Pengirim Kartu Kado (Gambar d3-4.png)] Pada gambar kartu ucapan hadiah ulang tahun, pengirim kado tercantum pada bagian akhir penutup kartu pengirim: 'りさんとあさんより' (Dari Li-san dan A-san). Maka kado tersebut diterima dari Li-san dan A-san.",
    opt_detail: [
      {
        kana: "かりなさん",
        rom: "karina-san",
        arti: "Karina-san",
        alasan: "Salah. Nama Karina-san tidak tertulis sebagai pihak pengirim kado pada kartu ucapan."
      },
      {
        kana: "さとうさん",
        rom: "satou-san",
        arti: "Satou-san",
        alasan: "Salah. Satou-san tidak tercantum dalam isi pesan kartu hadiah."
      },
      {
        kana: "りさんとあさん",
        rom: "ri-san to a-san",
        arti: "Li-san dan A-san (りさんとあさん)",
        alasan: "Tepat sekali. Pada bagian tanda tangan pengirim kartu kado tertera jelas nama pemberi hadiah yaitu Li-san dan A-san (りさんとあさんより)."
      }
    ]
  },
  44: {
    title: "Mendapatkan hadiah apa?",
    subTitle: "Berdasarkan kartu ucapan pada gambar di atas, hadiah apa yang didapatkan?",
    trans: "Mendapatkan hadiah apa?",
    analisis: "[Dokkai - Analisis Informasi Barang Kado (Gambar d3-4.png)] Di dalam naskah kartu ucapan pada gambar tertulis deskripsi kado yang diberikan: 'ピンクのテニスウェアをプレゼントします' (Kami memberikan hadiah baju tenis berwarna pink). Pakaian olahraga yang diberikan adalah baju tenis berwarna merah muda.",
    opt_detail: [
      {
        kana: "Baju tenis warna pink",
        rom: "pinku no tenisu wea",
        arti: "Baju tenis warna pink",
        alasan: "Tepat sekali. Teks pada gambar menyebutkan secara spesifik: 'ピンクのテニスウェア' (pakaian tenis warna pink)."
      },
      {
        kana: "Baju senam warna pink",
        rom: "pinku no taisougi",
        arti: "Baju senam warna pink",
        alasan: "Salah. Kado bukan berupa seragam senam, melainkan baju tenis lapangan."
      },
      {
        kana: "Baju joging warna pink",
        rom: "pinku no jogingu wea",
        arti: "Baju joging warna pink",
        alasan: "Salah. Jenis baju olahraga yang tercantum secara tegas adalah pakaian tenis (テニスウェア)."
      }
    ]
  },
  45: {
    title: "Apa yang tidak boleh dilakukan ditaman?",
    subTitle: "Berdasarkan papan aturan pada gambar di atas, apa yang dilarang dilakukan di taman?",
    trans: "Apa yang tidak boleh dilakukan di taman?",
    analisis: "[Dokkai - Analisis Larangan Fasilitas Umum (Gambar d5-6.png)] Pada gambar papan tata tertib taman kota terdapat simbol dan teks larangan (禁止事項): gambar anjing dengan tanda silang merah bertuliskan 'ペットの散歩・連れ込みはご遠慮ください / 禁止' (Dilarang membawa/mengajak hewan peliharaan masuk ke taman). Maka hal yang tidak boleh dilakukan adalah membawa hewan peliharaan ke taman.",
    opt_detail: [
      {
        kana: "恋人を公園に連れて行きます",
        rom: "koibito wo kouen ni tsurete ikimasu",
        arti: "Membawa pasangan ke taman",
        alasan: "Salah. Mengajak teman atau pasangan berkunjung ke taman umum diperbolehkan dan tidak dilarang."
      },
      {
        kana: "飲み物を公園に持っていきます",
        rom: "nomimono wo kouen ni motte ikimasu",
        arti: "Membawa minuman ke taman",
        alasan: "Salah. Membawa bekal minuman pribadi diperbolehkan asalkan membuang sampah pada tempatnya."
      },
      {
        kana: "ペットを公園に連れて行きます",
        rom: "petto wo kouen ni tsurete ikimasu",
        arti: "Membawa hewan peliharaan ke taman (ペットを連れて行く)",
        alasan: "Tepat sekali. Pada papan tata tertib taman tertera jelas tanda larangan membawa hewan peliharaan (ペットの連れ込み禁止)."
      }
    ]
  },
  46: {
    title: "Apa yang dilakukan ditaman?",
    subTitle: "Berdasarkan papan petunjuk pada gambar di atas, aktivitas apa yang dapat dilakukan di taman?",
    trans: "Apa kegiatan yang bisa dilakukan di taman?",
    analisis: "[Dokkai - Analisis Fasilitas yang Diizinkan (Gambar d5-6.png)] Papan informasi taman menunjukkan fasilitas area yang tersedia untuk pengunjung, yaitu area khusus memanggang daging / barbeque (バーベキュー広場 - baabekyuu hiroba). Pengunjung diizinkan melakukan barbeque di area yang telah disediakan tersebut.",
    opt_detail: [
      {
        kana: "つり",
        rom: "tsuri",
        arti: "Memancing ikan",
        alasan: "Salah. Tidak ada fasilitas kolam pemancingan ikan pada denah dan petunjuk taman."
      },
      {
        kana: "ペットを連れて行きます",
        rom: "petto wo tsurete ikimasu",
        arti: "Membawa hewan peliharaan",
        alasan: "Salah. Membawa hewan peliharaan justru merupakan hal yang tegas dilarang di taman ini."
      },
      {
        kana: "バーベキュー",
        rom: "baabekyuu",
        arti: "Barbeque (バーベキュー)",
        alasan: "Tepat sekali. Berdasarkan papan denah fasilitas taman, terdapat area resmi yang disediakan untuk kegiatan barbeque (バーベキュー広場)."
      }
    ]
  },
  47: {
    title: "Bisa mendengar music dimana?",
    subTitle: "Berdasarkan pamflet konser pada gambar di atas, di manakah tempat pertunjukan musik diadakan?",
    trans: "Di manakah tempat bisa mendengarkan pertunjukan musik?",
    analisis: "[Dokkai - Analisis Lokasi Acara (Gambar d7-8.png)] Pada pamflet brosur konser musik tertera bagian lokasi / tempat acara (場所 / 会場): tertulis '市民ホール' atau 'ホール' (Aula / Hall Gedung Pertunjukan). Maka pertunjukan musik diselenggarakan di dalam aula/hall gedung.",
    opt_detail: [
      {
        kana: "がっこう",
        rom: "gakkou",
        arti: "Sekolah",
        alasan: "Salah. Lokasi pementasan musik bukan diadakan di gedung sekolah."
      },
      {
        kana: "スーパー",
        rom: "suupaa",
        arti: "Supermarket",
        alasan: "Salah. Supermarket adalah pusat perbelanjaan, bukan tempat penyelenggaraan konser musik."
      },
      {
        kana: "ホール",
        rom: "hooru",
        arti: "Hall / Aula pertunjukan (ホール)",
        alasan: "Tepat sekali. Pada pamflet acara musik tertulis lokasi acara diadakan di aula/hall gedung pertemuan (ホール - hooru)."
      }
    ]
  },
  48: {
    title: "Jam berapa diadakan nya?",
    subTitle: "Berdasarkan jadwal pamflet pada gambar di atas, jam berapakah konser musik dimulai?",
    trans: "Pukul berapakah acara musik tersebut diselenggarakan?",
    analisis: "[Dokkai - Analisis Waktu Mulai Konser (Gambar d7-8.png)] Pada keterangan jadwal waktu acara di pamflet tertulis: '開演 15:00' (Pertunjukan dimulai pukul 15:00). Sedangkan waktu pintu dibuka adalah '開場 14:00'. Pertanyaan menanyakan jam dimulainya pertunjukan konser, yaitu pukul 15:00 sore.",
    opt_detail: [
      {
        kana: "15:00",
        rom: "juugo-ji",
        arti: "Pukul 15:00 (15:00)",
        alasan: "Tepat sekali. Jam pertunjukan musik dimulai (開演) tercantum pada pamflet adalah pukul 15:00 sore."
      },
      {
        kana: "14:00",
        rom: "juuyon-ji",
        arti: "Pukul 14:00",
        alasan: "Salah. Pukul 14:00 adalah jam dibukanya pintu aula (開場), bukan waktu konser dimulai."
      },
      {
        kana: "12:30",
        rom: "juuni-ji sanjuppun",
        arti: "Pukul 12:30",
        alasan: "Salah. Pukul 12:30 tidak tercantum dalam jadwal pertunjukan konser musik."
      }
    ]
  },
  49: {
    title: "Sabtu buka jam berapa?",
    subTitle: "Berdasarkan tabel jam operasional pada gambar di atas, hari Sabtu buka jam berapa?",
    trans: "Hari Sabtu toko/klinik buka mulai pukul berapa?",
    analisis: "[Dokkai - Analisis Jadwal Operasional (Gambar d9-10.png)] Pada gambar tabel jam buka klinik/toko, baris khusus untuk hari Sabtu (土曜日) mencantumkan jam buka operasional: '11:00 〜 17:00'. Jam buka pada hari Sabtu dimulai tepat pukul 11:00.",
    opt_detail: [
      {
        kana: "10:30",
        rom: "juu-ji sanjuppun",
        arti: "Pukul 10:30",
        alasan: "Salah. Pukul 10:30 bukan waktu buka yang tercantum pada tabel."
      },
      {
        kana: "11:00",
        rom: "juuichi-ji",
        arti: "Pukul 11:00 (11:00)",
        alasan: "Tepat sekali. Berdasarkan baris hari Sabtu (土曜日) pada tabel operasional, toko/klinik buka mulai pukul 11:00 siang."
      },
      {
        kana: "10:00",
        rom: "juu-ji",
        arti: "Pukul 10:00",
        alasan: "Salah. Pukul 10:00 adalah jam buka untuk hari kerja biasa (Senin - Jumat), bukan hari Sabtu."
      }
    ]
  },
  50: {
    title: "Libur hari apa?",
    subTitle: "Berdasarkan tabel operasional pada gambar di atas, toko/klinik libur hari apa?",
    trans: "Toko/klinik tersebut libur pada hari apa?",
    analisis: "[Dokkai - Analisis Hari Libur Rutin (Gambar d9-10.png)] Di bawah tabel jam operasional tertera kolom keterangan hari libur tetap / rutin (定休日 - teikyuubi): tertulis secara tegas '木曜日' (Hari Kamis). Maka hari libur operasional toko/klinik adalah hari Kamis.",
    opt_detail: [
      {
        kana: "日曜日",
        rom: "nichiyoubi",
        arti: "Hari Minggu (日曜日)",
        alasan: "Salah. Pada tabel, hari Minggu tetap buka melayani pengunjung."
      },
      {
        kana: "木曜日",
        rom: "mokuyoubi",
        arti: "Hari Kamis (木曜日)",
        alasan: "Tepat sekali. Pada keterangan hari libur tetap (定休日 - teikyuubi) tertulis hari Kamis (木曜日)."
      },
      {
        kana: "土曜日",
        rom: "doyoubi",
        arti: "Hari Sabtu (土曜日)",
        alasan: "Salah. Hari Sabtu tetap buka mulai pukul 11:00 siang."
      }
    ]
  },
  51: {
    title: "ES CREAM DIBERIIKAN SETELAH APA ?",
    subTitle: "Berdasarkan kupon promosi pada gambar di atas, es krim diberikan setelah apa?",
    trans: "Es krim gratis diberikan setelah melakukan apa?",
    analisis: "[Dokkai - Analisis Ketentuan Kupon Makanan (Gambar d11-12.png)] Pada gambar kupon hidangan penutup gratis tertera syarat penyajian: 'お食事（ご飯）をお召し上がりの後に、無料アイスクリームをご提供いたします' (Es krim gratis diberikan setelah selesai menyantap hidangan utama / makan nasi). Jadi es krim diberikan setelah selesai makan nasi (ご飯を食べる).",
    opt_detail: [
      {
        kana: "ちゅうもんを やっています",
        rom: "chuumon wo yatte imasu",
        arti: "Saat sedang memesan",
        alasan: "Salah. Es krim penutup tidak disajikan pada saat pengunjung baru melakukan pemesanan di awal."
      },
      {
        kana: "かう とき",
        rom: "kau toki",
        arti: "Saat membayar/membeli",
        alasan: "Salah. Es krim dinikmati di meja sebelum pengunjung menuju kasir untuk membayar tagihan."
      },
      {
        kana: "ご飯を食べる",
        rom: "gohan wo taberu",
        arti: "Setelah selesai makan hidangan utama/nasi (ご飯を食べる)",
        alasan: "Tepat sekali. Syarat pada kupon menyebutkan es krim penutup gratis disajikan setelah pengunjung selesai menyantap makanan utama / nasi (ご飯を食べた後)."
      }
    ]
  },
  52: {
    title: "Menunjukan tiket pas kapan?",
    subTitle: "Berdasarkan ketentuan pada kupon di atas, kapan kupon tiket harus ditunjukkan?",
    trans: "Kapan tiket/kupon promosi harus ditunjukkan kepada staf?",
    analisis: "[Dokkai - Analisis Prosedur Penggunaan Kupon (Gambar d11-12.png)] Pada bagian syarat dan ketentuan di bawah kupon tertulis: 'ご注文の際にご提示ください' (Harap tunjukkan kupon ini pada saat melakukan pemesanan / 注文時). Maka kupon harus diperlihatkan saat memesan makanan (注文 - chuumon).",
    opt_detail: [
      {
        kana: "注文",
        rom: "chuumon",
        arti: "Saat memesan makanan (注文)",
        alasan: "Tepat sekali. Petunjuk penggunaan pada kupon menyatakan secara eksplisit: 'ご注文の際にご提示ください' (Tunjukkan kupon pada saat memesan makanan)."
      },
      {
        kana: "買います",
        rom: "kaimasu",
        arti: "Saat membayar (買います)",
        alasan: "Salah. Jika baru ditunjukkan saat membayar di kasir, pesanan es krim promo dari dapur sudah tidak bisa disajikan."
      },
      {
        kana: "帰ります",
        rom: "kaerimasu",
        arti: "Saat mau pulang (帰ります)",
        alasan: "Salah. Menunjukkan kupon saat hendak keluar restoran tentu sudah terlambat untuk menikmati es krim di tempat."
      }
    ]
  }
};

for (let no = 41; no <= 52; no++) {
  const q = data.find(i => i.no === no);
  const up = dokkaiUpdates[no];
  if (q && up) {
    q.title = up.title;
    q.subTitle = up.subTitle;
    q.trans = up.trans;
    q.analisis = up.analisis;
    q.opt_detail = up.opt_detail;
    q.opt_note = up.opt_detail.map(o => `(${o.arti})`);
  }
}

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log('Berhasil menyesuaikan No. 17, 19, 21, 22, dan Dokkai 41-52!');

