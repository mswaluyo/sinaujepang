// tools/extract-archive-basu2-v3.mjs — Deep extraction of answer key from HTML
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const htmlPath = path.join(ROOT, '_arsip/basu2/complete/BASU (OKTOBER-NOVEMBER).htm');
const html = fs.readFileSync(htmlPath, 'utf8');
const jsonData = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/basu2-quiz/quiz-data.json'), 'utf8'));

// In Google Forms quiz results, each radio button has:
// - aria-label="option text"
// - data-value="option text"  
// - aria-checked="true/false" (true = student selected this)
// Near each radio, there's a "Benar" or "Salah" label indicating correctness

// Let's extract blocks around "Benar" and "Salah" labels
// Strategy: find each "Benar" or "Salah" occurrence, look backward for the nearest aria-label

// Split by the Benar/Salah labels to find associated options
const benarIndices = [];
const salahIndices = [];
const allLabel = 'Benar';
let idx = html.indexOf(allLabel);
while (idx !== -1) {
  benarIndices.push(idx);
  idx = html.indexOf(allLabel, idx + 1);
}
idx = html.indexOf('Salah');
while (idx !== -1) {
  salahIndices.push(idx);
  idx = html.indexOf('Salah', idx + 1);
}

console.log('Benar occurrences:', benarIndices.length);
console.log('Salah occurrences:', salahIndices.length);

// For each Benar/Salah, extract nearby aria-label (within 1000 chars before)
const benarLabels = [];
const salahLabels = [];
benarIndices.forEach(pos => {
  const chunk = html.substring(Math.max(0, pos - 1000), pos + 100);
  const labelMatch = chunk.match(/aria-label="([^"]*)"/g);
  if (labelMatch) {
    benarLabels.push(labelMatch[labelMatch.length - 1].replace(/aria-label="|"/g, ''));
  }
});
salahIndices.forEach(pos => {
  const chunk = html.substring(Math.max(0, pos - 1000), pos + 100);
  const labelMatch = chunk.match(/aria-label="([^"]*)"/g);
  if (labelMatch) {
    salahLabels.push(labelMatch[labelMatch.length - 1].replace(/aria-label="|"/g, ''));
  }
});

console.log('\n=== BENAR (correct) option labels (' + benarLabels.length + ') ===');
benarLabels.forEach((l, i) => console.log('  [' + (i+1) + '] ' + l));

console.log('\n=== SALAH (wrong) option labels (' + salahLabels.length + ') ===');
salahLabels.forEach((l, i) => console.log('  [' + (i+1) + '] ' + l));
