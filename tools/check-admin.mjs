// tools/check-admin.mjs - Cek status admin tanpa membuat perubahan
import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import fs from "node:fs";
const email = (process.argv[2] || "").trim().toLowerCase();
if (!email) {
  console.error("Pakai: node tools/check-admin.mjs <emailUser>");
  process.exit(1);
}
if (!fs.existsSync("./serviceAccountKey.json")) {
  console.error("Tidak ada ./serviceAccountKey.json");
  process.exit(1);
}
const app = admin.initializeApp({ credential: admin.cert(JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf8"))), projectId: "sinau-jepang" });
const auth = getAuth(app);
const db = getFirestore(app);
try {
  const user = await auth.getUserByEmail(email);
  console.log("User ditemukan:", user.email, "(UID:", user.uid + ")");
  console.log("Custom claims:", user.customClaims);
  if (user.customClaims && user.customClaims.admin === true) {
    console.log("STATUS: Sudah admin");
  } else {
    console.log("STATUS: Belum admin");
  }
  // Cek Firestore admins/{uid}
  const doc = await db.collection("admins").doc(user.uid).get();
  if (doc.exists) {
    console.log("Firestore admins/{uid}: ada, data =", doc.data());
  } else {
    console.log("Firestore admins/{uid}: belum ada");
  }
} catch (e) {
  console.error("Error:", e.message);
  process.exit(1);
}
process.exit(0);