// debug-render.mjs - WITH ERROR CATCH
import fs from "node:fs";

class MockDiv {
  constructor() { this.innerHTML = ""; this.textContent = ""; }
}
var documentMock = {
  createElement: function(tag) { return new MockDiv(); },
};
var windowMock = {};
globalThis.document = documentMock;
globalThis.window = windowMock;

const dataContent = fs.readFileSync("public/assets/js/explorer-data.js", "utf8");
const idx = dataContent.indexOf("window.EXPLORER_DATA = ");
const jsonStr = dataContent.slice(idx + "window.EXPLORER_DATA = ".length).trim().replace(/;\s*$/, "");
windowMock.EXPLORER_DATA = JSON.parse(jsonStr);

eval(fs.readFileSync("public/assets/js/kanji-tree-render.js", "utf8"));
eval(fs.readFileSync("public/assets/js/kanji-tree-render-engine.js", "utf8"));
eval(fs.readFileSync("public/assets/js/kanji-tree-render-main.js", "utf8"));

// Try calling renderTree with error catching
const mockContainer = new MockDiv();
try {
  windowMock.KanjiTreeRender.renderTree(mockContainer);
} catch(e) {
  console.log("RENDER ERROR:", e.message);
  console.log("STACK:", e.stack);
}

const html = mockContainer.innerHTML;
const labelCount = (html.match(/1\. Rumpun/g) || []).length;
console.log("rumpun label count:", labelCount);

// Check what names exist
console.log("Alam found:", html.includes("Alam & Elemen Alam"));
console.log("Manusia found:", html.includes("Manusia & Relasi Sosial"));
console.log("Angka found:", html.includes("Angka & Simbol Dasar"));
console.log("Hewan found:", html.includes("Hewan"));

// Check for title blue spans
var titles = html.match(/title blue">[^<]+</g) || [];
console.log("\nTitles found (" + titles.length + "):");
titles.forEach(function(t, i) { console.log("  " + (i+1) + ": " + t); });