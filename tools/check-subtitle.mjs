// check-subtitle.mjs
import fs from "node:fs";

class MockDiv {
  constructor() { this.innerHTML = ""; this.textContent = ""; }
}
var windowMock = {};
globalThis.document = { createElement: function() { return new MockDiv(); } };
globalThis.window = windowMock;

const dc = fs.readFileSync("public/assets/js/explorer-data.js", "utf8");
const i = dc.indexOf("window.EXPLORER_DATA = ");
windowMock.EXPLORER_DATA = JSON.parse(dc.slice(i + "window.EXPLORER_DATA = ".length).replace(/;\s*$/, ""));

eval(fs.readFileSync("public/assets/js/kanji-tree-render.js", "utf8"));
eval(fs.readFileSync("public/assets/js/kanji-tree-render-engine.js", "utf8"));
eval(fs.readFileSync("public/assets/js/kanji-tree-render-main.js", "utf8"));

const c = new MockDiv();
windowMock.KanjiTreeRender.renderTree(c);
const html = c.innerHTML;

console.log("=== Subtitle check ===");
console.log("Nature &amp; Natural Elements found:", html.includes("Nature &amp; Natural Elements"));
console.log("Nature & Natural Elements found:", html.includes("Nature & Natural Elements"));
console.log("subtitle italic style found:", html.includes("font-style:italic"));

// Check ordering
var titles = html.match(/title blue\">[^<]+</g) || [];
console.log("\n=== Group order ===");
titles.forEach(function(t, i) {
  console.log((i+1) + ": " + t.replace('title blue">', '').replace(/<$/, ''));
});

// Check subtitle presence for each group
var subCount = (html.match(/font-style:italic/g) || []).length;
console.log("\nTotal subtitles found:", subCount);