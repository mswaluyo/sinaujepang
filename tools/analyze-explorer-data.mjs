// Analyze explorer-data.js for jukugo/kotoba derivation
import fs from "node:fs";

const t = fs.readFileSync("public/assets/js/explorer-data.js", "utf8");
const idx = t.indexOf("window.EXPLORER_DATA = ");
const jsonStr = t.slice(idx + "window.EXPLORER_DATA = ".length).trim().replace(/;\s*$/, "");
const d = JSON.parse(jsonStr);

// Build KANJI_TO_RADICAL map
const KANJI_TO_RADICAL = {};
for (const [rad, rd] of Object.entries(d)) {
  (rd.kanji || []).forEach((k) => { KANJI_TO_RADICAL[k.ch] = rad; });
}

console.log("Total radikal:", Object.keys(d).length);
console.log("Total unique kanji:", Object.keys(KANJI_TO_RADICAL).length);

// Analyze jukugo candidates across all vocab
const radWithJukugo = {};
let totalJukugo = 0;
let totalKotoba = 0;

for (const [rad, rd] of Object.entries(d)) {
  if (!rd.kanji) continue;
  for (const k of rd.kanji) {
    const vs = k.vocab || [];
    totalKotoba += vs.length;
    for (const v of vs) {
      const kanjiRuns = (v.k.match(/[\u4e00-\u9fff\u3400-\u9fff\u3005\u3006\u3007\u303c]+/g) || []);
      const multiRuns = kanjiRuns.filter((x) => x.length >= 2);
      if (multiRuns.length > 0) {
        if (!radWithJukugo[rad]) radWithJukugo[rad] = [];
        radWithJukugo[rad].push({
          k: v.k,
          jukugoRuns: multiRuns,
          kanjiAll: kanjiRuns
        });
        totalJukugo += multiRuns.length;
      }
    }
  }
}

console.log("Total kotoba:", totalKotoba);
console.log("Total jukugo candidates (multi-kanji runs):", totalJukugo);
console.log("Radikal with jukugo candidates:", Object.keys(radWithJukugo).length);

console.log("=== Sample data for first 5 radikal with jukugo ===");
const sampleKeys = Object.keys(radWithJukugo).slice(0, 5);
for (const rad of sampleKeys) {
  console.log("\n--- Radikal: " + rad + " (" + d[rad].romaji + ") ---");
  console.log("  Kanji:", (d[rad].kanji || []).map(k => k.ch).join(", "));
  radWithJukugo[rad].forEach((c) => {
    console.log("  Kotoba:", c.k);
    c.jukugoRuns.forEach((jr) => {
      const colored = [...jr].map((ch) => {
        const belongsTo = KANJI_TO_RADICAL[ch];
        const tag = belongsTo === rad ? "M" : "E";
        return ch + "(" + tag + ")";
      }).join("");
      console.log("    Jukugo:", jr, "->", colored);
    });
  });
}

// Print full list of kanji-to-radical mapping for verification
console.log("\n=== KANJI_TO_RADICAL (full) ===");
console.log(JSON.stringify(KANJI_TO_RADICAL, null, 2));