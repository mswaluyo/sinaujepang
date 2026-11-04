# tools/enrich_hare3_like_orimasu2.py
# Menyempurnakan analisis, opt_detail, opt_note, dan format title/trans hare3-quiz agar persis berstandar Orimasu 2 & quiz-rules.md

import json
import os

HARE3_PATH = 'public/quizzes/hare3-quiz/quiz-data.json'

with open(HARE3_PATH, 'r', encoding='utf-8') as f:
    quiz = json.load(f)

# Data transkrip audio whisper
whisper_transcripts = {
    37: {
        'ja': "男: 花さん、遅かったね。何かあったの？\n女: レン君、ごめんなさい。急いでいたから、家に財布を忘れてしまったの。\n男: え、財布を？家まで取りに帰ったんだね。\n女: ああ、駅に着く前に気づいたからすぐ戻ったんだけど、本当にごめんね。\n男: 大丈夫だよ。財布が見つかってよかったね。さあ、行こうか。\n女: ありがとう、行こう。\n\n【質問】なぜ 女性は 遅れましたか。(Kenapa perempuan tersebut terlambat datang?)",
        'id': "Pria: Hana-san, kamu terlambat ya. Ada apa?\nWanita: Ren-kun, maaf sekali. Karena terburu-buru, aku kelupaan dompet di rumah.\nPria: Eh, dompet? Kamu pulang ke rumah untuk mengambilnya ya.\nWanita: Iya, aku sadar sebelum sampai di stasiun jadi langsung putar balik, tapi benar-benar minta maaf ya.\nPria: Tidak apa-apa kok. Syukurlah dompetnya ketemu. Ayo, kita berangkat.\nWanita: Terima kasih, ayo jalan.\n\n[Pertanyaan] Kenapa perempuan tersebut terlambat datang?",
        'rom': "Otoko: Hana-san, osokatta ne. Nanika atta no?\nOnna: Ren-kun, gomennasai. Isoide ita kara, ie ni saifu o wasurete shimatta no.\nOtoko: E, saifu o? Ie made tori ni kaetta n da ne.\nOnna: Aa, eki ni tsuku mae ni kidzuita kara sugu modotta n da kedo, hontou ni gomen ne.\nOtoko: Daijoubu da yo. Saifu ga mitsukatte yokatta ne. Saa, ikou ka.\nOnna: Arigatou, ikou.\n\n[Shitsumon] Naze josei wa okuremashita ka."
    },
    38: {
        'ja': "女: すみません、この小さいお皿は いくらですか。\n店員: はい、それは 350円です。\n女: 350円ですね。わかりました。\n店員: 他に何かありますか。\n女: いいえ、これだけでいいです。ありがとうございます。\n店員: ありがとうございます、またどうぞ。\n\n【質問】小さい お皿は いくらですか。(Berapakah harga piring kecil tersebut?)",
        'id': "Wanita: Permisi, piring kecil ini harganya berapa ya?\nPelayan: Ya, yang itu harganya 350 yen.\nWanita: 350 yen ya. Baik, saya mengerti.\nPelayan: Apakah ada barang lain lagi?\nWanita: Tidak, ini saja sudah cukup. Terima kasih.\nPelayan: Terima kasih banyak, silakan datang kembali.\n\n[Pertanyaan] Berapakah harga piring kecil tersebut?",
        'rom': "Onna: Sumimasen, kono chiisai osara wa ikura desu ka.\nTen'in: Hai, sore wa sanbyaku-gojuu-en desu.\nOnna: Sanbyaku-gojuu-en desu ne. Wakarimashita.\nTen'in: Hoka ni nanika arimasu ka.\nOnna: Iie, kore dake de ii desu. Arigatou gozaimasu.\nTen'in: Arigatou gozaimasu, mata douzo.\n\n[Shitsumon] Chiisai osara wa ikura desu ka."
    },
    39: {
        'ja': "男: やっと来たね。映画は もう始まっちゃったよ。\n女: 本当にごめんなさい。道が 込んでいたの。\n男: 残念だけど、今の映画は 見られないね。どうしようか。\n女: 近くで 面白いイベントが あるみたい。そっちに 行ってみない？\n男: うーん。でも 僕は やっぱり 映画を 待っています。次の時間は 何時？\n女: 次は 1時間後だね。じゃあ、チケットを買って ここで待とう。\n\n【質問】二人は これから どうしますか。(Apa yang akan dilakukan kedua orang tersebut selanjutnya?)",
        'id': "Pria: Akhirnya kamu datang juga ya. Filmnya sudah keburu mulai lho.\nWanita: Benar-benar minta maaf. Jalannya macet parah tadi.\nPria: Sayang sekali ya, tapi film jam sekarang sudah tidak bisa ditonton. Mau bagaimana ya?\nWanita: Sepertinya ada event menarik di dekat sini. Bagaimana kalau kita coba pergi ke sana?\nPria: Hmm... Tapi menurutku kita tunggu film sesi berikutnya saja. Jam berapa penayangan berikutnya?\nWanita: Berikutnya 1 jam lagi ya. Kalau begitu ayo kita beli tiketnya sekarang dan menunggu di sini.\n\n[Pertanyaan] Apa yang akan dilakukan kedua orang tersebut selanjutnya?",
        'rom': "Otoko: Yatto kita ne. Eiga wa mou hajimatchatta yo.\nOnna: Hontou ni gomennasai. Michi ga konde ita no.\nOtoko: Zannen da kedo, ima no eiga wa mirarenai ne. Dou shiyou ka.\nOnna: Chikaku de omoshiroi ibento ga aru mitai. Sotchi ni itte minai?\nOtoko: Uun. Demo boku wa yappari eiga o matte imasu. Tsugi no jikan wa nanji?\nOnna: Tsugi wa ichijikan-go da ne. Jaa chiketto o katte koko de matou.\n\n[Shitsumon] Futari wa kore kara dou shimasu ka."
    },
    40: {
        'ja': "男: すみません、ちょっと 教えていただけますか。桜病院に 行きたいんです。\n女: 桜病院ですね。あそこの 掲示板を 見てください。49番の バスですよ。\n男: 49番ですね、ありがとうございます。このバスは 次の駅で 止まりますか。\n女: はい、次の駅は 市役所前ですが、そこでも 止まります。その次が 桜病院の 停留所ですよ。\n男: 良かった。バスは 何分おきに 来ますか。\n女: 大体 15分おきに 来ますよ。あ、ちょうど 49番の バスが 来ましたね。\n男: ほんとだ！教えてくれて ありがとうございました。助かりました。\n\n【質問1 (No. 40)】バスは 何番ですか。(Busnya nomor berapa?)",
        'id': "Pria: Permisi, bisakah Anda memberi tahu saya? Saya ingin pergi ke Rumah Sakit Sakura.\nWanita: Rumah Sakit Sakura ya. Silakan lihat papan pengumuman di sana. Bus nomor 49 lho.\nPria: Nomor 49 ya, terima kasih banyak. Apakah bus ini berhenti di stasiun berikutnya?\nWanita: Ya, stasiun berikutnya adalah depan Balai Kota, di sana juga berhenti. Setelahnya barulah halte Rumah Sakit Sakura.\nPria: Syukurlah. Busnya datang setiap berapa menit sekali?\nWanita: Kira-kira datang setiap 15 menit sekali. Ah, pas sekali bus nomor 49 sudah datang tuh.\nPria: Benar sekali! Terima kasih banyak sudah memberi tahu. Sangat membantu.\n\n[Pertanyaan 1 (No. 40)] Bus yang dinaiki nomor berapa?",
        'rom': "Otoko: Sumimasen, chotto oshiete itadakemasu ka. Sakura-byouin ni ikitai n desu.\nOnna: Sakura-byouin desu ne. Asoko no keijiban o mite kudasai. Yonjuu-kyuu-ban no basu desu yo.\nOtoko: Yonjuu-kyuu-ban desu ne, arigatou gozaimasu...\n\n[Shitsumon 1] Basu wa nanban desu ka."
    },
    41: {
        'ja': "男: すみません、ちょっと 教えていただけますか。桜病院に 行きたいんです。\n女: 桜病院ですね。あそこの 掲示板を 見てください。49番の バスですよ。\n男: 49番ですね、ありがとうございます。このバスは 次の駅で 止まりますか。\n女: はい、次の駅は 市役所前ですが、そこでも 止まります。その次が 桜病院の 停留所ですよ。\n男: 良かった。バスは 何分おきに 来ますか。\n女: 大体 15分おきに 来ますよ。あ、ちょうど 49番の バスが 来ましたね。\n男: ほんとだ！教えてくれて ありがとうございました。助かりました。\n\n【質問2 (No. 41)】男性は どこへ 行きますか。(Tujuannya pergi ke mana?)",
        'id': "Pria: Permisi, bisakah Anda memberi tahu saya? Saya ingin pergi ke Rumah Sakit Sakura.\nWanita: Rumah Sakit Sakura ya. Silakan lihat papan pengumuman di sana. Bus nomor 49 lho.\n...\n[Pertanyaan 2 (No. 41)] Laki-laki tersebut hendak pergi ke mana?",
        'rom': "Otoko: Sumimasen, chotto oshiete itadakemasu ka. Sakura-byouin ni ikitai n desu...\n\n[Shitsumon 2] Dansei wa doko e ikimasu ka."
    },
    42: {
        'ja': "女: りく君、今日の 会議は 何時からだっけ？\n男: 午後3時からだよ。あと 1時間くらい あるね。\n女: じゃあ、会議が 始まる前に、みんなで この部屋を 掃除しませんか。\n男: いいですね、やりましょう。掃除の道具は どこに ありますか。\n女: 掃除の道具は 受付に 置いてありますよ。\n男: わかりました。僕が 受付まで 取りに行ってきますね。\n女: お願いします。その間に 私は 机の上を 片付けておきます。\n男: はい、すぐ戻ります。3時までに 綺麗にしましょう。\n\n【質問1 (No. 42)】掃除は いつまでに 終わらせますか／何時から始めますか。(Kapan bersih-bersih dilakukan?)",
        'id': "Wanita: Riku-kun, rapat hari ini mulai jam berapa ya?\nPria: Jam 3 sore lho. Masih ada waktu sekitar 1 jam lagi ya.\nWanita: Kalau begitu, sebelum rapat dimulai, bagaimana kalau kita bersama-sama membersihkan ruangan ini?\nPria: Ide bagus, ayo kita lakukan. Alat bersih-bersihnya ada di mana ya?\nWanita: Alat bersih-bersih ditaruh di meja resepsionis (uketsuke).\nPria: Baik, saya akan pergi mengambilnya ke resepsionis ya.\nWanita: Tolong ya. Sementara itu saya akan merapikan meja.\nPria: Siap, saya segera kembali. Ayo kita bersihkan sebelum jam 3.\n\n[Pertanyaan 1 (No. 42)] Kapan kegiatan bersih-bersih diselesaikan / dimulai?",
        'rom': "Onna: Riku-kun, kyou no kaigi wa nanji kara dakke?\nOtoko: Gogo san-ji kara da yo. Ato ichijikan kurai aru ne...\n\n[Shitsumon 1] Souji wa itsu made ni owarasemasu ka."
    },
    43: {
        'ja': "女: りく君、今日の 会議は 何時からだっけ？\n男: 午後3時からだよ。あと 1時間くらい あるね。\n女: じゃあ、会議が 始まる前に、みんなで この部屋を 掃除しませんか。\n男: いいですね、やりましょう。掃除の道具は どこに ありますか。\n女: 掃除の道具は 受付に 置いてありますよ。\n男: わかりました。僕が 受付まで 取りに行ってきますね。\n女: お願いします。その間に 私は 机の上を 片付けておきます。\n男: はい、すぐ戻ります。3時までに 綺麗にしましょう。\n\n【質問2 (No. 43)】掃除の道具は どこに ありますか。(Di manakah alat bersih-bersih ditaruh?)",
        'id': "Wanita: Alat bersih-bersihnya ada di mana ya?\nPria: Alat bersih-bersih ditaruh di resepsionis (uketsuke).\n...\n[Pertanyaan 2 (No. 43)] Di manakah alat bersih-bersih ditaruh?",
        'rom': "Onna: Souji no dougu wa doko ni arimasu ka.\nOtoko: Souji no dougu wa uketsuke ni oite arimasu yo.\n\n[Shitsumon 2] Souji no dougu wa doko ni arimasu ka."
    }
}

# Update all questions
for q in quiz:
    no = q['no']
    
    # Standard field salah like Orimasu 2
    q['salah'] = "Pilihan lain tidak cocok dengan gambar/bacaan dan kunci file jawaban."
    
    # 1. MOJIGOI (1-13)
    if no == 1:
        q['trans'] = "Gambar menunjukkan kondisi cuaca cerah di mana matahari bersinar terang di langit biru."
        q['analisis'] = "[MNN Bab 8 - Kosakata Cuaca (Hare)] Gambar menampilkan simbol cuaca cerah dengan sinar matahari terang benderang. Dalam bahasa Jepang, cuaca cerah disebut はれ (hare - 晴れ). Opsi あめ (ame) berarti hujan, sedangkan くもり (kumori) berarti berawan/mendung."
        q['opt_detail'] = [
            { "kana": "はれ [ 晴れ ]", "rom": "hare", "arti": "cerah", "alasan": "Tepat sekali. はれ (hare) berarti cuaca cerah disinari matahari, sesuai dengan gambar pemandangan langit cerah." },
            { "kana": "あめ [ 雨 ]", "rom": "ame", "arti": "hujan", "alasan": "Salah. あめ (ame) berarti cuaca hujan, tidak sesuai gambar matahari bersinar." },
            { "kana": "くもり [ 曇り ]", "rom": "kumori", "arti": "berawan / mendung", "alasan": "Salah. くもり (kumori) berarti langit tertutup awan mendung, tidak tepat untuk cuaca cerah." }
        ]
        q['opt_note'] = ["(hare) cerah", "(ame) hujan", "(kumori) mendung"]

    elif no == 2:
        q['trans'] = "Gambar menampilkan sosok seorang ayah paruh baya."
        q['analisis'] = "[MNN Bab 28 - Sebutan Keluarga Sendiri (Chichi)] Gambar memperlihatkan sosok pria dewasa/ayah. Sebutan untuk ayah kandung sendiri dalam percakapan sopan bahasa Jepang adalah ちち (chichi - 父). Opsi はは (haha) adalah ibu kandung, dan ぢぢ bukan kata baku bahasa Jepang."
        q['opt_detail'] = [
            { "kana": "ちち [ 父 ]", "rom": "chichi", "arti": "ayah (kandung sendiri)", "alasan": "Tepat sekali. ちち (chichi) adalah sebutan keluarga sendiri untuk ayah, sesuai visual pria/bapak." },
            { "kana": "ぢぢ", "rom": "jiji", "arti": "bukan ejaan baku", "alasan": "Salah ejaan. Huruf ぢ (ji/di) tidak lazim untuk sebutan ayah; kata kakek pun ditulis じじ / おじいさん." },
            { "kana": "はは [ 母 ]", "rom": "haha", "arti": "ibu (kandung sendiri)", "alasan": "Salah jenis kelamin. はは (haha) adalah sebutan untuk ibu kandung perempuan." }
        ]
        q['opt_note'] = ["(chichi) ayah sendiri", "(jiji) tidak baku", "(haha) ibu sendiri"]

    elif no == 3:
        q['trans'] = "Gambar memperlihatkan rintik air hujan yang turun dari langit membasahi tanah."
        q['analisis'] = "[MNN Bab 8/12 - Kanji Gejala Alam (Ame)] Visual menunjukkan air hujan yang sedang turun. Kanji untuk hujan adalah 雨 (dibaca あめ / ame). Opsi 夏 (natsu) berarti musim panas, sedangkan 雪 (yuki) berarti salju."
        q['opt_detail'] = [
            { "kana": "雨 [ あめ ]", "rom": "ame", "arti": "hujan", "alasan": "Tepat sekali. Kanji 雨 melambangkan tetesan air hujan dari awan di langit." },
            { "kana": "夏 [ なつ ]", "rom": "natsu", "arti": "musim panas", "alasan": "Salah. 夏 (natsu) berarti musim panas, bukan fenomena rintik hujan." },
            { "kana": "雪 [ ゆき ]", "rom": "yuki", "arti": "salju", "alasan": "Salah. 雪 (yuki) berarti butiran salju putih, bukan tetesan air hujan cair." }
        ]
        q['opt_note'] = ["(ame) hujan", "(natsu) musim panas", "(yuki) salju"]

    elif no == 4:
        q['trans'] = "Gambar menunjukkan seseorang yang sedang membungkuk memungut sampah dari tanah."
        q['analisis'] = "[MNN Bab 14/16 - Kata Kerja Aktivitas (Hirowimasu)] Gambar memperlihatkan tindakan mengambil/memungut barang yang jatuh di tanah. Kata kerja yang tepat adalah ひろいます (hiroimasu - 拾います = memungut). Opsi おろします berarti menurunkan barang, dan すてます berarti membuang sampah."
        q['opt_detail'] = [
            { "kana": "おろします [ 降ろします ]", "rom": "oroshimasu", "arti": "menurunkan barang", "alasan": "Salah. おろします berarti menurunkan muatan/barang dari tempat tinggi atau kendaraan." },
            { "kana": "ひろいます [ 拾います ]", "rom": "hiroimasu", "arti": "memungut / mengambil dari bawah", "alasan": "Tepat sekali. Sesuai visual seseorang membungkuk memungut sampah/benda dari tanah." },
            { "kana": "すてます [ 捨てます ]", "rom": "sutemasu", "arti": "membuang", "alasan": "Kurang tepat. Meskipun berkaitan dengan sampah, gestur membungkuk mengambil sampah di lantai adalah memungut (拾う)." }
        ]
        q['opt_note'] = ["(oroshimasu) menurunkan", "(hiroimasu) memungut", "(sutemasu) membuang"]

    elif no == 5:
        q['trans'] = "Gambar menampilkan matahari terik dengan termometer merkuri yang melonjak tinggi menunjukkan hawa panas menyengat."
        q['analisis'] = "[MNN Bab 12 - Kata Sifat Suhu Udara (Atsui)] Gambar termometer bersuhu tinggi dan matahari terik mengilustrasikan hawa udara yang panas. Kata sifat i untuk suhu udara panas adalah 暑い (あつい / atsui). Opsi 寒い (samui) berarti dingin cuaca, sedangkan 冷たい (tsumetai) berarti dingin untuk sentuhan benda/minuman."
        q['opt_detail'] = [
            { "kana": "寒い [ さむい ]", "rom": "samui", "arti": "dingin (cuaca/udara)", "alasan": "Salah. Antonim dari panas; 寒い dipakai saat musim dingin atau salju." },
            { "kana": "暑い [ あつい ]", "rom": "atsui", "arti": "panas (cuaca/udara)", "alasan": "Tepat sekali. Kanji 暑い khusus digunakan untuk menyatakan temperatur iklim/cuaca yang panas terik." },
            { "kana": "冷たい [ つめたい ]", "rom": "tsumetai", "arti": "dingin (benda/minuman)", "alasan": "Salah konteks. 冷たい digunakan untuk rasa dingin pada fisik benda (seperti es/air), bukan suhu udara luar." }
        ]
        q['opt_note'] = ["(samui) dingin cuaca", "(atsui) panas cuaca", "(tsumetai) dingin benda"]

    elif no == 6:
        q['analisis'] = "[MNN Bab 8/22 - Cara Tulis Kanji Kata Sifat (Yuumei)] Kalimat: 「彼 は この町 に [ ゆうめいな ] んです」 (Dia terkenal di kota ini). Kata sifat na 'terkenal' ditulis dengan kanji 有名 (huruf 有 = ada/memiliki, 名 = nama/reputasi). Pilihan 人気 (ninki) berarti popularitas, dan 名前 (namae) berarti nama orang."
        q['opt_detail'] = [
            { "kana": "有名 [ ゆうめい ]", "rom": "yuumei", "arti": "terkenal / termasyhur", "alasan": "Tepat sekali. Kanji 有名 merupakan padanan kanji resmi untuk kosakata ゆうめい." },
            { "kana": "人気 [ にんき ]", "rom": "ninki", "arti": "populer / digemari", "alasan": "Salah kanji dan cara baca. 人気 dibaca にんき, bukan ゆうめい." },
            { "kana": "名前 [ なまえ ]", "rom": "namae", "arti": "nama", "alasan": "Salah kanji. 名前 dibaca なまえ (nama), bukan kata sifat terkenal." }
        ]
        q['opt_note'] = ["(yuumei) terkenal", "(ninki) populer", "(namae) nama"]

    elif no == 7:
        q['analisis'] = "[MNN Bab 14/19 - Kanji Kata Kerja Bentuk Negatif (Ugokanai)] Kalimat: 「私の車 が [ うごかない ] です」 (Mobil saya tidak bergerak / mogok). Kata kerja 'bergerak' adalah 動く (ugoku), sehingga bentuk negatifnya adalah 動かない (ugokanai). Opsi 働かない (hatarakanai) berarti tidak bekerja, dan 泳がない (oyoganai) berarti tidak berenang."
        q['opt_detail'] = [
            { "kana": "働かない [ はたらかない ]", "rom": "hatarakanai", "arti": "tidak bekerja (karyawan/pegawai)", "alasan": "Salah. 働く (hataraku) digunakan untuk manusia bekerja mencari nafkah." },
            { "kana": "泳がない [ およがない ]", "rom": "oyoganai", "arti": "tidak berenang", "alasan": "Salah arti. 泳ぐ (oyogu) berarti berenang di air." },
            { "kana": "動かない [ うごかない ]", "rom": "ugokanai", "arti": "tidak bergerak / mogok (mesin)", "alasan": "Tepat sekali. Kanji 動 (gerak) pada 動かない dipakai untuk mesin/kendaraan yang tidak mau hidup atau mogok." }
        ]
        q['opt_note'] = ["(hatarakanai) tidak bekerja", "(oyoganai) tidak berenang", "(ugokanai) tidak bergerak/mogok"]

    elif no == 8:
        q['analisis'] = "[MNN Bab 8/19 - Cara Baca Kanji Rasa Sakit (Itai)] Kalimat: 「おなか が [ 痛い ]ですから、ちょっとトイレ に いきます」 (Karena perut saya sakit, saya izin ke toilet sebentar). Kanji 痛い dibaca いたい (itai) yang berarti terasa sakit/nyeri pada bagian tubuh. Opsi 顔 dibaca かお (wajah), dan あたま berarti kepala."
        q['opt_detail'] = [
            { "kana": "顔 [ かお ]", "rom": "kao", "arti": "wajah / muka", "alasan": "Salah arti dan kategori kata. 顔 adalah kata benda bagian wajah." },
            { "kana": "あたま [ 頭 ]", "rom": "atama", "arti": "kepala", "alasan": "Salah kata. あたま adalah kata benda kepala, bukan rasa sakit." },
            { "kana": "いたい [ 痛い ]", "rom": "itai", "arti": "sakit / nyeri", "alasan": "Tepat sekali. Kanji 痛い dibaca いたい, menerangkan kondisi perut yang melilit/mulas." }
        ]
        q['opt_note'] = ["(kao) wajah", "(atama) kepala", "(itai) sakit"]

    elif no == 9:
        q['analisis'] = "[MNN Bab 4 - Penanda Menit & Setengah Jam (Han)] Kalimat: 「待ち合わせ は 6時 [ 半 ] どうですか」 (Bagaimana kalau janji ketemunya jam 6 lewat setengah / 6.30?). Kanji 半 diletakkan setelah jam dibaca はん (han) yang bermakna lewat 30 menit (setengah jam). Opsi ふん / ぷん dipakai untuk bilangan menit spesifik (seperti 5-fun, 10-pun)."
        q['opt_detail'] = [
            { "kana": "ふん [ 分 ]", "rom": "fun", "arti": "menit (angka ganjil tertentu)", "alasan": "Salah. Menit menggunakan angka sebelum kanji 分, sedangkan kanji 半 sendiri selalu dibaca はん." },
            { "kana": "ぷん [ 分 ]", "rom": "pun", "arti": "menit (angka genap/kelipatan 10)", "alasan": "Salah cara baca untuk kanji 半." },
            { "kana": "はん [ 半 ]", "rom": "han", "arti": "setengah (30 menit)", "alasan": "Tepat sekali. 6時半 (roku-ji han) berarti pukul 06:30." }
        ]
        q['opt_note'] = ["(fun) menit", "(pun) menit", "(han) setengah jam"]

    elif no == 10:
        q['analisis'] = "[MNN Bab 10/11 - Kolokasi Kata Benda Minuman (Gyuunyuu)] Dialog: 「A: 何 を 飲みますか。 B: ______ を 飲みます」 (A: Mau minum apa? B: Saya minum...). Predikat kalimat adalah 飲みます (nomimasu = meminum), sehingga kata benda yang dicari wajib berupa benda cair/minuman. Kanji 牛乳 dibaca ぎゅうにゅう (gyuunyuu = susu sapi). Opsi 牛肉 (gyuuniku = daging sapi) dan 鶏肉 (toriniku = daging ayam) adalah makanan yang dipasangkan dengan 食べます (makan)."
        q['opt_detail'] = [
            { "kana": "牛乳 [ ぎゅうにゅう ]", "rom": "gyuunyuu", "arti": "susu sapi", "alasan": "Tepat sekali. Susu sapi adalah minuman yang cocok dengan predikat 飲みます (meminum)." },
            { "kana": "牛肉 [ ぎゅうにく ]", "rom": "gyuuniku", "arti": "daging sapi", "alasan": "Salah kolokasi. Daging sapi merupakan makanan padat (食べます), bukan minuman." },
            { "kana": "鶏肉 [ とりにく ]", "rom": "toriniku", "arti": "daging ayam", "alasan": "Salah kolokasi. Daging ayam dimakan (食べます), tidak bisa diminum." }
        ]
        q['opt_note'] = ["(gyuunyuu) susu sapi (minuman)", "(gyuuniku) daging sapi", "(toriniku) daging ayam"]

    elif no == 11:
        q['analisis'] = "[MNN Bab 1 - Ungkapan Etika Makan Jepang (Itadakimasu)] Pertanyaan: 「たべる前 なん と いいますか」 (Sebelum makan mengucapkan apa?). Ungkapan wajib dan beretika santun sebelum menyantap hidangan di Jepang adalah いただきます (itadakimasu = selamat makan / saya terima hidangannya). Opsi ごちそうさま / ごちそうさまでした diucapkan setelah selesai makan, sedangkan いだたきます merupakan pengecoh tipuan urutan suku kata (typo ta/da)."
        q['opt_detail'] = [
            { "kana": "いだたきます", "rom": "idatakimasu", "arti": "salah ejaan (typo fonetik)", "alasan": "Jebakan fonetik! Huruf 'da' dan 'ta' sengaja ditukar tempatnya dari kata baku いただきます." },
            { "kana": "いただきます", "rom": "itadakimasu", "arti": "selamat makan (di awal makan)", "alasan": "Tepat sekali. Diucapkan tepat sebelum mulai menyantap makanan sambil merapatkan kedua telapak tangan." },
            { "kana": "ごちそうさまです", "rom": "gochisousama desu", "arti": "terima kasih hidangannya (di akhir)", "alasan": "Salah waktu. Diucapkan setelah selesai makan, bukan sebelum mulai makan." }
        ]
        q['opt_note'] = ["(idatakimasu) salah ejaan", "(itadakimasu) sebelum makan", "(gochisousamadesu) sesudah makan"]

    elif no == 12:
        q['trans'] = "Gambar memperlihatkan pensil yang sangat panjang jika dibandingkan dengan pensil normal di sebelahnya."
        q['analisis'] = "[MNN Bab 12 - Kata Sifat Ukuran Fisik (Nagai)] Visual membandingkan ukuran panjang fisik benda. Kata sifat i untuk 'panjang' adalah 長い (ながい / nagai). Opsi 多い (ooi) berarti jumlahnya banyak, dan 早い (hayai) berarti cepat/pagi."
        q['opt_detail'] = [
            { "kana": "多い [ おおい ]", "rom": "ooi", "arti": "banyak (jumlah/kuantitas)", "alasan": "Salah. 多い dipakai untuk menghitung kuantitas orang/benda yang berjumlah banyak." },
            { "kana": "早い [ はやい ]", "rom": "hayai", "arti": "cepat / pagi (waktu)", "alasan": "Salah dimensi. 早い berkaitan dengan kecepatan waktu/jam." },
            { "kana": "長い [ ながい ]", "rom": "nagai", "arti": "panjang (dimensi ukuran fisik)", "alasan": "Tepat sekali. Kanji 長い dipakai menerangkan benda yang memiliki bentang fisik panjang." }
        ]
        q['opt_note'] = ["(ooi) banyak jumlah", "(hayai) cepat waktu", "(nagai) panjang ukuran"]

    elif no == 13:
        q['trans'] = "Gambar menampilkan seseorang yang sedang berenang di dalam kolam renang."
        q['analisis'] = "[MNN Bab 14 - Kata Kerja Olahraga & Aktivitas Air (Oyogimasu)] Gambar visual menunjukkan orang sedang mengayunkan tangan dan kaki berenang di kolam. Kata kerja 'berenang' adalah 泳ぎます (およぎます / oyogimasu). Opsi 走ります (hashirimasu) berarti berlari, dan 歩きます (arukimasu) berarti berjalan kaki."
        q['opt_detail'] = [
            { "kana": "走ります [ はしります ]", "rom": "hashirimasu", "arti": "berlari", "alasan": "Salah aksi. 走ります dilakukan di darat/lintasan lari, bukan di air kolam." },
            { "kana": "歩きます [ あるきます ]", "rom": "arukimasu", "arti": "berjalan kaki", "alasan": "Salah aksi. 歩きます berarti melangkah berjalan santai." },
            { "kana": "泳ぎます [ およぎます ]", "rom": "oyogimasu", "arti": "berenang", "alasan": "Tepat sekali. Visual dengan jelas memperlihatkan gerakan berenang di dalam air." }
        ]
        q['opt_note'] = ["(hashirimasu) berlari", "(arukimasu) berjalan", "(oyogimasu) berenang"]

    # 2. HYOUGEN (14-36)
    elif no == 14:
        q['analisis'] = "[MNN Bab 6/18 - Bentuk Biasa Kalimat Ajakan Informal (Nomu)] Kalimat: 「コーヒーを ____?」 (Mau minum kopi?). Objek adalah kopi (minuman), sehingga kata kerja yang sesuai adalah 飲む (nomu = minum) dalam ragam santai/futsukei bertanda tanya naik. Pilihan 吸う (suu) dipakai untuk menghisap/merokok (たばこを吸う), dan 食べます memakai akhiran -masu yang janggal dalam pola informal pendek ini."
        q['opt_detail'] = [
            { "kana": "飲む [ のむ ]", "rom": "nomu", "arti": "minum (ragam akrab)", "alasan": "Tepat sekali. Kata kerja bentuk kamus 飲む dengan intonasi naik di akhir kalimat dipakai untuk menawarkan minuman secara kasual." },
            { "kana": "吸う [ すう ]", "rom": "suu", "arti": "menghisap / merokok", "alasan": "Salah kolokasi. 吸う dipasangkan dengan rokok (たばこ) atau udara (空気)." },
            { "kana": "食べます [ たべます ]", "rom": "tabemasu", "arti": "makan (ragam sopan)", "alasan": "Salah arti. Kopi adalah minuman yang diteguk (飲む), bukan makanan padat (食べる)." }
        ]
        q['opt_note'] = ["(nomu) minum", "(suu) menghisap/merokok", "(tabemasu) makan"]

    elif no == 15:
        q['analisis'] = "[MNN Bab 14/18 - Kolokasi Memilih Belanjaan (Erabimasu)] Kalimat: 「買い物 を ........」 (Memilih barang saat berbelanja). Kata kerja yang secara alami berpasangan dengan memilah/memilih barang saat belanja adalah えらびます (erabimasu - 選びます). Opsi まなびます (manabimasu) berarti menuntut ilmu/belajar, dan さそいます (sasoimasu) berarti mengajak orang lain."
        q['opt_detail'] = [
            { "kana": "まなびます [ 学びます ]", "rom": "manabimasu", "arti": "belajar / menuntut ilmu", "alasan": "Salah konteks. 学びます dipakai untuk mempelajari ilmu pengetahuan atau keahlian di sekolah/kursus." },
            { "kana": "えらびます [ 選びます ]", "rom": "erabimasu", "arti": "memilih / menyeleksi", "alasan": "Tepat sekali. Sesuai situasi berbelanja di mana pembeli membandingkan dan memilih barang yang diinginkan." },
            { "kana": "さそいます [ 誘います ]", "rom": "sasoimasu", "arti": "mengajak orang lain", "alasan": "Salah objek. 誘います membutuhkan objek manusia (teman/kolega) untuk diajak pergi bersama." }
        ]
        q['opt_note'] = ["(manabimasu) belajar", "(erabimasu) memilih", "(sasoimasu) mengajak"]

    elif no == 16:
        q['analisis'] = "[MNN Bab 7 - Tata Krama Bertamu ke Rumah Orang (Ojamashimasu)] Dialog: Ketika tamu tiba mengucapkan 「ごめんください」 (permisi) lalu tuan rumah mempersilakan 「いらっしゃい、どうぞあがってください」 (selamat datang, silakan masuk ke dalam), ucapan balasan baku dari tamu saat melangkah naik ke lantai rumah adalah 「おじゃまします」 (ojamashimasu = permisi / maaf mengganggu). Pilihan こちらこそ berarti 'sama-sama/saya yang semestinya'."
        q['opt_detail'] = [
            { "kana": "おじゃまします [ お邪魔します ]", "rom": "ojamashimasu", "arti": "permisi (saat masuk rumah orang)", "alasan": "Tepat sekali. Wajib diucapkan saat melangkah masuk ke dalam rumah orang Jepang sebagai etika sopan." },
            { "kana": "こちらこそ", "rom": "kochira koso", "arti": "justru saya yang harusnya...", "alasan": "Salah konteks. Diucapkan untuk membalas ucapan terima kasih atau salam perkenalan pertama kali." },
            { "kana": "よろしくおじゃまします", "rom": "yoroshiku ojamashimasu", "arti": "ungkapan tidak baku", "alasan": "Ungkapan rancu yang menggabungkan yoroshiku dan ojamashimasu tanpa aturan tata bahasa yang benar." }
        ]
        q['opt_note'] = ["(ojamashimasu) permisi bertamu", "(kochira koso) justru saya", "(rancu) tidak baku"]

    elif no == 17:
        q['analisis'] = "[MNN Bab 5 - Penyangkalan Total Kata Tanya + mo + Negatif (Doko ni mo)] Pertanyaan: 「休みの日は どこへ 行きますか」 (Hari libur mau pergi ke mana?). Dijawab dengan sangkalan penuh: 「いいえ、どこにも 行きません」 (Tidak, saya tidak pergi ke mana-mana). Pola [Kata Tanya Tempat + に/へ + も + Negatif] menegaskan ketiadaan tempat tujuan. Pilihan だれもいません (tidak ada siapa-siapa) dan なにもいません (tidak ada makhluk hidup apa-apa) adalah keberadaan makhluk hidup, bukan perpindahan arah jalan."
        q['opt_detail'] = [
            { "kana": "どこにも行きません", "rom": "doko ni mo ikimasen", "arti": "tidak pergi ke mana pun", "alasan": "Tepat sekali. Menyangkal tujuan pergi secara mutlak dengan pola kata tanya doko + mo + negatif." },
            { "kana": "だれもいません", "rom": "dare mo imasen", "arti": "tidak ada siapa pun", "alasan": "Salah fokus. Menjawab pertanyaan tentang keberadaan orang (だれ), bukan tempat tujuan liburan." },
            { "kana": "なにもいません", "rom": "nani mo imasen", "arti": "tidak ada benda/hewan apa-apa", "alasan": "Salah fokus dan tata bahasa keberadaan benda mati/hidup." }
        ]
        q['opt_note'] = ["(doko ni mo ikimasen) tidak ke mana-mana", "(dare mo imasen) tidak ada orang", "(nani mo imasen) tidak ada apa-apa"]

    elif no == 18:
        q['analisis'] = "[MNN Bab 25 - Pengandaian Kondisional Waktu (~tara)] Dialog: 「福岡へ ________、食べてみてください」 (Kalau pergi ke Fukuoka, tolong cobalah makan ya). Pola pengandaian lampau bentuk ~たら (~tara = jika/kalau nanti sudah sampai di sana) tepat untuk memberikan anjuran atau saran tindakan selanjutnya (行ったら、食べてみてください). Pilihan 着て (memakai baju/datang) dan 来たら (kalau datang ke sini) tidak tepat dari sudut pandang pembicara yang membicarakan kota lain."
        q['opt_detail'] = [
            { "kana": "着て [ きて ]", "rom": "kite", "arti": "memakai baju / mengenakan", "alasan": "Salah arti. 着る (kiru) berarti mengenakan pakaian, bukan pergi ke suatu tempat." },
            { "kana": "行ったら [ いったら ]", "rom": "ittara", "arti": "jika / kalau sudah pergi ke sana", "alasan": "Tepat sekali. Bentuk kondisional ~tara dari ikimasu (行きます) tepat untuk menyarankan tindakan mencicipi kuliner saat tiba di Fukuoka." },
            { "kana": "来たら [ きたら ]", "rom": "kitara", "arti": "kalau datang (ke arah sini)", "alasan": "Salah sudut pandang arah gerak. Pembicara dan lawan bicara tidak sedang berada di Fukuoka." }
        ]
        q['opt_note'] = ["(kite) memakai baju", "(ittara) kalau pergi ke sana", "(kitara) kalau datang ke sini"]

    elif no == 19:
        q['analisis'] = "[MNN Bab 9/38 - Menyatakan Kelemahan / Ketidaksukaan (Nigate)] Dialog: A bertanya kenapa tidak suka musim panas (どうしてですか), dijawab oleh B: 「暑いのが _________」 (Karena saya lemah / tidak tahan dengan hawa panas). Kata sifat na 苦手 (にがて / nigate) digunakan untuk menyatakan ketidaksukaan yang disebabkan oleh ketidakmampuan fisik/daya tahan tubuh menahan suatu kondisi (暑いのが苦手です = saya tidak kuat hawa panas). Opsi 涼しい (sejuk) dan 楽しい (menyenangkan) bertolak belakang dengan alasan ketidaksukaan."
        q['opt_detail'] = [
            { "kana": "涼しいですから [ すずしいですから ]", "rom": "suzushii desu kara", "arti": "karena sejuk", "alasan": "Kontradiktif. Kalimat menyebutkan kata 暑い (panas), bukan sejuk." },
            { "kana": "苦手ですから [ にがてですから ]", "rom": "nigate desu kara", "arti": "karena saya tidak tahan / lemah terhadapnya", "alasan": "Tepat sekali. 苦手 (nigate) tepat untuk menerangkan bahwa tubuh seseorang tidak kuat terpapar temperatur panas musim panas." },
            { "kana": "楽しいですから [ たのしいですから ]", "rom": "tanoshii desu kara", "arti": "karena menyenangkan", "alasan": "Salah nalar. Jika menyenangkan, semestinya menjadi alasan suka, bukan tidak suka." }
        ]
        q['opt_note'] = ["(suzushii) sejuk", "(nigate) tidak tahan/lemah", "(tanoshii) menyenangkan"]

    elif no == 20:
        q['analisis'] = "[MNN Bab 14/26 - Ungkapan Menawarkan Sesuatu Secara Sopan (Yokattara)] Kalimat: 「________ この料理 を たべてみてください」 ([Jika Anda berkenan], silakan coba makan masakan ini). Kata keterangan よかったら (yokattara = kalau Anda berkenan / kalau Anda mau) adalah frasa sopan pembuka ketika kita menawarkan makanan atau bantuan kepada orang lain. Pilihan ほんとう berarti benar/sungguh, dan できれば berarti sebisa mungkin."
        q['opt_detail'] = [
            { "kana": "ほんとう [ 本当 ]", "rom": "hontou", "arti": "sungguh / benar-benar", "alasan": "Salah fungsi. ほんとう dipakai untuk menanyakan kebenaran informasi (本当ですか), bukan membuka tawaran santun." },
            { "kana": "よかったら", "rom": "yokattara", "arti": "kalau berkenan / jika Anda mau", "alasan": "Tepat sekali. Ungkapan santun wajib untuk melembutkan ajakan atau tawaran menyantap hidangan." },
            { "kana": "できれば", "rom": "dekireba", "arti": "jika memungkinkan / sebisa mungkin", "alasan": "Kurang tepat. できれば dipakai saat pemohon meminta bantuan orang lain, bukan saat menyuguhi makanan." }
        ]
        q['opt_note'] = ["(hontou) sungguh/benar", "(yokattara) jika Anda berkenan", "(dekireba) jika memungkinkan"]

    elif no == 21:
        q['analisis'] = "[MNN Bab 45 - Partikel Kontras Kekecewaan / Di Luar Nalar (~noni)] Kalimat: 「インドネシア に 住んでいる_____、インドネシア語 を 話したことがありません」 ([Padahal] tinggal di Indonesia, tetapi belum pernah berbicara bahasa Indonesia). Pola konjungsi のに (noni = padahal / meskipun) digunakan untuk menghubungkan dua klausa di mana kenyataan pada klausa kedua sangat bertolak belakang dengan ekspektasi logis klausa pertama. Opsi ので menyatakan alasan sebab-akibat searah (karena), dan のは membuat topik kata benda."
        q['opt_detail'] = [
            { "kana": "ので", "rom": "node", "arti": "karena (sebab akibat searah)", "alasan": "Salah logika. Jika 'karena tinggal di Indonesia', semestinya sering bicara bahasa Indonesia, bukan sebaliknya." },
            { "kana": "のに", "rom": "noni", "arti": "padahal / meskipun", "alasan": "Tepat sekali. Menyatakan fakta paradoks yang bertentangan dengan kenyataan yang lumrah." },
            { "kana": "のは", "rom": "no wa", "arti": "partikel penegas topik", "alasan": "Salah fungsi. のは digunakan untuk menominakan kata kerja (contoh: 走るのは楽しい)." }
        ]
        q['opt_note'] = ["(node) karena", "(noni) padahal", "(no wa) partikel topik"]

    # CHOUKAI (37-43)
    if no in whisper_transcripts:
        tr = whisper_transcripts[no]
        q['title'] = tr['ja']
        q['trans'] = tr['id']
        q['trans_rom'] = tr['rom']
        
    if no == 37:
        q['analisis'] = "[MNN Bab 29/44 - Menyimak Alasan Keterlambatan (~te shimatta)] Dalam dialog rekaman percakapan, si perempuan (Hana-san) secara gamblang meminta maaf dan menjelaskan alasan keterlambatannya: 「レン君、ごめんなさい。急いでいたから、家に財布を忘れてしまったの」 (Ren-kun, maaf. Karena tadi terburu-buru, dompetku ketinggalan di rumah). Jadi penyebab keterlambatan adalah si perempuan ketinggalan dompetnya sendiri (かのじょはさいふをわすれました)."
        q['opt_detail'] = [
            { "kana": "かのじょはさいふをわすれました", "rom": "kanojo wa saifu o wasuremashita", "arti": "dia (perempuan) kelupaan dompet", "alasan": "Tepat sekali. Sesuai perkataan Hana-san: 「家に財布を忘れてしまった」 (dompet saya tertinggal di rumah)." },
            { "kana": "ふたりはさいふをわすれました", "rom": "futari wa saifu o wasuremashita", "arti": "keduanya kelupaan dompet", "alasan": "Salah. Hanya pihak perempuan yang dompetnya tertinggal, sedangkan laki-laki sudah menunggu di lokasi." },
            { "kana": "かれはさいふをわすれました", "rom": "kare wa saifu o wasuremashita", "arti": "dia (laki-laki) kelupaan dompet", "alasan": "Salah subjek. Pria (Ren-kun) tidak ketinggalan dompet." }
        ]
        q['opt_note'] = ["(kanojo wa saifu o wasuremashita) benar", "(futari wa...) salah subjek jamak", "(kare wa...) salah subjek pria"]

    elif no == 38:
        q['analisis'] = "[MNN Bab 2/3 - Menyimak Informasi Harga Benda (Ikura)] Dalam transaksi di toko, pembeli menanyakan harga piring kecil: 「この 小さい お皿は いくらですか」 (Piring kecil ini harganya berapa?). Penjual menjawab dengan tegas: 「はい、それは 350円です」 (Ya, itu harganya 350 yen). Angka 350 dibaca さんびゃくごじゅう (sanbyaku-gojuu). Maka harga piring kecil tersebut adalah 350円."
        q['opt_detail'] = [
            { "kana": "340円", "rom": "sanbyaku-yonjuu-en", "arti": "340 yen", "alasan": "Salah nominal. Penjual menyebutkan angka lima puluh (50), bukan empat puluh (40)." },
            { "kana": "350円", "rom": "sanbyaku-gojuu-en", "arti": "350 yen", "alasan": "Tepat sekali. Sesuai kutipan langsung penjual toko: 「それは 350円です」." },
            { "kana": "440円", "rom": "yonbyaku-yonjuu-en", "arti": "440 yen", "alasan": "Salah nominal ratusan dan puluhan." }
        ]
        q['opt_note'] = ["(340-en) salah nominal", "(350-en) benar", "(440-en) salah nominal"]

    elif no == 39:
        q['analisis'] = "[MNN Bab 5/18 - Menyimak Keputusan Akhir Pembicara (Matou)] Laki-laki dan perempuan tertinggal jadwal film bioskop. Meskipun perempuan merekomendasikan event di dekat sana, laki-laki memutuskan: 「でも 僕は やっぱり 映画を 待っています」 (Tapi menurutku aku tetap mau menunggu film). Perempuan menyetujui dan mengajak: 「じゃあ、チケットを買って ここで待とう」 (Ayo beli tiket dan menunggu di sini). Jadi tindakan yang mereka pilih adalah menunggu sesi penayangan film berikutnya (えいがをまっています)."
        q['opt_detail'] = [
            { "kana": "スーパーへまっています", "rom": "suupaa e matte imasu", "arti": "menunggu di supermarket", "alasan": "Salah tempat. Mereka berada di bioskop dan tidak pergi ke supermarket." },
            { "kana": "こうえんへいきます", "rom": "kouen e ikimasu", "arti": "pergi ke taman", "alasan": "Salah. Rekomendasi pergi ke luar dibatalkan demi menonton film sesi berikutnya." },
            { "kana": "えいがをまっています", "rom": "eiga o matte imasu", "arti": "menunggu film (jadwal berikutnya)", "alasan": "Tepat sekali. Keduanya sepakat membeli tiket dan menunggu 1 jam untuk film berikutnya: 「ここで待とう」." }
        ]
        q['opt_note'] = ["(suupaa e...) salah lokasi", "(kouen e...) batal ke tempat lain", "(eiga o matte imasu) benar"]

    elif no == 40:
        q['analisis'] = "[MNN Bab 5/16 - Menyimak Nomor Rute Bus (Yonjuu-kyuu-ban)] Pria bertanya rute menuju Rumah Sakit Sakura (桜病院). Wanita penunjuk arah menjelaskan sambil menunjuk papan informasi: 「あそこの 掲示板を 見てください。49番の バスですよ」 (Lihat papan di sana. Bus nomor 49 lho). Angka 49 dibaca よんじゅうきゅう (yonjuu-kyuu). Jadi bus yang harus dinaiki bernomor 49."
        q['opt_detail'] = [
            { "kana": "48", "rom": "yonjuu-hachi", "arti": "nomor 48", "alasan": "Pengecoh angka digit satuan (delapan alih-alih sembilan)." },
            { "kana": "49", "rom": "yonjuu-kyuu", "arti": "nomor 49", "alasan": "Tepat sekali. Rekaman secara eksplisit menyebut: 「49番の バスですよ」 (Bus nomor 49)." },
            { "kana": "47", "rom": "yonjuu-nana", "arti": "nomor 47", "alasan": "Pengecoh angka digit satuan." }
        ]
        q['opt_note'] = ["(48) salah nomor", "(49) benar (49番)", "(47) salah nomor"]

    elif no == 41:
        q['analisis'] = "[MNN Bab 5 - Menyimak Tujuan Perjalanan (~e Ikitai)] Pada awal dialog pria membuka percakapan dengan menyampaikan tujuan kepergiannya: 「すみません、ちょっと 教えていただけますか。桜病院に 行きたいんです」 (Permisi, bisakah memberi tahu saya? Saya ingin pergi ke Rumah Sakit Sakura). Rumah sakit dalam bahasa Jepang adalah 病院 (びょういん / byouin). Maka tempat yang dituju adalah rumah sakit (rumah sakit / 桜病院)."
        q['opt_detail'] = [
            { "kana": "rumah sakit", "rom": "byouin (Sakura-byouin)", "arti": "rumah sakit (RS Sakura)", "alasan": "Tepat sekali. Penutur jelas menyatakan: 「桜病院に 行きたいんです」." },
            { "kana": "sekolah", "rom": "gakkou", "arti": "sekolah", "alasan": "Salah lokasi. Tidak ada penyebutan sekolah (学校) dalam dialog." },
            { "kana": "taman", "rom": "kouen", "arti": "taman", "alasan": "Salah lokasi. Lokasi yang dituju adalah fasilitas medis rumah sakit." }
        ]
        q['opt_note'] = ["(rumah sakit) benar (桜病院)", "(sekolah) salah tujuan", "(taman) salah tujuan"]

    elif no == 42:
        q['analisis'] = "[MNN Bab 4/14 - Menyimak Jadwal Waktu Dimulainya Kegiatan (~made ni)] Wanita menanyakan jam rapat: 「今日の 会議は 何時からだっけ？」 (Rapat hari ini mulai jam berapa ya?), pria menjawab jam 3 (午後3時). Lalu wanita mengajak: 「会議が 始まる前に、みんなで この部屋を 掃除しませんか」 (Sebelum rapat dimulai, bagaimana kalau kita bersihkan ruangan ini?). Pria mengiyakan dan menegaskan: 「3時までに 綺麗にしましょう」 (Ayo buat ruangan bersih rapi sebelum jam 3). Maka kegiatan pembersihan dilakukan sebelum jam 3 (さんじまえにそうじをはじめます)."
        q['opt_detail'] = [
            { "kana": "さんじまえにそうじをはじめます", "rom": "san-ji mae ni souji o hajimemasu", "arti": "memulai bersih-bersih sebelum jam 3", "alasan": "Tepat sekali. Mereka membersihkan ruangan pada kurun waktu sebelum rapat jam 3 sore dimulai." },
            { "kana": "よんじそうじします", "rom": "yon-ji souji shimasu", "arti": "bersih-bersih jam 4", "alasan": "Salah waktu. Jam 4 rapat sedang berlangsung." },
            { "kana": "さんじはんそうじします", "rom": "san-ji han souji shimasu", "arti": "bersih-bersih jam 3.30", "alasan": "Salah waktu. Jam 3.30 rapat sudah berjalan setengah jam." }
        ]
        q['opt_note'] = ["(san-ji mae...) benar (sebelum jam 3)", "(yon-ji...) salah waktu", "(san-ji han...) salah waktu"]

    elif no == 43:
        q['analisis'] = "[MNN Bab 10 - Menyimak Posisi Peletakan Benda (Uketsuke)] Pria menanyakan keberadaan perkakas kebersihan: 「掃除の道具は どこに ありますか」 (Alat-alat bersih-bersih ada di mana?). Wanita menjawab: 「掃除の道具は 受付に 置いてありますよ」 (Alat bersih-bersih ditaruh di resepsionis). Kata 受付 (うけつけ / uketsuke) berarti meja informasi / resepsionis."
        q['opt_detail'] = [
            { "kana": "Resepsionis", "rom": "uketsuke (受付)", "arti": "meja resepsionis / bagian depan", "alasan": "Tepat sekali. Disebutkan secara langsung: 「受付に 置いてあります」 (ditaruh di resepsionis)." },
            { "kana": "Ruang rapat", "rom": "kaigishitsu (会議室)", "arti": "ruang rapat", "alasan": "Salah. Ruang rapat adalah ruangan yang hendak dibersihkan, bukan tempat penyimpanan alatnya." },
            { "kana": "Gudang", "rom": "souko (倉庫)", "arti": "gudang", "alasan": "Salah. Audio tidak menyebutkan gudang, melainkan meja resepsionis (受付)." }
        ]
        q['opt_note'] = ["(resepsionis) benar (受付)", "(ruang rapat) ruang yang dibersihkan", "(gudang) tidak disebutkan"]

    # 4. DOKKAI (44-55)
    elif no == 44:
        q['analisis'] = "[MNN Bab 5 - Dokkai Sarana Transportasi (Partikel で)] Kalimat kedua wacana: 「家から 海まで オートバイで 行きました」 (Dari rumah sampai ke laut kami pergi naik sepeda motor). Partikel で (de) menandakan sarana kendaraan yang dinaiki, yaitu sepeda motor (オートバイ / オトバイク). Opsi くるま (mobil) dan じてんしゃ (sepeda) tidak sesuai teks wacana."
        q['opt_detail'] = [
            { "kana": "くるま [ 車 ]", "rom": "kuruma", "arti": "mobil", "alasan": "Salah moda transportasi. Teks menyatakan pergi dengan sepeda motor, bukan mobil." },
            { "kana": "じてんしゃ [ 自転車 ]", "rom": "jitensha", "arti": "sepeda", "alasan": "Salah moda transportasi. Teks tidak menyebutkan sepeda gowes." },
            { "kana": "オトバイク [ オートバイ ]", "rom": "otobaiku / ootobai", "arti": "sepeda motor", "alasan": "Tepat sekali. Tertulis gamblang di baris ke-2 bacaan: 「オートバイで 行きました」." }
        ]
        q['opt_note'] = ["(kuruma) mobil", "(jitensha) sepeda", "(otobaiku) sepeda motor (benar)"]

    elif no == 45:
        q['analisis'] = "[MNN Bab 14 - Dokkai Aktivitas di Tempat Liburan (~de Oyogimashita)] Kalimat keempat wacana: 「わたしたちは 海で たくさん 泳ぎました」 (Kami banyak berenang di laut). Kata kerja 泳ぎました (oyogimashita) berasal dari 泳ぐ (oyogu = berenang). Opsi はしります berarti berlari, dan ねます berarti tidur."
        q['opt_detail'] = [
            { "kana": "はしります [ 走ります ]", "rom": "hashirimasu", "arti": "berlari", "alasan": "Salah aktivitas. Teks tidak menceritakan aktivitas lari di pantai." },
            { "kana": "ねます [ 寝ます ]", "rom": "nemasu", "arti": "tidur", "alasan": "Salah aktivitas. Penulis tidak pergi tidur saat di laut." },
            { "kana": "およぎます [ 泳ぎます ]", "rom": "oyogimasu", "arti": "berenang", "alasan": "Tepat sekali. Sesuai kalimat wacana: 「海で たくさん 泳ぎました」." }
        ]
        q['opt_note'] = ["(hashirimasu) berlari", "(nemasu) tidur", "(oyogimasu) berenang (benar)"]

    elif no == 46:
        q['analisis'] = "[MNN Bab 11 - Dokkai Durasi Waktu Pemeriksaan (~pun kan)] Dalam pengumuman apartemen tertulis rincian waktu: 「ひとつの へやの てんけんは 20ぷん（分）くらいです」 (Pemeriksaan satu kamar kira-kira selama 20 menit). Huruf kanji 分 dibaca ぷん/ふん menandakan menit durasi. Maka durasi pemeriksaan gas adalah 20 menit (20 分)."
        q['opt_detail'] = [
            { "kana": "25 分", "rom": "nijuu-go-fun", "arti": "25 menit", "alasan": "Salah angka durasi." },
            { "kana": "10 分", "rom": "juppun", "arti": "10 menit", "alasan": "Salah angka durasi." },
            { "kana": "20 分", "rom": "nijuppun", "arti": "20 menit", "alasan": "Tepat sekali. Tertulis spesifik pada surat edaran: 「20ぷん（分）くらいです」." }
        ]
        q['opt_note'] = ["(25-fun) salah", "(10-pun) salah", "(20-pun) benar (20分)"]

    elif no == 47:
        q['analisis'] = "[MNN Bab 4 - Dokkai Kalender & Tanggal Pelaksanaan (~gatsu ~nichi)] Bagian jadwal tanggal pengumuman tertulis: 「ひにち：7月20日（にちようび）」 atau tanggal pemeriksaan gas. Pada opsi jawaban: 7月20日 / 8月20日 / 8月2日. Tanggal yang tertera pada pengumuman pemeriksaan gas adalah tanggal 20 bulan 7 / 20 Juli (7月20日)."
        q['opt_detail'] = [
            { "kana": "8 月 2 日", "rom": "hachigatsu futsuka", "arti": "tanggal 2 Agustus", "alasan": "Salah tanggal dan bulan." },
            { "kana": "8 月 20 日", "rom": "hachigatsu hatsuka", "arti": "tanggal 20 Agustus", "alasan": "Salah bulan." },
            { "kana": "7 月 20 日 / 7 月 2 日", "rom": "shichigatsu", "arti": "bulan Juli", "alasan": "Tepat sekali. Sesuai penanggalan yang tertera pada pengumuman apartemen." }
        ]
        q['opt_note'] = ["(8/2) salah", "(8/20) salah", "(7月) benar"]

    elif no == 48:
        q['analisis'] = "[MNN Bab 11 - Dokkai Syarat Usia Peserta (~sai ijou)] Pengumuman medical check-up (けんこうしんだん) perusahaan menyatakan syarat peserta: 「たいしょう：35さい 以上の かた」 (Sasaran peserta: karyawan yang berusia 35 tahun ke atas). Kanji 以上 (いじょう / ijou) berarti 'ke atas / lebih dari atau sama dengan'. Maka usia yang diperiksa adalah 35 tahun ke atas (35 歳以上)."
        q['opt_detail'] = [
            { "kana": "35 歳以上 [ 35さいいじょう ]", "rom": "sanjuu-go-sai ijou", "arti": "usia 35 tahun ke atas", "alasan": "Tepat sekali. Kata 以上 (ijou) mencakup usia 35 tahun beserta usia di atasnya sesuai ketentuan pengumuman." },
            { "kana": "35歳", "rom": "sanjuu-go-sai", "arti": "hanya usia 35 tahun", "alasan": "Kurang lengkap. Pengumuman tidak hanya membatasi usia 35 tahun saja, melainkan 35 tahun ke atas (以上)." },
            { "kana": "25歳", "rom": "nijuu-go-sai", "arti": "usia 25 tahun", "alasan": "Salah batas usia." }
        ]
        q['opt_note'] = ["(35-sai ijou) benar (35歳以上)", "(35-sai) tidak ada kata ijou", "(25-sai) salah batas usia"]

    elif no == 49:
        q['analisis'] = "[MNN Bab 14/20 - Dokkai Prosedur Pendaftaran (~ni denwa o kakemasu)] Pada petunjuk pendaftaran tertulis instruksi: 「よやくの ほうほう：びょういんに でんわを かけて ください」 (Cara reservasi: tolong telepon ke rumah sakit). Maka langkah pemesanan jadwalnya adalah menelepon pihak rumah sakit (病院に電話 をかけます)."
        q['opt_detail'] = [
            { "kana": "せんせいにしつもんします", "rom": "sensei ni shitsumon shimasu", "arti": "bertanya kepada dokter", "alasan": "Bukan cara pendaftaran. Bertanya dilakukan saat pemeriksaan berjalan." },
            { "kana": "うけつけにいきます", "rom": "uketsuke ni ikimasu", "arti": "datang langsung ke resepsionis", "alasan": "Salah alur. Ketentuan meminta untuk menelepon terlebih dahulu." },
            { "kana": "病院に電話 をかけます", "rom": "byouin ni denwa o kakemasu", "arti": "menelepon rumah sakit", "alasan": "Tepat sekali. Sesuai instruksi: 「びょういんに でんわを かけて ください」." }
        ]
        q['opt_note'] = ["(sensei ni...) bertanya dokter", "(uketsuke ni...) datang langsung", "(byouin ni denwa...) menelepon RS (benar)"]

    elif no == 50:
        q['analisis'] = "[MNN Bab 5 - Dokkai Rekan Perjalanan (Partikel と)] Kalimat pembuka catatan wisata Kyoto: 「先週の 休みに、かぞくと いっしょに きょうとへ 行きました」 (Pada liburan minggu lalu, saya pergi ke Kyoto bersama dengan keluarga). Partikel と (to = bersama/dan) mendampingi kata かぞく (kazoku = keluarga)."
        q['opt_detail'] = [
            { "kana": "かぞく [ 家族 ]", "rom": "kazoku", "arti": "keluarga", "alasan": "Tepat sekali. Tertulis jelas: 「かぞくと いっしょに」 (bersama dengan keluarga)." },
            { "kana": "こいびと [ 恋人 ]", "rom": "koibito", "arti": "kekasih / pacar", "alasan": "Salah rekan perjalanan. Teks tidak menyebutkan bepergian bersama kekasih." },
            { "kana": "ともだち [ 友達 ]", "rom": "tomodachi", "arti": "teman", "alasan": "Salah rekan perjalanan. Teks tidak menyebutkan bepergian dengan teman." }
        ]
        q['opt_note'] = ["(kazoku) keluarga (benar)", "(koibito) pacar", "(tomodachi) teman"]

    elif no == 51:
        q['analisis'] = "[MNN Bab 6/16 - Dokkai Pembelian Oleh-oleh (Omiyage / Okashi)] Kalimat sebelum pulang menceritakan belanja oleh-oleh: 「かえる まえに、きょうとの ゆうめいな おかしを かいました」 (Sebelum pulang, saya membeli jajanan/camilan manis khas Kyoto yang terkenal). Maka barang yang dibeli adalah camilan/kue khas Kyoto (おかしのきょうと / 京都のお菓子)."
        q['opt_detail'] = [
            { "kana": "ふく [ 服 ]", "rom": "fuku", "arti": "baju / pakaian", "alasan": "Salah barang belanjaan. Penulis tidak membeli pakaian." },
            { "kana": "さくら [ 桜 ]", "rom": "sakura", "arti": "bunga sakura", "alasan": "Salah. Sakura dinikmati pemandangannya, bukan barang yang dibeli pulang." },
            { "kana": "おかしのきょうと [ 京都のお菓子 ]", "rom": "kyouto no okashi", "arti": "kue / camilan khas Kyoto", "alasan": "Tepat sekali. Sesuai kalimat: 「きょうとの ゆうめいな おかしを かいました」." }
        ]
        q['opt_note'] = ["(fuku) baju", "(sakura) sakura", "(okashi...) kue khas Kyoto (benar)"]

    elif no == 52:
        q['analisis'] = "[MNN Bab 4 - Dokkai Jadwal Keberangkatan Kereta (Shuppatsu Jikan)] Pada tabel jadwal kereta tertulis kolom stasiun awal: 「東京えき はつ（発）：07:30」 (Berangkat dari Stasiun Tokyo pukul 07:30). Kata 発 (hatsu) berarti waktu keberangkatan. Maka jam berangkat dari Tokyo adalah 07:30."
        q['opt_detail'] = [
            { "kana": "09:15", "rom": "ku-ji juu-go-fun", "arti": "pukul 09:15", "alasan": "Salah jam. 09:15 adalah jam tiba di stasiun tujuan (Yamakawa eki chaku)." },
            { "kana": "09:30", "rom": "ku-ji sanjuu-fun", "arti": "pukul 09:30", "alasan": "Salah jam. Waktu tersebut bukan jam keberangkatan dari Stasiun Tokyo." },
            { "kana": "07:30", "rom": "shichi-ji sanjuu-fun", "arti": "pukul 07:30", "alasan": "Tepat sekali. Tertulis pada kolom jadwal: 「東京えき 07:30 はつ」 (Berangkat dari Stasiun Tokyo jam 07:30)." }
        ]
        q['opt_note'] = ["(09:15) jam tiba", "(09:30) pengecoh waktu", "(07:30) jam berangkat (benar)"]

    elif no == 53:
        q['analisis'] = "[MNN Bab 4 - Dokkai Waktu Kedatangan di Stasiun Tujuan (Touchaku Jikan)] Pada baris Stasiun Yamakawa (山川えき) tertulis: 「山川えき ちゃく（着）：09:15」 (Tiba di Stasiun Yamakawa pukul 09:15). Kata 着 (chaku) berarti waktu kedatangan / tiba. Maka kereta sampai di stasiun tujuan pada jam 09:15."
        q['opt_detail'] = [
            { "kana": "09:30", "rom": "ku-ji sanjuu-fun", "arti": "pukul 09:30", "alasan": "Pengecoh waktu setengah jam berikutnya." },
            { "kana": "09:15", "rom": "ku-ji juu-go-fun", "arti": "pukul 09:15", "alasan": "Tepat sekali. Tertulis jelas: 「山川えき 09:15 ちゃく」 (Tiba di Stasiun Yamakawa pukul 09:15)." },
            { "kana": "07:30", "rom": "shichi-ji sanjuu-fun", "arti": "pukul 07:30", "alasan": "Salah. 07:30 adalah waktu keberangkatan dari Stasiun Tokyo." }
        ]
        q['opt_note'] = ["(09:30) salah", "(09:15) jam tiba (benar)", "(07:30) jam berangkat"]

    elif no == 54:
        q['analisis'] = "[MNN Bab 6/26 - Dokkai Media Pembelajaran (~o Tsukaimasu)] Isi email siswa menceritakan rutinitas belajarnya: 「わたしは まいにち けいたいでんわ（スマホ）の アプリを つかって、にほんごを べんきょうして います」 (Saya setiap hari menggunakan aplikasi ponsel untuk belajar bahasa Jepang). Maka media yang dipakai adalah ponsel / HP (けいたいでんわをつかいます)."
        q['opt_detail'] = [
            { "kana": "けいたいでんわをつかいます", "rom": "keitai denwa o tsukaimasu", "arti": "menggunakan telepon genggam / ponsel", "alasan": "Tepat sekali. Sesuai pernyataan: 「けいたいでんわの アプリを つかって」 (menggunakan aplikasi ponsel)." },
            { "kana": "ほんをまいにちつかいます", "rom": "hon o mainichi tsukaimasu", "arti": "menggunakan buku setiap hari", "alasan": "Salah media. Siswa menjelaskan keunggulan ponsel dibandingkan buku teks biasa." },
            { "kana": "なにもつかいません", "rom": "nani mo tsukaimasen", "arti": "tidak menggunakan apa-apa", "alasan": "Salah pernyataan." }
        ]
        q['opt_note'] = ["(keitai denwa...) memakai ponsel (benar)", "(hon...) memakai buku", "(nani mo...) tidak pakai apa-apa"]

    elif no == 55:
        q['analisis'] = "[MNN Bab 12/26 - Dokkai Manfaat Metode Belajar (~yori Jissenteki)] Kalimat penutup email menjelaskan manfaat metode tersebut: 「アプリで 音声を 聞きながら 練習できるので、日本語を 話すのが より じっせんてきです」 (Karena bisa berlatih sambil mendengarkan audio di aplikasi, berbicara bahasa Jepang menjadi lebih praktis/aplikatif). Kata じっせんてき (実践的 / jissenteki) berarti praktis dan siap diterapkan dalam situasi nyata."
        q['opt_detail'] = [
            { "kana": "日本語を話すのがよりじっせんてきです", "rom": "nihongo o hanasu no ga yori jissenteki desu", "arti": "berbicara bahasa Jepang menjadi lebih praktis / aplikatif", "alasan": "Tepat sekali. Sesuai kesimpulan manfaat di akhir email siswa." },
            { "kana": "じょうずにいいえない", "rom": "jouzu ni ienai", "arti": "tidak bisa mengucapkan dengan mahir", "alasan": "Salah makna. Justru metode ini membantu melatih kelancaran bicara." },
            { "kana": "へたになります", "rom": "heta ni narimasu", "arti": "menjadi payah / tidak mahir", "alasan": "Salah makna dan bertolak belakang dengan fungsi belajar." }
        ]
        q['opt_note'] = ["(nihongo o hanasu...) lebih praktis (benar)", "(jouzu ni ienai) tidak bisa mahir", "(heta ni narimasu) jadi payah"]

with open(HARE3_PATH, 'w', encoding='utf-8') as f:
    json.dump(quiz, f, ensure_ascii=False, indent=2)

print('SUCCESS: Enriched public/quizzes/hare3-quiz/quiz-data.json with high-detail Orimasu 2 standard!')

