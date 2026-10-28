import fs from 'fs';
const h = fs.readFileSync('./public/jft-a2.html', 'utf8');
const idx = h.indexOf('Tingkat 3: Baris Kotoba Turunan');
if (idx >= 0) {
  // Get the exact line containing "font-medium text-sky-700 jp-font"
  const start = h.indexOf('font-medium text-sky-700 jp-font', idx);
  const end = h.indexOf('<td class="py-2.5 px-4 font-normal text-slate-700">', start);
  console.log('Found from:', start, 'to:', end);
  if (start >= 0 && end >= 0) {
    console.log(h.substring(start, end));
  }
}
