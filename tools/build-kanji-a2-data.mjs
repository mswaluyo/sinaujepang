import fs from 'fs';
import path from 'path';

// Kamus Radikal & Jumlah Coretan Standar (Kangxi Radicals & Stroke Counts)
// untuk 273 Kanji JFT-Basic A2 yang ada di kotoba-lolosyuk.json
const KANJI_METADATA = {
  // 1-2 Coretan
  "一": { stroke: 1, radical: "一", radName: "ichi (satu)", arti: "satu", on: "イチ", kun: "ひと・つ" },
  "二": { stroke: 2, radical: "二", radName: "ni (dua)", arti: "dua", on: "ニ", kun: "ふた・つ" },
  "十": { stroke: 2, radical: "十", radName: "juu (sepuluh)", arti: "sepuluh", on: "ジュウ", kun: "とお" },
  "人": { stroke: 2, radical: "人", radName: "hito (orang)", arti: "orang", on: "ジン・ニン", kun: "ひと" },
  "入": { stroke: 2, radical: "入", radName: "hairu (masuk)", arti: "masuk", on: "ニュウ", kun: "はい・る / い・れる" },
  "八": { stroke: 2, radical: "八", radName: "hachi (delapan)", arti: "delapan", on: "ハチ", kun: "や・っつ" },
  "七": { stroke: 2, radical: "一", radName: "ichi (satu)", arti: "tujuh", on: "シチ", kun: "なな・つ" },
  "九": { stroke: 2, radical: "乙", radName: "otsu (kedua)", arti: "sembilan", on: "キュウ・ク", kun: "ここの・つ" },
  "力": { stroke: 2, radical: "力", radName: "chikara (kekuatan)", arti: "kekuatan / tenaga", on: "リョク・リキ", kun: "ちから" },

  // 3 Coretan
  "三": { stroke: 3, radical: "一", radName: "ichi (satu)", arti: "tiga", on: "サン", kun: "み・っつ" },
  "上": { stroke: 3, radical: "一", radName: "ichi (satu)", arti: "atas / naik", on: "ジョウ", kun: "うえ / あ・がる" },
  "下": { stroke: 3, radical: "一", radName: "ichi (satu)", arti: "bawah / turun", on: "カ・ゲ", kun: "した / さ・がる" },
  "大": { stroke: 3, radical: "大", radName: "dai (besar)", arti: "besar", on: "ダイ・タイ", kun: "おお・きい" },
  "小": { stroke: 3, radical: "小", radName: "shou (kecil)", arti: "kecil", on: "ショウ", kun: "ちい・さい" },
  "口": { stroke: 3, radical: "口", radName: "kuchi (mulut)", arti: "mulut / pintu", on: "コウ・ク", kun: "くち" },
  "山": { stroke: 3, radical: "山", radName: "yama (gunung)", arti: "gunung", on: "サン", kun: "やま" },
  "川": { stroke: 3, radical: "川", radName: "kawa (sungai)", arti: "sungai", on: "セン", kun: "かわ" },
  "女": { stroke: 3, radical: "女", radName: "onna (wanita)", arti: "wanita", on: "ジョ", kun: "おんな" },
  "子": { stroke: 3, radical: "子", radName: "ko (anak)", arti: "anak", on: "シ・ス", kun: "こ" },
  "丸": { stroke: 3, radical: "丶", radName: "ten (titik)", arti: "bulat / lingkaran", on: "ガン", kun: "まる・い" },
  "土": { stroke: 3, radical: "土", radName: "tsuchi (tanah)", arti: "tanah / hari sabtu", on: "ド・ト", kun: "つち" },
  "夕": { stroke: 3, radical: "夕", radName: "yuu (sore)", arti: "sore / petang", on: "セキ", kun: "ゆう" },
  "千": { stroke: 3, radical: "十", radName: "juu (sepuluh)", arti: "seribu", on: "セン", kun: "ち" },
  "万": { stroke: 3, radical: "一", radName: "ichi (satu)", arti: "sepuluh ribu", on: "マン・バン", kun: "よろず" },

  // 4 Coretan
  "中": { stroke: 4, radical: "丨", radName: "bou (garis vertikal)", arti: "tengah / dalam", on: "チュウ", kun: "なか" },
  "日": { stroke: 4, radical: "日", radName: "hi (matahari)", arti: "hari / matahari", on: "ニチ・ジツ", kun: "ひ・か" },
  "月": { stroke: 4, radical: "月", radName: "tsuki (bulan)", arti: "bulan", on: "ゲツ・ガツ", kun: "つき" },
  "木": { stroke: 4, radical: "木", radName: "ki (pohon)", arti: "pohon / hari kamis", on: "ボク・モク", kun: "き" },
  "水": { stroke: 4, radical: "水", radName: "mizu (air)", arti: "air / hari rabu", on: "スイ", kun: "みず" },
  "火": { stroke: 4, radical: "火", radName: "hi (api)", arti: "api / hari selasa", on: "カ", kun: "ひ" },
  "手": { stroke: 4, radical: "手", radName: "te (tangan)", arti: "tangan", on: "シュ", kun: "て" },
  "父": { stroke: 4, radical: "父", radName: "chichi (ayah)", arti: "ayah", on: "フ", kun: "ちち" },
  "友": { stroke: 4, radical: "又", radName: "mata (lagi)", arti: "teman", on: "ユウ", kun: "とも" },
  "文": { stroke: 4, radical: "文", radName: "bun (tulisan)", arti: "kalimat / teks", on: "ブン・モン", kun: "ふみ" },
  "分": { stroke: 4, radical: "刀", radName: "katana (pedang)", arti: "menit / membagi / paham", on: "ブン・フン", kun: "わ・かる" },
  "切": { stroke: 4, radical: "刀", radName: "katana (pedang)", arti: "potong", on: "セツ", kun: "き・る" },
  "止": { stroke: 4, radical: "止", radName: "tomeru (berhenti)", arti: "berhenti", on: "シ", kun: "と・まる / と・める" },
  "方": { stroke: 4, radical: "方", radName: "hou (arah)", arti: "arah / orang / cara", on: "ホウ", kun: "かた" },
  "今": { stroke: 4, radical: "人", radName: "hito (orang)", arti: "sekarang", on: "コン・キン", kun: "いま" },
  "元": { stroke: 4, radical: "儿", radName: "hitoashi (kaki manusia)", arti: "asal / sehat", on: "ゲン・ガン", kun: "もと" },
  "円": { stroke: 4, radical: "冂", radName: "makigamae", arti: "yen / bulat", on: "エン", kun: "まる・い" },
  "牛": { stroke: 4, radical: "牛", radName: "ushi (sapi)", arti: "sapi", on: "ギュウ", kun: "うし" },
  "内": { stroke: 4, radical: "冂", radName: "makigamae", arti: "dalam", on: "ナイ・ダイ", kun: "うち" },
  "公": { stroke: 4, radical: "八", radName: "hachi (delapan)", arti: "umum / publik", on: "コウ", kun: "おおやけ" },
  "六": { stroke: 4, radical: "八", radName: "hachi (delapan)", arti: "enam", on: "ロク", kun: "む・っつ" },
  "天": { stroke: 4, radical: "大", radName: "dai (besar)", arti: "langit / cuaca", on: "テン", kun: "あめ・あま" },
  "犬": { stroke: 4, radical: "犬", radName: "inu (anjing)", arti: "anjing", on: "ケン", kun: "いぬ" },
  "太": { stroke: 4, radical: "大", radName: "dai (besar)", arti: "gemuk / tebal", on: "タイ・タ", kun: "ふと・い" },

  // 5 Coretan
  "出": { stroke: 5, radical: "凵", radName: "kannyou (kotak terbuka)", arti: "keluar", on: "シュツ", kun: "で・る / だ・す" },
  "右": { stroke: 5, radical: "口", radName: "kuchi (mulut)", arti: "kanan", on: "ウ・ユウ", kun: "みぎ" },
  "左": { stroke: 5, radical: "工", radName: "kou (kerja)", arti: "kiri", on: "サ", kun: "ひだり" },
  "本": { stroke: 5, radical: "木", radName: "ki (pohon)", arti: "buku / asal", on: "ホン", kun: "もと" },
  "目": { stroke: 5, radical: "目", radName: "me (mata)", arti: "mata", on: "モク", kun: "め" },
  "耳": { stroke: 5, radical: "耳", radName: "mimi (telinga)", arti: "telinga", on: "ジ", kun: "みみ" },
  "北": { stroke: 5, radical: "匕", radName: "saji (sendok)", arti: "utara", on: "ホク", kun: "きた" },
  "外": { stroke: 5, radical: "夕", radName: "yuu (sore)", arti: "luar", on: "ガイ・ゲ", kun: "そと / はず・す" },
  "半": { stroke: 5, radical: "十", radName: "juu (sepuluh)", arti: "setengah", on: "ハン", kun: "なか・ば" },
  "白": { stroke: 5, radical: "白", radName: "shiro (putih)", arti: "putih", on: "ハク", kun: "しろ・い" },
  "母": { stroke: 5, radical: "毋", radName: "nakare", arti: "ibu", on: "ボ", kun: "はは" },
  "生": { stroke: 5, radical: "生", radName: "sei (lahir)", arti: "hidup / lahir", on: "セイ・ショウ", kun: "い・きる / う・まれる" },
  "田": { stroke: 5, radical: "田", radName: "ta (sawah)", arti: "sawah", on: "デン", kun: "た" },
  "休": { stroke: 5, radical: "人", radName: "ninben (orang)", arti: "istirahat / libur", on: "キュウ", kun: "やす・む" },
  "先": { stroke: 5, radical: "儿", radName: "hitoashi (kaki manusia)", arti: "terdahulu / depan", on: "セン", kun: "さき" },
  "去": { stroke: 5, radical: "厶", radName: "mu (pribadi)", arti: "lalu / pergi", on: "キョ・コ", kun: "さ・る" },
  "兄": { stroke: 5, radical: "儿", radName: "hitoashi", arti: "kakak laki-laki", on: "ケイ・キョウ", kun: "あに" },
  "四": { stroke: 5, radical: "囗", radName: "kunigamae (kotak keliling)", arti: "empat", on: "シ", kun: "よ・っつ / よん" },
  "市": { stroke: 5, radical: "巾", radName: "haba (kain)", arti: "kota / pasar", on: "シ", kun: "いち" },
  "立": { stroke: 5, radical: "立", radName: "tatsu (berdiri)", arti: "berdiri", on: "リツ", kun: "た・つ" },
  "冬": { stroke: 5, radical: "冫", radName: "nisui (es)", arti: "musim dingin", on: "トウ", kun: "ふゆ" },
  "古": { stroke: 5, radical: "口", radName: "kuchi (mulut)", arti: "kuno / lama", on: "コ", kun: "ふる・い" },

  // 6 Coretan
  "気": { stroke: 6, radical: "气", radName: "kigamae (uap/udara)", arti: "udara / semangat / rasa", on: "キ・ケ", kun: "いき" },
  "行": { stroke: 6, radical: "行", radName: "gyou (jalan/langkah)", arti: "pergi / baris", on: "コウ・ギョウ", kun: "い・く / おこな・う" },
  "見": { stroke: 6, radical: "見", radName: "miru (melihat)", arti: "melihat / menonton", on: "ケン", kun: "み・る / み・える" },
  "多": { stroke: 6, radical: "夕", radName: "yuu (sore)", arti: "banyak", on: "タ", kun: "おお・い" },
  "安": { stroke: 6, radical: "宀", radName: "ukanmuri (atap)", arti: "murah / tenang", on: "アン", kun: "やす・い" },
  "会": { stroke: 6, radical: "人", radName: "hito (orang)", arti: "bertemu / perkumpulan", on: "カイ・エ", kun: "あ・う" },
  "休": { stroke: 6, radical: "人", radName: "ninben (orang)", arti: "istirahat", on: "キュウ", kun: "やす・む" },
  "西": { stroke: 6, radical: "襾", radName: "nishi (barat)", arti: "barat", on: "セイ・サイ", kun: "にし" },
  "名": { stroke: 6, radical: "口", radName: "kuchi (mulut)", arti: "nama / terkenal", on: "メイ・ミョウ", kun: "な" },
  "年": { stroke: 6, radical: "干", radName: "kan (kering)", arti: "tahun", on: "ネン", kun: "とし" },
  "早": { stroke: 6, radical: "日", radName: "hi (matahari)", arti: "cepat / awal", on: "ソウ・サッ", kun: "はや・い" },
  "字": { stroke: 6, radical: "宀", radName: "ukanmuri", arti: "huruf / karakter", on: "ジ", kun: "あざ" },
  "回": { stroke: 6, radical: "囗", radName: "kunigamae", arti: "kali / berputar", on: "カイ", kun: "まわ・る" },
  "同": { stroke: 6, radical: "口", radName: "kuchi", arti: "sama", on: "ドウ", kun: "おな・じ" },
  "考": { stroke: 6, radical: "老", radName: "oikanmuri (tua)", arti: "berpikir", on: "コウ", kun: "かんが・える" },
  "死": { stroke: 6, radical: "歹", radName: "ichitahen", arti: "mati", on: "シ", kun: "し・ぬ" },
  "百": { stroke: 6, radical: "白", radName: "shiro (putih)", arti: "ratusan", on: "ヒャク", kun: "もも" },
  "地": { stroke: 6, radical: "土", radName: "tsuchi (tanah)", arti: "bumi / tanah", on: "チ・ジ", kun: "" },
  "色": { stroke: 6, radical: "色", radName: "iro (warna)", arti: "warna", on: "ショク・シキ", kun: "いろ" },
  "肉": { stroke: 6, radical: "肉", radName: "niku (daging)", arti: "daging", on: "ニク", kun: "" },
  "好": { stroke: 6, radical: "女", radName: "onna (wanita)", arti: "suka", on: "コウ", kun: "す・き / この・む" },

  // 7 Coretan
  "何": { stroke: 7, radical: "人", radName: "ninben (orang)", arti: "apa", on: "カ", kun: "なに・なん" },
  "花": { stroke: 7, radical: "艸", radName: "kusa (rumput)", arti: "bunga", on: "カ", kun: "はな" },
  "町": { stroke: 7, radical: "田", radName: "ta (sawah)", arti: "kota kecil / pemukiman", on: "チョウ", kun: "まち" },
  "男": { stroke: 7, radical: "田", radName: "ta (sawah)", arti: "pria / laki-laki", on: "ダン・ナン", kun: "おとこ" },
  "作": { stroke: 7, radical: "人", radName: "ninben (orang)", arti: "membuat", on: "サク・サ", kun: "つく・る" },
  "見": { stroke: 7, radical: "見", radName: "miru (melihat)", arti: "melihat", on: "ケン", kun: "み・る" },
  "社": { stroke: 7, radical: "示", radName: "shimesu (altar)", arti: "perusahaan / kuil", on: "シャ", kun: "やしろ" },
  "来": { stroke: 7, radical: "木", radName: "ki (pohon)", arti: "datang / yang akan datang", on: "ライ", kun: "く・る / き・ます" },
  "言": { stroke: 7, radical: "言", radName: "gonben (ucapan)", arti: "ucapan / berkata", on: "ゲン・ゴン", kun: "い・う / こと" },
  "足": { stroke: 7, radical: "足", radName: "ashi (kaki)", arti: "kaki / cukup", on: "ソク", kun: "あし / た・りる" },
  "車": { stroke: 7, radical: "車", radName: "kuruma (kendaraan)", arti: "mobil / roda", on: "シャ", kun: "くるま" },
  "近": { stroke: 7, radical: "辶", radName: "shinnyou (jalan)", arti: "dekat", on: "キン", kun: "ちか・い" },
  "住": { stroke: 7, radical: "人", radName: "ninben (orang)", arti: "tinggal / mukim", on: "ジュウ", kun: "す・む" },
  "体": { stroke: 7, radical: "人", radName: "ninben (orang)", arti: "tubuh / badan", on: "タイ・テイ", kun: "からだ" },
  "私": { stroke: 7, radical: "禾", radName: "ine (padi)", arti: "saya / pribadi", on: "シ", kun: "わたし・わたくし" },
  "低": { stroke: 7, radical: "人", radName: "ninben (orang)", arti: "rendah", on: "テイ", kun: "ひく・い" },
  "走": { stroke: 7, radical: "走", radName: "hashiru (lari)", arti: "lari", on: "ソウ", kun: "はし・る" },
  "赤": { stroke: 7, radical: "赤", radName: "aka (merah)", arti: "merah", on: "セキ・シャク", kun: "あか・い" },
  "村": { stroke: 7, radical: "木", radName: "ki (pohon)", arti: "desa", on: "ソン", kun: "むら" },
  "冷": { stroke: 7, radical: "冫", radName: "nisui (es)", arti: "dingin (benda)", on: "レイ", kun: "つめ・たい / ひ・える" },

  // 8 Coretan
  "国": { stroke: 8, radical: "囗", radName: "kunigamae", arti: "negara", on: "コク", kun: "くに" },
  "学": { stroke: 8, radical: "子", radName: "ko (anak)", arti: "belajar / ilmu", on: "ガク", kun: "まな・ぶ" },
  "長": { stroke: 8, radical: "長", radName: "nagai (panjang)", arti: "panjang / pemimpin", on: "チョウ", kun: "なが・い" },
  "門": { stroke: 8, radical: "門", radName: "mon (gerbang)", arti: "gerbang / pintu gerbang", on: "モン", kun: "かど" },
  "雨": { stroke: 8, radical: "雨", radName: "ame (hujan)", arti: "hujan", on: "ウ", kun: "あめ・あま" },
  "店": { stroke: 8, radical: "广", radName: "madare (rumah condong)", arti: "toko", on: "テン", kun: "みせ" },
  "金": { stroke: 8, radical: "金", radName: "kane (logam/emas)", arti: "emas / uang / hari jumat", on: "キン・コン", kun: "かね" },
  "東": { stroke: 8, radical: "木", radName: "ki (pohon)", arti: "timur", on: "トウ", kun: "ひがし" },
  "明": { stroke: 8, radical: "日", radName: "hi (matahari)", arti: "terang / jelas", on: "メイ・ミョウ", kun: "あか・るい" },
  "物": { stroke: 8, radical: "牛", radName: "ushi (sapi)", arti: "benda / barang", on: "ブツ・モツ", kun: "もの" },
  "始": { stroke: 8, radical: "女", radName: "onna (wanita)", arti: "memulai", on: "シ", kun: "はじ・める" },
  "服": { stroke: 8, radical: "月", radName: "tsuki", arti: "pakaian / menaati", on: "フク", kun: "" },
  "使": { stroke: 8, radical: "人", radName: "ninben (orang)", arti: "menggunakan / memakai", on: "シ", kun: "つか・う" },
  "夜": { stroke: 8, radical: "夕", radName: "yuu (sore)", arti: "malam", on: "ヤ", kun: "よ・よる" },
  "妹": { stroke: 8, radical: "女", radName: "onna", arti: "adik perempuan", on: "マイ", kun: "いもうと" },
  "姉": { stroke: 8, radical: "女", radName: "onna", arti: "kakak perempuan", on: "シ", kun: "あね" },
  "空": { stroke: 8, radical: "穴", radName: "ana (lubang)", arti: "langit / kosong", on: "クウ", kun: "そら / あ・く" },
  "青": { stroke: 8, radical: "青", radName: "ao (biru)", arti: "biru", on: "セイ・ショウ", kun: "あお・い" },
  "知": { stroke: 8, radical: "矢", radName: "ya (panah)", arti: "mengetahui / kenal", on: "チ", kun: "し・る" },
  "歩": { stroke: 8, radical: "止", radName: "tomeru (berhenti)", arti: "berjalan kaki", on: "ホ・ブ", kun: "ある・く / あゆ・む" },
  "所": { stroke: 8, radical: "戸", radName: "to (pintu)", arti: "tempat", on: "ショ", kun: "ところ" },
  "味": { stroke: 8, radical: "口", radName: "kuchi (mulut)", arti: "rasa / cita rasa", on: "ミ", kun: "あじ" },
  "注": { stroke: 8, radical: "水", radName: "sanzui (air)", arti: "menuang / memusatkan", on: "チュウ", kun: "そそ・ぐ" },
  "魚": { stroke: 11, radical: "魚", radName: "sakana (ikan)", arti: "ikan", on: "ギョ", kun: "さかな / うお" },

  // 9 Coretan
  "前": { stroke: 9, radical: "刀", radName: "katana (pedang)", arti: "depan / sebelum", on: "ゼン", kun: "まえ" },
  "後": { stroke: 9, radical: "彳", radName: "gyouninben (langkah)", arti: "belakang / setelah", on: "ゴ・コウ", kun: "うし・ろ / あと" },
  "食": { stroke: 9, radical: "食", radName: "shoku (makan)", arti: "makan / makanan", on: "ショク", kun: "た・べる" },
  "南": { stroke: 9, radical: "十", radName: "juu", arti: "selatan", on: "ナン", kun: "みなみ" },
  "室": { stroke: 9, radical: "宀", radName: "ukanmuri", arti: "ruangan / kamar", on: "シツ", kun: "むろ" },
  "急": { stroke: 9, radical: "心", radName: "kokoro (hati)", arti: "bergegas / mendadak", on: "キュウ", kun: "いそ・ぐ" },
  "音": { stroke: 9, radical: "音", radName: "oto (bunyi)", arti: "suara / bunyi", on: "オン・イン", kun: "おと・ね" },
  "風": { stroke: 9, radical: "風", radName: "kaze (angin)", arti: "angin", on: "フウ", kun: "かぜ" },
  "海": { stroke: 9, radical: "水", radName: "sanzui (air)", arti: "laut", on: "カイ", kun: "うみ" },
  "茶": { stroke: 9, radical: "艸", radName: "kusa (rumput)", arti: "teh", on: "チャ・サ", kun: "" },
  "秋": { stroke: 9, radical: "禾", radName: "ine (padi)", arti: "musim gugur", on: "シュウ", kun: "あき" },
  "春": { stroke: 9, radical: "日", radName: "hi (matahari)", arti: "musim semi", on: "シュン", kun: "はる" },
  "重": { stroke: 9, radical: "里", radName: "sato (kampung)", arti: "berat / bertumpuk", on: "ジュウ・チョウ", kun: "おも・い / かさ・なる" },
  "待": { stroke: 9, radical: "彳", radName: "gyouninben (langkah)", arti: "menunggu", on: "タイ", kun: "ま・つ" },
  "持": { stroke: 9, radical: "手", radName: "tehen (tangan)", arti: "membawa / mempunyai", on: "ジ", kun: "も・つ" },
  "思": { stroke: 9, radical: "心", radName: "kokoro (hati)", arti: "berpikir / merasa", on: "シ", kun: "おも・う" },
  "洗": { stroke: 9, radical: "水", radName: "sanzui", arti: "mencuci", on: "セン", kun: "あら・う" },
  "乗": { stroke: 9, radical: "禾", radName: "ine (padi)", arti: "naik (kendaraan)", on: "ジョウ", kun: "の・る" },
  "屋": { stroke: 9, radical: "尸", radName: "shikabane", arti: "atap / toko", on: "オク", kun: "や" },
  "計": { stroke: 9, radical: "言", radName: "gonben (ucapan)", arti: "mengukur / rencana", on: "ケイ", kun: "はか・る" },
  "度": { stroke: 9, radical: "广", radName: "madare", arti: "derajat / kali", on: "ド・ト", kun: "たび" },

  // 10 Coretan
  "高": { stroke: 10, radical: "高", radName: "takai (tinggi)", arti: "tinggi / mahal", on: "コウ", kun: "たか・い" },
  "時": { stroke: 10, radical: "日", radName: "hi (matahari)", arti: "waktu / jam", on: "ジ", kun: "とき" },
  "校": { stroke: 10, radical: "木", radName: "ki (pohon)", arti: "sekolah", on: "コウ", kun: "" },
  "帰": { stroke: 10, radical: "巾", radName: "haba (kain)", arti: "pulang / kembali", on: "キ", kun: "かえ・る" },
  "起": { stroke: 10, radical: "走", radName: "hashiru (lari)", arti: "bangun / bangkit", on: "キ", kun: "お・きる / お・こす" },
  "書": { stroke: 10, radical: "曰", radName: "iwaku", arti: "menulis / buku", on: "ショ", kun: "か・く" },
  "病": { stroke: 10, radical: "疒", radName: "yamaidare (penyakit)", arti: "sakit / penyakit", on: "ビョウ", kun: "や・む" },
  "院": { stroke: 10, radical: "阜", radName: "kozatohen (bukit)", arti: "institusi / gedung", on: "イン", kun: "" },
  "通": { stroke: 10, radical: "辶", radName: "shinnyou (jalan)", arti: "lewat / bolak-balik", on: "ツウ", kun: "とお・る / かよ・う" },
  "借": { stroke: 10, radical: "人", radName: "ninben (orang)", arti: "meminjam", on: "シャク", kun: "か・りる" },
  "旅": { stroke: 10, radical: "方", radName: "hou (arah)", arti: "perjalanan / wisata", on: "リョ", kun: "たび" },
  "夏": { stroke: 10, radical: "夂", radName: "fuyugashira", arti: "musim panas", on: "カ・ゲ", kun: "なつ" },
  "紙": { stroke: 10, radical: "糸", radName: "ito (benang)", arti: "kertas", on: "シ", kun: "かみ" },
  "家": { stroke: 10, radical: "宀", radName: "ukanmuri", arti: "rumah / keluarga", on: "カ・ケ", kun: "いえ・や" },
  "特": { stroke: 10, radical: "牛", radName: "ushi (sapi)", arti: "khusus / istimewa", on: "トク", kun: "" },
  "止": { stroke: 4, radical: "止", radName: "tomeru", arti: "berhenti", on: "シ", kun: "と・まる" },
  "駅": { stroke: 14, radical: "馬", radName: "uma (kuda)", arti: "stasiun", on: "エキ", kun: "" },

  // 11 Coretan
  "動": { stroke: 11, radical: "力", radName: "chikara (kekuatan)", arti: "bergerak", on: "ドウ", kun: "うご・く" },
  "教": { stroke: 11, radical: "攴", radName: "bokuzukuri (pukul)", arti: "mengajar / ajaran", on: "キョウ", kun: "おし・える" },
  "週": { stroke: 11, radical: "辶", radName: "shinnyou (jalan)", arti: "minggu / pekan", on: "シュウ", kun: "" },
  "強": { stroke: 11, radical: "弓", radName: "yumi (busur)", arti: "kuat / berjuang", on: "キョウ・ゴウ", kun: "つよ・い" },
  "理": { stroke: 11, radical: "玉", radName: "tama (batu giok)", arti: "alasan / logika / tata", on: "リ", kun: "" },
  "黒": { stroke: 11, radical: "黒", radName: "kuro (hitam)", arti: "hitam", on: "コク", kun: "くろ・い" },
  "悪": { stroke: 11, radical: "心", radName: "kokoro (hati)", arti: "buruk / jahat", on: "アク・オ", kun: "わる・い" },
  "習": { stroke: 11, radical: "羽", radName: "hane (sayap)", arti: "mempelajari / membiasakan", on: "シュウ", kun: "なら・う" },
  "転": { stroke: 11, radical: "車", radName: "kuruma (kendaraan)", arti: "berguling / berpindah", on: "テン", kun: "ころ・がる" },

  // 12 Coretan
  "間": { stroke: 12, radical: "門", radName: "mon (gerbang)", arti: "antara / waktu / jangka", on: "カン・ケン", kun: "あいだ・ま" },
  "買": { stroke: 12, radical: "貝", radName: "kai (kerang)", arti: "membeli", on: "バイ", kun: "か・う" },
  "道": { stroke: 12, radical: "辶", radName: "shinnyou (jalan)", arti: "jalan / rute", on: "ドウ・トウ", kun: "みち" },
  "飲": { stroke: 12, radical: "食", radName: "shoku (makan)", arti: "minum", on: "イン", kun: "の・む" },
  "朝": { stroke: 12, radical: "月", radName: "tsuki", arti: "pagi", on: "チョウ", kun: "あさ" },
  "昼": { stroke: 9, radical: "日", radName: "hi", arti: "siang", on: "チュウ", kun: "ひる" },
  "飯": { stroke: 12, radical: "食", radName: "shoku (makan)", arti: "nasi / hidangan", on: "ハン", kun: "めし" },
  "開": { stroke: 12, radical: "門", radName: "mon", arti: "membuka", on: "カイ", kun: "あ・ける / ひら・く" },
  "寒": { stroke: 12, radical: "宀", radName: "ukanmuri", arti: "dingin (cuaca)", on: "カン", kun: "さむ・い" },
  "暑": { stroke: 12, radical: "日", radName: "hi (matahari)", arti: "panas (cuaca)", on: "ショ", kun: "あつ・い" },
  "短": { stroke: 12, radical: "矢", radName: "ya (panah)", arti: "pendek", on: "タン", kun: "みじか・い" },

  // 13 Coretan
  "話": { stroke: 13, radical: "言", radName: "gonben (ucapan)", arti: "berbicara / cerita", on: "ワ", kun: "はな・す / はなし" },
  "働": { stroke: 13, radical: "人", radName: "ninben (orang)", arti: "bekerja", on: "ドウ", kun: "はたら・く" },
  "電": { stroke: 13, radical: "雨", radName: "ame (hujan)", arti: "listrik", on: "デン", kun: "" },
  "暗": { stroke: 13, radical: "日", radName: "hi", arti: "gelap", on: "アン", kun: "くら・い" },
  "新": { stroke: 13, radical: "斤", radName: "ono (kapak)", arti: "baru", on: "シン", kun: "あたら・しい" },
  "遠": { stroke: 13, radical: "辶", radName: "shinnyou", arti: "jauh", on: "エン", kun: "とお・い" },

  // 14+ Coretan
  "聞": { stroke: 14, radical: "耳", radName: "mimi (telinga)", arti: "mendengar / bertanya", on: "ブン・モン", kun: "き・く" },
  "語": { stroke: 14, radical: "言", radName: "gonben (ucapan)", arti: "bahasa / perkataan", on: "ゴ", kun: "かた・る" },
  "読": { stroke: 14, radical: "言", radName: "gonben (ucapan)", arti: "membaca", on: "ドク", kun: "よ・む" },
  "銀": { stroke: 14, radical: "金", radName: "kane (logam)", arti: "perak / bank", on: "ギン", kun: "しろがね" },
  "駅": { stroke: 14, radical: "馬", radName: "uma (kuda)", arti: "stasiun", on: "エキ", kun: "" },
  "館": { stroke: 16, radical: "食", radName: "shoku (makan)", arti: "gedung / balai / museum", on: "カン", kun: "やかた" },
  "薬": { stroke: 16, radical: "艸", radName: "kusa (rumput)", arti: "obat", on: "ヤク", kun: "くすり" },
  "曜": { stroke: 18, radical: "日", radName: "hi (matahari)", arti: "hari dalam sepekan", on: "ヨウ", kun: "" }
};

// Buat database Kanji A2 Terstruktur yang diurutkan standar:
// 1. Jumlah Coretan (Strokes) dari sedikit ke banyak
// 2. Radikal Pengelompok
export function buildKanjiA2Database() {
  const kotobaList = JSON.parse(fs.readFileSync('public/kotoba-lolosyuk.json', 'utf8'));

  const kanjiMap = new Map();

  kotobaList.forEach(item => {
    if (!item.kanji) return;
    for (const ch of item.kanji) {
      if (/[\u4E00-\u9FAF]/.test(ch)) {
        if (!kanjiMap.has(ch)) {
          const meta = KANJI_METADATA[ch] || {
            stroke: 8,
            radical: "Lainnya",
            radName: "Umum",
            arti: item.arti,
            on: "-",
            kun: item.kana
          };

          kanjiMap.set(ch, {
            kanji: ch,
            stroke: meta.stroke,
            radical: meta.radical,
            radName: meta.radName,
            arti: meta.arti,
            on: meta.on || "-",
            kun: meta.kun || "-",
            vocab: []
          });
        }

        const entry = kanjiMap.get(ch);
        if (!entry.vocab.some(v => v.kanji === item.kanji)) {
          entry.vocab.push({
            kanji: item.kanji,
            kana: item.kana,
            rom: item.rom,
            arti: item.arti,
            keterangan: item.keterangan || "JFT"
          });
        }
      }
    }
  });

  const kanjiArray = Array.from(kanjiMap.values());

  // Urutkan standar: Jumlah Coretan ASC, lalu Radikal
  kanjiArray.sort((a, b) => {
    if (a.stroke !== b.stroke) return a.stroke - b.stroke;
    return a.radical.localeCompare(b.radical, 'ja');
  });

  const outputPath = path.join('public', 'kanji-jft-a2.json');
  fs.writeFileSync(outputPath, JSON.stringify(kanjiArray, null, 2), 'utf8');

  console.log(`=== DATABASE KANJI JFT-A2 BERHASIL DIBUAT ===`);
  console.log(`Total Karakter Kanji Terkelompok : ${kanjiArray.length}`);
  console.log(`Disimpan ke                      : ${outputPath}`);
}

buildKanjiA2Database();
