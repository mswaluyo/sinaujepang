// tools/seed-master.mjs — ONE-OFF: buat 4 file master dari file hasil build lama
// (kotoba-verb/adj/noun/ungk.js yg sudah bersih). Jalankan sekali:
//   node tools/seed-master.mjs
// Setelah ini, edit public/kotoba-*.json langsung; jangan jalankan lagi.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const load = f => {
  const t = fs.readFileSync(path.join(ROOT, "public", "assets", "js", f), "utf8");
  return JSON.parse(t.slice(t.indexOf("["), t.lastIndexOf(";")));
};
const toMaster = arr => arr.map(e => ({
  kanji: e[0], kana: e[1], rom: e[2], arti: e[3],
  paket: String(e[4] || "").split(",").filter(Boolean),
})).sort((a, b) => a.kana.localeCompare(b.kana, "ja"));
const files = [
  ["kotoba-verb.js", "kotoba-kerja.json"],
  ["kotoba-adj.js", "kotoba-sifat.json"],
  ["kotoba-noun.js", "kotoba-benda.json"],
  ["kotoba-ungk.js", "kotoba-ungkapan.json"],
];
for (const [src, out] of files) {
  const data = toMaster(load(src));
  fs.writeFileSync(path.join(ROOT, "public", out), JSON.stringify(data, null, 1) + "\n", "utf8");
  console.log(out + ": " + data.length + " entri");
}
