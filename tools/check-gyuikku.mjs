import fs from 'fs';
const k = JSON.parse(fs.readFileSync('./public/kotoba-lolosyuk.json', 'utf8'));
const found = k.find(x => x.kana && x.kana.includes('ぎゅう'));
if (found) {
  console.log(JSON.stringify(found, null, 2));
} else {
  console.log('not found');
}
