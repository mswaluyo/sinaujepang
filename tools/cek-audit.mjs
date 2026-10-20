// tools/cek-audit.mjs — verifikasi temuan audit pada file hasil build
import fs from "node:fs";
const load = f => { const t = fs.readFileSync("D:/soal-jft/public/assets/js/" + f, "utf8"); return JSON.parse(t.slice(t.indexOf("["), t.lastIndexOf(";"))); };
const V = load("kotoba-verb.js"), A = load("kotoba-adj.js"), N = load("kotoba-noun.js"), U = load("kotoba-ungk.js");
const all = [...V, ...A, ...N, ...U];
console.log("verb:" + V.length + " adj:" + A.length + " noun:" + N.length + " ungk:" + U.length + " total:" + all.length);
function cek(label, cond) {
  const x = all.filter(cond);
  let s = label + ": " + x.length;
  if (x.length > 0 && x.length <= 8) s += " -> " + JSON.stringify(x.map(e => e[0] + "/" + e[1] + "/" + e[4]));
  console.log(s);
}
// pengecekan positif: entri HARUS ada di file hasil build
function cekAda(label, cond) {
  const x = all.filter(cond);
  console.log((x.length >= 1 ? "OK   " : "GAGAL") + " " + label + ": " + x.length + (x.length && x.length <= 8 ? " -> " + JSON.stringify(x.map(e => e[0] + "/" + e[1])) : ""));
}
cek("nomimasu", e => e[1] === "のみます");
cek("tabemasu", e => e[1] === "たべます");
cek("ojamashimasu", e => e[1] === "おじゃまします");
cek("osewa", e => e[1].includes("おせわになります"));
cek("ashita", e => e[1] === "あしたけします");
cek("makimasu", e => e[1] === "まきます");
cek("HAPUS-typo", e => ["さくります", "すくります", "おぎます", "なにいきます", "なにもいます", "こんどからはじめます", "買ってもらいました", "どぞおねがいたします"].includes(e[0]) || ["さくります", "すくります", "おぎます"].includes(e[1]));
cek("okimasu", e => e[1] === "おきます");
cek("agemasu", e => e[0] === "揚げます");
cek("kirimasu", e => e[0] === "切ります");
cek("HAPUS-batch2", e => ["どこにも出かけます", "どこも行きます", "べつにかまいます", "もうしわけあります", "それは問題ではあります"].includes(e[0]) || ["どこにも出かけます", "どこも行きます", "べつにかまいます", "もうしわけあります", "それは問題ではあります"].includes(e[1]));
cek("nakushimasu", e => e[1] === "なくします");
cek("hajimemasu", e => e[1] === "はじめます");
cek("kega", e => e[1] === "怪我をしています" || e[1] === "けがをしています");
cek("nemashita", e => e[1] === "寝ました" || e[1] === "ねました");
cek("yoroshiku", e => e[1] === "よろしくおねがいします");
cek("dekakemasen", e => e[1] === "どこにも出かけません" || e[1] === "どこにもでかけません");
cek("dokomo", e => e[1] === "どこも行きません" || e[1] === "どこもいきません");
cek("betsu", e => e[1] === "べつにかまいません");
cek("moushiwake", e => e[1] === "もうしわけありません");
cek("mondai-dewaarimasen", e => e[1] === "それは問題ではありません" || e[1] === "それはもんだいではありません");