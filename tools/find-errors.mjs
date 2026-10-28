import fs from 'fs';
const k = JSON.parse(fs.readFileSync('./public/kanji-jft-a2.json', 'utf8'));
const entries = k.filter(x => {
  if (x.vocab) {
    return x.vocab.some(v => 
      v.kanji.includes('学校') || v.kanji.includes('始め') || v.kanji.includes('木')
    );
  }
  return false;
});
console.log(JSON.stringify(entries, null, 2));
