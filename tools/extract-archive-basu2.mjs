// tools/extract-archive-basu2.mjs — Extract correct answers from HTML archive
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const htmlPath = path.join(ROOT, '_arsip/basu2/complete/BASU (OKTOBER-NOVEMBER).htm');
const html = fs.readFileSync(htmlPath, 'utf8');

// Google Forms stores each question's correct answer in data-value attributes
// within radio buttons. The "aria-checked" attribute indicates the selected/preferred answer.
// Let's extract:
// 1) All data-value entries (these are the answer option texts)
// 2) The aria-checked=true ones (these are likely the correct answers)

// Find all radio buttons with their aria-label and data-value
const allRadioRegex = /role="radio"[^>]*aria-label="([^"]*)"[^>]*data-value="([^"]*)"/g;
const allRadios = [];
let m;
while ((m = allRadioRegex.exec(html)) !== null) {
  allRadios.push({ ariaLabel: m[1], dataValue: m[2] });
}

// Find aria-checked="true" radios
const checkedRegex = /aria-checked="true"[^>]*data-value="([^"]*)"/g;
const checkedValues = [];
while ((m = checkedRegex.exec(html)) !== null) {
  checkedValues.push(m[1]);
}

// Alternative: checked might come after data-value
const checkedRegex2 = /data-value="([^"]*)"[^>]*aria-checked="true"/g;
const checkedValues2 = [];
while ((m = checkedRegex2.exec(html)) !== null) {
  checkedValues2.push(m[1]);
}

console.log('Total radio buttons found:', allRadios.length);
console.log('Checked radios (pattern 1):', checkedValues.length);
console.log('Checked radios (pattern 2):', checkedValues2.length);

// Let's also extract question points
const pointsRegex = /Poin yang diterima untuk pertanyaan ini\.">(\d+\/\d+)<\/div>|points.*?>(\d+\/\d+)</g;
const pointsMatches = [...html.matchAll(pointsRegex)];
console.log('Points found:', pointsMatches.length);
if (pointsMatches.length > 0) {
  pointsMatches.slice(0, 30).forEach((p, i) => {
    console.log('  Point ' + (i+1) + ':', p[1] || p[2]);
  });
}

// Extract question titles/headings
const headingRegex = /<div[^>]*role="heading"[^>]*aria-level="3"[^>]*><span[^>]*><br><div>([^<]+)<\/div>/g;
const headings = [];
while ((m = headingRegex.exec(html)) !== null) {
  headings.push(m[1]);
}
console.log('\nTotal question headings found:', headings.length);
headings.slice(0, 30).forEach((h, i) => console.log('  Q' + (i+1) + ': ' + h));

// Now let's look at the data-value entries that look like they could be answers
// Group by nearby proximity
console.log('\n=== ALL UNIQUE DATA-VALUES (first 80) ===');
const uniqueDataValues = [...new Set(allRadios.map(r => r.dataValue))];
console.log('Unique data-values:', uniqueDataValues.length);
uniqueDataValues.slice(0, 80).forEach((v, i) => console.log('  ' + (i+1) + ': ' + v));
