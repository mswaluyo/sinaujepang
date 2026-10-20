// tools/count-email.mjs — hitung dokumen attempts per email+slug langsung dari Firestore
// Pakai: node tools/count-email.mjs <email> [slug]
import { execSync } from "node:child_process";
const [email, slug] = process.argv.slice(2);
if (!email) { console.error("Pakai: node tools/count-email.mjs <email> [slug]"); process.exit(1); }
const PID = (() => { try { return execSync("gcloud config get-value project", { encoding: "utf8" }).trim(); } catch (e) { return "sinau-jepang"; } })() || "sinau-jepang";
const TOKEN = execSync("gcloud auth application-default print-access-token", { encoding: "utf8" }).trim();
const GH = { "Authorization": "Bearer " + TOKEN, "x-goog-user-project": PID };
let pageToken = "", rows = [];
for (;;) {
  const body = { structuredQuery: { from: [{ collectionId: "attempts" }], where: { fieldFilter: { field: { fieldPath: "email" }, op: "EQUAL", value: { stringValue: email } } }, limit: 1000, ...(pageToken ? { startAfter: pageToken } : {}) } };
  const r = await fetch(`https://firestore.googleapis.com/v1/projects/${PID}/databases/(default)/documents:runQuery`, { method: "POST", headers: { ...GH, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const j = await r.json();
  if (!r.ok) { console.error(JSON.stringify(j).slice(0, 400)); process.exit(1); }
  for (const x of j) { if (x.document) rows.push(x.document); }
  break;
}
const bySlug = {};
rows.forEach(d => {
  const f = d.fields || {};
  const s = f.slug?.stringValue || "-";
  const done = f.done?.booleanValue;
  const skor = Number(f.skor?.integerValue ?? f.skor?.doubleValue ?? -1);
  bySlug[s] = bySlug[s] || { total: 0, doneFalse: 0, skor0: 0, skorMax: -1 };
  const o = bySlug[s]; o.total++;
  if (done === false) o.doneFalse++;
  if (skor === 0) o.skor0++;
  if (skor > o.skorMax) o.skorMax = skor;
});
console.log(`email=${email} total=${rows.length}`);
Object.entries(bySlug).filter(([s]) => !slug || s === slug).forEach(([s, o]) => console.log(` ${s}: total=${o.total} doneFalse=${o.doneFalse} skor0=${o.skor0} skorMax=${o.skorMax}`));
process.exit(0);
