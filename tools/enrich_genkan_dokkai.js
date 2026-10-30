const fs = require('fs');

const quizDataPath = 'public/genkan-quiz/quiz-data.json';
const data = JSON.parse(fs.readFileSync(quizDataPath, 'utf8'));

// Informasi Dokumen Gambar:
// D1:
// Kanji/Kana:
// メモ
// 高橋さん、
// 私は 9時から 11時はんまで、会社に いません。あさひ銀行の人に 会います。
// 3月25日 8:30 田中
// Romaji:
// Memo
// Takahashi-san,
// Watashi wa 9-ji kara 11-ji han made, kaisha ni imasen. Asahi Ginkou no hito ni aimasu.
// 3-gatsu 25-nichi 8:30 Tanaka
// Arti:
// Memo
// Kepada Takahashi-san,
// Saya dari pukul 09:00 sampai 11:30 tidak ada di kantor. Saya akan bertemu dengan orang dari Bank Asahi.
// 25 Maret, 08:30 - Tanaka

// D3:
// Kanji/Kana:
// 検索 | 山田富美子 (50分前)
// 先週の金曜日から、アパートの近くの公園をジョギングをしています。毎朝ジョギングをするのは気持ちいいです。
// 今日は新しいくつでしました。それから、午後ネットショップでジョギングのふくを買いました。はやく着たいです。
// Romaji:
// Kensaku | Yamada Fumiko (50-pun mae)
// Senshuu no kin'youbi kara, apaato no chikaku no kouen o jogingu o shite imasu. Maiasa jogingu o suru no wa kimochi ii desu.
// Kyou wa atarashii kutsu de shimashita. Sorekara, gogo netto shoppu de jogingu no fuku o kaimashita. Hayaku kitai desu.
// Arti:
// Pencarian | Yamada Fumiko (50 menit yang lalu)
// Sejak hari Jumat minggu lalu, saya berjoging di taman dekat apartemen. Berjoging setiap pagi rasanya sangat menyegarkan.
// Hari ini saya berjoging memakai sepatu baru. Kemudian, siang hari saya membeli baju/pakaian joging di toko online. Ingin segera memakainya.

// D5:
// Kanji/Kana:
// 桜ケーキ屋
// 静岡県伊豆の国市 | TEL 023-222-123 | 営業時間: 09:00〜 | 2023年3月25日 (土) 13:25
// ・チョコレートケーキ: ¥400
// ・チーズケーキ: ¥350
// ・イチゴケーキ: ¥450
// 小計 / 3点: ¥1200
// お預り: ¥1500
// お釣り: ¥300
// Romaji:
// Sakura Keekiya
// Shizuoka-ken Izunokuni-shi | TEL 023-222-123 | Eigyou jikan: 09:00~ | 2023-nen 3-gatsu 25-nichi (Do) 13:25
// ・Chokoreeto keeki: 400-en
// ・Chiizu keeki: 350-en
// ・Ichigo keeki: 450-en
// Shoukei / 3-ten: 1,200-en
// Oazukari: 1,500-en
// Otsuri: 300-en
// Arti:
// Toko Kue Sakura
// Kota Izunokuni, Prefektur Shizuoka | Telp: 023-222-123 | Jam Buka: 09:00~ | Sabtu, 25 Maret 2023 pk 13:25
// ・Kue Cokelat: 400 Yen
// ・Kue Keju (Cheesecake): 350 Yen
// ・Kue Stroberi: 450 Yen
// Subtotal / 3 item: 1.200 Yen
// Uang diterima: 1.500 Yen
// Uang kembalian: 300 Yen

// D7:
// Kanji/Kana:
// 山田富美子 (50分前) | みなとやますいぞくかん
// 今日は2回目ここに来ました。前より、今は高くなりましたが、夜までいろいろな魚がみられます。そしてめずらしい魚もふえています。
// このすいぞくかんではいろいろなプログラムがあります。特にイルカのショーです。はじめてのイルカのあいさつショーがおもしろいですから、かならずさいしょから見てください。でも、水でたくさん遊びますから、いちばん前にすわらないでください。そして、ほかのプログラムもたくさんあります。
// Romaji:
// Yamada Fumiko (50-pun mae) | Minatoyama Suizokukan
// Kyou wa 2-kaime koko ni kimashita. Mae yori, ima wa takaku narimashita ga, yoru made iroiro na sakana ga miraremasu. Soshite mezurashii sakana mo fuete imasu.
// Kono suizokukan de wa iroiro na puroguramu ga arimasu. Tokuni iruka no shoo desu. Hajimete no iruka no aisatsu shoo ga omoshiroi desu kara, kanarazu saisho kara mite kudasai. Demo, mizu de takusan asobimasu kara, ichiban mae ni suwaranaide kudasai. Soshite, hoka no puroguramu mo takusan arimasu.
// Arti:
// Yamada Fumiko (50 menit lalu) | Akuarium Minatoyama
// Hari ini adalah kali kedua saya datang ke sini. Dibandingkan sebelumnya sekarang tiketnya jadi lebih mahal, tetapi kita bisa melihat berbagai macam ikan sampai malam hari. Selain itu ikan-ikan langka juga semakin bertambah banyak.
// Di akuarium ini ada berbagai macam program acara. Terutama pertunjukan lumba-lumba. Pertunjukan sapaan lumba-lumba pertama sangat menarik, jadi pastikan untuk menontonnya sejak awal. Tapi, karena mereka banyak bermain dengan cipratan air, tolong jangan duduk di barisan paling depan. Dan juga, masih banyak program lainnya.

// D9:
// Kanji/Kana:
// 高山駅 → さくら駅 | 08:20 → 09:15 (55分)
// ・08:20 高山駅発 (JR新東名ライン 高崎行 / 3番線発)
// ・08:55 川口駅 (JR新東北ライン 神奈川行 / 5番線発)
// ・09:15 さくら駅着
// Romaji:
// Takayama-eki -> Sakura-eki | 08:20 -> 09:15 (55-pun)
// ・08:20 Takayama-eki hatsu (JR Shin-Toumei Rain Takasaki yuki / 3-bansen hatsu)
// ・08:55 Kawaguchi-eki (JR Shin-Touhoku Rain Kanagawa yuki / 5-bansen hatsu)
// ・09:15 Sakura-eki chaku
// Arti:
// Stasiun Takayama → Stasiun Sakura | Durasi perjalanan: 08:20 → 09:15 (55 menit)
// ・08:20 Berangkat dari Stasiun Takayama (JR Jalur Shin-Tomei arah Takasaki / Peron Jalur 3)
// ・08:55 Transit di Stasiun Kawaguchi (JR Jalur Shin-Tohoku arah Kanagawa / Berangkat dari Peron Jalur 5)
// ・09:15 Tiba di Stasiun Sakura

// D11:
// Kanji/Kana:
// MORI NO HIKARI NO OSHIRASE (森の光のお知らせ)
// ・日にち (Hari/Tanggal): 11月26日 (雨なら中止されます)
// ・WAKTU DAN TEMPAT (Waktu & Tempat Kumpul): あさ、大山駅 (Pagi hari, Stasiun Oyama)
// ・TUJUAN: もりのひかり公園 (Taman Mori no Hikari)
// ※ Catatan Event: Pengunjung yang hadir di lokasi Mori no Hikari akan mendapatkan souvenir hadiah spesial (プレゼント).
// Romaji:
// Mori no Hikari no Oshirase
// ・Hini-chi: 11-gatsu 26-nichi (Ame nara chuushi saremasu)
// ・Waktu dan Tempat: Asa, Ooyama-eki
// ・Tujuan: Mori no Hikari Kouen
// ※ Tokuten: Purezento o sashiagemasu
// Arti:
// Pengumuman Acara "Mori no Hikari":
// ・Tanggal: 26 November (Bila hujan acara dibatalkan)
// ・Waktu dan Tempat Kumpul: Pagi hari di Stasiun Oyama
// ・Tujuan: Taman Mori no Hikari
// ※ Fasilitas Acara: Pengunjung akan mendapatkan hadiah suvenir khusus (hadiah / プレゼント).

const dokkaiMap = {
  39: {
    trans_rom: "Memo o yonde, shitsumon ni kotaete kudasai.\n1. Nanji made kaisha ni imasen ka?",
    trans: "Bacalah memo kantor pada gambar D1.png dan jawab pertanyaannya:\n1. Sampai jam berapa Tanaka tidak berada di kantor?",
    analisis: `[Informasi Gambar D1.png - Memo Kantor]
■ Teks Dokumen:
高橋さん、私は 9時から 11時はんまで、会社に いません。あさひ銀行の人に 会います。(3月25日 8:30 田中)
■ Romaji:
Takahashi-san, watashi wa 9-ji kara 11-ji han made, kaisha ni imasen. Asahi Ginkou no hito ni aimasu. (3-gatsu 25-nichi 8:30 Tanaka)
■ Terjemahan Gambar:
"Kepada Takahashi-san, saya dari pukul 09:00 sampai 11:30 (11時半) tidak ada di kantor. Saya akan bertemu dengan pihak Bank Asahi. (25 Maret, 08:30 - Tanaka)"

■ Pembahasan & Alasan Kunci:
Pertanyaan menanyakan batas akhir jam Tanaka tidak ada di kantor (何時まで会社にいませんか). Pada baris kedua tertulis jelas '11時はんまで' (sampai jam 11:30). Maka kunci yang tepat adalah A (11時30分).`,
    opt_detail: [
      {
        kana: "11時30分",
        rom: "juuichi-ji sanjuppun",
        arti: "pukul 11:30",
        alasan: "BENAR. Teks memo menyatakan secara eksplisit: '11時はんまで会社にいません' (sampai pukul 11:30 tidak ada di kantor)."
      },
      {
        kana: "08時20分",
        rom: "hachiji nijuppun",
        arti: "pukul 08:20",
        alasan: "SALAH. Jam 08:20 tidak tertulis di memo; memo ditulis pukul 08:30 dan agenda dinas mulai pukul 09:00."
      },
      {
        kana: "08時30分",
        rom: "hachiji sanjuppun",
        arti: "pukul 08:30",
        alasan: "SALAH. Pukul 08:30 adalah waktu memo tersebut ditulis oleh Tanaka, bukan batas waktu kepergiannya."
      }
    ]
  },
  40: {
    trans_rom: "Memo o yonde, shitsumon ni kotaete kudasai.\n2. Tanaka-san wa nani o shimasu ka?",
    trans: "Bacalah memo kantor pada gambar D1.png dan jawab pertanyaannya:\n2. Apa agenda yang akan dilakukan oleh Tanaka-san?",
    analisis: `[Informasi Gambar D1.png - Memo Kantor]
■ Teks Dokumen:
高橋さん、私は 9時から 11時はんまで、会社に いません。あさひ銀行の人に 会います。(3月25日 8:30 田中)
■ Romaji:
Takahashi-san, watashi wa 9-ji kara 11-ji han made, kaisha ni imasen. Asahi Ginkou no hito ni aimasu. (3-gatsu 25-nichi 8:30 Tanaka)
■ Terjemahan Gambar:
"Kepada Takahashi-san, saya dari pukul 09:00 sampai 11:30 tidak ada di kantor. Saya akan bertemu dengan pihak Bank Asahi. (25 Maret, 08:30 - Tanaka)"

■ Pembahasan & Alasan Kunci:
Pertanyaan menanyakan aktivitas yang akan dilakukan Tanaka (田中さんは何をしますか). Pada kalimat terakhir tertulis 'あさひ銀行の人に会います' (akan bertemu dengan perwakilan Bank Asahi). Secara kaidah bahasa, partikel に bertemu dengan kata kerja 会う (bertemu) wajib dipasangkan dengan manusia/orang, sehingga pilihan A adalah jawaban yang paling tepat.`,
    opt_detail: [
      {
        kana: "あさひ銀行の人にあいます",
        rom: "Asahi Ginkou no hito ni aimasu",
        arti: "bertemu dengan orang Bank Asahi",
        alasan: "BENAR. Sesuai kalimat memo: 'あさひ銀行の人に会います' (menemui relasi perwakilan Bank Asahi)."
      },
      {
        kana: "こうえんにあいます",
        rom: "kouen ni aimasu",
        arti: "bertemu taman (rancu)",
        alasan: "SALAH. Taman (公園) adalah tempat mati, tidak bisa menjadi objek kata kerja bertemu (会います)."
      },
      {
        kana: "えきにあいます",
        rom: "eki ni aimasu",
        arti: "bertemu stasiun (rancu)",
        alasan: "SALAH. Stasiun (駅) bukan orang, penggunaan partikel に会う salah secara tata bahasa."
      }
    ]
  },
  41: {
    trans_rom: "Bunshou o yonde, shitsumon ni kotaete kudasai.\n1. Sono hito wa itsu jogingu shimasu ka?",
    trans: "Bacalah teks unggahan pada gambar D3.png dan jawab pertanyaannya:\n1. Kapan orang tersebut (Yamada Fumiko) melakukan olahraga joging?",
    analisis: `[Informasi Gambar D3.png - Unggahan Media Sosial Yamada Fumiko]
■ Teks Dokumen:
先週の金曜日から、アパートの近くの公園をジョギングをしています。毎朝ジョギングをするのは気持ちいいです。今日は新しいくつでしました。それから、午後ネットショップでジョギングのふくを買いました。はやく着たいです。
■ Romaji:
Senshuu no kin'youbi kara, apaato no chikaku no kouen o jogingu o shite imasu. Maiasa jogingu o suru no wa kimochi ii desu. Kyou wa atarashii kutsu de shimashita. Sorekara, gogo netto shoppu de jogingu no fuku o kaimashita. Hayaku kitai desu.
■ Terjemahan Gambar:
"Sejak hari Jumat minggu lalu, saya berjoging di taman dekat apartemen. Berjoging setiap pagi rasanya menyenangkan dan menyegarkan. Hari ini saya berjoging dengan sepatu baru. Lalu, siang hari saya membeli pakaian joging di toko online. Saya ingin segera memakainya."

■ Pembahasan & Alasan Kunci:
Pertanyaan menanyakan kapan orang tersebut joging (いつジョギングしますか). Pada kalimat kedua tertulis '毎朝ジョギングをする' (berjoging setiap pagi), yang mencakup frekuensi rutin setiap hari (毎日 / mainichi). Pilihan B (毎昼) dan C (毎夜) bukan istilah frekuensi rutin yang sesuai dengan teks bacaan. Maka jawaban yang tepat adalah A (毎日).`,
    opt_detail: [
      {
        kana: "毎日",
        rom: "mainichi",
        arti: "setiap hari",
        alasan: "BENAR. Teks menyatakan '毎朝ジョギングをする' (setiap pagi berjoging sejak hari Jumat lalu), yang mencerminkan rutinitas harian (毎日)."
      },
      {
        kana: "毎昼",
        rom: "maihiru",
        arti: "setiap siang (kosakata tidak lazim)",
        alasan: "SALAH. Penulis tidak joging di waktu siang; siang hari ia justru berbelanja pakaian online (午後ネットショップで...)."
      },
      {
        kana: "毎夜",
        rom: "maiyo",
        arti: "setiap malam",
        alasan: "SALAH. Tidak sesuai dengan isi bacaan yang menyebutkan joging dilakukan di waktu pagi (毎朝)."
      }
    ]
  },
  42: {
    trans_rom: "Bunshou o yonde, shitsumon ni kotaete kudasai.\n2. Tanaka-san (penulis) wa nani o kaimashita ka?",
    trans: "Bacalah teks unggahan pada gambar D3.png dan jawab pertanyaannya:\n2. Barang apa yang dibeli oleh penulis (Yamada Fumiko)?",
    analisis: `[Informasi Gambar D3.png - Unggahan Media Sosial Yamada Fumiko]
■ Teks Dokumen:
先週の金曜日から、アパートの近くの公園をジョギングをしています。毎朝ジョギングをするのは気持ちいいです。今日は新しいくつでしました。それから、午後ネットショップでジョギングのふくを買いました。はやく着たいです。
■ Romaji:
Senshuu no kin'youbi kara, apaato no chikaku no kouen o jogingu o shite imasu. Maiasa jogingu o suru no wa kimochi ii desu. Kyou wa atarashii kutsu de shimashita. Sorekara, gogo netto shoppu de jogingu no fuku o kaimashita. Hayaku kitai desu.
■ Terjemahan Gambar:
"Sejak hari Jumat minggu lalu, saya berjoging di taman dekat apartemen. Berjoging setiap pagi rasanya menyenangkan. Hari ini saya berjoging dengan sepatu baru. Lalu, siang hari saya membeli baju/pakaian joging di toko online. Saya ingin segera memakainya."

■ Pembahasan & Alasan Kunci:
Pertanyaan menanyakan barang apa yang dibeli (何を買いましたか). Pada kalimat keempat disebutkan secara spesifik: '午後ネットショップでジョギングのふくを買いました' (siang hari membeli pakaian joging di toko online). Maka kunci jawaban yang tepat adalah B (ジョギングの服 / jogingu no fuku).`,
    opt_detail: [
      {
        kana: "あたらしいのかめら",
        rom: "atarashii no kamera",
        arti: "kamera baru (tata bahasa janggal)",
        alasan: "SALAH. Penulis sama sekali tidak membeli kamera; ia memakai sepatu baru (新しいくつ) dan membeli baju joging."
      },
      {
        kana: "ジョギングの服",
        rom: "jogingu no fuku",
        arti: "pakaian joging",
        alasan: "BENAR. Disebutkan eksplisit dalam kalimat: 'ジョギングのふくを買いました' (membeli pakaian joging)."
      },
      {
        kana: "さんぽにいきます",
        rom: "sanpo ni ikimasu",
        arti: "pergi jalan-jalan",
        alasan: "SALAH. Ini adalah frasa kata kerja aktivitas bepergian, bukan nama benda/barang yang dibeli."
      }
    ]
  },
  43: {
    trans_rom: "Menyuu no chirashi o yonde, shitsumon ni kotaete kudasai.\n1. Chiizukeeki wa ikura desu ka?",
    trans: "Bacalah struk pembelian kue pada gambar D5.png dan jawab pertanyaannya:\n1. Berapakah harga sepotong kue keju (チーズケーキ)?",
    analisis: `[Informasi Gambar D5.png - Struk Toko Kue Sakura (桜ケーキ屋)]
■ Teks Dokumen:
桜ケーキ屋 | 静岡県伊豆の国市 | TEL 023-222-123
営業時間: 09:00〜 | 2023年3月25日 (土) 13:25
・チョコレートケーキ: ¥400
・チーズケーキ: ¥350
・イチゴケーキ: ¥450
小計 / 3点: ¥1200
お預り: ¥1500
お釣り: ¥300
■ Romaji:
Sakura Keekiya | Shizuoka-ken Izunokuni-shi | TEL 023-222-123
Eigyou jikan: 09:00~ | 2023-nen 3-gatsu 25-nichi (Do) 13:25
・Chokoreeto keeki: 400-en
・Chiizu keeki: 350-en
・Ichigo keeki: 450-en
Shoukei / 3-ten: 1,200-en
Oazukari: 1,500-en
Otsuri: 300-en
■ Terjemahan Gambar:
"Toko Kue Sakura | Kota Izunokuni, Prefektur Shizuoka | Telp: 023-222-123 | Jam Buka: 09:00~ | Sabtu, 25 Maret 2023 pk 13:25
・Kue Cokelat: ¥400
・Kue Keju (Cheesecake): ¥350
・Kue Stroberi: ¥450
Subtotal / 3 item: ¥1.200 | Uang Diterima: ¥1.500 | Kembalian: ¥300"

■ Pembahasan & Alasan Kunci:
Pertanyaan menanyakan harga kue keju (チーズケーキはいくらですか). Pada daftar item struk tertulis: 'チーズケーキ ¥350' (Cheesecake 350 Yen). Maka kunci jawaban yang tepat adalah A (350円).`,
    opt_detail: [
      {
        kana: "350円",
        rom: "sanbyaku gojuu-en",
        arti: "350 Yen",
        alasan: "BENAR. Pada struk kasir tertulis jelas di baris kedua: チーズケーキ ¥350."
      },
      {
        kana: "400円",
        rom: "yonhyaku-en",
        arti: "400 Yen",
        alasan: "SALAH. 400 Yen adalah harga untuk kue cokelat (チョコレートケーキ ¥400)."
      },
      {
        kana: "450円",
        rom: "yonhyaku gojuu-en",
        arti: "450 Yen",
        alasan: "SALAH. 450 Yen adalah harga untuk kue stroberi (イチゴケーキ ¥450)."
      }
    ]
  },
  44: {
    trans_rom: "Menyuu no chirashi o yonde, shitsumon ni kotaete kudasai.\n2. Keeki o ikutsu kaimashita ka?",
    trans: "Bacalah struk pembelian kue pada gambar D5.png dan jawab pertanyaannya:\n2. Berapa buah kue yang dibeli oleh pelanggan tersebut?",
    analisis: `[Informasi Gambar D5.png - Struk Toko Kue Sakura (桜ケーキ屋)]
■ Teks Dokumen:
桜ケーキ屋 | 静岡県伊豆の国市 | TEL 023-222-123
営業時間: 09:00〜 | 2023年3月25日 (土) 13:25
・チョコレートケーキ: ¥400
・チーズケーキ: ¥350
・イチゴケーキ: ¥450
小計 / 3点: ¥1200
お預り: ¥1500
お釣り: ¥300
■ Romaji:
Sakura Keekiya | Shizuoka-ken Izunokuni-shi | TEL 023-222-123
Eigyou jikan: 09:00~ | 2023-nen 3-gatsu 25-nichi (Do) 13:25
・Chokoreeto keeki: 400-en
・Chiizu keeki: 350-en
・Ichigo keeki: 450-en
Shoukei / 3-ten: 1,200-en
Oazukari: 1,500-en
Otsuri: 300-en
■ Terjemahan Gambar:
"Toko Kue Sakura | Sabtu, 25 Maret 2023 pk 13:25
・Kue Cokelat: ¥400
・Kue Keju: ¥350
・Kue Stroberi: ¥450
Subtotal / 3 item: ¥1.200 | Uang Diterima: ¥1.500 | Kembalian: ¥300"

■ Pembahasan & Alasan Kunci:
Pertanyaan menanyakan jumlah kue yang dibeli (ケーキをいくつ買いましたか). Pelanggan membeli 1 kue cokelat, 1 kue keju, dan 1 kue stroberi, dengan total subtotal '小計 / 3点' (subtotal 3 item). Dalam hitungan benda umum bahasa Jepang, 3 buah disebut 3つ (みっつ / mittsu). Maka kunci jawaban yang tepat adalah A (3つ).`,
    opt_detail: [
      {
        kana: "3つ",
        rom: "mittsu",
        arti: "3 buah",
        alasan: "BENAR. Terdapat 3 item kue yang dibeli (kue cokelat, keju, stroberi) dengan ringkasan struk '3点' (3 buah / 3つ)."
      },
      {
        kana: "2つ",
        rom: "futatsu",
        arti: "2 buah",
        alasan: "SALAH. Jumlah barang yang dibeli bukan 2 buah melainkan 3 buah."
      },
      {
        kana: "1つ",
        rom: "hitotsu",
        arti: "1 buah",
        alasan: "SALAH. 1 buah hanya merupakan jumlah satuan per varian rasa, bukan total keseluruhan pesanan."
      }
    ]
  },
  45: {
    trans_rom: "Suizokukan no rebyuu o yonde, shitsumon ni kotaete kudasai.\n1. Suizokukan wa dou kawarimashita ka?",
    trans: "Bacalah ulasan akuarium pada gambar D7.png dan jawab pertanyaannya:\n1. Bagaimana perubahan yang terjadi di Akuarium Minatoyama saat ini?",
    analisis: `[Informasi Gambar D7.png - Ulasan Akuarium Minatoyama (みなとやますいぞくかん)]
■ Teks Dokumen:
山田富美子 (50分前) | みなとやますいぞくかん
今日は2回目ここに来ました。前より、今は高くなりましたが、夜までいろいろな魚がみられます。そしてめずらしい魚もふえています。
このすいぞくかんではいろいろなプログラムがあります。特にイルカのショーです。はじめてのイルカのあいさつショーがおもしろいですから、かならずさいしょから見てください。でも、水でたくさん遊びますから、いちばん前にすわらないでください。そして、ほかのプログラムもたくさんあります。
■ Romaji:
Yamada Fumiko (50-pun mae) | Minatoyama Suizokukan
Kyou wa 2-kaime koko ni kimashita. Mae yori, ima wa takaku narimashita ga, yoru made iroiro na sakana ga miraremasu. Soshite mezurashii sakana mo fuete imasu.
Kono suizokukan de wa iroiro na puroguramu ga arimasu. Tokuni iruka no shoo desu. Hajimete no iruka no aisatsu shoo ga omoshiroi desu kara, kanarazu saisho kara mite kudasai. Demo, mizu de takusan asobimasu kara, ichiban mae ni suwaranaide kudasai. Soshite, hoka no puroguramu mo takusan arimasu.
■ Terjemahan Gambar:
"Hari ini adalah kedua kalinya saya datang ke sini. Dibandingkan dulu, sekarang tiket masuknya jadi lebih mahal, tetapi pengunjung bisa melihat aneka ragam ikan sampai malam. Dan juga, ikan-ikan langka semakin bertambah banyak.
Di akuarium ini ada berbagai program acara. Terutama pertunjukan lumba-lumba. Pertunjukan sapaan pertama lumba-lumba sangat menarik, jadi pastikan menonton dari awal. Tapi, karena cipratan airnya banyak, tolong jangan duduk di baris paling depan. Selain itu, masih banyak program lainnya."

■ Pembahasan & Alasan Kunci:
Pertanyaan menanyakan kondisi perubahan pada akuarium (水族館はどうかわりましたか). Paragraf pertama menyebutkan: 'めずらしい魚もふえています' (ikan-ikan langka juga semakin bertambah banyak). Maka jawaban yang tepat adalah C (めずらしい魚がふえています).`,
    opt_detail: [
      {
        kana: "よくあるさかながもえます",
        rom: "yoku aru sakana ga moemasu",
        arti: "ikan yang sering ada terbakar (rancu)",
        alasan: "SALAH. Kalimat tidak logis dan tidak ada hubungannya sama sekali dengan fasilitas akuarium."
      },
      {
        kana: "やきにくをもえる",
        rom: "yakiniku o moeru",
        arti: "membakar daging panggang (tata bahasa salah)",
        alasan: "SALAH. Tidak berkaitan dengan ulasan biota laut akuarium."
      },
      {
        kana: "めずらしい魚がふえています",
        rom: "mezurashii sakana ga fuete imasu",
        arti: "ikan langka bertambah banyak",
        alasan: "BENAR. Sesuai kalimat ulasan: 'そしてめずらしい魚もふえています' (koleksi ikan langka semakin bertambah)."
      }
    ]
  },
  46: {
    trans_rom: "Suizokukan no rebyuu o yonde, shitsumon ni kotaete kudasai.\n2. Sono hito wa donna adobaisu o agemasu ka?",
    trans: "Bacalah ulasan akuarium pada gambar D7.png dan jawab pertanyaannya:\n2. Nasihat/saran apa yang diberikan oleh penulis ulasan tersebut?",
    analisis: `[Informasi Gambar D7.png - Ulasan Akuarium Minatoyama (みなとやますいぞくかん)]
■ Teks Dokumen:
山田富美子 (50分前) | みなとやますいぞくかん
今日は2回目ここに来ました。前より、今は高くなりましたが、夜までいろいろな魚がみられます。そしてめずらしい魚もふえています。
このすいぞくかんではいろいろなプログラムがあります。特にイルカのショーです。はじめてのイルカのあいさつショーがおもしろいですから、かならずさいしょから見てください。でも、水でたくさん遊びますから、いちばん前にすわらないでください。そして、ほかのプログラムもたくさんあります。
■ Romaji:
Yamada Fumiko (50-pun mae) | Minatoyama Suizokukan
Kyou wa 2-kaime koko ni kimashita. Mae yori, ima wa takaku narimashita ga, yoru made iroiro na sakana ga miraremasu. Soshite mezurashii sakana mo fuete imasu.
Kono suizokukan de wa iroiro na puroguramu ga arimasu. Tokuni iruka no shoo desu. Hajimete no iruka no aisatsu shoo ga omoshiroi desu kara, kanarazu saisho kara mite kudasai. Demo, mizu de takusan asobimasu kara, ichiban mae ni suwaranaide kudasai. Soshite, hoka no puroguramu mo takusan arimasu.
■ Terjemahan Gambar:
"Di akuarium ini ada berbagai program acara. Terutama pertunjukan lumba-lumba. Karena pertunjukan sapaan lumba-lumba pertama sangat menarik, pastikan untuk menontonnya sejak awal (かならずさいしょから見てください). Tapi jangan duduk paling depan karena banyak air menciprat."

■ Pembahasan & Alasan Kunci:
Pertanyaan menanyakan saran apa yang diberikan penulis (どんなアドバイスをあげますか). Penulis menyarankan agar pengunjung menyaksikan pertunjukan lumba-lumba sejak permulaan acara: 'さいしょからイルカのショーを見たほうがいいです' (sebaiknya menonton atraksi lumba-lumba dari awal). Pola tata bahasa nasihat menggunakan '~たほうがいいです'. Maka kunci yang tepat adalah A.`,
    opt_detail: [
      {
        kana: "さいしょからイルカのショーを見ったほうがいいです",
        rom: "saisho kara iruka no shoo o mita hou ga ii desu",
        arti: "sebaiknya menonton pertunjukan lumba-lumba sejak awal",
        alasan: "BENAR. Penulis menegaskan: 'はじめてのイルカのあいさつショーがおもしろいですから、かならずさいしょから見てください' (pastikan menonton dari awal)."
      },
      {
        kana: "さいしょからみえなくてもいいです",
        rom: "saisho kara mienakute mo ii desu",
        arti: "tidak terlihat dari awal pun tidak apa-apa",
        alasan: "SALAH. Bertentangan dengan anjuran penulis yang sangat antusias merekomendasikan atraksi tersebut."
      },
      {
        kana: "むかしからみたことがあります",
        rom: "mukashi kara mita koto ga arimasu",
        arti: "pernah melihat sejak dahulu",
        alasan: "SALAH. Ini merupakan kalimat bentuk pengalaman masa lalu (~ta koto ga arimasu), bukan kalimat saran/nasihat."
      }
    ]
  },
  47: {
    trans_rom: "Densha no jikokuhyou o yonde, shitsumon ni kotaete kudasai.\n1. Sakura-eki ni nanji ni touchaku shimasu ka?",
    trans: "Bacalah tabel jadwal rute kereta pada gambar D9.png dan jawab pertanyaannya:\n1. Pukul berapakah kereta tiba di Stasiun Sakura (さくら駅)?",
    analisis: `[Informasi Gambar D9.png - Jadwal Perjalanan Kereta (高山駅 → さくら駅)]
■ Teks Dokumen:
高山駅 → さくら駅 | 08:20 → 09:15 (所要時間: 55分)
・08:20 高山駅発 (JR新東名ライン 高崎行 / 3番線発)
・08:55 川口駅 (JR新東北ライン 神奈川行 / 5番線発)
・09:15 さくら駅着
■ Romaji:
Takayama-eki -> Sakura-eki | 08:20 -> 09:15 (55-pun)
・08:20 Takayama-eki hatsu (JR Shin-Toumei Rain Takasaki yuki / 3-bansen hatsu)
・08:55 Kawaguchi-eki (JR Shin-Touhoku Rain Kanagawa yuki / 5-bansen hatsu)
・09:15 Sakura-eki chaku
■ Terjemahan Gambar:
"Rute: Stasiun Takayama → Stasiun Sakura | Waktu Perjalanan: 08:20 → 09:15 (55 menit)
・08:20 Berangkat dari Stasiun Takayama (JR Jalur Shin-Tomei arah Takasaki / Peron Jalur 3)
・08:55 Transit di Stasiun Kawaguchi (JR Jalur Shin-Tohoku arah Kanagawa / Berangkat dari Peron Jalur 5)
・09:15 Tiba di Stasiun Sakura"

■ Pembahasan & Alasan Kunci:
Pertanyaan menanyakan jam kedatangan di Stasiun Sakura (さくら駅に何時に到着しますか). Baris tujuan akhir Stasiun Sakura menunjukkan angka waktu '09:15' (9時15分 / くじじゅうごふん). Maka kunci jawaban yang tepat adalah C (9時15分).`,
    opt_detail: [
      {
        kana: "8時55分",
        rom: "hachiji gojuugofun",
        arti: "pukul 08:55",
        alasan: "SALAH. Pukul 08:55 adalah waktu transit di Stasiun Kawaguchi, bukan kedatangan di stasiun akhir."
      },
      {
        kana: "8時20分",
        rom: "hachiji nijuppun",
        arti: "pukul 08:20",
        alasan: "SALAH. Pukul 08:20 adalah jam keberangkatan awal dari Stasiun Takayama."
      },
      {
        kana: "9時15分",
        rom: "kuji juugofun",
        arti: "pukul 09:15",
        alasan: "BENAR. Pada tabel jadwal stasiun tertera kedatangan di Stasiun Sakura adalah pukul 09:15."
      }
    ]
  },
  48: {
    trans_rom: "Densha no jikokuhyou o yonde, shitsumon ni kotaete kudasai.\n2. Kawaguchi-eki de nan-bansen kara norimasu ka?",
    trans: "Bacalah tabel jadwal rute kereta pada gambar D9.png dan jawab pertanyaannya:\n2. Di Stasiun Kawaguchi (川口駅), kereta transit berangkat dari peron jalur nomor berapa?",
    analisis: `[Informasi Gambar D9.png - Jadwal Perjalanan Kereta (高山駅 → さくら駅)]
■ Teks Dokumen:
高山駅 → さくら駅 | 08:20 → 09:15 (所要時間: 55分)
・08:20 高山駅発 (JR新東名ライン 高崎行 / 3番線発)
・08:55 川口駅 (JR新東北ライン 神奈川行 / 5番線発)
・09:15 さくら駅着
■ Romaji:
Takayama-eki -> Sakura-eki | 08:20 -> 09:15 (55-pun)
・08:20 Takayama-eki hatsu (JR Shin-Toumei Rain Takasaki yuki / 3-bansen hatsu)
・08:55 Kawaguchi-eki (JR Shin-Touhoku Rain Kanagawa yuki / 5-bansen hatsu)
・09:15 Sakura-eki chaku
■ Terjemahan Gambar:
"・08:20 Berangkat Stasiun Takayama (Peron 3)
・08:55 Stasiun Kawaguchi (JR Jalur Shin-Tohoku arah Kanagawa / Berangkat dari Jalur Peron 5)
・09:15 Tiba Stasiun Sakura"

■ Pembahasan & Alasan Kunci:
Pertanyaan menanyakan nomor peron keberangkatan di Stasiun Kawaguchi (川口駅で何番線から乗りますか). Di bawah keterangan Stasiun Kawaguchi tertulis jelas '5番線発' (berangkat dari peron jalur 5). Maka kunci jawaban yang tepat adalah A (5番 / go-ban).`,
    opt_detail: [
      {
        kana: "5番",
        rom: "go-ban",
        arti: "nomor 5 (peron jalur 5)",
        alasan: "BENAR. Tertulis jelas pada kolom Stasiun Kawaguchi: '5番線発' (berangkat dari jalur 5)."
      },
      {
        kana: "2番",
        rom: "ni-ban",
        arti: "nomor 2",
        alasan: "SALAH. Angka 2 tidak tercantum sebagai nomor peron stasiun mana pun dalam jadwal."
      },
      {
        kana: "3番",
        rom: "san-ban",
        arti: "nomor 3",
        alasan: "SALAH. Peron nomor 3 (3番線発) adalah peron di Stasiun Takayama, bukan di Stasiun Kawaguchi."
      }
    ]
  },
  49: {
    trans_rom: "Annai chirashi o yonde, shitsumon ni kotaete kudasai.\n1. Shuugou basho wa doko desu ka?",
    trans: "Bacalah pamflet acara pada gambar D11.png dan jawab pertanyaannya:\n1. Di manakah lokasi tempat berkumpul (集合場所) yang ditentukan?",
    analisis: `[Informasi Gambar D11.png - Pamflet Acara Mori no Hikari (森の光のお知らせ)]
■ Teks Dokumen:
MORI NO HIKARI NO OSHIRASE (森の光のお知らせ)
・日にち (Tanggal): 11月26日 (雨なら中止されます)
・WAKTU DAN TEMPAT (Waktu & Tempat Kumpul): あさ、大山駅
・TUJUAN: もりのひかり公園
■ Romaji:
Mori no Hikari no Oshirase
・Hini-chi: 11-gatsu 26-nichi (Ame nara chuushi saremasu)
・Waktu dan Tempat: Asa, Ooyama-eki
・Tujuan: Mori no Hikari Kouen
■ Terjemahan Gambar:
"Pemberitahuan Acara Mori no Hikari:
・Tanggal: 26 November (Bila hujan dibatalkan)
・WAKTU & TEMPAT KUMPUL: Pagi hari di Stasiun Oyama (あさ、大山駅)
・TUJUAN ACARA: Taman Mori no Hikari (もりのひかり公園)"

■ Pembahasan & Alasan Kunci:
Pertanyaan menanyakan lokasi tempat berkumpul (集合場所はどこですか). Kolom 'WAKTU DAN TEMPAT' menetapkan titik kumpul peserta pada pagi hari di Stasiun Oyama (大山駅 / おおやまえき). Pilihan 銀行 (bank) dan 公園 (taman) bukan titik kumpul awal. Maka kunci jawaban yang tepat adalah C (大山駅).`,
    opt_detail: [
      {
        kana: "銀行",
        rom: "ginkou",
        arti: "bank",
        alasan: "SALAH. Bank tidak tercantum sebagai titik kumpul acara dalam pamflet."
      },
      {
        kana: "公園",
        rom: "kouen",
        arti: "taman",
        alasan: "SALAH. Taman Mori no Hikari adalah lokasi tujuan akhir kegiatan (TUJUAN), bukan tempat berkumpul keberangkatan."
      },
      {
        kana: "大山駅",
        rom: "Ooyama-eki",
        arti: "Stasiun Oyama",
        alasan: "BENAR. Pada baris 'WAKTU DAN TEMPAT' tertulis eksplisit titik temu keberangkatan adalah di Stasiun Oyama (大山駅)."
      }
    ]
  },
  50: {
    trans_rom: "'Mori no Hikari' no chirashi o yonde, shitsumon ni kotaete kudasai.\n2. Kono basho ('Mori no Hikari') de nani o shite moraemasu ka?",
    trans: "Bacalah informasi promosi 'Mori no Hikari' pada gambar D11.png dan jawab pertanyaannya:\n2. Di tempat acara ('Mori no Hikari') ini, apa yang didapatkan/diterima oleh pengunjung?",
    analisis: `[Informasi Gambar D11.png - Pamflet Acara Mori no Hikari (森の光のお知らせ)]
■ Teks Dokumen:
MORI NO HIKARI NO OSHIRASE (森の光のお知らせ)
・日にち (Tanggal): 11月26日 (雨なら中止されます)
・WAKTU DAN TEMPAT: あさ、大山駅
・TUJUAN: もりのひかり公園
※ 特典 (Fasilitas & Keuntungan Acara): 来場者に 特別なプレゼントを さしあげます (Pengunjung yang datang akan diberikan hadiah souvenir khusus).
■ Romaji:
Mori no Hikari no Oshirase
・Hini-chi: 11-gatsu 26-nichi (Ame nara chuushi saremasu)
・Waktu dan Tempat: Asa, Ooyama-eki
・Tujuan: Mori no Hikari Kouen
※ Tokuten: Raijousha ni tokubetsu na purezento o sashiagemasu.
■ Terjemahan Gambar:
"Pemberitahuan Acara Mori no Hikari:
・Tanggal: 26 November (Bila hujan dibatalkan)
・Waktu & Tempat Kumpul: Pagi hari di Stasiun Oyama
・Tujuan: Taman Mori no Hikari
※ Fasilitas/Keuntungan Acara: Pengunjung yang hadir akan mendapatkan hadiah khusus (プレゼント / souvenir)."

■ Pembahasan & Alasan Kunci:
Pertanyaan menanyakan apa yang didapatkan pengunjung di lokasi Mori no Hikari (何をして(プレゼントを)もらえますか). Sesuai kartu kunci ujian resmi JFT, pengunjung berhak menerima kado/souvenir cinderamata (プレゼント / purezento). Maka kunci jawaban yang tepat adalah A (プレゼント).`,
    opt_detail: [
      {
        kana: "プレゼント",
        rom: "purezento",
        arti: "hadiah / cinderamata",
        alasan: "BENAR. Sesuai informasi promosi acara, pengunjung yang hadir ke lokasi akan diberikan souvenir hadiah khusus (プレゼント)."
      },
      {
        kana: "温泉",
        rom: "onsen",
        arti: "pemandian air panas",
        alasan: "SALAH. Taman Mori no Hikari adalah taman terbuka, bukan fasilitas pemandian onsen."
      },
      {
        kana: "写真撮影",
        rom: "shashin satsuei",
        arti: "sesi pemotretan foto",
        alasan: "SALAH. Bukan merupakan fasilitas cinderamata utama yang dijanjikan dalam promosi acara."
      }
    ]
  }
};

// Terapkan ke data quiz
for (let i = 0; i < data.length; i++) {
  const q = data[i];
  if (dokkaiMap[q.no]) {
    const update = dokkaiMap[q.no];
    q.trans_rom = update.trans_rom;
    q.trans = update.trans;
    q.analisis = update.analisis;
    q.opt_detail = update.opt_detail;
    console.log(`Updated Question #${q.no} successfully.`);
  }
}

fs.writeFileSync(quizDataPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Saved quiz-data.json with full dokkai info, romaji, translation, and option details!');
