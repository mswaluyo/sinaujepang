import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'public');
const pkg = process.argv[2] || 'basu3-quiz';
const dataPath = path.join(ROOT, pkg, 'quiz-data.json');
const outDir = path.join(ROOT, pkg, 'images');
fs.mkdirSync(outDir, { recursive: true });

const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const items = Array.isArray(data) ? data : (data.questions || []);

for (const q of items) {
  const url = q.link;
  if (!url || !/^https?:\/\//i.test(url)) continue;
  const no = q.no != null ? q.no : (items.indexOf(q) + 1);
  const fname = 'soal_' + String(no).padStart(1, '0') + '.jpg'; // keep simple
  // prefer existing img basename if present
  const targetName = (q.img && q.img.trim()) ? path.basename(q.img) : fname;
  const dest = path.join(outDir, targetName);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log('OK', targetName);
  } catch (e) {
    console.error('FAIL', targetName, e.message);
  }
}
console.log('Done');
