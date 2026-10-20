// tools/check-n.mjs — cek field n + history beberapa dokumen gabungan
import { execSync } from "node:child_process";
const PID = "sinau-jepang";
const T = execSync("gcloud auth application-default print-access-token", { encoding: "utf8" }).trim();
const GH = { "Authorization": "Bearer " + T, "x-goog-user-project": PID };
const get = async id => {
  const r = await fetch(`https://firestore.googleapis.com/v1/projects/${PID}/databases/(default)/documents/attempts/${id}`, { headers: GH });
  return r.ok ? await r.json() : null;
};
const u = (await (await fetch(`https://firestore.googleapis.com/v1/projects/${PID}/databases/(default)/documents/users?pageSize=1000`, { headers: GH })).json()).documents || [];
const m = {};
u.forEach(d => { const em = (d.fields?.email?.stringValue || "").toLowerCase(); if (em) m[em] = d.name.split("/").pop(); });
for (const em of ["dwinovita880@gmail.com", "caradindavid2@gmail.com", "davidlorok12@gmail.com"]) {
  if (!m[em]) { console.log(em, "-> user tidak ada"); continue; }
  for (const s of ["kuroi-quiz", "tomemasu-quiz", "orimasu-quiz"]) {
    const d = await get(m[em] + "_" + s);
    if (!d) { console.log(em, s, "-> TIDAK ADA"); continue; }
    const f = d.fields;
    const h = f.history?.arrayValue?.values?.length || 0;
    console.log(em, s, "-> n=" + (f.n?.integerValue || f.n?.doubleValue || "?"), "skor=" + (f.skor?.integerValue || f.skor?.doubleValue), "hist=" + h);
  }
}
process.exit(0);
