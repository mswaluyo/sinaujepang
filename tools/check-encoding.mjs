import fs from 'fs';
const h = fs.readFileSync('./public/jft-a2.html', 'utf8');
const idx = h.indexOf('(${v.kana})');
console.log('Index:', idx);
if (idx >= 0) {
  console.log('Context:', JSON.stringify(h.substring(idx - 50, idx + 100)));
}
