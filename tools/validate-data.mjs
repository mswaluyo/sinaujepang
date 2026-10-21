// tools/validate-data.mjs — Validasi struktur data soal (quiz-data.json)
// Jalankan: node tools/validate-data.mjs
// Exit code: 0 = semua valid, 1 = ada yang bermasalah

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const PACK_DIR = path.join(ROOT, 'public');
const ISSUES = [];

function validateQuiz(quiz, fileName) {
  if (!Array.isArray(quiz)) {
    ISSUES.push(`${fileName}: bukan array`);
    return;
  }

  const seenNo = new Set();
  let sections = new Set();

  for (const [idx, q] of quiz.entries()) {
    const id = `${fileName}[${idx}]`;

    // Wajib: no
    if (typeof q.no !== 'number' || q.no < 1) {
      ISSUES.push(`${id}: no harus number >= 1, dapat "${q.no}"`);
    } else if (seenNo.has(q.no)) {
      ISSUES.push(`${id}: no duplikat (${q.no})`);
    } else {
      seenNo.add(q.no);
    }

    // Wajib: options (array)
    if (!Array.isArray(q.options) || q.options.length === 0) {
      ISSUES.push(`${id}: options harus array tidak kosong`);
      continue;
    }

    // Validasi setiap option
    for (const [oi, opt] of q.options.entries()) {
      if (!opt || typeof opt !== 'object') {
        ISSUES.push(`${id}.option${oi}: harus object`);
        continue;
      }
      if (!('text' in opt) && !('img' in opt)) {
        ISSUES.push(`${id}.option${oi}: minimal punya text atau img`);
      }
    }

    // Validasi answer
    if (typeof q.answer !== 'number' || q.answer < 0 || q.answer >= q.options.length) {
      ISSUES.push(`${id}: answer di luar rentang (options=${q.options.length}, answer=${q.answer})`);
    }

    // Track sections
    if (q.section) sections.add(q.section);
  }

  return { sections };
}

// Main
const packDirs = fs.readdirSync(PACK_DIR)
  .filter(f => f.endsWith('-quiz') && fs.statSync(path.join(PACK_DIR, f)).isDirectory())
  .sort();

let totalQuiz = 0;
let totalPacks = packDirs.length;

console.log(`📦 Memeriksa ${totalPacks} paket kuis (ditemukan di ${PACK_DIR})...\n`);

for (const pack of packDirs) {
  const filePath = path.join(PACK_DIR, pack, 'quiz-data.json');
  let data;
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    data = JSON.parse(raw);
  } catch (e) {
    ISSUES.push(`${pack}/quiz-data.json: GAGAL baca/parse: ${e.message}`);
    continue;
  }

  const result = validateQuiz(data, pack);
  totalQuiz += data.length;

  const sectionList = [...result.sections].join(', ');
  console.log(`  ✅ ${pack}/quiz-data.json — ${data.length} soal, section: ${sectionList || '(tidak ada)'}`);
}

// Laporan
console.log(`\n📊 Ringkasan: ${totalPacks} paket, ${totalQuiz} soal`);

if (ISSUES.length === 0) {
  console.log('✅ SEMUA DATA VALID — tanpa masalah');
  process.exit(0);
} else {
  console.log(`\n❌ Ditemukan ${ISSUES.length} masalah:`);
  for (const issue of ISSUES) {
    console.log(`  • ${issue}`);
  }
  process.exit(1);
}
