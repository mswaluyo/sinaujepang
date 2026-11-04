import json
import re

def clean_and_enrich():
    # 1. Clean hare2-quiz [cite: X]
    with open('public/quizzes/hare2-quiz/quiz-data.json', 'r', encoding='utf-8') as f:
        h2 = json.load(f)
    for q in h2:
        if 'analisis' in q and q['analisis']:
            q['analisis'] = re.sub(r'\[cite:\s*\d+\]', '', q['analisis']).strip()
        if 'opt_detail' in q and q['opt_detail']:
            for opt in q['opt_detail']:
                if 'alasan' in opt and opt['alasan']:
                    opt['alasan'] = re.sub(r'\[cite:\s*\d+\]', '', opt['alasan']).strip()
    with open('public/quizzes/hare2-quiz/quiz-data.json', 'w', encoding='utf-8') as f:
        json.dump(h2, f, ensure_ascii=False, indent=2)
    print("Cleaned hare2-quiz cite tags!")

    # 2. Refine hare-quiz
    with open('public/quizzes/hare-quiz/quiz-data.json', 'r', encoding='utf-8') as f:
        h1 = json.load(f)
    if len(h1) >= 44 and h1[43].get('opt_detail'):
        for opt in h1[43]['opt_detail']:
            if opt.get('alasan') == 'Tidak disebut.':
                opt['alasan'] = 'Pilihan ini tidak disebutkan atau tidak sesuai dengan instruksi/isi audio percakapan Choukai.'
    if len(h1) >= 46 and h1[45].get('opt_detail'):
        for opt in h1[45]['opt_detail']:
            if '235' in opt.get('alasan', ''):
                opt['alasan'] = 'Nomor 235 adalah urutan angka terbalik dan keliru, tidak sesuai dengan nomor tiket 325 yang diucapkan di audio.'
    with open('public/quizzes/hare-quiz/quiz-data.json', 'w', encoding='utf-8') as f:
        json.dump(h1, f, ensure_ascii=False, indent=2)
    print("Refined hare-quiz Q44 & Q46!")

    # 3. Elevate hare3-quiz Q22 - Q36 & Q47
    with open('public/quizzes/hare3-quiz/quiz-data.json', 'r', encoding='utf-8') as f:
        h3 = json.load(f)

    # Q22 (index 21)
    h3[21]['analisis'] = "[MNN Bab 7 / Bab 31 - Bentuk Lampau & Percakapan] Pola `もう + bentuk lampau (〜ましたか)` menanyakan apakah sudah melakukan suatu tindakan ke tempat tujuan (planetarium). Respon `まだです` (belum) mengonfirmasi bahwa kata kerja lampau tanya yang tepat adalah **行きましたか (sudah pergi?)**."
    h3[21]['opt_detail'] = [
        {"kana": "かいものします", "rom": "kaimono shimasu", "arti": "berbelanja", "alasan": "買い物します adalah bentuk sekarang non-tanya, tidak cocok untuk merespons ajakan atau pertanyaan pengalaman yang dijawab まだです."},
        {"kana": "りょうりますか", "rom": "ryoorimasu ka", "arti": "apakah memasak?", "alasan": "料理ますか secara tata bahasa salah (seharusnya 料理しますか) dan tidak logis dipasangkan dengan tempat planetarium."},
        {"kana": "いきましたか", "rom": "ikimashita ka", "arti": "apakah sudah pergi?", "alasan": "行きましたか adalah bentuk lampau tanya yang tepat untuk pola もう〜ましたか (sudahkah pergi?), dijawab まだです."}
    ]

    # Q23 (index 22)
    h3[22]['analisis'] = "[MNN Bab 14 / Bab 16 - Koordinasi & Rencana] Jawaban B menyatakan tindakan yang akan dilakukannya (`私は飲み物を持ってきます`). Pertanyaan pembuka untuk koordinasi pembagian tugas bersama adalah **どうしますか (bagaimana rencana/tindakan kita?)**."
    h3[22]['opt_detail'] = [
        {"kana": "どうしたんですか", "rom": "dooshitan desu ka", "arti": "ada apa / apa yang terjadi?", "alasan": "どうしたんですか digunakan untuk menanyakan keadaan seseorang yang tampak sakit/kesulitan, bukan pembagian persiapan pesta."},
        {"kana": "どうですか", "rom": "doo desu ka", "arti": "bagaimana pendapatmu?", "alasan": "どうですか menanyakan kesan atau menawarkan sesuatu, bukan menanyakan tindakan apa yang harus dilakukan."},
        {"kana": "どうしますか", "rom": "doo shimasu ka", "arti": "mau bagaimana tindakannya?", "alasan": "どうしますか menanyakan koordinasi rencana tindakan bersama, langsung direspons dengan pembagian tugas 持ってきます."}
    ]

    # Q24 (index 23)
    h3[23]['analisis'] = "[MNN Bab 1 / Bab 26 - Percakapan Restoran & Frasa Sopan] Untuk memanggil perhatian pelayan di restoran sebelum menyampaikan pesanan (`注文したいんです`), ungkapan yang lazim dan tepat digunakan adalah **すみません (Sumimasen = Permisi)**."
    h3[23]['opt_detail'] = [
        {"kana": "どうぞ", "rom": "doozo", "arti": "silakan", "alasan": "どうぞ digunakan saat mempersilakan orang lain melakukan sesuatu, bukan untuk memanggil pelayan."},
        {"kana": "おだいじに", "rom": "odaiji ni", "arti": "semoga lekas sembuh", "alasan": "お大事に diucapkan kepada orang yang sedang sakit, sama sekali tidak relevan di konteks restoran."},
        {"kana": "すみません", "rom": "sumimasen", "arti": "permisi / maaf", "alasan": "すみません adalah kata standar untuk memanggil perhatian pelayan saat ingin memesan makanan."}
    ]

    # Q25 (index 24)
    h3[24]['analisis'] = "[MNN Bab 32 - Saran & Keterangan Derajat] Frasa **できるだけ早く (dekiru dake hayaku)** berarti 'sebisa mungkin secepat mungkin / seawal mungkin'. Kalimat menyarankan `早く行ったほうがいいです` karena kondisi tempat wisata sangat ramai (`すごくこみますから`)."
    h3[25-1]['opt_detail'] = [
        {"kana": "できれば", "rom": "dekireba", "arti": "jika memungkinkan", "alasan": "できれば bermakna 'kalau bisa', kurang tepat dipasangkan langsung membentuk frasa keterangan できるだけ早く."},
        {"kana": "かならず", "rom": "kanarazu", "arti": "pasti / selalu", "alasan": "かならず menyatakan kepastian mutlak (100%), kurang pas dengan nuansa anjuran kondisional tempat ramai."},
        {"kana": "できるだけ", "rom": "dekiru dake", "arti": "sebisa mungkin", "alasan": "できるだけ (sebisanya) berkolokasi alami dengan 早く (secepat/seawal mungkin) memberikan saran pencegahan antrean."}
    ]

    # Q26 (index 25)
    h3[25]['analisis'] = "[MNN Bab 8 - Kata Sifat-Na Bentuk Negatif] Kata sifat-na `好き (suki)` memerlukan bentuk penyangkalan ketika jawaban diawali kata `いいえ (tidak)`. Bentuk negatif informal/kasual yang tepat adalah **すきじゃない (tidak suka)**."
    h3[25]['opt_detail'] = [
        {"kana": "すきじゃない", "rom": "suki janai", "arti": "tidak suka", "alasan": "すきじゃない adalah bentuk negatif yang tepat untuk merespons penyangkalan いいえ terhadap pertanyaan ケーキは好きですか."},
        {"kana": "すきです", "rom": "suki desu", "arti": "suka", "alasan": "すきです adalah bentuk afirmatif (positif), kontradiktif dengan awalan jawaban いいえ."},
        {"kana": "とてもすき", "rom": "totemo suki", "arti": "sangat suka", "alasan": "とてもすき bermakna sangat suka (positif kuat), bertolak belakang dengan kata いいえ."}
    ]

    # Q27 (index 26)
    h3[26]['analisis'] = "[MNN Bab 5 - Partikel Perpindahan & Negatif Total] Kalimat kedua menyatakan `家でゆっくりします` (bersantai di rumah). Pola penyangkalan total ke mana pun adalah `どこへも + bentuk negatif`. Kata kerja perpindahan yang tepat adalah **でかけません (tidak bepergian keluar)**."
    h3[26]['opt_detail'] = [
        {"kana": "いません", "rom": "imasen", "arti": "tidak ada (makhluk hidup)", "alasan": "いません adalah keberadaan makhluk hidup, bukan kata kerja gerak/aktivitas untuk partikel perpindahan へ."},
        {"kana": "でかけません", "rom": "dekakemasen", "arti": "tidak bepergian keluar", "alasan": "どこへも出かけません tepat menyatakan tidak pergi ke mana-mana karena ingin bersantai di rumah."},
        {"kana": "いきます", "rom": "ikimasu", "arti": "pergi (positif)", "alasan": "いきます adalah bentuk positif, bertentangan dengan partikel penyangkalan total どこへも dan penjelasan 家でゆっくりします."}
    ]

    # Q28 (index 27)
    h3[27]['analisis'] = "[MNN Bab 19 / Bab 41 - Frasa Idiomatis Merawat/Menjaga] Kalimat menyatakan foto tersebut adalah kenangan indah (`おもいでのひ`). Frasa standar bahasa Jepang untuk menjaga/merawat kenangan dengan baik selamanya adalah `ずっと` + **たいせつにします (menjaganya berharga)**."
    h3[27]['opt_detail'] = [
        {"kana": "たいせつにします", "rom": "taisetsu ni shimasu", "arti": "menjaga baik-baik / merawat berharga", "alasan": "ずっと大切にします bermakna akan selalu merawat dan menyimpan kenangan indah ini dengan baik."},
        {"kana": "かいます", "rom": "kaimasu", "arti": "membeli", "alasan": "かいます (membeli) tidak masuk akal karena foto kenangan pribadi tersebut sudah dimiliki."},
        {"kana": "わすれます", "rom": "wasuremasu", "arti": "melupakan", "alasan": "わすれます (melupakan) bertolak belakang dengan nilai foto yang disebut sebagai おもいで (kenangan)."}
    ]

    # Q29 (index 28)
    h3[28]['analisis'] = "[MNN Bab 36 - Pola Harapan & Doa 〜ように] Pola `〜ように (お祈りします)` menyatakan doa atau harapan agar suatu kondisi terwujud. Subjek doa adalah hal abstrak benda mati `良いこと` (hal-hal baik), sehingga kata kerja keberadaan yang tepat adalah `ある` menjadi **あるように (semoga ada)**."
    h3[28]['opt_detail'] = [
        {"kana": "あるように", "rom": "aru yoo ni", "arti": "semoga ada / terjadi", "alasan": "あるように tepat berpasangan dengan subjek benda abstrak 良いこと (hal-hal baik) dan kata kerja keberadaan ある."},
        {"kana": "いるように", "rom": "iru yoo ni", "arti": "semoga ada (makhluk bernyawa)", "alasan": "いる hanya digunakan untuk makhluk bernyawa (orang/hewan), salah jika digunakan untuk hal abstrak こと."},
        {"kana": "おもうように", "rom": "omou yoo ni", "arti": "seperti yang dipikirkan", "alasan": "おもうように berarti 'sesuai yang dipikirkan', tidak cocok dengan struktur gramatikal doa 良いことが〜."}
    ]

    # Q30 (index 29)
    h3[29]['analisis'] = "[MNN Bab 8 / Bab 12 - Kata Sifat Pujian Penampilan] Kata sifat yang paling tepat dan natural untuk memuji busana jaket keren adalah **かっこいい (kakkoii = keren/modis)**. Pilihan きれい biasanya untuk kebersihan atau kecantikan wajah/pemandangan."
    h3[29]['opt_detail'] = [
        {"kana": "きれい", "rom": "kirei", "arti": "cantik / bersih", "alasan": "きれい kurang lazim dipakai untuk memuji gaya jaket pria/kasual dibanding kata かっこいい."},
        {"kana": "かっこいい", "rom": "kakkoii", "arti": "keren / bergaya", "alasan": "かっこいい adalah kata sifat paling umum dan alami untuk memuji model jaket yang modis."},
        {"kana": "まずい", "rom": "mazui", "arti": "tidak enak / gawat", "alasan": "まずい mengacu pada rasa makanan yang tidak enak atau situasi gawat, salah konteks."}
    ]

    # Q31 (index 30)
    h3[30]['analisis'] = "[MNN Bab 13 / Bab 26 - Percakapan Sehari-hari Menitip Pesanan] Ketika teman menawarkan diri untuk memesankan makanan ke pelayan (`じゃあ、注文するね`), respons yang sopan dan lazim untuk mengiyakan dan menitip adalah **お願いします (Onegaishimasu = Minta tolong ya / Tolong ya)**."
    h3[30]['opt_detail'] = [
        {"kana": "ありがとう", "rom": "arigatoo", "arti": "terima kasih", "alasan": "ありがとう kurang lengkap sebagai serah terima permintaan pesanan sebelum pesanan tersebut diproses."},
        {"kana": "おねがいします", "rom": "onegaishimasu", "arti": "minta tolong ya", "alasan": "お願いします adalah respons standar paling alami ketika seseorang menawarkan bantuan memesankan makanan."},
        {"kana": "どうぞ", "rom": "doozo", "arti": "silakan", "alasan": "どうぞ digunakan saat menawarkan sesuatu kepada lawan bicara, bukan saat menitipkan pesanan."}
    ]

    # Q32 (index 31)
    h3[31]['analisis'] = "[MNN Bab 7 / Bab 41 - Menerima Hadiah & Tanggapan Janji] Menjawab pesan dari pemberi kado `大事にしてね` (rawat baik-baik ya), respons sopan yang menegaskan bahwa penerima akan menjaga hadiah tersebut adalah **はい、大切にします (Hai, taisetsu ni shimasu)**."
    h3[31]['opt_detail'] = [
        {"kana": "まあまあですね", "rom": "maamaa desu ne", "arti": "lumayan / biasa saja", "alasan": "まあまあですね sangat tidak sopan karena meremehkan hadiah pemberian orang lain."},
        {"kana": "ありがとう", "rom": "arigatoo", "arti": "terima kasih", "alasan": "ありがとう sudah diucapkan di awal, respons terhadap permintaan khusus 大事にしてね memerlukan konfirmasi kesanggupan."},
        {"kana": "はい、たいせつにします", "rom": "hai, taisetsu ni shimasu", "arti": "ya, akan saya rawat baik-baik", "alasan": "はい、大切にします menyepakati permintaan 大事にしてね dengan penuh rasa hormat dan janji merawat hadiah."}
    ]

    # Q33 (index 32)
    h3[32]['analisis'] = "[MNN Bab 17 / Bab 24 - Aisatsu Bertamu ke Rumah Orang] Saat dipersilakan melangkah naik ke dalam rumah orang Jepang (`どうぞ、上がってください`), ucapan salam sopan wajib yang diucapkan tamu saat melangkah masuk adalah **おじゃまします (Ojamashimasu = Permisi mengganggu)**."
    h3[32]['opt_detail'] = [
        {"kana": "おじゃまします", "rom": "ojamashimasu", "arti": "permisi mengganggu", "alasan": "おじゃまします adalah salam tata krama wajib saat memasuki rumah atau ruangan orang lain atas undangan pemilik rumah."},
        {"kana": "おねがいします", "rom": "onegaishimasu", "arti": "mohon bantuannya", "alasan": "おねがいします digunakan untuk meminta tolong atau memulai kerja sama, bukan salam masuk rumah."},
        {"kana": "ごめんください", "rom": "gomen kudasai", "arti": "permisi (di depan pintu)", "alasan": "ごめんください diucapkan di luar pintu/genkan saat baru tiba untuk memanggil penghuni, bukan saat dipersilakan masuk."}
    ]

    # Q34 (index 33)
    h3[33]['analisis'] = "[MNN Bab 5 / Bab 29 - Partikel Pilihan & Negatif Menyangkal Rencana] Penanya menanyakan rencana bulan depan (`来月どこかへ行く予定ですか`). Lawan bicara beralasan sibuk kerja (`仕事が忙しくて`), sehingga predikatnya menyangkal pergi ke mana pun yaitu **どこにもいきません (tidak pergi ke mana pun)**."
    h3[33]['opt_detail'] = [
        {"kana": "どこにもいきません", "rom": "dokonimo ikimasen", "arti": "tidak pergi ke mana pun", "alasan": "どこにもいきません tepat menyatakan penafian total rencana masa depan akibat kesibukan kerja saat ini."},
        {"kana": "どこへもいきまんでした", "rom": "dokoemo ikimandeshita", "arti": "salah tata bahasa", "alasan": "どこへもいきまんでした memiliki kesalahan ejaan (いきまんでした bukan い spectral) serta bentuk lampau, padahal konteks rencana bulan depan."},
        {"kana": "どこでもいきません", "rom": "doko demo ikimasen", "arti": "ke mana saja tidak pergi", "alasan": "Partikel でも tidak lazim dipakai dengan kata kerja negatif いきません dalam pola penyangkalan tempat."}
    ]

    # Q35 (index 34)
    h3[34]['analisis'] = "[MNN Bab 46 / Fukushi Tingkat Keberhasilan] Kata keterangan **やっと (yatto)** berarti 'akhirnya', digunakan saat suatu keberhasilan tercapai setelah perjuangan berat atau penantian panjang. Sangat pas berpasangan dengan `テストに合格できました`."
    h3[34]['opt_detail'] = [
        {"kana": "やっと", "rom": "yatto", "arti": "akhirnya (setelah perjuangan)", "alasan": "やっと mengekspresikan rasa lega atas kelulusan ujian yang telah lama dipersiapkan dan dinantikan."},
        {"kana": "そろそろ", "rom": "sorosoro", "arti": "sebentar lagi / perlahan", "alasan": "そろそろ digunakan untuk mengajak atau menandakan waktu pamit/mulai, bukan hasil kelulusan."},
        {"kana": "なかなか", "rom": "nakanaka", "arti": "cukup / tak kunjung (negatif)", "alasan": "なかなか jika diikuti bentuk positif bermakna 'cukup mengesankan', bukan penanda pencapaian setelah usaha keras."}
    ]

    # Q36 (index 35)
    h3[35]['analisis'] = "[MNN Bab 26 / Bab 50 - Keigo & Permintaan Maaf Sopan] Pembicara menyadari dirinya terlambat (`遅くなって`), sehingga harus meminta maaf secara sopan dan formal. Ungkapan meminta maaf yang tepat adalah **もうしわけありません (Moushiwake arimasen)**, yang dibalas dengan `いいえ、大丈夫です`."
    h3[35]['opt_detail'] = [
        {"kana": "もうしわけありません", "rom": "mooshiwake arimasen", "arti": "mohon maaf sebesar-besarnya", "alasan": "申し訳ありません adalah ungkapan permohonan maaf resmi yang paling tepat atas keterlambatan."},
        {"kana": "しょうしょうおまちください", "rom": "shooshoo omachi kudasai", "arti": "mohon tunggu sebentar", "alasan": "少々お待ちください digunakan untuk meminta lawan bicara menunggu, tidak cocok saat sudah terlambat hadir."},
        {"kana": "べつにかまいません", "rom": "betsu ni kamaimasen", "arti": "tidak masalah kok", "alasan": "別にかまいません adalah respons pihak yang memaafkan/tidak keberatan, bukan ungkapan dari orang yang berbuat salah."}
    ]

    # Q47 (index 46)
    if len(h3) >= 47 and h3[46].get('opt_detail'):
        for opt in h3[46]['opt_detail']:
            if opt.get('alasan') == 'Salah bulan.':
                opt['alasan'] = 'Pilihan ini salah karena menyebutkan bulan yang tidak sesuai dengan jadwal yang tertulis di teks pengumuman Dokkai.'

    with open('public/quizzes/hare3-quiz/quiz-data.json', 'w', encoding='utf-8') as f:
        json.dump(h3, f, ensure_ascii=False, indent=2)
    print("Elevated hare3-quiz Q22-Q36 and Q47!")

if __name__ == '__main__':
    clean_and_enrich()
