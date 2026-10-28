import fs from 'fs';
import path from 'path';

// Daftar Kanji Wajib & Sering Muncul di JFT-Basic A2 (Irodori/Can-do)
// yang belum ada di kumpulan 241 kotoba LOLOSYUK
const JFT_CORE_KANJI = [
  // Fasilitas & Tempat Umum
  { kanji: "病院", kana: "びょういん", rom: "byouin", arti: "rumah sakit", kategori_jft: "Tempat & Fasilitas" },
  { kanji: "銀行", kana: "ぎんこう", rom: "ginkou", arti: "bank", kategori_jft: "Tempat & Fasilitas" },
  { kanji: "郵便局", kana: "ゆうびんきょく", rom: "yuubinkyoku", arti: "kantor pos", kategori_jft: "Tempat & Fasilitas" },
  { kanji: "交番", kana: "こうばん", rom: "kouban", arti: "pos polisi", kategori_jft: "Tempat & Fasilitas" },
  { kanji: "市役所", kana: "しやくしょ", rom: "shiyakusho", arti: "kantor wali kota / balai kota", kategori_jft: "Tempat & Fasilitas" },
  { kanji: "会社", kana: "かいしゃ", rom: "kaisha", arti: "perusahaan / kantor", kategori_jft: "Tempat & Fasilitas" },
  { kanji: "部屋", kana: "へや", rom: "heya", arti: "kamar / ruangan", kategori_jft: "Tempat & Fasilitas" },

  // Rambu, Arah & Penunjuk Tempat
  { kanji: "入口", kana: "いりぐち", rom: "iriguchi", arti: "pintu masuk", kategori_jft: "Rambu & Arah" },
  { kanji: "出口", kana: "でぐち", rom: "deguchi", arti: "pintu keluar", kategori_jft: "Rambu & Arah" },
  { kanji: "非常口", kana: "ひじょうぐち", rom: "hijouguchi", arti: "pintu darurat", kategori_jft: "Rambu & Arah" },
  { kanji: "受付", kana: "うけつけ", rom: "uketsuke", arti: "resepsionis / meja informasi", kategori_jft: "Rambu & Arah" },
  { kanji: "右", kana: "みぎ", rom: "migi", arti: "kanan", kategori_jft: "Rambu & Arah" },
  { kanji: "左", kana: "ひだり", rom: "hidari", arti: "kiri", kategori_jft: "Rambu & Arah" },
  { kanji: "前", kana: "まえ", rom: "mae", arti: "depan / sebelum", kategori_jft: "Rambu & Arah" },
  { kanji: "後", kana: "うしろ", rom: "ushiro", arti: "belakang", kategori_jft: "Rambu & Arah" },
  { kanji: "北", kana: "きた", rom: "kita", arti: "utara", kategori_jft: "Rambu & Arah" },
  { kanji: "南", kana: "みなみ", rom: "minami", arti: "selatan", kategori_jft: "Rambu & Arah" },
  { kanji: "東", kana: "ひがし", rom: "higashi", arti: "timur", kategori_jft: "Rambu & Arah" },
  { kanji: "西", kana: "にし", rom: "nishi", arti: "barat", kategori_jft: "Rambu & Arah" },
  { kanji: "禁煙", kana: "きんえん", rom: "kin'en", arti: "dilarang merokok", kategori_jft: "Rambu & Arah" },
  { kanji: "注意", kana: "ちゅうい", rom: "chuui", arti: "perhatian / awas", kategori_jft: "Rambu & Arah" },

  // Orang, Relasi & Pekerjaan
  { kanji: "友達", kana: "ともだち", rom: "tomodachi", arti: "teman", kategori_jft: "Orang & Relasi" },
  { kanji: "子供", kana: "こども", rom: "kodomo", arti: "anak-anak", kategori_jft: "Orang & Relasi" },
  { kanji: "人", kana: "ひと", rom: "hito", arti: "orang", kategori_jft: "Orang & Relasi" },
  { kanji: "女の人", kana: "おんなのひと", rom: "onna no hito", arti: "wanita", kategori_jft: "Orang & Relasi" },
  { kanji: "男の人", kana: "おとこのひと", rom: "otoko no hito", arti: "pria", kategori_jft: "Orang & Relasi" },
  { kanji: "医者", kana: "いしゃ", rom: "isha", arti: "dokter", kategori_jft: "Orang & Relasi" },

  // Kata Kerja Esensial JFT
  { kanji: "行きます", kana: "いきます", rom: "ikimasu", arti: "pergi", kategori_jft: "Kata Kerja Esensial" },
  { kanji: "来ます", kana: "きます", rom: "kimasu", arti: "datang", kategori_jft: "Kata Kerja Esensial" },
  { kanji: "食べます", kana: "たべます", rom: "tabemasu", arti: "makan", kategori_jft: "Kata Kerja Esensial" },
  { kanji: "飲みます", kana: "のみます", rom: "nomimasu", arti: "minum", kategori_jft: "Kata Kerja Esensial" },
  { kanji: "買います", kana: "かいます", rom: "kaimasu", arti: "membeli", kategori_jft: "Kata Kerja Esensial" },
  { kanji: "寝ます", kana: "ねます", rom: "nemasu", arti: "tidur", kategori_jft: "Kata Kerja Esensial" },
  { kanji: "待ちます", kana: "まちます", rom: "machimasu", arti: "menunggu", kategori_jft: "Kata Kerja Esensial" },
  { kanji: "聞きます", kana: "ききます", rom: "kikimasu", arti: "mendengar / bertanya", kategori_jft: "Kata Kerja Esensial" },
  { kanji: "話します", kana: "はなします", rom: "hanashimasu", arti: "berbicara", kategori_jft: "Kata Kerja Esensial" },
  { kanji: "使います", kana: "つかいます", rom: "tsukaimasu", arti: "menggunakan", kategori_jft: "Kata Kerja Esensial" },
  { kanji: "立ちます", kana: "たちます", rom: "tachimasu", arti: "berdiri", kategori_jft: "Kata Kerja Esensial" },
  { kanji: "入ります", kana: "はいります", rom: "hairimasu", arti: "masuk", kategori_jft: "Kata Kerja Esensial" },
  { kanji: "出ます", kana: "でます", rom: "demasu", arti: "keluar", kategori_jft: "Kata Kerja Esensial" },
  { kanji: "電話します", kana: "でんわします", rom: "denwa shimasu", arti: "menelepon", kategori_jft: "Kata Kerja Esensial" },

  // Waktu & Kalender
  { kanji: "今日", kana: "きょう", rom: "kyou", arti: "hari ini", kategori_jft: "Waktu & Kalender" },
  { kanji: "明日", kana: "あした", rom: "ashita", arti: "besok", kategori_jft: "Waktu & Kalender" },
  { kanji: "昨日", kana: "きのう", rom: "kinou", arti: "kemarin", kategori_jft: "Waktu & Kalender" },
  { kanji: "毎日", kana: "まいにち", rom: "mainichi", arti: "setiap hari", kategori_jft: "Waktu & Kalender" },
  { kanji: "今週", kana: "こんしゅう", rom: "konshuu", arti: "minggu ini", kategori_jft: "Waktu & Kalender" },
  { kanji: "来週", kana: "らいしゅう", rom: "raishuu", arti: "minggu depan", kategori_jft: "Waktu & Kalender" },
  { kanji: "今月", kana: "こんげつ", rom: "kongetsu", arti: "bulan ini", kategori_jft: "Waktu & Kalender" },
  { kanji: "来月", kana: "らいげつ", rom: "raigetsu", arti: "bulan depan", kategori_jft: "Waktu & Kalender" },
  { kanji: "今年", kana: "ことし", rom: "kotoshi", arti: "tahun ini", kategori_jft: "Waktu & Kalender" },
  { kanji: "来年", kana: "らいねん", rom: "rainen", arti: "tahun depan", kategori_jft: "Waktu & Kalender" },
  { kanji: "月曜日", kana: "げつようび", rom: "getsuyoubi", arti: "Senin", kategori_jft: "Waktu & Kalender" },
  { kanji: "火曜日", kana: "かようび", rom: "kayoubi", arti: "Selasa", kategori_jft: "Waktu & Kalender" },
  { kanji: "水曜日", kana: "すいようび", rom: "suiyoubi", arti: "Rabu", kategori_jft: "Waktu & Kalender" },
  { kanji: "木曜日", kana: "もくようび", rom: "mokuyoubi", arti: "Kamis", kategori_jft: "Waktu & Kalender" },
  { kanji: "金曜日", kana: "きんようび", rom: "kin'youbi", arti: "Jumat", kategori_jft: "Waktu & Kalender" },
  { kanji: "土曜日", kana: "どようび", rom: "doyoubi", arti: "Sabtu", kategori_jft: "Waktu & Kalender" },
  { kanji: "日曜日", kana: "にちようび", rom: "nichiyoubi", arti: "Minggu", kategori_jft: "Waktu & Kalender" },

  // Makanan & Benda Esensial
  { kanji: "水", kana: "みず", rom: "mizu", arti: "air", kategori_jft: "Benda & Makanan" },
  { kanji: "お茶", kana: "おちゃ", rom: "ocha", arti: "teh hijau", kategori_jft: "Benda & Makanan" },
  { kanji: "ご飯", kana: "ごはん", rom: "gohan", arti: "nasi / makanan", kategori_jft: "Benda & Makanan" },
  { kanji: "魚", kana: "さかな", rom: "sakana", arti: "ikan", kategori_jft: "Benda & Makanan" },
  { kanji: "肉", kana: "にく", rom: "niku", arti: "daging", kategori_jft: "Benda & Makanan" },
  { kanji: "手紙", kana: "てがみ", rom: "tegami", arti: "surat", kategori_jft: "Benda & Makanan" },
  { kanji: "本", kana: "ほん", rom: "hon", arti: "buku", kategori_jft: "Benda & Makanan" },
  { kanji: "薬", kana: "くすり", rom: "kusuri", arti: "obat", kategori_jft: "Benda & Makanan" }
];

export function enrichWithJftCoreKanji() {
  const jsonPath = path.join('public', 'kotoba-lolosyuk.json');

  const existingList = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  // Beri keterangan untuk data asli LOLOSYUK yang sudah ada
  const updatedList = existingList.map(item => {
    return {
      ...item,
      keterangan: item.paket && item.paket.length > 0 ? "Soal Kuis LOLOSYUK" : "Kanji Wajib JFT-Basic A2"
    };
  });

  // Tambahkan Kanji Core JFT yang belum ada
  let addedCount = 0;
  JFT_CORE_KANJI.forEach(core => {
    const exists = updatedList.some(item => item.kanji === core.kanji || item.kana === core.kana);
    if (!exists) {
      updatedList.push({
        kanji: core.kanji,
        kana: core.kana,
        rom: core.rom,
        arti: core.arti,
        paket: ["jft-core-a2"],
        kategori_jft: core.kategori_jft,
        keterangan: "Kanji Wajib JFT-Basic A2 (Tambahan Esensial)"
      });
      addedCount++;
    }
  });

  // Urutkan berdasarkan abjad Kana
  updatedList.sort((a, b) => a.kana.localeCompare(b.kana, 'ja'));

  // Tulis kembali ke JSON
  fs.writeFileSync(jsonPath, JSON.stringify(updatedList, null, 2), 'utf8');

  console.log('=== PENGAYAAN KANJI WAJIB JFT-BASIC A2 BERHASIL ===');
  console.log(`Total Kotoba Sebelumnya : ${existingList.length}`);
  console.log(`Kanji Esensial Ditambahkan: ${addedCount}`);
  console.log(`Total Kotoba Sekarang   : ${updatedList.length}`);
}

enrichWithJftCoreKanji();
