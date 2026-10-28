// debug-subdata.mjs - Inspect kotoba data for jukugo/kotoba frasa
import fs from "node:fs";

const obj = JSON.parse(fs.readFileSync("output/kotoba-benda.json", "utf8"));
console.log("=== Scanning for 洗濯 frasa ===");
for (const [k, v] of Object.entries(obj)) {
  const kanji = v.kanji || "";
  const kana = v.kana || "";
  const rom = v.rom || "";
  const arti = v.arti || "";
  if (kanji.includes("洗濯") || kana.includes("する")) {
    console.log(`Key: ${k}`);
    console.log(`  kanji: ${kanji}`);
    console.log(`  kana: ${kana}`);
    console.log(`  rom: ${rom}`);
    console.log(`  arti: ${arti}`);
    console.log(`  full: ${JSON.stringify(v)}`);
    console.log("");
  }
}

console.log("\n=== Scan complete ===");