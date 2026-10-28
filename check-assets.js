const fs = require('fs');
const path = require('path');

// List files in assets folder
const assetsDir = 'd:\\soal-jft\\public\\basu2-quiz\\assets';
const subfolders = ['images', 'audio'];

console.log('=== Summary of assets folder ===');
subfolders.forEach(sub => {
  const subDir = path.join(assetsDir, sub);
  const files = fs.readdirSync(subDir);
  console.log(`${sub}/:`);
  if (files.length === 0) {
    console.log('  (empty)');
  } else {
    console.log('  Files:');
    files.forEach(f => {
      const sz = fs.statSync(path.join(subDir, f)).size;
      console.log(`    - ${f} (${sz} bytes)`);
    });
  }
});

// Check if images are valid
console.log('\n=== Image validity ===');
const imagesDir = path.join(assetsDir, 'images');
const imageFiles = fs.readdirSync(imagesDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
let validCount = 0;
let invalidCount = 0;

imageFiles.forEach(f => {
  const buf = fs.readFileSync(path.join(imagesDir, f));
  // PNG header: 89 50 4E 47
  // JPEG header: FF D8 FF
  const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47;
  const isJpeg = buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF;
  
  if (isPng || isJpeg) {
    validCount++;
    console.log(`  ✓ ${f} - Valid`);
  } else {
    invalidCount++;
    console.log(`  ✗ ${f} - Invalid header`);
  }
});

console.log(`\nSummary: ${validCount} valid, ${invalidCount} invalid`);

