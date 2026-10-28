import fs from 'fs';
const h = fs.readFileSync('./public/jft-a2.html', 'utf8');
const idx = h.indexOf('Tingkat 3: Baris Kotoba Turunan');
if (idx >= 0) {
  console.log(h.substring(idx, idx + 1000));
  console.log('---LENGTH---');
  console.log(h.length);
}
