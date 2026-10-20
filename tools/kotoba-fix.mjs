// tools/kotoba-fix.mjs — KOREKSI MANUAL hasil audit (prioritas tertinggi).
// 1) HAPUS: typo / bukan kata baku / kalimat rusak / romaji rusak.
//    Cocokkan ke kana ATAU kata (setelah trim).
export const HAPUS = [
  "さくります", "すくります", "おぎます",
  "なにいきます", "なにもいます", "なにもいません", "こんどからはじめます", "買ってもらいました",
  "どぞおねがいたします",
];
// KANA BAKU: kana berkanji -> kana murni (agar dedup kunci kana berhasil).
// Mis. 明日けします (kana) -> あしたけします, gabung dgn varian basu.
export const KANA_BAKU = {
  "明日けします": "あしたけします",
  "お邪魔します": "おじゃまします",
  "お世話になります": "おせわになります",
  "お待たせしました": "おまたせしました",
};
// 2) PERBAIKI: kana -> {kana, rom, arti?} yg benar.
export const BETUL = {
  "おぎます": { kana: "おきます", rom: "okimasu", arti: "bangun" },
  "借りてはいけます": { kana: "かりてはいけません", rom: "karite wa ikemasen" },
  "きります": { rom: "kirimasu" },
  "揚げます": { rom: "agemasu" },
  "あすびます": { kana: "あそびます", rom: "asobimasu" },
  "すってるのにつかいます": { rom: "sutteru no ni tsukaimasu" },
  "すってるようになります": { rom: "sutteru you ni narimasu" },
  "どぞおねがいたします": { kana: "どうぞおねがいいたします", rom: "douzo onegai itashimasu" },
};
// 3) KANJI BAKU: kana -> tulisan kanji yg benar (gabung varian hiragana+kanji).
export const KANJI_BAKU = {
  "あしたけします": "明日けします",
  "おじゃまします": "お邪魔します",
  "おせわになります": "お世話になります",
  "おまたせしました": "お待たせしました",
  "すみませんおまたせしました": "すみませんお待たせしました",
  "ごめんおまたせしました": "ごめんお待たせしました",
};
