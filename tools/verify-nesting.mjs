import fs from 'node:fs';

const dataContent = fs.readFileSync('public/assets/js/explorer-data.js', 'utf8');
const idx = dataContent.indexOf('window.EXPLORER_DATA = ');
const jsonStr = dataContent.slice(idx + 'window.EXPLORER_DATA = '.length).trim().replace(/;\s*$/, '');
const windowMock = { EXPLORER_DATA: JSON.parse(jsonStr) };
globalThis.window = windowMock;
globalThis.document = { createElement: function() { return { innerHTML: '', textContent: '' }; } };

eval(fs.readFileSync('public/assets/js/kanji-tree-render.js', 'utf8'));
eval(fs.readFileSync('public/assets/js/kanji-tree-render-engine.js', 'utf8'));
eval(fs.readFileSync('public/assets/js/kanji-tree-render-main.js', 'utf8'));

const mockContainer = { innerHTML: '' };
window.KanjiTreeRender.renderTree(mockContainer);
const html = mockContainer.innerHTML;

// Cari posisi elemen penting
const branchWaterIdx = html.indexOf('Radikal 水 adalah fondasi');
const washKanjiIdx = html.indexOf('<div class="kanji">洗</div>');
const jukugoIdx = html.indexOf('4. Kanji Gabungan (Jukugo)');
const kotobaIdx = html.indexOf('5. Frasa Utuh (Kotoba)');

console.log('=== Verifikasi Nesting HTML ===');
console.log('Branch 水 found at position:', branchWaterIdx);
console.log('洗 kanji found at position:', washKanjiIdx);
console.log('Jukugo found at position:', jukugoIdx);
console.log('Kotoba found at position:', kotobaIdx);

if (branchWaterIdx !== -1 && washKanjiIdx !== -1) {
  if (washKanjiIdx > branchWaterIdx) {
    console.log('\n✓ 洗 berada DI DALAM branch radikal 水 (nesting benar)');
  } else {
    console.log('\n✗ 洗 berada LUAR dari branch radikal 水 (nesting SALAH)');
  }
} else {
  console.log('\n⚠ Tidak dapat menemukan branch 水 atau kanji 洗');
}

// Verify nesting order
if (branchWaterIdx !== -1 && washKanjiIdx !== -1 && jukugoIdx !== -1 && kotobaIdx !== -1) {
  if (branchWaterIdx < washKanjiIdx && washKanjiIdx < jukugoIdx && jukugoIdx < kotobaIdx) {
    console.log('\n✓ Urutan nesting benar: 水 → 洗 → 洗濯 → 洗濯をする');
  } else {
    console.log('\n✗ Urutan nesting SALAH');
  }
}

// Hitung total node per level
const rumpunCount = (html.match(/1\. Rumpun/g) || []).length;
const radikalCount = (html.match(/2\. Radikal Dasar/g) || []).length;
const tankanjiCount = (html.match(/3\. Kanji Tunggal/g) || []).length;
const jukugoCount = (html.match(/4\. Kanji Gabungan/g) || []).length;
const kotobaCount = (html.match(/5\. Frasa Utuh/g) || []).length;

console.log('\n=== Statistik ===');
console.log('Rumpun:', rumpunCount);
console.log('Radikal:', radikalCount);
console.log('Tankanji:', tankanjiCount);
console.log('Jukugo:', jukugoCount);
console.log('Kotoba:', kotobaCount);