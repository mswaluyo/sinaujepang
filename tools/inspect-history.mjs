import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import fs from "node:fs";

const cred = JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf8"));
const app = admin.initializeApp({ credential: admin.cert(cred), projectId: "sinau-jepang" });
const db = getFirestore(app);

const d = await db.collection("attempts").doc("hiraganeyuu_gmail_com_hare-quiz").get();
const data = d.data();
console.log("history:", JSON.stringify(data.history, null, 2));
