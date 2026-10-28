import fs from 'fs';
const path = './public/kanji-jft-a2.json';
const content = fs.readFileSync(path, 'utf8');
const updated = content.replace(/"radName":\s*"mata \(lagi\)"/g, '"radName": "mata"');
fs.writeFileSync(path, updated, 'utf8');
console.log('Updated:', updated.includes('mata (lagi)') ? 'FAILED' : 'SUCCESS');
