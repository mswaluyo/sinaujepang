// tools/make-admin.mjs - set admin pertama SinauJepang
// Cara pakai:
//   1. Download serviceAccountKey.json dari Firebase Console
//      (Project Settings > Service accounts > Generate new private key)
//      simpan sebagai ./serviceAccountKey.json (JANGAN di-commit!)
//   2. npm i -D firebase-admin
//   3. node tools/make-admin.mjs <emailUser>
//      contoh: node tools/make-admin.mjs guru@gmail.com
// Script ini: set custom claim {admin:true} + buat dokumen /admins/{uid}
import admin from "firebase-admin";
import fs from "node:fs";
const email = (process.argv[2] || "").trim().toLowerCase();
if (!email) {
  console.error("Pakai: node tools/make-admin.mjs <emailUser>");
  process.exit(1);
}
if (!fs.existsSync("./serviceAccountKey.json")) {
  console.error("Tidak ada ./serviceAccountKey.json - download dulu dari Firebase Console > Project Settings > Service accounts.");
  process.exit(1);
}
const app = admin.initializeApp({ credential: admin.cert(JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf8"))), projectId: "sinau-jepang" });
const user = await app.auth().getUserByEmail(email);
await app.auth().setCustomUserClaims(user.uid, { admin: true });
await app.firestore().collection("admins").doc(user.uid).set({
  email: user.email,
  role: "admin",
  createdAt: admin.firestore.FieldValue.serverTimestamp()
}, { merge: true });
console.log(`OK: ${user.email} (${user.uid}) sekarang ADMIN. Minta user logout + login ulang.`);
process.exit(0);