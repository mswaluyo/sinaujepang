// tools/extract-archive-basu2-v5.mjs — Extract all answer keys from HTML archive
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const htmlPath = path.join(ROOT, '_arsip/basu2/complete/BASU (OKTOBER-NOVEMBER).htm');
const html = fs.readFileSync(htmlPath, 'utf8');
const jsonData = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/basu2-quiz/quiz-data.json'), 'utf8'));

// Pattern: radiogroup data-value="CORRECT_ANSWER_TEXT"
// Also extract: aria-label="Benar/Salah" and points
// And: heading text (question title/number)

// Extract radiogroup data-values
const radioGroupRegex = /role="radiogroup"[^>]*data-value="([^"]*)"/g;
const hiddenInputRegex = /<input type="hidden"[^>]*value="([^"]*)"/g;

// Also try the reverse order
const radioGroupRegex2 = /data-value="([^"]*)"[^>]*role="radiogroup"/g;

const radioGroupValues = [];
let m;
while ((m = radioGroupRegex.exec(html)) !== null) {
  radioGroupValues.push(m[1]);
}
while ((m = radioGroupRegex2.exec(html)) !== null) {
  radioGroupValues.push(m[1]);
}

// Extract hidden input values
const hiddenValues = [];
while ((m = hiddenInputRegex.exec(html)) !== null) {
  hiddenValues.push(m[1]);
}

// Extract all aria-labels (Benar/Salah)
const noteRegex = /aria-label="(Benar|Salah)" role="note"/g;
const correctness = [];
while ((m = noteRegex.exec(html)) !== null) {
  correctness.push(m[1]);
}

// Extract all points
const pointsRegex = /<div[^>]*id="i\.points\.\d+"[^>]*>(\d+\/\d+)<\/div>/g;
const allPoints = [];
while ((m = pointsRegex.exec(html)) !== null) {
  allPoints.push(m[1]);
}

// Extract question headings - look for aria-label of heading div
const headingRegex = /class="cTDvob D1wxyf RjsPE" id="i\d+" role="heading" aria-level="3"[^>]*><span[^>]*><br><div>([^<]*)<\/div>/g;
const headings = [];
while ((m = headingRegex.exec(html)) !== null) {
  headings.push(m[1].trim());
}

console.log('=== EXTRACTED FROM HTML ARCHIVE ===');
console.log('Radiogroup data-values:', radioGroupValues.length);
console.log('Hidden input values:', hiddenValues.length);
console.log('Correctness (Benar/Salah):', correctness.length);
console.log('Points:', allPoints.length);
console.log('Headings:', headings.length);

console.log('\n=== ALL RADIogroup data-values (ANSWER KEYS) ===');
radioGroupValues.forEach((v, i) => console.log('  [' + (i+1) + ']', v));

console.log('\n=== ALL HIDDEN INPUT VALUES ===');
hiddenValues.forEach((v, i) => console.log('  [' + (i+1) + ']', v));

console.log('\n=== CORRECTNESS LABELS ===');
correctness.forEach((v, i) => console.log('  [' + (i+1) + ']', v));

console.log('\n=== ALL POINTS ===');
allPoints.forEach((v, i) => console.log('  [' + (i+1) + ']', v));

console.log('\n=== HEADINGS ===');
headings.forEach((v, i) => console.log('  [' + (i+1) + ']', v));
