const fs = require('fs');

const mhtmlItems = JSON.parse(fs.readFileSync('tools/parsed-kunci-utf8.json', 'utf8'));

// Filter hanya item yang punya options/pilihan (pertanyaan riil)
const questionsMhtml = mhtmlItems.filter(item => item.options && item.options.length > 0);
console.log('Total valid question items in MHTML:', questionsMhtml.length);

// Muat semua JSON soal di public/basu3-quiz
const quizData = JSON.parse(fs.readFileSync('public/basu3-quiz/quiz-data.json', 'utf8'));

// Kumpulkan file split 51-73
const splitFiles = [
  '51.json', '52.json', '53-54.json', '55-56.json', '57-59.json',
  '61-63.json', '64-65.json', '66-67.json', '68-69.json', '70-71.json',
  '72.json', '73.json'
];

const splitQuestions = [];
splitFiles.forEach(f => {
  const p = 'public/basu3-quiz/' + f;
  if (fs.existsSync(p)) {
    const list = JSON.parse(fs.readFileSync(p, 'utf8'));
    splitQuestions.push(...list);
  }
});

// Gabungkan semua soal aplikasi (1 sampai 73)
const allAppQuestions = new Map();
quizData.forEach(q => allAppQuestions.set(q.no, q));
splitQuestions.forEach(q => allAppQuestions.set(q.no, q));

console.log('Total questions in public/basu3-quiz:', allAppQuestions.size);

// Analisa per nomor
const discrepancies = [];
const verified = [];

let qIndex = 0;
for (const [no, appQ] of Array.from(allAppQuestions.entries()).sort((a,b) => a[0] - b[0])) {
  qIndex++;
  const mhtmlQ = questionsMhtml[no - 1]; // asumsi urutan 1-to-1 dengan nomor soal

  const appAnswerIndex = appQ.answer; // 0, 1, 2, dll
  const appOptions = appQ.options || [];
  const appAnswerText = (appOptions[appAnswerIndex] ? appOptions[appAnswerIndex].text : '').trim();
  const appKunciId = (appQ.kunci_id || '').trim();

  let mhtmlKunci = mhtmlQ ? mhtmlQ.keyAnswer : 'NOT FOUND IN MHTML';

  // Periksa kesesuaian
  // Di MHTML kadang tertulis "Opsi 2" jika opsi tanpa teks atau value index
  let isMatch = false;
  if (mhtmlKunci.startsWith('Opsi ')) {
    const optNum = parseInt(mhtmlKunci.replace('Opsi ', ''));
    if (appAnswerIndex === optNum - 1) {
      isMatch = true;
    }
  } else if (mhtmlKunci && appAnswerText && (mhtmlKunci.includes(appAnswerText) || appAnswerText.includes(mhtmlKunci))) {
    isMatch = true;
  } else if (mhtmlKunci && appKunciId && (mhtmlKunci.includes(appKunciId) || appKunciId.includes(mhtmlKunci))) {
    isMatch = true;
  }

  const resultObj = {
    no,
    title: (appQ.title || '').replace(/\s+/g, ' ').slice(0, 50),
    appAnswerIndex,
    appAnswerText,
    appKunciId,
    mhtmlKunci,
    mhtmlTitle: mhtmlQ ? mhtmlQ.title.replace(/\s+/g, ' ').slice(0, 50) : '',
    isMatch
  };

  if (isMatch) {
    verified.push(resultObj);
  } else {
    discrepancies.push(resultObj);
  }
}

console.log(`\n=== HASIL AUDIT KUNCI JAWABAN BASU 3 ===`);
console.log(`Cocok / Verified : ${verified.length} soal`);
console.log(`Perlu Ditinjau   : ${discrepancies.length} soal\n`);

if (discrepancies.length > 0) {
  console.log('--- DAFTAR SOAL YANG BERBEDA / PERLU DITINJAU ---');
  discrepancies.forEach(d => {
    console.log(`No ${d.no}:`);
    console.log(`  Soal App   : ${d.title}`);
    console.log(`  Kunci App  : [index ${d.appAnswerIndex}] "${d.appAnswerText}" (kunci_id: "${d.appKunciId}")`);
    console.log(`  Kunci Arsip: "${d.mhtmlKunci}"`);
    console.log(`  Soal Arsip : ${d.mhtmlTitle}`);
    console.log('--------------------------------------------------');
  });
}

fs.writeFileSync('tools/audit-basu3-results.json', JSON.stringify({ verified, discrepancies }, null, 2), 'utf8');
