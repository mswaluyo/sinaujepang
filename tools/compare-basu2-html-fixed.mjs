// tools/compare-basu2-html-fixed.mjs
// KEY INSIGHT: In Google Forms quiz results:
//   data-value = STUDENT'S SELECTED answer
//   aria-label="Benar/Salah" + points = whether selection was correct
//   kunci_id in JSON = CORRECT answer (from quiz creator)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const html = fs.readFileSync(path.join(ROOT, '_arsip/basu2/complete/BASU (OKTOBER-NOVEMBER).htm'), 'utf8');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/basu2-quiz/quiz-data.json'), 'utf8'));

const rgRegex1 = /role="radiogroup"[^>]*data-value="([^"]*)"/g;
const rgRegex2 = /data-value="([^"]*)"[^>]*role="radiogroup"/g;
const htmlAnswers = [];
let m;
while ((m = rgRegex1.exec(html)) !== null) htmlAnswers.push(m[1]);
while ((m = rgRegex2.exec(html)) !== null) { if (!htmlAnswers.includes(m[1]) || true) htmlAnswers.push(m[1]); }

const pointsRegex = /id="i\.points\.\d+"[^>]*>(\d+\/\d+)<\/div>/g;
const htmlPoints = [];
while ((m = pointsRegex.exec(html)) !== null) htmlPoints.push(m[1]);

const corrRegex = /aria-label="(Benar|Salah)" role="note"/g;
const htmlCorrectness = [];
while ((m = corrRegex.exec(html)) !== null) htmlCorrectness.push(m[1]);

const hiddenRegex = /<input type="hidden"[^>]*value="([^"]*)"/g;
const hiddenValues = [];
while ((m = hiddenRegex.exec(html)) !== null) hiddenValues.push(m[1]);

function getScoreNum(s) { return s ? parseInt(s.split('/')[0]) : null; }
function getScoreMax(s) { return s ? parseInt(s.split('/')[1]) : null; }
function normalize(s) { if (!s) return ''; return s.replace(/\s+/g, '').replace(/\s*\([^)]+\)/g, '').toLowerCase(); }

const htmlEntries = [];
for (let i = 0; i < Math.min(htmlAnswers.length, htmlPoints.length, htmlCorrectness.length); i++) {
  htmlEntries.push({ idx: i + 1, studentAnswer: htmlAnswers[i], points: htmlPoints[i] || '?/?', correctness: htmlCorrectness[i] || '?' });
}

console.log('HTML entries:', htmlEntries.length, '| JSON questions:', data.length);

// === MAIN CROSS-REFERENCE ===
// Match JSON questions to HTML entries by student's selected answer matching kunci_id
console.log('\n=== CROSS-REFERENCE: JSON kunci_id vs HTML student selection ===\n');

let matched = 0, unmatched = 0;
const scoreMismatches = [];
const details = [];

for (let i = 0; i < data.length; i++) {
  const jq = data[i];
  const kunci = jq.kunci_id;
  const optText = jq.options[jq.answer]?.text;

  // Find HTML entry where student's selection matches kunci_id or opt_text
  let htmlEntry = null;
  for (let j = 0; j < htmlEntries.length; j++) {
    const entry = htmlEntries[j];
    if (entry.studentAnswer === kunci || entry.studentAnswer === optText) {
      htmlEntry = entry;
      break;
    }
  }

  if (htmlEntry) {
    matched++;
    const htmlScore = htmlEntry.points;
    const jsonScore = jq.score;
    const htmlCorrect = htmlEntry.correctness;
    const scoreMatch = htmlScore === jsonScore;
    const isImageBased = htmlEntry.studentAnswer.startsWith('Opsi');
    let status = 'OK';

    if (!scoreMatch) {
      if (htmlCorrect === 'Benar' && !isImageBased) {
        scoreMismatches.push({ jsonNo: jq.no, section: jq.section, htmlIdx: htmlEntry.idx, htmlScore, jsonScore, htmlCorrect });
        status = '!! SCORE MISMATCH';
      } else if (htmlCorrect === 'Benar' && isImageBased) {
        status = 'OK (image-based, score may differ due to Opsi label)';
      } else {
        // Salah + score mismatch or Benar with image-based
        if (htmlCorrect === 'Benar') status = '~ score differs but image-based (Benar)';
        else status = 'OK (Salah, scores may differ in denom)';
      }
    }

    details.push({ jsonNo: jq.no, section: jq.section, htmlIdx: htmlEntry.idx, htmlAns: htmlEntry.studentAnswer, jsonKunci: kunci, htmlPoints: htmlScore, jsonScore, htmlCorrect, status });
  } else {
    unmatched++;
    const kunciInHtml = html.indexOf(kunci);
    const optInHtml = html.indexOf(optText);
    let nearestDv = '';
    if (kunciInHtml !== -1) {
      const rgPos = html.lastIndexOf('data-value=', kunciInHtml);
      if (rgPos !== -1) {
        const chunk = html.substring(rgPos, rgPos + 200);
        const rgm = chunk.match(/data-value="([^"]*)"/);
        if (rgm) nearestDv = rgm[1];
      }
    }
    details.push({ jsonNo: jq.no, section: jq.section, htmlIdx: 'N/A', htmlAns: 'NOT FOUND', jsonKunci: kunci, htmlPoints: 'N/A', jsonScore: jq.score, htmlCorrect: 'N/A', status: 'UNMATCHED' + (nearestDv ? ' (nearest data-value: "' + nearestDv + '")' : '') });
  }
}

// Print all details
console.log('Matched:', matched, '| Unmatched:', unmatched);
console.log('\n--- ALL DETAILS ---');
details.forEach(d => {
  const marker = d.status.startsWith('!!') ? '!!' : d.status.startsWith('UNMATCHED') ? '--' : '  ';
  console.log(marker + ' No.' + String(d.jsonNo).padStart(2) + ' [' + d.section + ']');
  console.log('     JSON: kunci="' + d.jsonKunci + '" score=' + d.jsonScore);
  console.log('     HTML: studentAnswer="' + d.htmlAns + '" points=' + d.htmlPoints + ' (' + d.htmlCorrect + ')');
  console.log('     Status: ' + d.status);
});

console.log('\n=== SCORE MISMATCHES (JSON score=0 but HTML shows Benar/full points) ===');
console.log('Count:', scoreMismatches.length);
scoreMismatches.forEach(s => console.log('  No.' + s.jsonNo + ' [' + s.section + ']: HTML=' + s.htmlPoints + '(' + s.htmlCorrect + ') JSON=' + s.jsonScore));

console.log('\n=== UNMATCHED QUESTIONS ===');
details.filter(d => d.status === 'UNMATCHED' || d.status.startsWith('UNMATCHED')).forEach(d => {
  console.log('  No.' + d.jsonNo + ' [' + d.section + ']: kunci="' + d.jsonKunci + '" score=' + d.jsonScore);
  console.log('    ' + d.status);
});

