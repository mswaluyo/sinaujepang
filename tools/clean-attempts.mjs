// tools/clean-attempts.mjs — hapus dokumen sampah di /attempts (TANPA service key)
// Sampah = dokumen autosave per-soal versi lama: done === false (kuis tak selesai),
// skor 0 tanpa secs, atau tanpa slug. Data selesai (done !== false) TIDAK disentuh.
// Cara pakai:
//   gcloud auth login && gcloud config set project sinau-jepang
//   node tools/clean-attempts.mjs --dry-run   (lihat dulu, tanpa menghapus)
//   node tools/clean-attempts.mjs --yes        (hapus beneran)
import { execSync } from "node:child_process";

const DRY = !process.argv.includes("--yes");
const PID = (() => { try { return execSync("gcloud config get-value project", { encoding: "utf8" }).trim(); } catch (e) { return "sinau-jepang"; } })() || "sinau-jepang";
let TOKEN = "";
try { TOKEN = execSync("gcloud auth application-default print-access-token", { encoding: "utf8" }).trim(); }
catch (e) { console.error("Gagal ambil token ADC. Jalankan: gcloud auth login --update-adc"); process.exit(1); }
const H = { "Authorization": "Bearer " + TOKEN, "Content-Type": "application/json", "x-goog-user-project": PID };
console.log("Project: " + PID + (DRY ? " [dry-run]" : " [HAPUS BENERAN]"));

async function api(url, opt) {
  const r = await fetch(url, opt);
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(url + " -> " + r.status + " " + JSON.stringify(j).slice(0, 300));
  return j;
}
const isJunk = f => {
  const g = n => f?.[n];
  const b = n => (g(n)?.integerValue ?? g(n)?.doubleValue ?? null);
  const s = n => g(n)?.stringValue ?? null;
  const bl = n => g(n)?.booleanValue;
  const done = bl("done");
  if (done === false) return "done=false (autosave tak selesai)";
  if (!s("slug") && !s("email")) return "tanpa slug+email";
  const skor = Number(b("skor") ?? 0);
  if (skor === 0 && !g("secs")) return "skor 0 tanpa secs";
  return null;
};
let pageToken = "", total = 0, junk = [];
for (;;) {
  const j = await api(`https://firestore.googleapis.com/v1/projects/${PID}/databases/(default)/documents/attempts?pageSize=1000${pageToken ? "&pageToken=" + pageToken : ""}`, { headers: { "Authorization": "Bearer " + TOKEN, "x-goog-user-project": PID } });
  for (const d of (j.documents || [])) {
    total++;
    const why = isJunk(d.fields || {});
    if (why) junk.push({ name: d.name, why, email: d.fields?.email?.stringValue || "-", slug: d.fields?.slug?.stringValue || "-" });
  }
  if (j.nextPageToken) pageToken = j.nextPageToken;
  else break;
}
console.log(`Total dokumen: ${total}, sampah: ${junk.length}`);
junk.slice(0, 30).forEach(x => console.log(` - ${x.email} | ${x.slug} | ${x.why}`));
if (junk.length > 30) console.log(` …dan ${junk.length - 30} lainnya`);
if (DRY) { console.log("Dry-run selesai. Ulangi dengan --yes untuk menghapus."); process.exit(0); }
let del = 0;
for (const x of junk) {
  await api(`https://firestore.googleapis.com/v1/${x.name}`, { method: "DELETE", headers: H });
  del++;
  if (del % 50 === 0) console.log(` …${del}/${junk.length}`);
}
console.log(`Selesai: ${del} dokumen sampah dihapus.`);
process.exit(0);
