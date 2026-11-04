const fs = require('fs');

// Data lengkap pembaruan analisis opt_detail dan opt_note untuk 52 soal shimemasu2
const updates = {
  1: {
    opt_detail: [
      { kana: "かんじます [ 感じます ]", rom: "kanjimasu", arti: "Merasa (kanjimasu)", alasan: "Salah. Kata kerja 感じます berarti merasakan sensasi atau firasat, bukan menutup jendela/pintu." },
      { kana: "はしります [ 走ります ]", rom: "hashirimasu", arti: "Berlari (hashirimasu)", alasan: "Salah. Kata kerja 走ります berarti berlari dengan kaki, tidak sesuai dengan gambar yang sedang menutup jendela." },
      { kana: "しめます [ 閉めます ]", rom: "shimemasu", arti: "Menutup (shimemasu)", alasan: "Tepat sekali. Gambar menunjukkan aksi menutup pintu/jendela geser, bahasa Jepangnya adalah 閉めます (shimemasu)." }
    ]
  },
  2: {
    opt_detail: [
      { kana: "バース", rom: "baasu", arti: "Baasu (salah eja)", alasan: "Salah. Kata ini salah eja menggunakan vokal panjang (ー). Kata serapan untuk bus umum tidak menggunakan vokal panjang." },
      { kana: "じてんしゃ [ 自転車 ]", rom: "jitensha", arti: "Sepeda", alasan: "Salah. 自転車 berarti sepeda ontel kayuh, bukan kendaraan bus umum seperti pada gambar." },
      { kana: "バス", rom: "basu", arti: "Bus (basu)", alasan: "Tepat sekali. Gambar menunjukkan kendaraan bus umum. Penulisan katakana yang baku dan tepat adalah バス (basu)." }
    ]
  },
  3: {
    opt_detail: [
      { kana: "目", rom: "me", arti: "Mata (me)", alasan: "Tepat sekali. Gambar memperlihatkan sepasang mata. Kanji resmi untuk mata dalam bahasa Jepang adalah 目 (me)." },
      { kana: "車", rom: "kuruma", arti: "Mobil (kuruma)", alasan: "Salah. Kanji 車 berarti mobil atau kendaraan roda empat, bukan mata." },
      { kana: "耳", rom: "mimi", arti: "Telinga (mimi)", alasan: "Salah. Kanji 耳 berarti telinga (organ pendengaran), bukan mata." }
    ]
  },
  4: {
    opt_detail: [
      { kana: "しかります [ 叱ります ]", rom: "shikarimasu", arti: "Memarahi (shikarimasu)", alasan: "Tepat sekali. Gambar memperlihatkan seseorang sedang memarahi atau menegur temannya, bahasa Jepangnya adalah 叱ります (shikarimasu)." },
      { kana: "勉強します", rom: "benkyou shimasu", arti: "Belajar", alasan: "Salah. 勉強します berarti belajar atau menuntut ilmu, tidak sesuai dengan situasi memarahi orang." },
      { kana: "およぎます [ 泳ぎます ]", rom: "oyogimasu", arti: "Berenang", alasan: "Salah. 泳ぎます berarti berenang di air/kolam, bukan memarahi seseorang." }
    ]
  },
  5: {
    opt_detail: [
      { kana: "並べます", rom: "narabemasu", arti: "Menjajarkan (narabemasu)", alasan: "Salah. 並べます digunakan untuk menata atau menjajarkan deretan benda (contoh: kursi/buku), bukan masuk bak mandi." },
      { kana: "習います", rom: "naraimasu", arti: "Belajar/kursus (naraimasu)", alasan: "Salah. 習います digunakan untuk belajar keterampilan khusus dari guru (kursus), tidak cocok dengan partikel に dan kata おふろ." },
      { kana: "入ります", rom: "hairimasu", arti: "Masuk (hairimasu)", alasan: "Tepat sekali. Pasangan kolokasi baku dalam bahasa Jepang untuk mandi berendam air hangat adalah お風呂に入ります (ofuro ni hairimasu)." }
    ]
  },
  6: {
    opt_detail: [
      { kana: "勉強します", rom: "benkyou shimasu", arti: "Belajar", alasan: "Salah. 勉強します adalah tindakan aktif manusia untuk belajar, tidak masuk akal jika subjeknya adalah angin (風が)." },
      { kana: "吹きます", rom: "fukimasu", arti: "Bertiup (fukimasu)", alasan: "Tepat sekali. Kata kerja alami khusus yang berpasangan dengan angin (風が) adalah 吹きます (fukimasu = berhembus/bertiup kencang)." },
      { kana: "習います", rom: "naraimasu", arti: "Belajar/kursus", alasan: "Salah. 習います berarti menimba ilmu/kursus, tidak bisa digunakan untuk fenomena hembusan angin." }
    ]
  },
  7: {
    opt_detail: [
      { kana: "てつだています", rom: "tetsudateimasu", arti: "Sedang membantu (salah bentuk)", alasan: "Salah. Penulisan tata bahasa salah (seharusnya てつだっています) dan maknanya 'membantu', tidak cocok untuk benda mati berupa cangkir (コップ)." },
      { kana: "ひつようです", rom: "hitsuyou desu", arti: "Dibutuhkan / diperlukan (hitsuyou desu)", alasan: "Tepat sekali. Karena banyak orang yang datang (たくさん人が来るので), maka cangkir lebih banyak dibutuhkan/diperlukan (コップがもっと必要です)." },
      { kana: "ごめんなさいです", rom: "gomen nasai desu", arti: "Mohon maaf", alasan: "Salah. ごめんなさい adalah ungkapan permintaan maaf, tidak logis ditempatkan sebagai predikat kebutuhan cangkir." }
    ]
  },
  8: {
    opt_detail: [
      { kana: "安い", rom: "yasui", arti: "Murah (yasui)", alasan: "Tepat sekali. Sifat paling umum dan positif yang dibicarakan mengenai sayuran di toko/supermarket adalah harganya yang murah (安い - yasui)." },
      { kana: "楽しい", rom: "tanoshii", arti: "Menyenangkan (tanoshii)", alasan: "Salah. 楽しい berarti menyenangkan atau seru, lazim untuk suasana aktivitas/acara/liburan, bukan rasa atau harga sayuran." },
      { kana: "難しい", rom: "muzukashii", arti: "Sulit (muzukashii)", alasan: "Salah. 難しい berarti sulit/sukar dipahami (seperti ujian/masalah), tidak cocok menerangkan kata sayuran." }
    ]
  },
  9: {
    opt_detail: [
      { kana: "作る", rom: "tsukuru", arti: "Membuat (tsukuru)", alasan: "Tepat sekali. Pola kemampuan kosa kata kerja menggunakan kamus form + ことができます. Pasangan memasak adalah 料理を作る (ryouri wo tsukuru = membuat masakan)." },
      { kana: "焼きる", rom: "yakiru", arti: "Bentuk salah", alasan: "Salah. Bentuk kamus untuk memanggang adalah 焼く (yaku), kata 焼きる secara gramatikal tidak ada dalam bahasa Jepang." },
      { kana: "尽きる", rom: "tsukiru", arti: "Habis / tuntas (tsukiru)", alasan: "Salah. 尽きる berarti habis daya atau habis sumber daya, sama sekali tidak ada hubungannya dengan memasak makanan." }
    ]
  },
  10: {
    opt_detail: [
      { kana: "りょうかん", rom: "ryoukan", arti: "Penginapan tradisional (ryoukan)", alasan: "Tepat sekali. 旅館 (ryoukan) adalah penginapan tradisional khas Jepang yang memiliki sejarah panjang (歴史 - rekishi) dan terkenal." },
      { kana: "なかなか", rom: "nakanaka", arti: "Cukup lumayan (nakanaka)", alasan: "Salah. なかなか adalah kata keterangan (adverbia) yang berarti 'cukup/lumayan', tidak dapat menjadi kata benda yang diterangkan oleh 'この___の歴史'." },
      { kana: "ちがい", rom: "chigai", arti: "Perbedaan (chigai)", alasan: "Salah. 違い berarti perbedaan atau kekeliruan, tidak cocok membentuk makna sejarah yang terkenal di konteks kalimat ini." }
    ]
  },
  11: {
    opt_detail: [
      { kana: "遠くて", rom: "tookute", arti: "Jauh sehingga... (tookute)", alasan: "Tepat sekali. Alasan utama fasilitas perbankan dianggap tidak praktis (不便 - fuben) adalah karena jaraknya jauh (遠い - tooi). Bentuk sambung sebab-akibatnya adalah 遠くて." },
      { kana: "高くて", rom: "takakute", arti: "Mahal / tinggi (takakute)", alasan: "Salah. 高くて berarti tinggi fisiknya atau mahal harganya, tidak menjadi alasan logis mengapa bank menjadi tidak praktis/sulit dijangkau." },
      { kana: "面白くて", rom: "omoshirokute", arti: "Menarik (omoshirokute)", alasan: "Salah. 面白くて berarti menarik atau lucu (kesan positif), berlawanan maknanya dengan keluhan tidak praktis (不便)." }
    ]
  },
  12: {
    opt_detail: [
      { kana: "85円です", rom: "hachijuugo-en desu", arti: "harganya 85 Yen", alasan: "Tepat sekali. Menggunakan satuan mata uang Jepang resmi 円 (en) dengan nominal yang sesuai dengan label harga 85." },
      { kana: "80千です", rom: "hachijuusen desu", arti: "80 ribu (salah satuan)", alasan: "Salah. Kata 千 (sen) berarti ribuan dan tidak boleh digunakan sebagai pengganti satuan mata uang 円." },
      { kana: "80門です", rom: "hachijuumon desu", arti: "80 gerbang (salah total)", alasan: "Salah. Kanji 門 (mon) berarti gerbang pintu, bukan satuan mata uang." }
    ]
  },
  13: {
    opt_detail: [
      { kana: "家", rom: "ie", arti: "Rumah (ie)", alasan: "Salah. 家 berarti rumah/kediaman. Rumah adalah tempat diam, tidak logis dikatakan 'rumah akan datang sehingga cepat pulang'." },
      { kana: "台風", rom: "taifuu", arti: "Angin topan / taifun (taifuu)", alasan: "Tepat sekali. Alasan darurat diminta lekas pulang kerja/sekolah adalah karena bencana alam badai taifun mendekat (台風が来るから)." },
      { kana: "海", rom: "umi", arti: "Laut (umi)", alasan: "Salah. 海 berarti laut/pantai, laut tidak bisa berpindah atau datang menghampiri tempat tinggal." }
    ]
  },
  14: {
    opt_detail: [
      { kana: "午後", rom: "gogo", arti: "Sore / p.m. (gogo)", alasan: "Salah. 午後 adalah penanda waktu siang menjelang sore hari (p.m.), tidak berkaitan dengan gambar bioskop." },
      { kana: "英語", rom: "eigo", arti: "Bahasa Inggris (eigo)", alasan: "Salah. 英語 berarti bahasa Inggris, bukan film bioskop." },
      { kana: "映画", rom: "eiga", arti: "Film / bioskop (eiga)", alasan: "Tepat sekali. Gambar memperlihatkan layar sinema bioskop atau tayangan film. Bahasa Jepangnya adalah 映画 (eiga)." }
    ]
  },
  15: {
    opt_detail: [
      { kana: "わらいます [ 笑います ]", rom: "waraimasu", arti: "Tertawa (waraimasu)", alasan: "Salah. 笑います berarti tertawa riang, berlawanan dengan situasi darurat bahaya tenggelam pada gambar." },
      { kana: "ならいます [ 習います ]", rom: "naraimasu", arti: "Belajar (naraimasu)", alasan: "Salah. 習います berarti belajar kursus dari pengajar, tidak sesuai dengan situasi meminta tolong." },
      { kana: "たすけます [ 助けます ]", rom: "tasukemasu", arti: "Menolong / menyelamatkan (tasukemasu)", alasan: "Tepat sekali. Gambar menunjukkan anak tenggelam di air sedang berseru minta bantuan. Kata kerja yang tepat adalah 助けます (tasukemasu = menolong)." }
    ]
  },
  16: {
    opt_detail: [
      { kana: "しずか [ 静か ]", rom: "shizuka", arti: "Tenang / sepi (shizuka)", alasan: "Salah. 静か berarti hening, tenang, atau sunyi, berlawanan dengan gambar kota ramai yang dipenuhi pejalan kaki." },
      { kana: "にぎやか [ 賑やか ]", rom: "nigiyaka", arti: "Ramai / meriah (nigiyaka)", alasan: "Tepat sekali. Gambar menampilkan kawasan pertokoan kota yang ramai dan padat pengunjung. Kata sifat-na yang tepat adalah 賑やか (nigiyaka)." },
      { kana: "駅", rom: "eki", arti: "Stasiun (eki)", alasan: "Salah. 駅 adalah kata benda yang berarti stasiun kereta api, bukan kata sifat yang mendeskripsikan keramaian suasana." }
    ]
  },
  17: {
    opt_detail: [
      { kana: "あります", rom: "arimasu", arti: "Ada (arimasu)", alasan: "Tepat sekali. Menyatakan keberadaan fasilitas umum atau benda mati (taman = 公園) di suatu tempat menggunakan partikel に dan kata kerja あります." },
      { kana: "できます", rom: "dekimasu", arti: "Bisa / selesai dibangun", alasan: "Kurang tepat. できます bermakna 'selesai dibuat' atau 'mampu', untuk kalimat deskriptif keberadaan taman yang indah di dekat rumah digunakan あります." },
      { kana: "いきます", rom: "ikimasu", arti: "Pergi (ikimasu)", alasan: "Salah. 行きます berarti pergi, berpasangan dengan partikel へ/に untuk tujuan gerak subjek manusia, bukan menyatakan ada taman." }
    ]
  },
  18: {
    opt_detail: [
      { kana: "おいしかったです", rom: "oishikatta desu", arti: "Enak / lezat (oishikatta desu)", alasan: "Tepat sekali. Berdasarkan pengalaman lampau pernah makan di restoran tersebut (食べたことがあります), kesan yang disampaikan secara wajar dan positif adalah masakannya enak (おいしかったです)." },
      { kana: "おいしくないです", rom: "oishikunai desu", arti: "Tidak enak", alasan: "Kurang tepat. Pola ini bernada negatif dan berkonjugasi bentuk sekarang, sedangkan penutur merekomendasikan pengalaman makannya di masa lalu." },
      { kana: "にがかったです", rom: "nigakatta desu", arti: "Pahit rasanya (nigakatta desu)", alasan: "Salah. 苦い berarti pahit rasa jamu/obat/kopi hitam, tidak lazim digunakan secara umum untuk seluruh menu masakan restoran." }
    ]
  },
  19: {
    opt_detail: [
      { kana: "ねるんですが", rom: "neru n desu ga", arti: "Ingin tidur...", alasan: "Salah. 寝る berarti tidur, tidak masuk akal jika ingin tidur diarahkan ke kantor pos (ゆびんきょくへ)." },
      { kana: "来たいんですが", rom: "kitai n desu ga", arti: "Ingin datang...", alasan: "Salah. 来たい berarti ingin datang ke arah sini, sedangkan penutur belum berada di kantor pos dan hendak menuju ke sana." },
      { kana: "行きたいんですが", rom: "ikitai n desu ga", arti: "Ingin pergi... (ikitai n desu ga)", alasan: "Tepat sekali. Pola ~たいんですが digunakan untuk mengutarakan keinginan secara sopan: 'あの郵便局へ行きたいんですが' (Saya ingin pergi ke kantor pos itu...). Direspons dengan ajakan pergi bersama." }
    ]
  },
  20: {
    opt_detail: [
      { kana: "きをつけて かえって ください", rom: "ki wo tsukete kaette kudasai", arti: "Hati-hatilah di jalan saat pulang", alasan: "Tepat sekali. Menjawab kabar bahwa rekan kerja hendak pulang duluan (お先に失礼します), ucapan salam pelepasan yang hangat dan sopan adalah 'hati-hatilah di jalan saat pulang'." },
      { kana: "おかえりなさい", rom: "okaerinasai", arti: "Selamat datang kembali di rumah", alasan: "Salah. おかえりなさい diucapkan kepada anggota keluarga atau rekan yang baru saja tiba kembali, bukan untuk orang yang mau berangkat pulang." },
      { kana: "ごめんください", rom: "gomen kudasai", arti: "Permisi (mengetuk pintu)", alasan: "Salah. ごめんください digunakan saat bertamu mengetuk pintu rumah seseorang, tidak cocok diucapkan di kantor." }
    ]
  },
  21: {
    opt_detail: [
      { kana: "えんぴつ", rom: "enpitsu", arti: "Pensil tulis", alasan: "Salah. えんぴつ berarti pensil kayu, bukan mesin pendingin ruangan." },
      { kana: "エアコン", rom: "eakon", arti: "AC / pendingin ruangan (eakon)", alasan: "Tepat sekali. Karena cuaca ruangan sangat panas (あついですね), penutur menawarkan bantuan untuk menyalakan pendingin ruangan: エアコンを つけましょうか (Mau saya nyalakan AC-nya?)." },
      { kana: "とけい", rom: "tokei", arti: "Jam dinding / tangan", alasan: "Salah. とけい berarti jam penunjuk waktu, tidak bisa mendinginkan hawa panas di ruangan." }
    ]
  },
  22: {
    opt_detail: [
      { kana: "そうしましょう", rom: "sou shimashou", arti: "Mari kita lakukan begitu (sou shimashou)", alasan: "Tepat sekali. Respons persetujuan yang antusias terhadap ajakan lawan bicara (〜ましょうか) adalah 'そうしましょう' (Ayo, mari kita lakukan demikian!)." },
      { kana: "これですね", rom: "kore desu ne", arti: "Yang ini ya", alasan: "Salah. これですね digunakan untuk mengonfirmasi suatu benda yang ditunjuk, tidak menjawab sebuah ajakan berbuat sesuatu." },
      { kana: "そうですね", rom: "sou desu ne", arti: "Iya ya / benar juga", alasan: "Kurang tepat. そうですね hanya menyetujui pernyataan atau sekadar basa-basi jeda berpikir, sedangkan ajakan langsung sebaiknya disambut ajakan balik そうしましょう." }
    ]
  },
  23: {
    opt_detail: [
      { kana: "でももうおなかがいっぱいです", rom: "demo mou onaka ga ippai desu", arti: "Tapi perut saya sudah kenyang", alasan: "Tepat sekali. Cara menolak tawaran tambah porsi makanan secara sopan adalah mengucap terima kasih lalu menyebutkan alasan bahwa perut sudah kenyang (でも、もうお腹がいっぱいです)." },
      { kana: "でももうおなかがぺこぺこです", rom: "demo mou onaka ga pekopeko desu", arti: "Tapi perut saya keroncongan/sangat lapar", alasan: "Salah. おなかがぺこぺこ berarti perut sangat lapar/keroncongan, berlawanan dengan konteks menolak tambahan makanan." },
      { kana: "えと。。ちょっと", rom: "eto.. chotto", arti: "Emm... agak...", alasan: "Kurang tepat. Menggantung tanpa alasan yang jelas dan terkesan canggung dibanding menyampaikan bahwa perut sudah penuh." }
    ]
  },
  24: {
    opt_detail: [
      { kana: "元気です", rom: "genki desu", arti: "Sehat walafiat", alasan: "Salah. 元気です berarti sehat bugar, sangat bertolak belakang dengan kondisi Misato-san yang mukanya merah karena demam." },
      { kana: "ちょっとしんぱいです", rom: "chotto shinpai desu", arti: "Saya agak khawatir (chotto shinpai desu)", alasan: "Tepat sekali. Melihat rekan kerja tampak sakit dan warna mukanya memerah panas, ungkapan empati yang wajar adalah ちょっと心配です (Saya agak khawatir padanya)." },
      { kana: "ちょっといいでしょう", rom: "chotto ii deshou", arti: "Mungkin agak bagus ya", alasan: "Salah. Ungkapan ini tidak wajar dan tidak menunjukkan rasa kepedulian terhadap orang yang sedang sakit." }
    ]
  },
  25: {
    opt_detail: [
      { kana: "バナナ", rom: "banana", arti: "Pisang (banana)", alasan: "Tepat sekali. Gambar memperlihatkan buah pisang yang sedang ditawarkan kepada lawan bicara. Bahasa Jepangnya adalah バナナ (banana)." },
      { kana: "りんご", rom: "ringo", arti: "Apel (ringo)", alasan: "Salah. りんご berarti buah apel yang berbentuk bulat kemerahan, bukan pisang." },
      { kana: "みかん", rom: "mikan", arti: "Jeruk (mikan)", alasan: "Salah. みかん berarti buah jeruk mandarin oranye, bukan pisang." }
    ]
  },
  26: {
    opt_detail: [
      { kana: "あらない", rom: "aranai", arti: "Bentuk tidak ada (salah)", alasan: "Salah. Bentuk negatif dari ある adalah ない, kata あらない tidak ada dalam kaidah bahasa Jepang." },
      { kana: "かかない", rom: "kakanai", arti: "Tidak menulis (kakanai)", alasan: "Salah. 書かない berarti tidak menuliskan, sedangkan B menawarkan mengajari makna kata, yang berarti A belum mengerti." },
      { kana: "わからない", rom: "wakaranai", arti: "Tidak mengerti (wakaranai)", alasan: "Tepat sekali. Pola ungkapan meminta tolong: 'すみません、この言葉はわからないですが' (Maaf, kata ini saya tidak paham artinya...). B kemudian membalas: 'はい、教えましょうか' (Mau saya ajari?)." }
    ]
  },
  27: {
    opt_detail: [
      { kana: "すみません", rom: "sumimasen", arti: "Permisi / maaf", alasan: "Kurang tepat. すみません adalah kata yang meminta maaf/memanggil, tidak sepadan dengan konteks permohonan maaf akrab yang dijawab santai いいえ." },
      { kana: "ごめなさい", rom: "gomen nasai", arti: "Maafkan saya (gomen nasai)", alasan: "Tepat sekali. Permintaan maaf tulus yang kasual 'ごめんなさい' (maafkan saya) biasa dijawab dengan tenang oleh kawan dekat: 'いいえ' (tidak apa-apa / santai saja)." },
      { kana: "だいじょうぶ", rom: "daijoubu", arti: "Tidak apa-apa", alasan: "Salah. だいじょうぶ adalah tanggapan penerimaan kondisi, jika A mengucap だいじょうぶ maka B tidak akan membalas dengan 'いいえ'." }
    ]
  },
  28: {
    opt_detail: [
      { kana: "そうすぐになりますね", rom: "sou sugu ni narimasu ne", arti: "Bentuk salah", alasan: "Salah. Susunan frasa rancu dan tidak memiliki arti idiomatis yang logis dalam menanggapi fungsi barang." },
      { kana: "そう買いましょうね", rom: "sou kaimashou ne", arti: "Mari beli begitu ya", alasan: "Salah. Tata bahasa janggal dan terlalu terburu-buru mengajak membeli tanpa mempertimbangkan saran lawan bicara secara halus." },
      { kana: "そうかもしれませんね", rom: "sou kamo shiremasen ne", arti: "Bisa jadi begitu ya (sou kamo shiremasen ne)", alasan: "Tepat sekali. Ungkapan diplomatis untuk menyetujui kemungkinan saran/keunggulan barang dari rekan: そうかもしれませんね (Bisa jadi demikian ya)." }
    ]
  },
  29: {
    opt_detail: [
      { kana: "12;30 入口", rom: "juuni-ji sanjuppun iriguchi", arti: "Pukul 12:30 di Pintu Masuk", alasan: "Tepat sekali. Di dalam audio, A menyetujui janji jam 12:30 ('12時30分でいいよ') dan memastikan menunggu di depan pintu masuk ('入口の前で待っているね')." },
      { kana: "12;30 出口", rom: "juuni-ji sanjuppun deguchi", arti: "Pukul 12:30 di Pintu Keluar", alasan: "Salah. Tempat bertemunya adalah di pintu masuk (入口 - iriguchi), bukan di pintu keluar (出口 - deguchi)." },
      { kana: "12;45 出口", rom: "juuni-ji yonjuugofun deguchi", arti: "Pukul 12:45 di Pintu Keluar", alasan: "Salah. Baik jam pertemuannya (12:45) maupun lokasinya (pintu keluar) keliru tidak sesuai dengan rekaman percakapan." }
    ]
  },
  30: {
    opt_detail: [
      { kana: "XL size, warna biru", rom: "XL saizu, aoiro", arti: "Ukuran XL, warna biru", alasan: "Salah. Dalam percakapan tidak pernah disebutkan baju ukuran XL maupun warna biru." },
      { kana: "M size, warna hitam", rom: "M saizu, kuroiro", arti: "Ukuran M, warna hitam", alasan: "Tepat sekali. Staf toko menginformasikan bahwa ukuran L habis, tetapi ukuran M warna hitam masih tersedia ('こちらのMサイズでしたら、黒色がございますよ')." },
      { kana: "XL size, warna hitam", rom: "XL saizu, kuroiro", arti: "Ukuran XL, warna hitam", alasan: "Salah. Ukuran yang tersedia dan ditawarkan oleh pelayan toko adalah ukuran M, bukan ukuran XL." }
    ]
  },
  31: {
    opt_detail: [
      { kana: "PERALATAN FOTO", rom: "peralatan foto", arti: "Peralatan foto / kamera", alasan: "Salah. Percakapan membicarakan rencana liburan bermain ski, bukan mempersiapkan pemotretan." },
      { kana: "PERALATAN SKI", rom: "peralatan ski", arti: "Peralatan ski (スキー用具)", alasan: "Tepat sekali. B secara lugas menyatakan mengenai peralatan ski: 'スキー用具は現地で全部レンタルするから大丈夫だよ' (Peralatan ski semuanya dirental di tempat)." },
      { kana: "PERALATAN MASAK", rom: "peralatan masak", arti: "Peralatan masak memasak", alasan: "Salah. Tidak ada pembahasan mengenai peralatan masak dalam persiapan bermain ski ke gunung salju." }
    ]
  },
  32: {
    opt_detail: [
      { kana: "Cemilan", rom: "cemilan", arti: "Camilan / makanan ringan", alasan: "Salah. Tidak disebutkan membeli makanan ringan atau snack sebelum berangkat." },
      { kana: "Kacamata", rom: "kacamata", arti: "Kacamata hitam (サングラス)", alasan: "Tepat sekali. Karena sinar matahari di gunung salju sangat terik ('日差しが強いから'), B harus membeli kacamata hitam/sunglasses ('サングラスを買っておかないと')." },
      { kana: "Baju", rom: "baju", arti: "Baju / pakaian", alasan: "Salah. Pakaian atau perlengkapan ski sudah diputuskan untuk menyewa di lokasi, bukan dibeli terlebih dahulu." }
    ]
  },
  33: {
    opt_detail: [
      { kana: "Tidur yang cukup", rom: "tidur yang cukup", arti: "Tidur dan istirahat yang cukup", alasan: "Tepat sekali. Dokter menegaskan bahwa untuk lekas sembuh pasien wajib istirahat total dan tidur yang cukup ('早く治すためにはしっかり休むことが大切です。今日はしっかり寝ていてください')." },
      { kana: "Olah raga", rom: "olahraga", arti: "Berolahraga", alasan: "Salah. Orang yang sedang sakit dilarang berolahraga berat, dokter memerintahkan istirahat." },
      { kana: "Makan yang banyak", rom: "makan yang banyak", arti: "Makan yang banyak", alasan: "Salah. Nasihat utama dokter berfokus pada istirahat tidur yang cukup dan minum obat secara teratur." }
    ]
  },
  34: {
    opt_detail: [
      { kana: "1", rom: "ichi", arti: "1 kali sehari", alasan: "Salah. Aturan minum obat bukan 1 kali sehari, melainkan dua kali." },
      { kana: "2", rom: "ni", arti: "2 kali sehari", alasan: "Tepat sekali. Dokter menjelaskan aturan konsumsi obat: 'これは1日に2回飲んでください' (Obat ini diminum 2 kali sehari, yaitu pada pagi dan malam hari)." },
      { kana: "3", rom: "san", arti: "3 kali sehari", alasan: "Salah. Dokter tidak menyebutkan 3 kali minum, pasien juga mengonfirmasi '朝と晩' (pagi dan malam = 2 kali)." }
    ]
  },
  35: {
    opt_detail: [
      { kana: "Tetap diam di tempat", rom: "tetap diam di tempat", arti: "Tetap diam di tempat tanpa bertindak", alasan: "Salah. Diam saja tanpa melindungi diri sangat berbahaya karena bisa tertimpa benda jatuh dari atas." },
      { kana: "Sembunyi dibawah meja", rom: "sembunyi dibawah meja", arti: "Berlindung di bawah meja", alasan: "Tepat sekali. Petunjuk keselamatan pertama saat gempa: '揺れを感じたら、まずは頭を守るために机の下に隠れてください' (Jika merasakan guncangan, pertama lindungi kepala dengan sembunyi di bawah meja)." },
      { kana: "Langsung lari keluar", rom: "langsung lari keluar", arti: "Langsung panik berlari keluar gedung", alasan: "Salah. Pengumuman menegaskan untuk tidak panik berlari keluar ('慌てて外に飛び出さないで') karena bahaya tertimpa serpihan kaca." }
    ]
  },
  36: {
    opt_detail: [
      { kana: "Rumah", rom: "rumah", arti: "Pulang ke rumah masing-masing", alasan: "Salah. Pengungsi diarahkan menuju titik kumpul terbuka terdekat, bukan pulang ke rumah pribadi." },
      { kana: "Gedung", rom: "gedung", arti: "Tetap berada di dalam gedung", alasan: "Salah. Setelah guncangan mereda, warga justru diminta keluar gedung secara tertib demi menghindari risiko bangunan runtuh." },
      { kana: "Lapangan", rom: "lapangan", arti: "Lapangan terbuka yang luas (広場)", alasan: "Tepat sekali. Lokasi evakuasi resmi yang disebutkan aman dari reruntuhan adalah lapangan luas di luar gedung ('外の広い広場へ避難してください')." }
    ]
  },
  37: {
    opt_detail: [
      { kana: "800 円", rom: "happaku-en", arti: "800 Yen (tarif 2 jam)", alasan: "Salah. 800 Yen adalah biaya untuk 2 jam penyewaan, bukan tarif dasar 1 jam." },
      { kana: "1200 円", rom: "sen nibyaku-en", arti: "1.200 Yen (total biaya sewa 3 jam)", alasan: "Salah. 1.200 Yen adalah total yang harus dibayar pelanggan untuk 3 jam sewa, sedangkan pertanyaan menanyakan tarif per 1 jam." },
      { kana: "400 円", rom: "yonhyaku-en", arti: "400 Yen (400円)", alasan: "Tepat sekali. Staf rental menyebutkan tarif sewa sepeda per jam: '料金は1時間400円でございます' (Tarifnya 400 Yen per 1 jam)." }
    ]
  },
  38: {
    opt_detail: [
      { kana: "Es batu", rom: "es batu", arti: "Es batu (kouri)", alasan: "Salah. Tidak disebutkan memasukkan es batu ke dalam kopi panas tersebut." },
      { kana: "Susu", rom: "susu", arti: "Susu cair (miruku)", alasan: "Salah. Penutur tidak menambahkan susu, melainkan pemanis gula." },
      { kana: "Gula", rom: "gula", arti: "Gula pasir (砂糖)", alasan: "Tepat sekali. Karena rasa kopinya terlalu pahit ('かなり苦いね'), penutur memutuskan menambahkan 2 sendok gula ('砂糖を2杯ほど入れてみるよ')." }
    ]
  },
  39: {
    opt_detail: [
      { kana: "Lantai 9", rom: "kyuu-kai", arti: "Lantai 9 (9階)", alasan: "Tepat sekali. Petugas toserba menjelaskan lokasi festival cokelat secara tegas: 'チョコレートフェスティバルは9階で開催しております' (Diselenggarakan di lantai 9)." },
      { kana: "Lantai 8", rom: "hachi-kai", arti: "Lantai 8", alasan: "Salah. Lantai 8 tidak disebutkan dalam percakapan festival cokelat." },
      { kana: "Lantai 6", rom: "rok-kai", arti: "Lantai 6", alasan: "Salah. Angka 6 hanya merujuk pada jam 6 sore (18:30), bukan nomor lantai acara." }
    ]
  },
  40: {
    opt_detail: [
      { kana: "Jam 14:00", rom: "juuyon-ji", arti: "Pukul 14:00", alasan: "Salah. Jam 14:00 (jam 2 siang) tidak ada dalam keterangan jam operasional acara." },
      { kana: "Jam 17:30", rom: "juushichi-ji sanjuppun", arti: "Pukul 17:30", alasan: "Salah. Waktu tutup festival bukan jam 17:30." },
      { kana: "Jam 18:30", rom: "juuhachi-ji sanjuppun", arti: "Pukul 18:30 (18時30分)", alasan: "Tepat sekali. Petugas toko menyebutkan batas jam selesai acara hari ini: '本日の営業は18時30分までとなっております' (Operasional hari ini sampai pukul 18:30)." }
    ]
  },
  41: {
    opt_detail: [
      { kana: "Ke kota", rom: "machi e", arti: "Ke kota (町)", alasan: "Tepat sekali. Pada teks pesan SMS tertulis ajakan jelas: '来週の土曜日、どこかの町へ行きませんか' (Sabtu depan maukah pergi ke suatu kota?)." },
      { kana: "Ke laut", rom: "umi e", arti: "Ke laut (海)", alasan: "Salah. Teks tidak mengajak berlibur ke laut atau pantai." },
      { kana: "Ke desa", rom: "mura e", arti: "Ke desa (村)", alasan: "Salah. Teks secara eksplisit menyebutkan pergi ke kota (町 - machi), bukan ke desa." }
    ]
  },
  42: {
    opt_detail: [
      { kana: "kencan", rom: "deeto", arti: "Kencan santai", alasan: "Salah. Tidak disebutkan bahwa mereka berencana untuk kencan romantis." },
      { kana: "jalan-jalan", rom: "sanpo", arti: "Jalan-jalan santai", alasan: "Kurang tepat. Tujuan spesifik yang diutarakan B-san adalah berbelanja kebutuhan busana baru." },
      { kana: "Berbelanja", rom: "kaimono", arti: "Berbelanja (買い物)", alasan: "Tepat sekali. B-san menjelaskan tujuannya: 'その町には店がたくさんありますから、買い物をしたいです。新しい服を買いたいです' (Karena di kota itu banyak toko, saya ingin berbelanja pakaian baru)." }
    ]
  },
  43: {
    opt_detail: [
      { kana: "かりなさん", rom: "karina-san", arti: "Karina-san", alasan: "Salah. Karina-san bukan pengirim hadiah ulang tahun pada teks kartu ucapan." },
      { kana: "さとうさん", rom: "satou-san", arti: "Satou-san", alasan: "Salah. Satou-san tidak tercantum sebagai pemberi kado." },
      { kana: "りさんとあさん", rom: "ri-san to a-san", arti: "Li-san dan A-san (りさんとあさん)", alasan: "Tepat sekali. Pada bagian tanda tangan pengirim kartu kado tertulis nama pemberi hadiah yaitu Li-san dan A-san (りさんとあさんより)." }
    ]
  },
  44: {
    opt_detail: [
      { kana: "Baju tenis warna pink", rom: "pinku no tenisu wea", arti: "Baju tenis warna pink", alasan: "Tepat sekali. Teks kartu ucapan menyebutkan kado yang dihadiahkan adalah pakaian olahraga tenis berwarna merah muda (ピンクのテニスウェア)." },
      { kana: "Baju senam warna pink", rom: "pinku no taisougi", arti: "Baju senam warna pink", alasan: "Salah. Olahraga yang dimaksud adalah tenis lapangan, bukan baju senam." },
      { kana: "Baju joging warna pink", rom: "pinku no jogingu wea", arti: "Baju joging warna pink", alasan: "Salah. Jenis pakaian olahraga yang dihadiahkan secara tegas adalah pakaian tenis (テニスウェア)." }
    ]
  },
  45: {
    opt_detail: [
      { kana: "恋人を公園に連れて行きます", rom: "koibito wo kouen ni tsurete ikimasu", arti: "Membawa pasangan ke taman", alasan: "Salah. Mengajak pasangan atau kawan ke taman umum tentu diperbolehkan." },
      { kana: "飲み物を公園に持っていきます", rom: "nomimono wo kouen ni motte ikimasu", arti: "Membawa minuman ke taman", alasan: "Salah. Membawa bekal air minum sendiri ke taman diperbolehkan asalkan tidak membuang sampah sembarangan." },
      { kana: "ペットを公園に連れて行きます", rom: "petto wo kouen ni tsurete ikimasu", arti: "Membawa hewan peliharaan ke taman (ペットを連れて行く)", alasan: "Tepat sekali. Pada papan aturan taman tertera simbol larangan membawa anjing atau hewan peliharaan (ペットの連れ込み禁止)." }
    ]
  },
  46: {
    opt_detail: [
      { kana: "つり", rom: "tsuri", arti: "Memancing ikan", alasan: "Salah. Area taman kota tersebut tidak menyediakan kolam pemancingan ikan." },
      { kana: "ペットを連れて行きます", rom: "petto wo tsurete ikimasu", arti: "Membawa hewan peliharaan", alasan: "Salah. Membawa hewan peliharaan justru merupakan hal yang dilarang di taman ini." },
      { kana: "バーベキュー", rom: "baabekyuu", arti: "Barbeque (バーベキュー)", alasan: "Tepat sekali. Papan fasilitas taman menunjukkan adanya area khusus barbeque (バーベキュー広場) yang boleh dinikmati pengunjung." }
    ]
  },
  47: {
    opt_detail: [
      { kana: "がっこう", rom: "gakkou", arti: "Sekolah", alasan: "Salah. Gedung tempat penyelenggaraan musik bukan di lingkungan sekolah." },
      { kana: "スーパー", rom: "suupaa", arti: "Supermarket", alasan: "Salah. Supermarket adalah tempat berbelanja kebutuhan pokok, bukan tempat konser musik." },
      { kana: "ホール", rom: "hooru", arti: "Hall / Aula pertunjukan (ホール)", alasan: "Tepat sekali. Pada selebaran pamflet tertulis lokasi pementasan musik diselenggarakan di dalam aula serbaguna / gedung pertunjukan (ホール - hooru)." }
    ]
  },
  48: {
    opt_detail: [
      { kana: "15:00", rom: "juugo-ji", arti: "Pukul 15:00", alasan: "Tepat sekali. Pada pamflet jadwal pementasan musik tertera jam mulai konser adalah pukul 15:00 (開演 15:00)." },
      { kana: "14:00", rom: "juuyon-ji", arti: "Pukul 14:00", alasan: "Salah. Jam 14:00 adalah waktu dibukanya pintu masuk (開場 14:00), bukan waktu dimulainya konser." },
      { kana: "12:30", rom: "juuni-ji sanjuppun", arti: "Pukul 12:30", alasan: "Salah. Waktu jam 12:30 tidak sesuai dengan jadwal acara konser." }
    ]
  },
  49: {
    opt_detail: [
      { kana: "10:30", rom: "juu-ji sanjuppun", arti: "Pukul 10:30", alasan: "Salah. Waktu jam 10:30 bukan jam buka pada hari Sabtu." },
      { kana: "11:00", rom: "juuichi-ji", arti: "Pukul 11:00", alasan: "Tepat sekali. Pada tabel jadwal operasional toko/klinik, tertulis jam buka khusus hari Sabtu (土曜日) dimulai pukul 11:00 pagi." },
      { kana: "10:00", rom: "juu-ji", arti: "Pukul 10:00", alasan: "Salah. Jam 10:00 adalah jadwal operasional pada hari kerja biasa (Senin-Jumat)." }
    ]
  },
  50: {
    opt_detail: [
      { kana: "日曜日", rom: "nichiyoubi", arti: "Hari Minggu (日曜日)", alasan: "Salah. Toko tetap buka melayani pelanggan di hari Minggu." },
      { kana: "木曜日", rom: "mokuyoubi", arti: "Hari Kamis (木曜日)", alasan: "Tepat sekali. Keterangan hari libur rutin (定休日 - teikyuubi) mencantumkan secara tegas hari Kamis (木曜日 - mokuyoubi)." },
      { kana: "土曜日", rom: "doyoubi", arti: "Hari Sabtu (土曜日)", alasan: "Salah. Hari Sabtu toko tetap beroperasi buka mulai jam 11:00." }
    ]
  },
  51: {
    opt_detail: [
      { kana: "ちゅうもんを やっています", rom: "chuumon wo yatte imasu", arti: "Saat sedang memesan", alasan: "Salah. Es krim penutup tidak disajikan bersamaan saat pelanggan baru memesan makanan." },
      { kana: "かう とき", rom: "kau toki", arti: "Saat membayar/membeli", alasan: "Salah. Es krim dinikmati di meja makan sebelum menuju kasir untuk membayar." },
      { kana: "ご飯を食べる", rom: "gohan wo taberu", arti: "Setelah selesai makan hidangan utama/nasi (ご飯を食べる)", alasan: "Tepat sekali. Kupon promosi mencantumkan bahwa es krim hidangan penutup gratis disajikan setelah pengunjung selesai menyantap makanan utama (ご飯を食べた後)." }
    ]
  },
  52: {
    opt_detail: [
      { kana: "注文", rom: "chuumon", arti: "Saat memesan makanan (注文)", alasan: "Tepat sekali. Syarat penggunaan kupon tertulis: 'ご注文の際にご提示ください' (Tolong perlihatkan kupon ini pada saat melakukan pemesanan makanan / 注文時)." },
      { kana: "買います", rom: "kaimasu", arti: "Saat membayar (買います)", alasan: "Salah. Jika kupon baru ditunjukkan saat membayar di kasir, pesanan es krim promo tidak dapat diproses dari dapur." },
      { kana: "帰ります", rom: "kaerimasu", arti: "Saat mau pulang (帰ります)", alasan: "Salah. Menunjukkan kupon saat hendak keluar/pulang tentu sudah terlambat untuk menikmati hidangan es krim di tempat." }
    ]
  }
};

// Baca quiz-data.json asli
const path = 'public/shimemasu2-quiz/quiz-data.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

let appliedCount = 0;
data.forEach(q => {
  const up = updates[q.no];
  if (up && up.opt_detail) {
    q.opt_detail = up.opt_detail;
    // Perbarui juga opt_note agar rapi dan selaras dengan arti
    q.opt_note = up.opt_detail.map(o => `(${o.arti})`);
    appliedCount++;
  }
});

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log(`Berhasil memperbarui analisis pada ${appliedCount} nomor soal di ${path}`);

