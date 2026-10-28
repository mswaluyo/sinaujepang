import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'public');
const pkg = process.argv[2] || 'basu3-quiz';
const dataPath = path.join(ROOT, pkg, 'quiz-data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const items = Array.isArray(data) ? data : (data.questions || []);

for (const q of items) {
  const imageUrl = q.image_url || q.link || (q.img && /^https?:\/\//i.test(q.img) ? q.img : null);
  const localPath = q.image_local || (q.img && !/^https?:\/\//i.test(q.img) ? q.img : null);
  if (!imageUrl || !localPath) continue;
  const dest = path.join(ROOT, pkg, localPath);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log('[SUCCESS] Q' + (q.no || '') + ' downloaded to ' + path.relative(process.cwd(), dest));
  } catch (e) {
    console.log('[ERROR] Q' + (q.no || '') + ' failed: ' + e.message);
  }
}
console.log('Done');
