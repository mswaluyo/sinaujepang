import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import fs from "node:fs";

const app = admin.initializeApp({
  credential: admin.cert(JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf8"))),
  projectId: "sinau-jepang"
});
const auth = getAuth(app);
const db = getFirestore(app);

const authUsers = (await auth.listUsers()).users;
let synced = 0;

for (const u of authUsers) {
  const ref = db.collection("users").doc(u.uid);
  const snap = await ref.get();
  if (!snap.exists) {
    const createdAt = u.metadata.creationTime ? new Date(u.metadata.creationTime) : new Date();
    const lastLoginAt = u.metadata.lastSignInTime ? new Date(u.metadata.lastSignInTime) : createdAt;
    await ref.set({
      name: u.displayName || (u.email ? u.email.split("@")[0] : "User"),
      email: u.email || "",
      photo: u.photoURL || "",
      createdAt: Timestamp.fromDate(createdAt),
      lastLoginAt: Timestamp.fromDate(lastLoginAt),
      loginCount: 1
    }, { merge: true });
    synced++;
    console.log(`Synced: ${u.email} (${u.uid})`);
  }
}

console.log(`Berhasil sinkronisasi ${synced} user dari Authentication ke Firestore.`);
process.exit(0);
