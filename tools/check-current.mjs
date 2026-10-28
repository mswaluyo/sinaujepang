import fs from 'fs';
const h = fs.readFileSync('./public/jft-a2.html', 'utf8');
const idx = h.indexOf('colorClass = radicalColor');
console.log('Found at index:', idx);
console.log(h.substring(idx-100, idx+350));
