const fs = require('fs');
const path = require('path');

const extractedDir = 'd:\\soal-jft';
const imageFiles = fs.readdirSync(extractedDir).filter(f => f.startsWith('extracted_') && f.endsWith('.png'));

console.log('Found', imageFiles.length, 'image files');
console.log('---');

// Define the mapping for basu2 quiz images
// Based on the structure of the quiz, we need 12 images (basu2_01.jpg to basu2_12.jpg)
const imageMap = {};
imageFiles.forEach((file, index) => {
  const number = (index % 12) + 1;
  const newName = `basu2_${String(number).padStart(2, '0')}.jpg`;
  imageMap[file] = newName;
});

// Copy and rename files
imageFiles.forEach((file, index) => {
  const newName = imageMap[file];
  const src = path.join(extractedDir, file);
  const dest = path.join(extractedDir, 'public', 'basu2-quiz', 'assets', 'images', newName);
  
  try {
    fs.copyFileSync(src, dest);
    console.log(`  ${file} -> basu2-${String(index % 12 + 1).padStart(2, '0')}.jpg`);
  } catch (err) {
    console.log(`  Error: ${file} -> ${err.message}`);
  }
});

console.log('---');
console.log('Done. Total images copied:', imageFiles.length);
