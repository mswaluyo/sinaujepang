const fs = require('fs');

const path = 'public/shimemasu2-quiz/quiz-data.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// 1. Lengkapi gambar pada soal Hyougen yang sebelumnya hilang / tidak terisi
// Soal No. 17 (Hyougen #4) -> h4.jpg (Taman kota yang indah)
const q17 = data.find(q => q.no === 17);
if (q17) {
  q17.img = 'assets/h4.jpg';
}

// Soal No. 19 (Hyougen #6) -> h6.jpg (Kantor pos)
const q19 = data.find(q => q.no === 19);
if (q19) {
  q19.img = 'assets/h6.jpg';
}

// Soal No. 27 (Hyougen #14) -> h14.jpg (Permintaan maaf)
const q27 = data.find(q => q.no === 27);
if (q27) {
  q27.img = 'assets/h14.jpg';
}

// 2. Perbaiki Soal No. 21 (Hyougen #8): Bangunan kuil/sejarah dibangun oleh arsitek terkenal
const q21 = data.find(q => q.no === 21);
if (q21) {
  q21.title = "有名な 建築家に よって___そうです";
  q21.subTitle = "(Kabarnya [dibangun] oleh arsitek terkenal...)";
  q21.trans = "Kabarnya (gedung ini) dibangun oleh arsitek terkenal.";
  q21.trans_rom = "Yuumei na kenchikuka ni yotte taterareta sou desu.";
  q21.analisis = "[MNN Bab 37 - Kalimat Pasif (Ukemi) ~ni yotte & Desas-desus ~sou desu] Gambar menunjukkan bangunan bersejarah. Pada konstruksi kalimat pasif dengan penanda pihak perancang/pembuat (によって), kata kerja yang tepat untuk bangunan adalah 建てられた (taterareta - dibangun, bentuk pasif dari 建てる). Pola: [Pencipta] に よって 建てられた そうです (Kabarnya dibangun oleh arsitek terkenal).";
  q21.opt_detail[2].alasan = "Tepat sekali. Bentuk pasif (ukemi) dari 建てる (tateru = membangun) adalah 建てられた (taterareta = dibangun), berpasangan pasif dengan penanda agen arsitek (によって).";
}

// 3. Perbaiki Soal No. 22 (Hyougen #9): Partikel kemampuan menulis kanji
const q22 = data.find(q => q.no === 22);
if (q22) {
  q22.title = "漢字が 500字 _____";
  q22.subTitle = "(Sekarang sudah [menjadi bisa menulis] 500 huruf kanji.)";
  q22.trans = "Sekarang sudah menjadi bisa menulis 500 huruf kanji.";
  q22.trans_rom = "Kanji ga gohyaku-ji kakeru you ni narimashita.";
  q22.analisis = "[MNN Bab 36 - Perubahan Kemampuan (~you ni narimashita)] Menyatakan perkembangan kemampuan yang baru tercapai menggunakan kata kerja bentuk potensial + ように なりました. Potensial dari 書く (kaku - menulis) adalah 書ける (kakeru - bisa menulis) yang berpasangan dengan objek berpartikel が: 漢字が書けるように なりました.";
  q22.opt_detail[2].alasan = "Tepat sekali. Kata kerja bentuk potensial 書ける (bisa menulis) bergabung dengan ように なりました untuk menyatakan perubahan kemampuan yang sebelumnya belum bisa menjadi bisa.";
}

// 4. Perbaiki Soal No. 24 (Hyougen #11): Typo partikel Misato-san
const q24 = data.find(q => q.no === 24);
if (q24) {
  q24.title = `A : ミサトさんは 元気が ありませんね。
B : 顔の色が 赤くなりました。
A : ______`;
  q24.subTitle = "(A : Misato-san kelihatannya tidak enak badan ya.\nB : Warna wajahnya memerah.\nA : [Saya agak khawatir padanya].)";
  q24.trans = `A : Misato-san kelihatannya tidak enak badan ya.
B : Warna wajahnya memerah karena demam.
A : Saya agak khawatir padanya.`;
  q24.trans_rom = "A: Misato-san wa genki ga arimasen ne. B: Kao no iro ga akaku narimashita. A: Chotto shinpai desu.";
  q24.analisis = "[MNN Bab 32 - Ungkapan Kepedulian & Simpati Kondisi Kesehatan] Ketika melihat rekan yang tampak sakit (元気がありません) dan wajahnya memerah (顔の色が赤くなりました), ungkapan empati yang tepat untuk diucapkan adalah ちょっと心配です (chotto shinpai desu - 'Saya agak khawatir padanya').";
}

// 5. Perbaiki Soal No. 25 (Hyougen #12): Dialog menawarkan pisang (どうぞ)
const q25 = data.find(q => q.no === 25);
if (q25) {
  q25.title = `A : ____を どうぞ。
B : はい、どうも ありがとうございます。`;
  q25.subTitle = "(A : Silakan nikmati [pisang] ini.\nB : Ya, terima kasih banyak.)";
  q25.trans = `A : Silakan nikmati buah pisang ini.
B : Ya, terima kasih banyak.`;
  q25.trans_rom = "A: Banana o douzo. B: Hai, doumo arigatou gozaimasu.";
  q25.analisis = "[MNN Bab 3 - Memberi / Menawarkan Sesuatu (~o douzo)] Gambar memperlihatkan buah pisang yang sedang ditawarkan kepada lawan bicara. Kata benda untuk pisang adalah バナナ (banana), dan ungkapan menawarkan yang berpasangan dengan balasan terima kasih (ありがとうございます) adalah 'バナナをどうぞ' (Silakan pisangnya).";
}

// 6. Perbaiki Soal No. 27 (Hyougen #14): Typo ejaan gomen nasai dan kelengkapan dialog
if (q27) {
  q27.title = `A : ______
B : いいえ、大丈夫ですよ。`;
  q27.subTitle = "(A : [Maafkan saya] — B : Tidak apa-apa.)";
  q27.trans = `A : Maafkan saya.
B : Tidak apa-apa kok.`;
  q27.trans_rom = "A: Gomennasai. B: Iie, daijoubu desu yo.";
  // Koreksi ejaan pilihan B dari 'ごめなさい' menjadi 'ごめんなさい'
  q27.options[1].text = "ごめんなさい";
  q27.opt_detail[1].kana = "ごめんなさい";
  q27.opt_detail[1].rom = "gomennasai";
  q27.opt_detail[1].arti = "Maafkan saya (gomennasai)";
  q27.opt_detail[1].alasan = "Tepat sekali. Permintaan maaf tulus yang kasual 'ごめんなさい' (maafkan saya) berpasangan dengan tanggapan penenang santai: 'いいえ、大丈夫ですよ' (tidak apa-apa / santai saja).";
  q27.kunci_id = "ごめんなさい";
  q27.opt_note[1] = "(Maafkan saya (gomennasai))";
}

// 7. Perbaiki Soal No. 28 (Hyougen #15): Typo pembersih debu 'そうじきはいですよ'
const q28 = data.find(q => q.no === 28);
if (q28) {
  q28.title = `A : この 掃除機は いいですよ。便利な機能がたくさんあります。
B : ______`;
  q28.subTitle = "(A : Mesin penyedot debu ini bagus lho, fiturnya ada banyak sekali.\nB : [Bisa jadi begitu ya].)";
  q28.trans = `A : Mesin penyedot debu ini bagus lho, ada banyak fungsi yang praktis.
B : Bisa jadi demikian ya.`;
  q28.trans_rom = "A: Kono soujiki wa ii desu yo. Benri na kinou ga takusan arimasu. B: Sou kamo shiremasen ne.";
  q28.analisis = "[MNN Bab 38 - Merespons Rekomendasi & Persetujuan (~kamo shiremasen)] Gambar menunjukkan mesin penyedot debu (掃除機). Merespons rekomendasi orang lain mengenai fungsi penyedot debu: ungkapan diplomatis yang sopan untuk menyetujui kemungkinan pendapat lawan bicara adalah そうかもしれませんね (sou kamo shiremasen ne - 'Bisa jadi begitu ya / mungkin benar').";
}

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log('Berhasil memperbaiki naskah, tata bahasa, dan sinkronisasi gambar sesi Hyougen di quiz-data.json');

