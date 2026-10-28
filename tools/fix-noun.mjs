import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const file = path.join(ROOT, 'public/assets/js/kotoba-noun.js');
let c = fs.readFileSync(file, 'utf8');
const oldTxt = '["せんたくき","せんたくき","sentakuki","mesin cuci","hashi",""]';
const newEntry = '["洗濯をする","せんたくをする","sentaku o suru","mencuci pakaian","konpyuutaa","kutsushita"]';
if (c.includes(newEntry)) {
  console.log('Entry sudah ada, tidak perlu ditambahkan.');
} else {
  const idx = c.indexOf(oldTxt);
  if (idx === -1) {
    console.error('Pattern tidak ditemukan: ' + oldTxt);
    process.exit(1);
  }
  const insertPos = idx + oldTxt.length;
  c = c.slice(0, insertPos) + ',' + newEntry + c.slice(insertPos);
  fs.writeFileSync(file, c, 'utf8');
  console.log('Berhasil menambahkan entri: ' + newEntry);
}