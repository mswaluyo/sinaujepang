// tools/merge-exec.mjs — BAGIAN 2/2: eksekusi penggabungan (dipanggil setelah audit).
// Menulis 1 dokumen {uid}_{slug} per grup + menghapus dokumen lama.
// Jalankan: node tools/merge-exec.mjs --yes   (wajib flag --yes)
import { PID, JH, GH, api, GO, uidOf, groups, autosaveDel } from "./merge-audit.mjs";
if (!GO) { console.log("Wajib --yes. Batal."); process.exit(1); }
const V = v => {
  if (v == null) return null;
  if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === "string") return { stringValue: v };
  return null;
};
let wrote = 0, deleted = 0;
for (const [k, g] of Object.entries(groups)) {
  if (!g.full.length) continue;
  const byScore = g.full.slice().sort((a, b) => (b.skor - a.skor) || (b.at - a.at));
  const best = byScore[0];
  const hist = byScore.slice(0, 20).map(r => ({ mapValue: { fields: {
    benar: V(r.benar), total: V(r.total), skor: V(r.skor),
    ...(r.rawSecs ? { secs: r.rawSecs } : {}), at: V(r.at),
  } } }));
  const latestName = g.full.slice().sort((a, b) => b.at - a.at)[0];
  const docId = uidOf(g.em) + "_" + g.slug;
  const base = `https://firestore.googleapis.com/v1/projects/${PID}/databases/(default)/documents/attempts/${docId}`;
  const fields = {
    name: V(latestName.uname || ""), email: V(latestName.email || g.em), slug: V(g.slug),
    benar: V(best.benar), total: V(best.total), skor: V(best.skor),
    ...(best.rawSecs ? { secs: best.rawSecs } : {}),
    at: V(best.at), n: V(g.full.length),
    history: { arrayValue: { values: hist } },
    mergedAt: { timestampValue: new Date().toISOString() },
  };
  Object.keys(fields).forEach(key => fields[key] == null && delete fields[key]);
  const mask = Object.keys(fields).map(f => "updateMask.fieldPaths=" + f).join("&");
  await api(`${base}?${mask}`, { method: "PATCH", headers: JH, body: JSON.stringify({ fields }) });
  wrote++;
  for (const r of g.rows) {
    if (r.name.split("/").pop() === docId) continue;
    await api(`https://firestore.googleapis.com/v1/${r.name}`, { method: "DELETE", headers: GH });
    deleted++;
  }
  if (wrote % 10 === 0) console.log(` …${wrote}/${Object.keys(groups).length} grup, hapus ${deleted}`);
}
for (const d of autosaveDel) {
  await api(`https://firestore.googleapis.com/v1/${d.name}`, { method: "DELETE", headers: GH });
  deleted++;
}
console.log(`Selesai: ${wrote} dokumen gabungan, ${deleted} dokumen lama dihapus.`);
process.exit(0);
