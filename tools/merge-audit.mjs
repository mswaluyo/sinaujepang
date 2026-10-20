// tools/merge-attempts.mjs — rapikan /attempts: gabung per siswa-paket (BAGIAN 1/2: audit).
// Aturan: done === false (autosave per-soal) = sampah; tanpa email/slug = lewati;
// skor 0 tanpa secs (latihan kosong) TIDAK dihitung percobaan.
//   node tools/merge-attempts.mjs --dry-run   (audit dulu)
//   node tools/merge-attempts.mjs --yes        (eksekusi beneran, lihat BAGIAN 2)
import { execSync } from "node:child_process";
import fs from "node:fs";

export const PID = (() => { try { return execSync("gcloud config get-value project", { encoding: "utf8" }).trim(); } catch (e) { return "sinau-jepang"; } })() || "sinau-jepang";
export let TOKEN = "";
try { TOKEN = execSync("gcloud auth application-default print-access-token", { encoding: "utf8" }).trim(); }
catch (e) { console.error("Gagal ambil token ADC. Jalankan: gcloud auth login --update-adc"); process.exit(1); }
export const GH = { "Authorization": "Bearer " + TOKEN, "x-goog-user-project": PID };
export const JH = { ...GH, "Content-Type": "application/json" };
export const GO = process.argv.includes("--yes");
console.log("Project: " + PID + (GO ? " [EKSEKUSI]" : " [dry-run]"));

export async function api(url, opt) {
  const r = await fetch(url, opt);
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(url + " -> " + r.status + " " + JSON.stringify(j).slice(0, 400));
  return j;
}
export const num = f => { if (!f) return 0; if (f.integerValue != null) return Number(f.integerValue); if (f.doubleValue != null) return Number(f.doubleValue); return 0; };
export const str = f => f?.stringValue ?? "";
export const tsMs = f => { try { const t = f?.timestampValue; return t ? Date.parse(t) : 0; } catch (e) { return 0; } };
export const atMs = f => tsMs(f?.createdAt) || num(f?.at) || 0;

export async function loadAll(col) {
  let docs = [], pt = "";
  for (;;) {
    const j = await api(`https://firestore.googleapis.com/v1/projects/${PID}/databases/(default)/documents/${col}?pageSize=1000${pt ? "&pageToken=" + pt : ""}`, { headers: GH });
    for (const d of (j.documents || [])) docs.push(d);
    if (j.nextPageToken) pt = j.nextPageToken; else break;
  }
  return docs;
}

const emailUid = {};
for (const d of await loadAll("users")) {
  const em = ((d.fields?.email?.stringValue) || "").toLowerCase();
  if (em) emailUid[em] = d.name.split("/").pop();
}
export const uidOf = em => emailUid[em] || em.replace(/[^a-z0-9]/gi, "_");

const docs = await loadAll("attempts");
const groups = {}, autosaveDel = [];
const noIdent = [];
docs.forEach(d => {
  const f = d.fields || {};
  const em = (str(f.email) || "").toLowerCase();
  const slug = str(f.slug);
  if (f.done?.booleanValue === false) { autosaveDel.push(d); return; }
  if (!em || !slug) { noIdent.push(d); return; }
  const total = num(f.total), skor = num(f.skor);
  if (!(total > 0)) { noIdent.push(d); return; }
  const k = em + "|" + slug;
  (groups[k] = groups[k] || { em, slug, rows: [] }).rows.push({
    name: d.name, email: str(f.email), uname: str(f.name),
    benar: num(f.benar), total, skor, at: atMs(f),
    rawSecs: f.secs || null, empty: !(skor > 0) && !f.secs,
  });
});
let nFull = 0, nEmpty = 0;
Object.values(groups).forEach(g => { g.full = g.rows.filter(r => !r.empty); g.empty = g.rows.filter(r => r.empty); nFull += g.full.length; nEmpty += g.empty.length; });
console.log(`Dokumen: ${docs.length} | grup: ${Object.keys(groups).length} | penuh: ${nFull} | kosong: ${nEmpty} | autosave: ${autosaveDel.length} | tanpa-identitas: ${noIdent.length}`);
Object.entries(groups).map(([k, g]) => ({ k, n: g.full.length })).sort((a, b) => b.n - a.n).slice(0, 15)
  .forEach(x => console.log(`   ${x.k}: ${x.n}x`));
fs.writeFileSync("tools/merge-audit.json", JSON.stringify({
  total: docs.length, grup: Object.keys(groups).length, penuh: nFull, kosong: nEmpty,
  autosave: autosaveDel.length, tanpaIdentitas: noIdent.length,
  top: Object.entries(groups).map(([k, g]) => ({ k, n: g.full.length })).sort((a, b) => b.n - a.n).slice(0, 30)
}, null, 1));
console.log("Audit tersimpan: tools/merge-audit.json");
if (!GO) { console.log("Dry-run selesai. Ulangi dengan --yes untuk eksekusi."); process.exit(0); }
export { groups, autosaveDel, noIdent, docs };
