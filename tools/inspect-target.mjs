import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import fs from "node:fs";

const cred = JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf8"));
const app = admin.initializeApp({ credential: admin.cert(cred), projectId: "sinau-jepang" });
const db = getFirestore(app);

const targetEmails = ["hiraganeyuu@gmail.com", "viramasaokori123@gmail.com", "dwinovita880@gmail.com"];

for (const em of targetEmails) {
  console.log(`\n================== ${em} ==================`);
  const snap = await db.collection("attempts").where("email", "==", em).get();
  snap.forEach(d => {
    const data = d.data();
    console.log(`Doc ID: ${d.id}`);
    console.log(` - slug: ${data.slug}, skor: ${data.skor}, benar: ${data.benar}, total: ${data.total}`);
    console.log(` - field 'n': ${data.n}`);
    console.log(` - history length: ${Array.isArray(data.history) ? data.history.length : 'tidak ada'}`);
  });
}
