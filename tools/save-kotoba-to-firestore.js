#!/usr/bin/env node

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Konfigurasi
const DATA_DIR = path.join(process.cwd(), 'public');
const BACKUP_DIR = path.join(process.cwd(), 'backup');

const FILES_TO_UPLOAD = [
  { file: 'kotoba-benda.json', jenis: 'N', collection: 'kotoba' },
  { file: 'kotoba-kerja.json', jenis: 'V', collection: 'kotoba' },
  { file: 'kotoba-sifat.json', jenis: 'A', collection: 'kotoba' },
  { file: 'kotoba-ungkapan.json', jenis: 'U', collection: 'kotoba' },
  { file: 'kotoba-master.json', jenis: 'MIXED', collection: 'kotoba' }
];

async function initializeFirebase() {
  const serviceAccount = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'serviceAccountKey.json'), 'utf-8'));
  const app = admin.initializeApp({ credential: admin.credential.cert(serviceAccount), projectId: serviceAccount.project_id });
  console.log('Firebase berhasil diinisialisasi');
  return app.firestore();
}

function formatData(data, jenis) {
  const docs = [];
  const items = data.data || data;
  if (!items || !Array.isArray(items)) return docs;
  for (const item of items) {
    docs.push({
      kanji: item.kanji || '',
      kana: item.kana || '',
      rom: item.rom || '',
      arti: item.arti || '',
      jenis: jenis,
      paket: item.paket || [],
      no: item.no || 0,
      section: item.section || '',
      source: 'soal-jft',
      sourceFile: item.sourceFile || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
  return docs;
}

async function uploadToFirestore(firestore, files) {
  const batch = firestore.batch();
  let total = 0;
  for (const { file, jenis, collection } of files) {
    if (fs.existsSync(path.join(BACKUP_DIR, file))) {
      console.log('Membaca: ' + file + ' (dari backup/)');
      const data = JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, file), 'utf-8'));
      const docs = formatData(data, jenis);
      for (const doc of docs) { batch.set(firestore.collection(collection).doc(doc.kanji), doc); total++; }
    } else if (fs.existsSync(path.join(DATA_DIR, file))) {
      console.log('Membaca: ' + file + ' (dari public/)');
      const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8'));
      const docs = formatData(data, jenis);
      for (const doc of docs) { batch.set(firestore.collection(collection).doc(doc.kanji), doc); total++; }
    }
  }
  if (total > 0) { await batch.commit(); console.log('Upload ' + total + ' dokumen ke Firestore'); }
  else { console.log('Tidak ada dokumen yang diupload'); }
}

async function main() {
  console.log('=== Save Kotoba to Firestore ===');
  if (!fs.existsSync(path.join(process.cwd(), 'serviceAccountKey.json'))) {
    console.error('File serviceAccountKey.json tidak ditemukan');
    process.exit(1);
  }
  try {
    const firestore = await initializeFirebase();
    console.log('Firebase terhubung');
    await uploadToFirestore(firestore, FILES_TO_UPLOAD);
    const count = await firestore.collection('kotoba').count().get();
    console.log('Total dokumen: ' + count.data().count);
    await admin.app().delete();
    console.log('Selesai!');
  } catch (e) { console.error('Error: ' + e.message); process.exit(1); }
}

main();
