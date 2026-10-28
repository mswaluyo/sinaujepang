import fs from 'fs';
const h = fs.readFileSync('./public/jft-a2.html', 'utf8');
const m = h.match(/function renderKanjiTable.*?kosong\|</s);
if (m) {
  console.log(m[0].substring(0, 2000));
}
