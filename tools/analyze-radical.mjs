import fs from 'fs';
const k = JSON.parse(fs.readFileSync('./public/kanji-jft-a2.json', 'utf8'));

// Analisis kanji yang punya radikal 人
const people = k.filter(x => x.radical === '人');
console.log('Total kanji dengan radikal 人:', people.length);
people.forEach(p => console.log(`  - ${p.kanji} (radikal: ${p.radical}, radName: ${p.namaRadikal})`));

// Cek struktur data Level 3
console.log('\nContoh 1 vocab entry:');
const sample = k.find(x => x.radical === '人');
if (sample) {
  console.log(JSON.stringify(sample.vocab ? sample.vocab[0] : 'no vocab', null, 2));
}
