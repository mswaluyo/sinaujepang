import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import fs from "node:fs";

const cred = JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf8"));
admin.initializeApp({ credential: admin.cert(cred), projectId: "sinau-jepang" });
const db = getFirestore();

console.log("=== SCANNING SAMPAH AUTOSAVE DI FIRESTORE ===");
const snap = await db.collection("attempts").get();
console.log(`Total dokumen di /attempts: ${snap.size}`);

const candidates = [];
const groups = {};

snap.forEach(docSnap => {
  const d = docSnap.data() || {};
  const id = docSnap.id;
  const em = (d.email || "").toLowerCase().trim();
  const slug = d.slug || "";
  
  // Kategori sampah:
  // 1. Explicit done: false
  // 2. Tanpa email / slug
  // 3. Skor 0 tanpa durasi pengerjaan (secs)
  // 4. Dokumen legacy duplikat per-soal
  if (d.done === false) {
    candidates.push({ id, reason: "done === false (autosave soal tak tuntas)" });
    return;
  }
  if (!em || !slug) {
    candidates.push({ id, reason: "tanpa email/slug" });
    return;
  }
  if ((d.skor === 0 || d.skor == null) && !d.secs && !d.history) {
    candidates.push({ id, reason: "skor 0 tanpa secs" });
    return;
  }

  const key = `${em}|${slug}`;
  if (!groups[key]) groups[key] = [];
  groups[key].push({ id, ...d });
});

console.log(`\nDokumen sampah murni terdeteksi: ${candidates.length}`);
let multiDocGroups = 0;
for (const [k, docs] of Object.entries(groups)) {
  if (docs.length > 1) {
    multiDocGroups++;
    if (multiDocGroups <= 5) {
      console.log(` - Duplikat ${k}: ${docs.length} dokumen`);
    }
  }
}
console.log(`Total siswa-paket yang memiliki duplikat dokumen per-soal: ${multiDocGroups} grup`);
