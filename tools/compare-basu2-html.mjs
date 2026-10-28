// tools/compare-basu2-html.mjs — Cross-reference HTML archive answers vs JSON
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const htmlPath = path.join(ROOT, '_arsip/basu2/complete/BASU (OKTOBER-NOVEMBER).htm');
const html = fs.readFileSync(htmlPath, 'utf8');
const jsonData = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/basu2-quiz/quiz-data.json'), 'utf8'));

// Extract radiogroup data-values
const radioGroupRegex = /role="radiogroup"[^>]*data-value="([^"]*)"/g;
const radioGroupRegex2 = /data-value="([^"]*)"[^>]*role="radiogroup"/g;
const htmlAnswers = [];
let m;
while ((m = radioGroupRegex.exec(html)) !== null) htmlAnswers.push(m[1]);
while ((m = radioGroupRegex2.exec(html)) !== null) {
  if (!htmlAnswers.includes(m[1]) || true) htmlAnswers.push(m[1]);
}

// Extract points
const pointsRegex = /<div[^>]*id="i\.points\.\d+"[^>]*>(\d+\/\d+)<\/div>/g;
const htmlPoints = [];
while ((m = pointsRegex.exec(html)) !== null) htmlPoints.push(m[1]);

// Extract correctness (Benar/Salah)
const noteRegex = /aria-label="(Benar|Salah)" role="note"/g;
const htmlCorrectness = [];
while ((m = noteRegex.exec(html)) !== null) htmlCorrectness.push(m[1]);

// Extract headings
const headingRegex = /class="cTDvob D1wxyf RjsPE" id="i\d+" role="heading" aria-level="3"[^>]*><span[^>]*>(?:<br>)?<div>([^<]*)<\/div>|class="cTDvob D1wxyf RjsPE" id="i\d+" role="heading" aria-level="3"[^>]*><span[^>]*><br><div>([^<]*)<\/div>/g;
const htmlHeadings = [];
while ((m = headingRegex.exec(html)) !== null) {
  htmlHeadings.push((m[1] || m[2] || '').trim());
}

console.log('HTML entries:', htmlAnswers.length);
console.log('HTML points:', htmlPoints.length);
console.log('HTML correctness:', htmlCorrectness.length);
console.log('HTML headings:', htmlHeadings.length);

// Now match HTML entries to JSON by comparing data-value with kunci_id
// The radiogroup data-value might contain the full answer text
// The hidden input value also contains the answer

// Let's also extract hidden input values
const hiddenRegex = /<input type="hidden"[^>]*value="([^"]*)"/g;
const hiddenValues = [];
while ((m = hiddenRegex.exec(html)) !== null) hiddenValues.push(m[1]);

console.log('\n=== CROSS-REFERENCE: HTML Answer Key vs JSON kunci_id ===');
let matched = 0, unmatched = 0, mismatches = [];
let htmlExtra = [];

for (let i = 0; i < jsonData.length; i++) {
  const jq = jsonData[i];
  const jsonKunci = jq.kunci_id;
  const jsonOpt = jq.options[jq.answer]?.text;

  // Try to find matching HTML entry by data-value
  let found = -1;
  for (let j = 0; j < htmlAnswers.length; j++) {
    const hv = htmlAnswers[j];
    // Check if HTML answer matches either kunci_id or the option text
    if (hv === jsonKunci || hv === jsonOpt) {
      found = j;
      break;
    }
  }
  if (found === -1) {
    // Try hidden values
    for (let j = 0; j < hiddenValues.length; j++) {
      if (hiddenValues[j] === jsonKunci || hiddenValues[j] === jsonOpt) {
        found = j;
        break;
      }
    }
  }

  if (found !== -1) {
    matched++;
    const htmlScore = htmlPoints[found] || '?';
    const htmlCorrect = htmlCorrectness[found] || '?';
    const matchScore = htmlScore === jq.score;
    const matchCorrect = (htmlCorrect === 'Benar' && getScoreNum(jq.score) === getScoreMax(jq.score)) ||
                         (htmlCorrect === 'Salah' && getScoreNum(jq.score) === 0);
    if (!matchScore || !matchCorrect) {
      mismatches.push({
        jsonNo: jq.no, section: jq.section,
        htmlEntry: found + 1, htmlScore, jsonScore: jq.score,
        htmlCorrect, matchScore, matchCorrect
      });
    }
  } else {
    unmatched++;
    htmlExtra.push({ jsonNo: jq.no, jsonKunci, jsonOpt });
  }
}

console.log('Matched: ' + matched + ', Unmatched: ' + unmatched);
console.log('\n=== DISCREPANCIES ===');
mismatches.forEach(m => {
  const flags = [];
  if (!m.matchScore) flags.push('SCORE MISMATCH');
  if (!m.matchCorrect) flags.push('CORRECTNESS MISMATCH');
  console.log('  No.' + m.jsonNo + ' [' + m.section + '] HTML[' + m.htmlEntry + ']: HTML=' + m.htmlScore + '(' + m.htmlCorrect + ') JSON=' + m.jsonScore + ' -> ' + flags.join(', '));
});

console.log('\n=== UNMATCHED JSON QUESTIONS ===');
htmlExtra.forEach(e => console.log('  No.' + e.jsonNo + ': kunci_id="' + e.jsonKunci + '" opt="' + e.jsonOpt + '"'));

// Now check: for questions where JSON says answer X but HTML data-value says different
console.log('\n=== VERIFY: Does HTML answer key match JSON answer selection? ===');
for (let i = 0; i < jsonData.length; i++) {
  const jq = jsonData[i];
  const jsonKunci = jq.kunci_id;
  const jsonOpt = jq.options[jq.answer]?.text;

  let htmlMatch = null;
  for (let j = 0; j < htmlAnswers.length; j++) {
    if (htmlAnswers[j] === jsonKunci || htmlAnswers[j] === jsonOpt) {
      htmlMatch = { idx: j, value: htmlAnswers[j] };
      break;
    }
  }
  if (htmlMatch) {
    // Check if HTML answer matches the option text selected by JSON
    if (htmlMatch.value !== jsonOpt) {
      console.log('  No.' + jq.no + ': HTML kunci="' + htmlMatch.value + '" vs JSON opt_text="' + jsonOpt + '" — DIFFERENT ANSWER');
    }
  }
}

function getScoreNum(s) {
  if (!s) return null;
  const p = s.split('/'); return p[0] ? parseInt(p[0]) : null;
}
function getScoreMax(s) {
  if (!s) return null;
  const p = s.split('/'); return p[1] ? parseInt(p[1]) : null;
}
