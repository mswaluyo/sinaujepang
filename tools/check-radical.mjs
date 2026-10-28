import fs from 'fs';
const k = JSON.parse(fs.readFileSync('./public/kanji-jft-a2.json', 'utf8'));
console.log('Total kanji entries:', k.length);
console.log('Sample entries:');
k.slice(0, 2).forEach(x => console.log(JSON.stringify(x)));
console.log('\nKanji with 口 radical:');
k.filter(x => x.radical === '口').forEach(x => console.log(`  ${x.kanji} (rad: ${x.radical}, name: ${x.namaRadikal})`));
console.log(`Total with radical 口: ${k.filter(x => x.radical === '口').length}`);
