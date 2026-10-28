import fs from 'fs';
const h = fs.readFileSync('./public/jft-a2.html', 'utf8');
const start = h.indexOf('function renderKanjiTable');
const end = h.indexOf('function renderKotobaTable');
console.log(h.substring(start, end));
