// tools/analisis-basu2.mjs — Analisis mendalam data quiz basu2
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, '../public/basu2-quiz/quiz-data.json');

const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
let report = [];
function log(s = '') { report.push(s); }

function getScoreMax(scoreStr) {
  if (!scoreStr || typeof scoreStr !== 'string') return null;
  const parts = scoreStr.split('/');
  return parts[1] ? parseInt(parts[1], 10) : null;
}
function getScoreNum(scoreStr) {
  if (!scoreStr || typeof scoreStr !== 'string') return null;
  const parts = scoreStr.split('/');
  return parts[0] ? parseInt(parts[0], 10) : null;
}

log('========================================');
log('  ANALISIS QUIZ DATA BASU2');
log('========================================');
log('File: ' + DATA_FILE);
log('Total soal: ' + data.length);
log('');

// 1. Distribusi per session
const bySession = {};
data.forEach(q => {
  if (!bySession[q.section]) bySession[q.section] = [];
  bySession[q.section].push(q);
});
log('--- 1. DISTRIBUSI PER SESION ---');
let sessionSummary = [];
for (const [sec, qs] of Object.entries(bySession)) {
  let correct = qs.filter(q => getScoreNum(q.score) === getScoreMax(q.score)).length;
  let zero = qs.filter(q => getScoreNum(q.score) === 0).length;
  log('  ' + sec + ': ' + qs.length + ' soal | full=' + correct + ', zero=' + zero);
  sessionSummary.push({ sec, count: qs.length, correct, zero });
}
log('');

// 2. Distribusi jumlah opsi
const optCounts = {};
data.forEach(q => {
  const n = q.options.length;
  optCounts[n] = (optCounts[n] || 0) + 1;
});
log('--- 2. DISTRIBUSI JUMLAH OPSI ---');
for (const [n, c] of Object.entries(optCounts)) log('  ' + n + ' opsi: ' + c + ' soal');
log('');

// 3. Distribusi skor
const scoreGroups = {};
data.forEach(q => {
  const s = q.score || '(null)';
  scoreGroups[s] = (scoreGroups[s] || 0) + 1;
});
log('--- 3. DISTRIBUSI SKOR ---');
for (const [s, c] of Object.entries(scoreGroups).sort()) log('  "' + s + '": ' + c + ' soal');
log('');


// 4. Answer validation: answer index -> kunci_id
log('--- 4. CEK KEASLIAN JAWABAN (answer index -> kunci_id) ---');
let answerMismatch = [];
data.forEach(q => {
  const ansText = q.options[q.answer]?.text;
  if (ansText !== q.kunci_id) {
    answerMismatch.push({
      no: q.no,
      section: q.section,
      answer_idx: q.answer,
      opt_text: ansText,
      kunci_id: q.kunci_id
    });
  }
});
log('Total jawaban yang kunci_id-nya TIDAK cocok dengan opsi yang dipilih: ' + answerMismatch.length);
if (answerMismatch.length > 0) {
  answerMismatch.forEach(m => {
    log('  No.' + m.no + ' [' + m.section + ']: answer[' + m.answer_idx + '].text="' + m.opt_text + '" vs kunci_id="' + m.kunci_id + '"');
  });
}
log('');

// 5. Score correctness mapping
log('--- 5. ANALISIS SCORE vs KEASLIAN JAWABAN ---');
let fullScoreCorrect = 0, fullScoreMismatch = 0;
let zeroScoreWrong = 0, zeroScoreCorrect = 0;
data.forEach(q => {
  const num = getScoreNum(q.score);
  const max = getScoreMax(q.score);
  const ansText = q.options[q.answer]?.text;
  const isCorrect = ansText === q.kunci_id;
  if (num === max) {
    if (isCorrect) fullScoreCorrect++;
    else fullScoreMismatch++;
  }
  if (num === 0) {
    if (!isCorrect) zeroScoreWrong++;
    else zeroScoreCorrect++;
  }
});
log('Full score (X/X) & jawaban benar (kunci_id match): ' + fullScoreCorrect);
log('Full score (X/X) tapi kunci_id TIDAK match: ' + fullScoreMismatch);
log('Zero score (0/X) & jawaban salah (kunci_id tidak match): ' + zeroScoreWrong);
log('Zero score (0/X) tapi jawaban SEBENARNYA benar (kunci_id match): ' + zeroScoreCorrect);
log('');


// 6. Missing fields
log('--- 6. CEK FIELD YANG KOSONG ---');
let noImg = data.filter(q => !q.img || q.img === '').map(q => q.no);
let noAudio = data.filter(q => !q.audio_url || q.audio_url === '').map(q => q.no);
let noTitle = data.filter(q => !q.title || q.title === '').map(q => q.no);
let noKunci = data.filter(q => !q.kunci_id || q.kunci_id === '').map(q => q.no);
log('No img: ' + noImg.length + ' soal -> ' + noImg.join(','));
log('No audio_url: ' + noAudio.length + ' soal -> ' + noAudio.join(','));
log('No title: ' + noTitle.length + ' soal');
log('No kunci_id: ' + noKunci.length + ' soal');
log('');

// 7. Audio URL format check
log('--- 7. FORMAT AUDIO URL ---');
const hasAudio = data.filter(q => q.audio_url && q.audio_url !== '');
const driveUrls = hasAudio.filter(q => q.audio_url.includes('drive.google.com')).map(q => q.no);
const whatsappUrls = hasAudio.filter(q => q.audio_url.includes('whatsapp.com')).map(q => q.no);
const malformedUrls = hasAudio.filter(q => !q.audio_url.includes('drive.google.com') && !q.audio_url.includes('whatsapp.com')).map(q => q.no);
log('Soal dengan audio_url: ' + hasAudio.length + ' -> ' + hasAudio.map(q => q.no).join(','));
log('Drive.google.com URLs: ' + (driveUrls.length ? driveUrls.join(',') : '(tidak ada)'));
log('Whatsapp URLs: ' + (whatsappUrls.length ? whatsappUrls.join(',') : '(tidak ada)'));
log('Malformed/other URLs: ' + malformedUrls.length + ' -> ' + (malformedUrls.length ? malformedUrls.join(', ') : '(tidak ada)'));
log('');

// 8. Answer index range check
log('--- 8. CEK ANSWER INDEX VALID ---');
let invalidAnswer = data.filter(q => q.answer < 0 || q.answer >= q.options.length);
log('Invalid answer index: ' + invalidAnswer.length + ' soal');
invalidAnswer.forEach(q => log('  No.' + q.no + ': answer=' + q.answer + ', options.length=' + q.options.length));
log('');

// 9. Duplicate check
log('--- 9. DUPLIKAT ---');
const nos = data.map(q => q.no);
const dupNos = [...new Set(nos.filter((n, i) => nos.indexOf(n) !== i))];
log('Duplicate no values: ' + (dupNos.length ? dupNos.join(', ') : '(tidak ada)'));
const dupTitles = {};
data.forEach(q => {
  if (!dupTitles[q.title]) dupTitles[q.title] = [];
  dupTitles[q.title].push(q.no);
});
const dTitles = Object.entries(dupTitles).filter(([t, arr]) => arr.length > 1);
log('Duplicate titles: ' + dTitles.length);
if (dTitles.length > 0) dTitles.forEach(([t, arr]) => log('  "' + t + '": ' + arr.join(', ')));
log('');

// 10. Opsi dengan prefix A./B./C.
log('--- 10. OPSI DENGAN PREFIX HURUF (A./B./C.) ---');
const prefixedOptions = data.filter(q => q.options.some(o => /^[A-D]\.\s/.test(o.text)));
log('Soal dengan opsi ber-prefix: ' + prefixedOptions.length + ' -> ' + prefixedOptions.map(q => q.no).join(','));
log('');


// 11. Soal dengan score 0 (kemungkinan jawaban salah)
log('--- 11. DAFTAR SOAL DENGAN SCORE 0/ (KEMUNGKINAN JAWABAN SALAH) ---');
const zeroScoreItems = data.filter(q => getScoreNum(q.score) === 0);
log('Total: ' + zeroScoreItems.length + ' soal');
zeroScoreItems.forEach(q => {
  const ansText = q.options[q.answer]?.text;
  const isMatch = ansText === q.kunci_id;
  log('  No.' + q.no + ' [' + q.section + '] answer_idx=' + q.answer + ' opt="' + ansText + '" kunci="' + q.kunci_id + '" match=' + isMatch);
});
log('');

// 12. Score denominator per session
log('--- 12. DENOMINATOR SKOR PER SESION ---');
sessionSummary.forEach(s => {
  let denoms = {};
  bySession[s.sec].forEach(q => {
    const d = getScoreMax(q.score);
    denoms[d] = (denoms[d] || 0) + 1;
  });
  log('  ' + s.sec + ': ' + JSON.stringify(denoms));
});
log('');

// Print summary
log('========================================');
log('  RINGKASAN EKSEKUTIF');
log('========================================');
log('Total soal: ' + data.length);
log('Sessions: ' + Object.keys(bySession).length);
for (const s of sessionSummary) {
  log('  ' + s.sec + ': ' + s.count + ' soal (' + s.correct + ' benar, ' + s.zero + ' nol)');
}
log('kunci_id mismatch (answer -> kunci_id): ' + answerMismatch.length);
log('Soal dengan audio: ' + hasAudio.length);
log('Soal tanpa img: ' + noImg.length);
log('Score 0 (kemungkinan salah): ' + zeroScoreItems.length);
log('Malformed audio URLs: ' + malformedUrls.length);

console.log(report.join('\n'));
