import fs from 'fs';
const data = JSON.parse(fs.readFileSync('./public/kanji-jft-a2.json', 'utf8'));
const entries = data.filter(x => x.kanji === '又' || x.kanji === '又');
entries.forEach((x, i) => {
  console.log(`Entry ${i}: kanji=${x.kanji}, radical=${x.radical}, radName=${x.radName}, arti=${x.arti}`);
});
