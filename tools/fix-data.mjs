import fs from 'fs';
const path = './public/kanji-jft-a2.json';
const content = fs.readFileSync(path, 'utf8');

// Fix 1: 学校 gakko -> gakkou
let updated = content.replace(/"rom":\s*"gakko"/g, '"rom": "gakkou"');

// Fix 2: 始めます memasu -> hajimemasu
updated = updated.replace(/"rom":\s*"memasu"/g, '"rom": "hajimemasu"');

// Fix 3: 木 pohon / hari kamis -> pohon
updated = updated.replace(/"arti":\s*"pohon / hari kamis"/g, '"arti": "pohon"');

fs.writeFileSync(path, updated, 'utf8');
console.log('Fixed!');
console.log('gakko remaining:', (updated.match(/"rom":\s*"gakko"/g) || []).length);
console.log('hajimemasu count:', (updated.match(/"rom":\s*"hajimemasu"/g) || []).length);
console.log('pohon count:', (updated.match(/"arti":\s*"pohon"/g) || []).length);
