import json

raw_quiz = json.load(open('public/quizzes/ssw-kaigo-nihongo-shukkin-quiz/quiz-data.json', 'r', encoding='utf-8'))

enrichments = [
    {
        "no": 1,
        "title": "A. ある人(ひと)は休(やす)みでしたが、明日(あした)から仕事(しごと)に行(い)きます。\nB. 夏休(なつやす)みが終(お)わって、田中(たなか)さんはまた仕事(しごと)に行(い)きます。会社(かいしゃ)に (.............)します。",
        "trans_rom": "A: Aru hito wa yasumi deshita ga, ashita kara shigoto ni ikimasu.\nB: Natsuyasumi ga owatte, Tanaka-san wa mata shigoto ni ikimasu. Kaisha ni (shukkin) shimasu.",
        "trans": "A: Seseorang kemarin libur, tetapi mulai besok akan pergi bekerja.\nB: Liburan musim panas telah berakhir, Tanaka-san akan kembali bekerja. Ia akan (masuk dinas / bekerja) ke perusahaan.",
        "analisis": "[Kaigo Nihongo - Kosakata Kerja & Istilah Dinas] Kalimat menjelaskan seseorang yang kembali masuk bekerja setelah libur atau cuti. Kosakata formal yang tepat untuk menyatakan 'hadir / masuk dinas bekerja' ke perusahaan atau fasilitas panti adalah 出勤 (しゅっきん)します. Pasangan istilah operasionalnya adalah 出勤 (masuk kerja) dan 退勤 (selesai/pulang kerja).",
        "opt_detail": [
            {"kana": "仕事に行きます", "rom": "shigoto ni ikimasu", "arti": "pergi bekerja", "alasan": "Secara gramatikal kata kerja ini rancu jika dipasangkan dengan partikel 'ni' dan akhiran '...します' (menjadi '会社に仕事に行きますします')."},
            {"kana": "出勤します [出勤]", "rom": "shukkin shimasu", "arti": "masuk kerja / dinas", "alasan": "Tepat sekali. 出勤 (しゅっきん) adalah istilah formal untuk masuk kerja/dinas, tepat mengisi pola '会社に出勤します'."},
            {"kana": "寝ます [寝ます]", "rom": "nemasu", "arti": "tidur", "alasan": "Tidak relevan dengan konteks datang ke tempat kerja untuk memulai tugas."},
            {"kana": "帰ります [帰ります]", "rom": "kaerimasu", "arti": "pulang", "alasan": "Bermakna sebaliknya; pulang kantor menggunakan istilah 退勤 (taikin) atau 帰宅 (kitaku)."}
        ]
    },
    {
        "no": 2,
        "title": "けいたいでんわ は 使用 (しよう) 禁止 (きんし)です。 この 意味 (いみ) と 同 (おな)じ もの は どれですか。",
        "trans_rom": "Keitai denwa wa shiyou kinshi desu. Kono imi to onaji mono wa dore desu ka.",
        "trans": "Dilarang menggunakan telepon genggam (ponsel). Manakah ungkapan yang memiliki arti yang sama?",
        "analisis": "[Kaigo Nihongo - Tata Bahasa Larangan ~te wa ikemasen] Istilah 使用禁止 (しようきんし, shiyou kinshi) berarti larangan pemakaian. Pola tata bahasa Jepang yang menyatakan larangan tegas melakukan suatu hal adalah ~てはいけません (~te wa ikemasen). Maka kalimat yang semakna adalah 'けいたいでんわを使用してはいけません'.",
        "opt_detail": [
            {"kana": "けいたいでんわを使ってもいいです", "rom": "keitai denwa o tsukattemo ii desu", "arti": "boleh memakai ponsel", "alasan": "Menyatakan izin (~temo ii desu), bertentangan langsung dengan larangan (禁止)."},
            {"kana": "けいたいでんわを使用してはいけません [使用禁止]", "rom": "keitai denwa o shiyou shite wa ikemasen", "arti": "tidak boleh menggunakan ponsel", "alasan": "Tepat sekali. Pola ~てはいけません merupakan bentuk tata bahasa baku untuk menyatakan larangan yang semakna dengan istilah kango 禁止 (kinshi)."},
            {"kana": "けいたいでんわを買います", "rom": "keitai denwa o kaimasu", "arti": "membeli ponsel", "alasan": "Tidak berkaitan dengan kepatuhan tata tertib pemakaian alat elektronik."},
            {"kana": "けいたいでんわを見ます", "rom": "keitai denwa o mimasu", "arti": "melihat ponsel", "alasan": "Bukan merupakan rumusan ungkapan larangan."}
        ]
    },
    {
        "no": 3,
        "title": "出 (で)かける 前 (まえ)に、ブラシ で 髪 (かみ) を (.............)。",
        "trans_rom": "Dekakeru mae ni, burashi de kami o (tokashimasu).",
        "trans": "Sebelum bepergian keluar, (menyisir) rambut dengan sikat/sisir.",
        "analisis": "[Kaigo Nihongo - Keterampilan Kebersihan Diri / Seikatsu Shien] Tindakan merapikan rambut menggunakan sisir atau sikat rambut (ブラシ) dalam bahasa Jepang diungkapkan dengan kata kerja 梳かします (とかします, tokashimasu = menyisir / merapikan rambut).",
        "opt_detail": [
            {"kana": "洗います [洗います]", "rom": "araimasu", "arti": "mencuci / keramas", "alasan": "Mencuci rambut menggunakan sampo di kamar mandi (洗髪), bukan dirapikan dengan sikat sebelum bepergian."},
            {"kana": "梳かします [梳かします]", "rom": "tokashimasu", "arti": "menyisir / merapikan rambut", "alasan": "Tepat sekali. 髪を梳かします (kami o tokashimasu) adalah kolokasi baku untuk menyisir atau merapikan rambut."},
            {"kana": "切ります [切ります]", "rom": "kirimasu", "arti": "memotong rambut", "alasan": "Memotong rambut (散髪) menggunakan gunting oleh perawat/ahli, bukan aktivitas sisir harian biasa."},
            {"kana": "乾かします [乾かします]", "rom": "kawakashimasu", "arti": "mengeringkan rambut", "alasan": "Mengeringkan rambut biasanya menggunakan alat pengering (ドライヤー), bukan sikat/sisir."}
        ]
    },
    {
        "no": 4,
        "title": "介護者 (かいごしゃ) は 利用者 (りようしゃ) に 言 (い)いました。 「ベッドをたかくしますね。」 一番 (いちばん) 正 (ただ)しい 意味 (いみ) は どれですか。",
        "trans_rom": "Kaigosha wa riyousha ni iimashita. 「Beddo o takaku shimasu ne.」 Ichiban tadashii imi wa dore desu ka.",
        "trans": "Perawat berkata kepada pengguna: \"Saya tinggikan tempat tidurnya ya.\" Manakah arti yang paling tepat?",
        "analisis": "[Kaigo Nihongo - Komunikasi Asuhan Lansia] Ungkapan 'ベッドをたかくします' berasal dari kata sifat 'たかい (tinggi)' + '~くします (membuat jadi...)', yang berarti ベッドをたかくする (meninggikan ranjang perawatan) guna memudahkan posisi perawat saat mendampingi atau membantu transfer lansia.",
        "opt_detail": [
            {"kana": "おしりをあらって", "rom": "oshiri o aratte", "arti": "cebok / bersihkan bokong", "alasan": "Merupakan prosedur pembersihan saat penggantian popok, bukan mengatur ketinggian tempat tidur."},
            {"kana": "おむつをあらって", "rom": "omutsu o aratte", "arti": "cuci popok", "alasan": "Tidak ada kaitannya dengan memposisikan ranjang pasien."},
            {"kana": "ベッドをあげる", "rom": "beddo o ageru", "arti": "mengangkat ranjang", "alasan": "Meskipun mirip secara makna kasar, pilihan D adalah padanan kata langsung yang persis dengan bentuk kalimat 'ベッドをたかくする'."},
            {"kana": "ベッドをたかくする [高くする]", "rom": "beddo o takaku suru", "arti": "meninggikan ranjang perawatan", "alasan": "Tepat sekali. Bentuk kamus dasar dari ungkapan 'ベッドをたかくします', yaitu menaikkan ketinggian ranjang medis."}
        ]
    },
    {
        "no": 5,
        "title": "転倒 (てんとう)しました。 同 (おな)じ 意味 (いみ) は どれですか。",
        "trans_rom": "Tentou shimashita. Onaji imi wa dore desu ka.",
        "trans": "Telah terjadi jatuh/tersandung (tentou). Manakah kata yang memiliki makna yang sama?",
        "analisis": "[Kaigo Nihongo - Istilah Medis & Kata Kerja Padanan] 転倒 (てんとう, tentou) adalah istilah klinis resmi keselamatan lansia yang berarti jatuh atau tersandung. Dalam bahasa percakapan sehari-hari bahasa Jepang, padanannya adalah kata kerja 転びます (ころびます, korobimasu).",
        "opt_detail": [
            {"kana": "起きます [起きます]", "rom": "okimasu", "arti": "bangun", "alasan": "Bermakna bangun tidur atau bangkit berdiri, berlawanan dengan jatuh."},
            {"kana": "転びます [転びます]", "rom": "korobimasu", "arti": "jatuh / tergelincir", "alasan": "Tepat sekali. 転びます adalah kata kerja asli bahasa Jepang yang artinya identik dengan istilah kango 転倒 (tentou)."},
            {"kana": "座ります [座ります]", "rom": "suwarimasu", "arti": "duduk", "alasan": "Bermakna duduk terkontrol, bukan terjatuh secara tiba-tiba."},
            {"kana": "走ります [走ります]", "rom": "hashirimasu", "arti": "berlari", "alasan": "Bermakna berlari, tidak semakna dengan insiden jatuh."}
        ]
    },
    {
        "no": 6,
        "title": "利用者 (りようしゃ) と 介護職 (かいごしょく) の 会話 (かいわ)です。\n🙍‍♂️利用者：おしぼり を たくさん たたみました。\n👩‍⚕️介護職：ありがとうございます。では、(.............)もお願いします。\nこの とき の 介護職 (かいごしょく) の 言葉 (ことば)として 正 (ただ)しい もの は どれですか。",
        "trans_rom": "Riyousha to kaigoshoku no kaiwa desu.\nRiyousha: Oshibori o takusan tatamimashita.\nKaigoshoku: Arigatou gozaimasu. Dewa, (.............) mo onegaishimasu.",
        "trans": "Percakapan antara pengguna lansia dan perawat.\nPengguna: \"Saya sudah melipat banyak handuk kecil lap tangan.\"\nPerawat: \"Terima kasih banyak. Kalau begitu, tolong (...) juga ya.\"",
        "analisis": "[Kaigo Nihongo - Partisipasi Lansia & Etika Komunikasi] Setelah pengguna menyelesaikan tugas ringan melipat handuk lap (oshibori), perawat mengapresiasi dan mengajak melanjutkan aktivitas melipat barang serupa, yaitu cucian pakaian bersih (洗濯物 - せんたくもの). Kata yang tepat melengkapi kalimat permintaan adalah 洗濯物 (せんたくもの).",
        "opt_detail": [
            {"kana": "おしぼりをたくさんたたみました", "rom": "oshibori o takusan tatamimashita", "arti": "sudah melipat banyak lap", "alasan": "Ini adalah perkataan pengguna sebelumnya, tidak logis jika perawat memintanya kembali dengan 'dewa, ... mo'."},
            {"kana": "すみません、つかれました", "rom": "sumimasen, tsukaremashita", "arti": "maaf, saya lelah", "alasan": "Bukan perkataan instruksi sopan dari seorang staf perawat yang meminta bantuan tugas ringan."},
            {"kana": "せんたくもの [洗濯物]", "rom": "sentakumono", "arti": "cucian pakaian bersih", "alasan": "Tepat sekali. 'では、洗濯物もお願いします' (Kalau begitu, tolong lipat cucian pakaian juga ya) menyambung konteks aktivitas melipat kain sebelumnya."},
            {"kana": "せんたくものをあらいました", "rom": "sentakumono o araimashita", "arti": "sudah mencuci pakaian", "alasan": "Bentuk lampau tidak bisa dirangkaikan langsung dengan partikel permohonan '...もお願いします'."}
        ]
    },
    {
        "no": 7,
        "title": "食事 (しょくじ)、排泄 (はいせつ) は 自立 (じりつ)ですが、入浴 (にゅうよく) は 介助 (かいじょ) が 必要 (ひつよう)です。 正 (ただ)しい 説明 (せつめい) は どれですか。",
        "trans_rom": "Shokuji, haisetsu wa jiritsu desu ga, nyuuyoku wa kaijo ga hitsuyou desu. Tadashii setsumei wa dore desu ka.",
        "trans": "Makan dan buang air mandiri (jiritsu), namun mandi memerlukan bantuan (kaijo). Manakah penjelasan yang benar?",
        "analisis": "[Kaigo Nihongo - Evaluasi Kemandirian Aktivitas ADL] Istilah 自立 (じりつ, jiritsu) bermakna mandiri tanpa perlu dibantu orang lain. Karena makan (食事) berstatus 自立, maka pernyataan yang benar adalah 'ひとり で 食事 (しょくじ) が できます' (dapat makan seorang diri tanpa bantuan).",
        "opt_detail": [
            {"kana": "ひとりで食事ができます [自立]", "rom": "hitori de shokuji ga dekimasu", "arti": "bisa makan sendiri tanpa bantuan", "alasan": "Tepat sekali. Konsep 自立 (jiritsu) berarti pengguna mampu melakukan aktivitas makan secara mandiri."},
            {"kana": "全部手伝いが必要です", "rom": "zenbu tetsudai ga hitsuyou desu", "arti": "semuanya butuh bantuan", "alasan": "Salah, karena hanya aktivitas mandi yang membutuhkan bantuan pendampingan."},
            {"kana": "食事ができません", "rom": "shokuji ga dekimasen", "arti": "tidak bisa makan", "alasan": "Bertolak belakang dengan pernyataan soal yang menyebutkan makan mandiri."},
            {"kana": "入浴も一人でできます", "rom": "nyuuyoku mo hitori de dekimasu", "arti": "mandi pun bisa sendirian", "alasan": "Salah, karena catatan medis secara tegas menuliskan '入浴は介助が必要' (mandi butuh bantuan)."}
        ]
    },
    {
        "no": 8,
        "title": "シフト の 仕事 (しごと)について、正 (ただ)しい 文 (ぶん) を 選 (えら)んでください。",
        "trans_rom": "Shifuto no shigoto ni tsuite, tadashii bun o erande kudasai.",
        "trans": "Mengenai pekerjaan sistem shift (giliran kerja), pilihlah kalimat yang benar.",
        "analisis": "[Kaigo Nihongo - Prosedur Jam Kerja Shift] Alur kronologis operasional dinas shift di panti lansia Jepang adalah: tiba di tempat kerja (出勤 - しゅっきん), menjalankan tugas keperawatan (勤務 - きんむ), lalu mencatat absensi kepulangan (退勤 - たいきん を 記録します).",
        "opt_detail": [
            {"kana": "たいきんしてしゅっきんをきろくし、きんむします", "rom": "taikin shite shukkin o kiroku shi, kimmu shimasu", "arti": "pulang lalu catat datang lalu dinas", "alasan": "Urutan waktu terbalik dan tidak masuk akal."},
            {"kana": "しゅっきんしてきんむし、たいきんをきろくします [出勤・勤務・退勤]", "rom": "shukkin shite kimmu shi, taikin o kiroku shimasu", "arti": "datang masuk kerja, bertugas, lalu mencatat jam pulang", "alasan": "Tepat sekali. Alur kerja kronologis yang logis: datang (出勤) -> berdinas (勤務) -> rekam kepulangan (退勤を記録)."},
            {"kana": "きろくしてたいきんし、きんむをしゅっきんします", "rom": "kiroku shite taikin shi, kimmu o shukkin shimasu", "arti": "mencatat lalu pulang lalu mendinaskan kedatangan", "alasan": "Struktur gramatikal dan pemakaian partikel rancu."},
            {"kana": "きんむしてきろくし、しゅっきんをたいきんします", "rom": "kimmu shite kiroku shi, shukkin o taikin shimasu", "arti": "dinas lalu mencatat lalu memulangkan kedatangan", "alasan": "Susunan kosakata kerja tidak tepat."}
        ]
    },
    {
        "no": 9,
        "title": "お湯 (おゆ) の 温度 (おんど) が 少 (すこ)し (.............)です。",
        "trans_rom": "Oyu no ondo ga sukoshi (nurui) desu.",
        "trans": "Suhu air panas mandi terasa agak (suam-suam kuku / kurang panas).",
        "analisis": "[Kaigo Nihongo - Perawatan Memandikan Lansia & Suhu Air] Air mandi untuk lansia yang suhunya berada di bawah kehangatan nyaman (kurang panas) disebut 温い (ぬるい, nurui). Suhu ideal mandi berendam bagi lansia adalah sekitar 38°C–40°C.",
        "opt_detail": [
            {"kana": "熱い [熱い]", "rom": "atsui", "arti": "panas", "alasan": "Meskipun bermakna panas, keluhan umum terhadap air hangat yang suhunya mulai dingin adalah 温い (nurui)."},
            {"kana": "温い [温い]", "rom": "nurui", "arti": "kurang panas / suam-suam kuku", "alasan": "Tepat sekali. 温い (ぬるい) dipakai khusus untuk air mandi atau minuman yang suhunya kurang hangat/panas dari semestinya."},
            {"kana": "冷たい [冷たい]", "rom": "tsumetai", "arti": "dingin (es)", "alasan": "Air mandi yang kehangatannya sedikit berkurang tidak disebut dingin es (tsumetai), melainkan nurui."},
            {"kana": "硬い [硬い]", "rom": "katai", "arti": "keras", "alasan": "Menyatakan tekstur benda padat, tidak bisa digunakan untuk suhu zat cair (温度)."}
        ]
    },
    {
        "no": 10,
        "title": "利用者 (りようしゃ) は 歩行 (ほこう) は 杖 (つえ) を 使 (つか)い、外出 (がいしゅつ) は 車椅子 (くるまいす) を 使 (つか)います。 正 (ただ)しい 文 (ぶん) は どれですか。",
        "trans_rom": "Riyousha wa hokou wa tsue o tsukai, gaishutsu wa kurumaisu o tsukaimasu. Tadashii bun wa dore desu ka.",
        "trans": "Pengguna menggunakan tongkat saat berjalan kaki di panti, dan menggunakan kursi roda saat bepergian ke luar. Manakah kalimat yang benar?",
        "analisis": "[Kaigo Nihongo - Alat Bantu Jalan & Mobilitas Lansia] Kalimat soal menjelaskan bahwa untuk 外出 (がいしゅつ, bepergian ke luar panti), pengguna menggunakan kursi roda (車椅子). Kegiatan berbelanja (買い物に行きます) merupakan bentuk bepergian ke luar ruangan (外出).",
        "opt_detail": [
            {"kana": "着替えるとき、車椅子を使います", "rom": "kigaeru toki, kurumaisu o tsukaimasu", "arti": "saat ganti pakaian memakai kursi roda", "alasan": "Tidak berkaitan; berganti pakaian dilakukan di tempat tidur atau kursi biasa."},
            {"kana": "買い物に行くとき、車椅子を使います [外出・買い物]", "rom": "kaimono ni iku toki, kurumaisu o tsukaimasu", "arti": "saat pergi berbelanja, memakai kursi roda", "alasan": "Tepat sekali. Pergi berbelanja (買い物に行く) adalah bagian dari aktivitas keluar panti (外出)."},
            {"kana": "寝るとき、車椅子を使います", "rom": "neru toki, kurumaisu o tsukaimasu", "arti": "saat tidur memakai kursi roda", "alasan": "Salah; posisi tidur harus berada di ranjang perawatan agar tubuh rileks dan mencegah dekubitus."},
            {"kana": "食べるとき、車椅子を使います", "rom": "taberu toki, kurumaisu o tsukaimasu", "arti": "saat makan memakai kursi roda", "alasan": "Di ruang makan panti umumnya lansia dipindahkan ke kursi makan yang ergonomis."}
        ]
    },
    {
        "no": 11,
        "title": "左耳 (ひだりみみ) は 聞 (き)こえにくいですが、右側 (みぎがわ) は 問題 (もんだい) ありません。話 (はな)す こと も できます。 正 (ただ)しい 説明 (せつめい) は どれですか。",
        "trans_rom": "Hidari mimi wa kikoenikui desu ga, migigawa wa mondai arimasen. Hanasu koto mo dekimasu. Tadashii setsumei wa dore desu ka.",
        "trans": "Telinga kiri sulit mendengar, namun sisi kanan tidak bermasalah. Beliau juga mampu berbicara. Manakah penjelasan yang benar?",
        "analisis": "[Kaigo Nihongo - Observasi Fungsi Sensorik Lansia] Berdasarkan catatan kondisi, telinga kanan mendengar dengan baik (右側は問題ありません) dan pasien mampu berbicara (話すこともできます). Maka pernyataan yang tepat adalah '話すことができます'.",
        "opt_detail": [
            {"kana": "右耳が聞こえにくいです", "rom": "migimimi ga kikoenikui desu", "arti": "telinga kanan sulit mendengar", "alasan": "Salah, teks menyatakan telinga kirilah yang pendengarannya menurun."},
            {"kana": "話すことはできません", "rom": "hanasu koto wa dekimasen", "arti": "tidak bisa berbicara", "alasan": "Bertentangan langsung dengan teks soal yang menyatakan '話すこともできます' (bisa berbicara)."},
            {"kana": "話すことができます [発話良好]", "rom": "hanasu koto ga dekimasu", "arti": "dapat berbicara", "alasan": "Tepat sekali. Sesuai langsung dengan fakta '話すこともできます' pada catatan soal."},
            {"kana": "すべて聞こえません", "rom": "subete kikoemasen", "arti": "sama sekali tidak bisa mendengar", "alasan": "Salah, karena telinga kanan masih berfungsi dengan baik tanpa gangguan."}
        ]
    },
    {
        "no": 12,
        "title": "利用者 (りようしゃ) が トイレ に 行 (い)きたい と 言 (い)っています。 正 (ただ)しい 対応 (たいおう) は どれですか。",
        "trans_rom": "Riyousha ga toire ni ikitai to itte imasu. Tadashii taiou wa dore desu ka.",
        "trans": "Pengguna mengatakan ingin pergi ke toilet. Manakah respons tindakan yang benar?",
        "analisis": "[Kaigo Nihongo - Kebutuhan Fisiologis Eliminasi / Haisetsu] Keinginan ke toilet tidak boleh ditunda karena dapat memicu inkontinensia urin atau risiko jatuh saat lansia berusaha berdiri sendiri. Respons yang benar adalah segera memandu dan mengantar sampai ke toilet (トイレまで案内する).",
        "opt_detail": [
            {"kana": "テレビを見せる", "rom": "terebi o miseru", "arti": "menontonkan televisi", "alasan": "Mengabaikan desakan hajat buang air yang sangat penting bagi martabat lansia."},
            {"kana": "トイレまで案内する [排泄介助]", "rom": "toire made annai suru", "arti": "mengantar sampai ke toilet", "alasan": "Tepat sekali. Membimbing dan mengantar lansia ke toilet memastikan keselamatan serta kenyamanan eliminasi."},
            {"kana": "そのままにする", "rom": "sono mama ni suru", "arti": "membiarkan begitu saja", "alasan": "Tindakan pembiaran (neglect) yang berisiko tinggi memicu ngompol atau insiden cedera jatuh."},
            {"kana": "食事を出す", "rom": "shokuji o dasu", "arti": "menyajikan makanan", "alasan": "Tidak sesuai dengan kebutuhan buang air yang diutarakan."}
        ]
    },
    {
        "no": 13,
        "title": "トイレ 内 (ない)。利用者 (りようしゃ) が 立 (た)ち上 (あ)がろうとしてふらついている。介護職 (かいごしょく) が 腕 (うで) を 支 (ささ)えている。 この とき の 正 (ただ)しい 対応 (たいおう) は どれですか。",
        "trans_rom": "Toire nai. Riyousha ga tachiagarou to shite furatsuite iru. Kaigoshoku ga ude o sasaete iru. Kono toki no tadashii taiou wa dore desu ka.",
        "trans": "Di dalam toilet. Pengguna sempoyongan saat mencoba berdiri. Perawat menopang lengannya. Manakah tindakan yang tepat saat situasi ini?",
        "analisis": "[Kaigo Nihongo - Pencegahan Jatuh / Tentou Boushi] Sempoyongan (ふらつく) menandakan ketidakstabilan keseimbangan tubuh akibat hipotensi ortostatik atau kelemahan otot. Tindakan perawat yang paling aman adalah menopang tubuh agar tidak jatuh dan mendudukkannya kembali dengan stabil di toilet (転倒しないように支え、安全に座らせる).",
        "opt_detail": [
            {"kana": "そのまま一人にする", "rom": "sono mama hitori ni suru", "arti": "membiarkannya sendirian", "alasan": "Sangat berbahaya; risiko tinggi lansia jatuh dan mengalami benturan di lantai toilet yang keras."},
            {"kana": "強く引っぱって立たせる", "rom": "tsuyoku hippatte tataseru", "arti": "menarik paksa untuk berdiri", "alasan": "Dapat mencederai sendi bahu atau memicu hilangnya keseimbangan yang fatal."},
            {"kana": "転倒しないように支え、安全に座らせる [転倒予防]", "rom": "tentou shinai you ni sasae, anzen ni suwaraseru", "arti": "menopang agar tidak jatuh dan mendudukkan kembali dengan aman", "alasan": "Tepat sekali. Menstabilkan kembali posisi duduk untuk meredakan limbung dan mencegah insiden jatuh."},
            {"kana": "大きな声で注意する", "rom": "ookina koe de chuui suru", "arti": "menegur dengan suara keras", "alasan": "Dapat membuat lansia panik dan terkejut sehingga makin kehilangan keseimbangan."}
        ]
    },
    {
        "no": 14,
        "title": "【申し送りノート】\n食事：全量摂取 (ぜんりょうせっしゅ)\n排泄：トイレ 自立 (じりつ)\n入浴：一部介助 (いちぶかいじょ)\n移動：車椅子 (くるまいす) 使用\nこの利用者(りようしゃ)の状態として正しい説明はどれですか。",
        "trans_rom": "【Moushiokuri nooto】\nShokuji: Zenryou sesshu\nHaisetsu: Toire jiritsu\nNyuuyoku: Ichibu kaijo\nIdou: Kurumaisu shiyou\nKono riyousha no joutai toshite tadashii setsumei wa dore desu ka.",
        "trans": "【Buku Catatan Operan / Handover】\nMakan: Habis seluruh porsi (全量摂取)\nBuang air: Mandiri di toilet (自立)\nMandi: Bantuan sebagian (一部介助)\nMobilitas: Menggunakan kursi roda\nManakah penjelasan yang benar mengenai kondisi pengguna ini?",
        "analisis": "[Kaigo Nihongo - Membaca Catatan Operan / Moushiokuri] Catatan menunjukkan bahwa ada aktivitas yang dapat dilakukan sendiri secara mandiri (自立) seperti buang air, namun ada pula yang memerlukan pendampingan perawat seperti mandi bantuan sebagian (一部介助). Maka, kondisi pengguna mencerminkan percampuran antara kemandirian dan bantuan: '一部介助と自立が混在しています'.",
        "opt_detail": [
            {"kana": "すべて介助が必要です", "rom": "subete kaijo ga hitsuyou desu", "arti": "semuanya butuh bantuan total", "alasan": "Salah, karena makan dan eliminasi toilet masih mandiri (自立)."},
            {"kana": "食事はできません", "rom": "shokuji wa dekimasen", "arti": "tidak bisa makan", "alasan": "Bertentangan dengan catatan yang tertulis '全量摂取' (makan habis seluruhnya)."},
            {"kana": "一部介助と自立が混在しています [自立支援]", "rom": "ichibu kaijo to jiritsu ga konzai shite imasu", "arti": "terdapat kombinasi antara bantuan sebagian dan kemandirian", "alasan": "Tepat sekali. Menggambarkan status lansia yang mandiri di beberapa aktivitas namun memerlukan pertolongan di aktivitas lainnya."},
            {"kana": "すべて自立です", "rom": "subete jiritsu desu", "arti": "semuanya mandiri", "alasan": "Salah, karena mandi memerlukan bantuan sebagian dan mobilitas memerlukan kursi roda."}
        ]
    },
    {
        "no": 15,
        "title": "【状況】廊下 (ろうか) で 利用者 (りようしゃ) が 歩行器 (ほこうき) を 使 (つか)って 歩 (ある)いている。途中 (とちゅう) で 立 (た)ち 止 (ど)まっている。\n🙍‍♂️利用者：「すこしつかれました。」\n介護職 (かいごしょく) の 正 (ただ)しい 声 (こえ)かけはどれですか。",
        "trans_rom": "【Joukyou】 Rouka de riyousha ga hokouki o tsukatte aruite iru. Tochuu de tachidomatte iru.\nRiyousha: 「Sukoshi tsukaremashita.」\nKaigoshoku no tadashii koekake wa dore desu ka.",
        "trans": "【Situasi】 Di lorong panti, pengguna sedang berjalan dengan alat bantu jalan (walker). Di tengah jalan beliau berhenti melangkah.\nPengguna: \"Saya agak lelah.\"\nManakah ucapan sapaan / respons yang benar dari staf perawat?",
        "analisis": "[Kaigo Nihongo - Respons Empati & Keselamatan Lansia] Saat lansia menyatakan kelelahan ketika berjalan kaki, perawat tidak boleh memaksakan latihan fisik, melainkan wajib merespons dengan empati dan menawarkan istirahat demi mencegah kelelahan berlebih atau kolaps: 「すこし休みましょうか」(Bagaimana kalau kita istirahat sejenak?).",
        "opt_detail": [
            {"kana": "がんばってください", "rom": "gambatte kudasai", "arti": "semangatlah / ayo berjuang", "alasan": "Kurang empati; memaksa lansia yang kelelahan dapat meningkatkan risiko terjatuh."},
            {"kana": "すぐに走りましょう", "rom": "sugu ni hashirimashou", "arti": "mari segera berlari", "alasan": "Sangat membahayakan lansia pengguna alat bantu jalan."},
            {"kana": "すこし休みましょうか [受容と共感]", "rom": "sukoshi yasumimashou ka", "arti": "bagaimana kalau kita istirahat sebentar?", "alasan": "Tepat sekali. Mengedepankan keselamatan dan mendengarkan kebutuhan tubuh lansia."},
            {"kana": "もう帰ります", "rom": "mou kaerimasu", "arti": "sudah mau pulang", "alasan": "Tidak memberikan solusi istirahat saat lansia sedang berdiri kelelahan di lorong."}
        ]
    }
]

# Terapkan ke raw_quiz
for i, item in enumerate(raw_quiz):
    if i < len(enrichments):
        enr = enrichments[i]
        item['title'] = enr['title']
        item['trans_rom'] = enr['trans_rom']
        item['trans'] = enr['trans']
        item['analisis'] = enr['analisis']
        item['opt_detail'] = enr['opt_detail']

with open('public/quizzes/ssw-kaigo-nihongo-shukkin-quiz/quiz-data.json', 'w', encoding='utf-8') as f:
    json.dump(raw_quiz, f, ensure_ascii=False, indent=2)

print('Successfully enriched all 15 questions in shukkin package!')

