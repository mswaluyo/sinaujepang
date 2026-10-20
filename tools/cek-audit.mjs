// tools/cek-audit.mjs — verifikasi temuan audit pada file hasil build
import fs from "node:fs";
const load = f => { const t = fs.readFileSync("D:/soal-jft/public/assets/js/" + f, "utf8"); return JSON.parse(t.slice(t.indexOf("["), t.lastIndexOf(";"))); };
const V = load("kotoba-verb.js"), A = load("kotoba-adj.js"), N = load("kotoba-noun.js");
const all = [...V, ...A, ...N];
console.log("verb:" + V.length + " adj:" + A.length + " noun:" + N.length + " total:" + all.length);
function cek(label, cond) {
  const x = all.filter(cond);
  let s = label + ": " + x.length;
  if (x.length > 0 && x.length <= 8) s += " -> " + JSON.stringify(x.map(e => e[0] + "/" + e[1] + "/" + e[4]));
  console.log(s);
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