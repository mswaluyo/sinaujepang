// check-groups.mjs
import fs from "node:fs";

const dc = fs.readFileSync("public/assets/js/explorer-data.js", "utf8");
const idx = dc.indexOf("window.EXPLORER_DATA = ");
const raw = dc.slice(idx + "window.EXPLORER_DATA = ".length).replace(/;\s*$/, "");
const obj = JSON.parse(raw);

// Extract GROUPS object by evaluating the IIFE in a browser-like context
const rc = fs.readFileSync("public/assets/js/kanji-tree-render.js", "utf8");

// Set up global mocks
globalThis.window = { EXPLORER_DATA: obj };
globalThis.document = { addEventListener: () => {} };

// Execute the file
eval(rc);

var GROUPS = window.__KanjiTree.GROUPS;

console.log("=== GROUPS di kanji-tree-render.js ===");
Object.keys(GROUPS).forEach(function(key, idx) {
  var g = GROUPS[key];
  var found = g.radikals.filter(function(r) { return !!obj[r]; });
  console.log((idx+1) + ". " + g.name + " [" + key + "]");
  console.log("   radikals: " + g.radikals.length + ", found in data: " + found.length);
  if (found.length === 0) {
    console.log("   WARNING: TIDAK ADA radikal ditemukan di data!");
  }
});