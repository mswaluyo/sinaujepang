// tools/extract-archive-basu2-v4.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const htmlPath = path.join(ROOT, '_arsip/basu2/complete/BASU (OKTOBER-NOVEMBER).htm');
const html = fs.readFileSync(htmlPath, 'utf8');

// Find context around "raket tenis" (No.62, known correct answer in JSON)
const searchTerm = 'raket tenis';
const termPos = html.indexOf(searchTerm);
if (termPos !== -1) {
  const start = Math.max(0, termPos - 1500);
  const end = Math.min(html.length, termPos + 1500);
  const chunk = html.substring(start, end);
  console.log('=== Context around "raket tenis" (No.62) ===');
  console.log(chunk);
}

console.log('\n\n=== Searching for "Salah" context ===');
const salahPos = html.indexOf('Salah');
if (salahPos !== -1) {
  const start = Math.max(0, salahPos - 800);
  const end = Math.min(html.length, salahPos + 800);
  console.log(html.substring(start, end));
}

console.log('\n\n=== Searching for "Benar" context ===');
const benarPos = html.indexOf('Benar');
if (benarPos !== -1) {
  const start = Math.max(0, benarPos - 800);
  const end = Math.min(html.length, benarPos + 800);
  console.log(html.substring(start, end));
}
