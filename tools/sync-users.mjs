// tools/sync-users.mjs — export SEMUA user Firebase Auth ke CSV/JSON (tanpa service key)
// Cara pakai:
//   gcloud auth login && gcloud config set project sinau-jepang
//   node tools/sync-users.mjs                    -> tulis users-auth.csv + users-auth.json
// Lalu import ke Firestore SEKALI via halaman admin (user admin sudah login):
//   buka /admin.html -> tab Pengguna -> tombol "Import CSV" -> pilih users-auth.csv
// Kenapa dua langkah? Token OAuth user (gcloud) tidak boleh dipakai Admin SDK
// Firestore, dan pembuatan service-account key diblokir organisasi.
import { execSync } from "node:child_process";
import fs from "node:fs";

const PID = (() => { try { return execSync("gcloud config get-value project", { encoding: "utf8" }).trim(); } catch (e) { return "sinau-jepang"; } })() || "sinau-jepang";
let TOKEN = "";
try { TOKEN = execSync("gcloud auth application-default print-access-token", { encoding: "utf8" }).trim(); }
catch (e) { console.error("Gagal ambil token ADC. Jalankan: gcloud auth login --update-adc"); process.exit(1); }
if (!TOKEN) { console.error("Token gcloud kosong. Jalankan: gcloud auth login"); process.exit(1); }
console.log("Project: " + PID);

async function api(url, opt) {
  const r = await fetch(url, opt);
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(url + " -> " + r.status + " " + JSON.stringify(j).slice(0, 300));
  return j;
}
const H = { "Authorization": "Bearer " + TOKEN, "Content-Type": "application/json", "x-goog-user-project": PID };
let users = [], pageToken = "";
for (;;) {
  const body = { pageSize: 1000 };
  if (pageToken) body.pageToken = pageToken;
  const j = await api(`https://identitytoolkit.googleapis.com/v1/projects/${PID}/accounts:query`, { method: "POST", headers: H, body: JSON.stringify(body) });
  (j.userInfo || []).forEach(u => users.push(u));
  if (j.nextPageToken) pageToken = j.nextPageToken;
  else break;
}
console.log(`Ditemukan ${users.length} user di Authentication.`);
const rows = users.map(u => ({
  uid: u.localId || "",
  name: u.displayName || "",
  email: u.email || "",
  photo: u.photoUrl || "",
  createdAt: u.createdAt && u.createdAt !== "0" ? new Date(Number(u.createdAt)).toISOString() : "",
  lastLoginAt: u.lastLoginAt && u.lastLoginAt !== "0" ? new Date(Number(u.lastLoginAt)).toISOString() : "",
}));
const cell = s => /[",\n]/.test(s) ? '"' + String(s).replace(/"/g, '""') + '"' : String(s);
const csv = "﻿" + ["uid,nama,email,foto,dibuat,login_terakhir"].concat(
  rows.map(r => [r.uid, r.name, r.email, r.photo, r.createdAt, r.lastLoginAt].map(cell).join(","))
).join("\n");
fs.writeFileSync("tools/users-auth.csv", csv);
fs.writeFileSync("tools/users-auth.json", JSON.stringify(rows, null, 1));
console.log("Ditulis: tools/users-auth.csv + tools/users-auth.json");
console.log("Langkah berikut: /admin.html -> tab Pengguna -> Import CSV -> pilih tools/users-auth.csv");
process.exit(0);
