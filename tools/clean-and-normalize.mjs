import admin from "firebase-admin";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import fs from "node:fs";

const cred = JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf8"));
const app = admin.initializeApp({ credential: admin.cert(cred), projectId: "sinau-jepang" });
const db = getFirestore(app);

console.log("=== MEMULAI PEMBERSIHAN & NORMALISASI DATA /attempts ===");

// 1. Dapatkan pemetaan email -> UID resmi dari koleksi /users
const userSnap = await db.collection("users").get();
const emailToUid = {};
userSnap.forEach(d => {
  const data = d.data();
  if (data.email) {
    emailToUid[data.email.toLowerCase().trim()] = d.id;
  }
});

// 2. Baca seluruh koleksi attempts
const snap = await db.collection("attempts").get();
console.log(`Membaca total ${snap.size} dokumen attempts...`);

const grouped = {};

snap.forEach(d => {
  const data = d.data() || {};
  const email = (data.email || "").toLowerCase().trim();
  const slug = (data.slug || "").trim();
  if (!email || !slug) return;

  const key = `${email}|${slug}`;
  if (!grouped[key]) {
    grouped[key] = [];
  }
  grouped[key].push({ id: d.id, ref: d.ref, ...data });
});

let totalMerged = 0;
let totalDeleted = 0;

for (const [key, docs] of Object.entries(grouped)) {
  const [email, slug] = key.split("|");
  const uid = emailToUid[email] || docs[0].uid || email.replace(/[^a-z0-9]/gi, "_");
  const canonicalId = `${uid}_${slug}`;

  // Kumpulkan seluruh history dan entri dari semua dokumen (lama + baru)
  let allEntries = [];
  let bestSkor = -1;
  let bestBenar = 0;
  let totalSoal = 0;
  let bestSecs = null;
  let latestAt = 0;
  let latestName = "";

  docs.forEach(docData => {
    totalSoal = docData.total || totalSoal;
    if (docData.name) latestName = docData.name;

    // Masukkan entri utama dokumen
    if (docData.skor != null) {
      allEntries.push({
        benar: docData.benar || 0,
        total: docData.total || totalSoal,
        skor: docData.skor || 0,
        secs: docData.secs || null,
        at: docData.at || (docData.createdAt?.toMillis ? docData.createdAt.toMillis() : Date.now())
      });
    }

    // Masukkan history jika ada
    if (Array.isArray(docData.history)) {
      docData.history.forEach(h => {
        allEntries.push({
          benar: h.benar || 0,
          total: h.total || totalSoal,
          skor: h.skor || 0,
          secs: h.secs || null,
          at: h.at || Date.now()
        });
      });
    }
  });

  // Hapus duplikat entri berdasarkan selisih waktu < 60 detik (autosave spam)
  allEntries.sort((a, b) => b.at - a.at);
  const cleanHistory = [];
  for (const item of allEntries) {
    if (!cleanHistory.length) {
      cleanHistory.push(item);
    } else {
      const last = cleanHistory[cleanHistory.length - 1];
      // Jika selisih waktu lebih dari 60 detik, anggap sesi yang berbeda
      if (Math.abs(last.at - item.at) > 60000) {
        cleanHistory.push(item);
      }
    }
  }

  // Hitung sesi nyata (cluster waktu yang berbeda > 10 menit dianggap ujian baru)
  let realSessionsCount = 0;
  let lastSessionTime = 0;
  // Urutkan dari terlama ke terbaru untuk hitung sesi
  const chronological = cleanHistory.slice().sort((a, b) => a.at - b.at);
  chronological.forEach(item => {
    if (item.at - lastSessionTime > 10 * 60 * 1000) {
      realSessionsCount++;
      lastSessionTime = item.at;
    }
  });
  realSessionsCount = Math.max(1, realSessionsCount);

  // Cari best score
  cleanHistory.forEach(item => {
    if (item.skor > bestSkor) {
      bestSkor = item.skor;
      bestBenar = item.benar;
      bestSecs = item.secs;
    }
    if (item.at > latestAt) {
      latestAt = item.at;
    }
  });

  // Siapkan dokumen resmi terpadu
  const finalDoc = {
    uid: uid,
    email: email,
    name: latestName,
    slug: slug,
    skor: bestSkor >= 0 ? bestSkor : 0,
    benar: bestBenar,
    total: totalSoal,
    secs: bestSecs,
    at: latestAt || Date.now(),
    n: realSessionsCount, // Jumlah ujian sebenarnya!
    history: cleanHistory.slice(0, 10), // Maks 10 riwayat bersih
    done: true,
    cleanedAt: FieldValue.serverTimestamp()
  };

  // 1. Tulis ke dokumen kanonikal resmi
  await db.collection("attempts").doc(canonicalId).set(finalDoc);
  totalMerged++;

  // 2. Hapus dokumen lama / sampah duplikat yang ID-nya bukan canonicalId
  for (const docData of docs) {
    if (docData.id !== canonicalId) {
      await docData.ref.delete();
      totalDeleted++;
    }
  }
}

console.log(`\n✅ PEMBERSIHAN SELESAI!`);
console.log(` - Dokumen dinormalisasi & diperbarui: ${totalMerged}`);
console.log(` - Dokumen sampah/duplikat lama dihapus: ${totalDeleted}`);
