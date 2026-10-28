// tools/extract-archive-basu2-v2.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const htmlPath = path.join(ROOT, '_arsip/basu2/complete/BASU (OKTOBER-NOVEMBER).htm');
const html = fs.readFileSync(htmlPath, 'utf8');

const radioBlocks = html.split('role="radio"');
console.log('Radio blocks:', radioBlocks.length - 1);

let checkedAnswers = [];
for (let i = 1; i < radioBlocks.length; i++) {
  const block = radioBlocks[i].substring(0, 500);
  if (block.includes('aria-checked="true"')) {
    const labelMatch = block.match(/aria-label="([^"]*)"/);
    const valueMatch = block.match(/data-value="([^"]*)"/);
    checkedAnswers.push({
      ariaLabel: labelMatch ? labelMatch[1] : '?',
      dataValue: valueMatch ? valueMatch[1] : '?'
    });
  }
}
console.log('Checked answers:', checkedAnswers.length);
checkedAnswers.forEach((a, i) => console.log('  [' + (i+1) + ']', a.ariaLabel, '|', a.dataValue));

const pointsRegex = /Poin yang diterima untuk pertanyaan ini\.">(\d+\/\d+)<\/div>/g;
const points = [];
let pm;
while ((pm = pointsRegex.exec(html)) !== null) points.push(pm[1]);
console.log('\nPoints from HTML:', points.length);
points.forEach((p, i) => console.log('  [' + (i+1) + ']', p));

const jsonData = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/basu2-quiz/quiz-data.json'), 'utf8'));
console.log('\n=== COMPARISON: HTML Points vs JSON scores ===');
const maxCompare = Math.min(points.length, jsonData.length);
let mismatches = 0;
for (let i = 0; i < maxCompare; i++) {
  const htmlScore = points[i];
  const jsonScore = jsonData[i].score;
  const match = htmlScore === jsonScore;
  if (!match) mismatches++;
  console.log('  No.' + jsonData[i].no + ': HTML=' + htmlScore + ' JSON=' + jsonScore + ' ' + (match ? 'OK' : 'XX MISMATCH'));
}
console.log('\nTotal mismatches:', mismatches);
