// verify-order.mjs
import fs from "node:fs";
import vm from "node:vm";

const dc = fs.readFileSync("public/assets/js/explorer-data.js", "utf8");
const idx = dc.indexOf("window.EXPLORER_DATA = ");
const raw = dc.slice(idx + "window.EXPLORER_DATA = ".length).replace(/;\s*$/, "");
const obj = JSON.parse(raw);

const sandbox = {
  window: { EXPLORER_DATA: obj, __KanjiTree: null },
  document: { addEventListener: () => {} }
};
vm.createContext(sandbox);

vm.runInContext(fs.readFileSync("public/assets/js/kanji-tree-render.js", "utf8"), sandbox, { filename: "helpers.js" });
vm.runInContext(fs.readFileSync("public/assets/js/kanji-tree-render-engine.js", "utf8"), sandbox, { filename: "engine.js" });
vm.runInContext(fs.readFileSync("public/assets/js/kanji-tree-render-main.js", "utf8"), sandbox, { filename: "main.js" });

const container = { innerHTML: "" };
sandbox.window.KanjiTreeRender.renderTree(container);
const html = container.innerHTML;

console.log("Nature found:", html.includes("Nature & Natural Elements"));
console.log("Alam order:", html.indexOf("Alam & Elemen Alam"));
console.log("Manusia order:", html.indexOf("Manusia & Relasi Sosial"));
console.log("Angka order:", html.indexOf("Angka & Simbol Dasar"));
console.log("Hewan order:", html.indexOf("Hewan"));
console.log("Food order:", html.indexOf("Tumbuhan & Makanan"));
console.log("Bangunan order:", html.indexOf("Bangunan & Tempat"));
console.log("Alat order:", html.indexOf("Alat & Benda"));
console.log("Aksi order:", html.indexOf("Aksi & Gerakan"));
console.log("Bentuk order:", html.indexOf("Bentuk & Bingkai"));