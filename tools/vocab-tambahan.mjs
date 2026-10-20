// tools/vocab-tambahan.mjs — KOSAKATA DASAR JLPT N5/N4 per kanji (data statis, ditulis manual).
// Dipakai build-explorer.mjs sebagai PELENGKAP bila soal tidak punya kosakata valid
// untuk kanji tsb. Format: "KANJI": [[kata, kana, romaji, arti], ...]
// Aturan: hanya kata tunggal umum (maks 2 kata), kana murni, arti singkat.
export const TAMBAHAN = {
  "人": [["人", "ひと", "hito", "orang"], ["人々", "ひとびと", "hitobito", "orang-orang"], ["日本人", "にほんじん", "nihonjin", "orang Jepang"]],
  "大": [["大きい", "おおきい", "ookii", "besar"], ["大学", "だいがく", "daigaku", "universitas"]],
  "女": [["女", "おんな", "onna", "perempuan"], ["女性", "じょせい", "josei", "wanita"]],
  "子": [["子", "こ", "ko", "anak"], ["子供", "こども", "kodomo", "anak-anak"]],
  "日": [["日", "ひ", "hi", "matahari/hari"], ["日本", "にほん", "nihon", "Jepang"], ["今日", "きょう", "kyou", "hari ini"]],
  "本": [["本", "ほん", "hon", "buku"], ["日本", "にほん", "nihon", "Jepang"]],
  "語": [["語", "ご", "go", "bahasa"], ["日本語", "にほんご", "nihongo", "bahasa Jepang"], ["英語", "えいご", "eigo", "bahasa Inggris"]],
  "学": [["学ぶ", "まなぶ", "manabu", "belajar"], ["学校", "がっこう", "gakkou", "sekolah"], ["学生", "がくせい", "gakusei", "murid"]],
  "生": [["生まれる", "うまれる", "umareru", "lahir"], ["先生", "せんせい", "sensei", "guru"], ["生活", "せいかつ", "seikatsu", "kehidupan"]],
  "先": [["先", "さき", "saki", "depan/terdahulu"], ["先生", "せんせい", "sensei", "guru"]],
  "年": [["年", "とし", "toshi", "tahun"], ["去年", "きょねん", "kyonen", "tahun lalu"], ["今年", "ことし", "kotoshi", "tahun ini"]],
  "時": [["時", "とき", "toki", "waktu"], ["時間", "じかん", "jikan", "jam/waktu"]],
  "間": [["間", "あいだ", "aida", "antara"], ["時間", "じかん", "jikan", "jam/waktu"], ["三時間", "さんじかん", "sanjikan", "3 jam"]],
  "分": [["分", "ぶん", "bun", "bagian"], ["分かる", "わかる", "wakaru", "mengerti"], ["五分", "ごふん", "gofun", "5 menit"]],
  "半": [["半", "はん", "han", "setengah"], ["半分", "はんぶん", "hanbun", "separuh"]],
  "週": [["週", "しゅう", "shuu", "minggu"], ["今週", "こんしゅう", "konshuu", "minggu ini"], ["毎週", "まいしゅう", "maishuu", "tiap minggu"]],
  "月": [["月", "つき", "tsuki", "bulan"], ["今月", "こんげつ", "kongetsu", "bulan ini"]],
  "曜": [["曜日", "ようび", "youbi", "hari (dlm minggu)"]],
  "火": [["火", "ひ", "hi", "api"], ["火曜日", "かようび", "kayoubi", "Selasa"]],
  "水": [["水", "みず", "mizu", "air"], ["水曜日", "すいようび", "suiyoubi", "Rabu"]],
  "木": [["木", "き", "ki", "pohon"], ["木曜日", "もくようび", "mokuyoubi", "Kamis"]],
  "金": [["金", "きん", "kin", "emas/uang"], ["金曜日", "きんようび", "kinyoubi", "Jumat"], ["お金", "おかね", "okane", "uang"]],
  "土": [["土", "つち", "tsuchi", "tanah"], ["土曜日", "どようび", "doyoubi", "Sabtu"]],
  "曜2": [],
};
delete TAMBAHAN["曜2"];
