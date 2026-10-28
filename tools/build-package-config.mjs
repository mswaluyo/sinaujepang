import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(process.cwd(), 'public');
const GROUPS_FILE = path.join(process.cwd(), 'tools', 'package-groups.json');
const defaultGroups = [
  { nama: 'LOLOSYUK', warna: 'sky', badgeGradien: 'from-sky-500 to-blue-600', paket: ['gakusei-quiz','hare-quiz','magarimasu-quiz','orimasu-quiz','tomemasu-quiz','konpyuutaa-quiz'] },
  { nama: 'AC', warna: 'purple', badgeGradien: 'from-purple-500 to-purple-600', paket: ['hare2-quiz'] },
  { nama: 'DN', warna: 'sky', badgeGradien: 'from-sky-500 to-blue-600', paket: ['basu2-quiz','basu3-quiz'] },
  { nama: 'PRINCESS', warna: 'rose', badgeGradien: 'from-rose-500 to-rose-600', paket: ['kuroi-quiz','kutsushita-quiz','shatsu-quiz','tamago-quiz'] },
  { nama: 'TOKYO OMIYAGE', warna: 'emerald', badgeGradien: 'from-emerald-500 to-emerald-600', paket: ['aoi-quiz','basu-quiz','jinja-quiz','kagi-quiz'] },
  { nama: 'YUCHU', warna: 'amber', badgeGradien: 'from-red-500 to-orange-500', paket: ['hashi-quiz','haburashi-quiz'] },
];
if (!fs.existsSync(GROUPS_FILE)) fs.writeFileSync(GROUPS_FILE, JSON.stringify(defaultGroups, null, 2));
const groups = JSON.parse(fs.readFileSync(GROUPS_FILE, 'utf8'));
let totalPaket = 0; let totalSoal = 0;
const kategori = groups.map(g => {
  const paket = g.paket.map(slug => {
    const dataPath = path.join(ROOT, slug, 'quiz-data.json');
    let total = 0; let nama = slug.replace('-quiz','').toUpperCase();
    if (fs.existsSync(dataPath)) {
      const data = JSON.parse(fs.readFileSync(dataPath,'utf8'));
      total = Array.isArray(data) ? data.length : (Array.isArray(data.questions) ? data.questions.length : 0);
      if (data.packageName) nama = data.packageName;
    }
    totalPaket++; totalSoal += total;
    return { nama, slug, total, ikon: nama.charAt(0) };
  });
  return { nama: g.nama, warna: g.warna, badgeGradien: g.badgeGradien, paket };
});
const out = "window.PAKET_CONFIG = " + JSON.stringify({ totalPaket, totalSoal, kategori }, null, 2) + ";\n";
fs.writeFileSync(path.join(ROOT, 'assets', 'js', 'package-config.js'), out);
console.log('Generated: paket', totalPaket, 'soal', totalSoal);
