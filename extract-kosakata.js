const fs = require('fs');
const path = require('path');

const QUIZ_DIRS = ['public/aoi-quiz', 'public/basu-quiz', 'public/gakusei-quiz', 'public/haburashi-quiz', 'public/hare-quiz', 'public/hashi-quiz', 'public/jinja-quiz', 'public/kagi-quiz', 'public/konpyuutaa-quiz', 'public/kuroi-quiz', 'public/kutsushita-quiz', 'public/magarimasu-quiz', 'public/orimasu-quiz', 'public/shatsu-quiz', 'public/tamago-quiz', 'public/tomemasu-quiz'];

const OUTPUT_DIR = path.join(__dirname, 'output');
const BUNDLE_DIR = path.join(__dirname, 'bundle');

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

function isNumber(t) { return /^[0-9]+\.?[0-9]*$/.test(t.trim()); }

function isQuestion(t) {
  const l = t.toLowerCase();
  const qw = ['apa','siapa','dimana','di mana','kapan','mengapa','bagaimana','berapa','saja','harus','perlu'];
  return qw.some(w => l.includes(w));
}

function isGuide(t) {
  const s = t.trim();
  return /^\([^)]*\)$/.test(s) && /gambar|audio|kunci|petunjuk|contoh|satu|dua|angka|teks/i.test(s);
}

function isPunct(t) {
  return /^[.!?,;:！。，、；：]+$/.test(t.trim());
}

function classifyWord(t) {
  t = t.trim();
  if (!t || isNumber(t) || isQuestion(t) || isGuide(t) || isPunct(t)) return 'other';
  
  const lower = t.toLowerCase();
  
  const verbPatterns = [
    /[aiueo]masu$/,
    /[aiueo]desu$/,
    /[aiueo]nai$/,
    /[aiueo]mashita$/,
    /[aiueo]ta$/,
    /[aiueo]te$/,
    /[aiueo]masen$/,
    /[aiueo]nikui$/,
  ];
  const isVerb = verbPatterns.some(p => p.test(lower));
  
  const isAdj = /^[a-z].*[aiueo]i$/i.test(t) && t.length <= 20 && !isVerb && !isNumber(t);
  
  const isNoun = t.length <= 20 && !t.includes(' ') && !isVerb && !isAdj && !isNumber(t);
  
  if (isVerb) return 'verb';
  if (isAdj) return 'adjective';
  if (isNoun) return 'noun';
  return 'other';
}

function extract() {
  const map = new Map();
  for (const d of QUIZ_DIRS) {
    const f = path.join(__dirname, d, 'quiz-data.json');
    if (!fs.existsSync(f)) { console.warn('Skip ' + d); continue; }
    const data = JSON.parse(fs.readFileSync(f, 'utf8'));
    const pack = path.basename(d);
    for (const q of data) {
      for (const o of q.options || []) {
        const t = o.text?.trim();
        if (!t) continue;
        const type = classifyWord(t);
        if (type === 'other') continue;
        if (!map.has(t)) map.set(t, { kanji: t, kana: t, rom: '', arti: '', tipe: type, paket: [pack], no: q.no, section: q.section });
        else { const e = map.get(t); if (!e.paket.includes(pack)) e.paket.push(pack); if (!e.no) e.no = q.no; if (!e.section) e.section = q.section; }
      }
    }
    console.log('  Diproses: ' + d + ' (' + map.size + ')');
  }
  return Array.from(map.values());
}

function exportFile(arr, filename) {
  const m = { 'kotoba-benda.json': 'noun', 'kotoba-kerja.json': 'verb', 'kotoba-sifat.json': 'adjective' };
  const type = m[filename] || filename.replace('.json', '');
  const filtered = arr.filter(e => e.tipe === type).sort((a,b) => a.kanji.localeCompare(b.kanji, 'de', { sensitivity: 'base' }));
  const out = { created: new Date().toISOString(), jumlah: filtered.length, data: filtered };
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), JSON.stringify(out, null, 2), 'utf8');
  console.log('  -> ' + filename + ': ' + filtered.length);
}

function main() {
  console.log('=== Ekstraksi Kosakata ===\n');
  const all = extract();
  console.log('Total: ' + all.length);
  ensureDir(OUTPUT_DIR);
  exportFile(all, 'kotoba-benda.json');
  exportFile(all, 'kotoba-kerja.json');
  exportFile(all, 'kotoba-sifat.json');
  ensureDir(BUNDLE_DIR);
  console.log('\n=== Hasil: ' + OUTPUT_DIR + ' ===');
}

if (require.main === module) main();

module.exports = { extractVocabulary: extract, classifyWord };
