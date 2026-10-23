const fs = require('fs');
const path = require('path');

// Files to process
const files = {
  'benda': 'public/kotoba-benda.json',
  'kerja': 'public/kotoba-kerja.json',
  'sifat': 'public/kotoba-sifat.json',
  'ungkapan': 'public/kotoba-ungkapan.json'
};

// Types of vocabulary
function determineType(item, sourceFile) {
  const t = item.kanji || '';
  const kana = item.kana || '';
  
  // Check if it's a verb (ends with -masu, -desu, -nai, etc.)
  const isVerb = /(ます|です|ません|ませんか|ない|ません)$/.test(t) ||
                 /(ます|です|ません|ませんか|ない|ません)$/.test(kana);
  
  // Check if it's an adjective (-i or -na)
  const isAdjective = /(い$|な$)/.test(t) || /(い$|な$)/.test(kana);
  
  // Check if it's an expression (has more than 3 characters or contains particles)
  const isExpression = t.length >= 5 || /[で|に|を|へ|と|から|まで|も|は|が|の|へ]/.test(t);
  
  // Priority: verb > adjective > expression > noun
  if (isVerb && !/\d/.test(t)) return 'verb';
  if (isAdjective && !/\d/.test(t)) return 'adjective';
  if (isExpression) return 'expression';
  if (/^[\\u4e00-\\u9fff\\uf900-\\ufaff]/.test(t)) return 'kanji';
  if (/^[\\u3040-\\u309f]/.test(t)) return 'kana';
  if (/^[\\u30a0-\\u30ff]/.test(t)) return 'katakana';
  
  // Default based on source file
  if (sourceFile === 'kotoba-benda.json') return 'noun';
  if (sourceFile === 'kotoba-kerja.json') return 'verb';
  if (sourceFile === 'kotoba-sifat.json') return 'adjective';
  if (sourceFile === 'kotoba-ungkapan.json') return 'expression';
  
  return 'unknown';
}

// Process each file
Object.entries(files).forEach(([category, filePath]) => {
  console.log('Processing ' + category + '...');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const sourceFile = path.basename(filePath);
  
  // Add type field to each entry
  const fixedData = data.map(item => {
    const newItem = { ...item };
    newItem.tipe = determineType(item, sourceFile);
    return newItem;
  });
  
  // Sort by type
  const typeOrder = ['kanji', 'kana', 'verb', 'noun', 'adjective', 'expression', 'katakana'];
  fixedData.sort((a, b) => {
    const orderA = typeOrder.indexOf(a.tipe) === -1 ? 99 : typeOrder.indexOf(a.tipe);
    const orderB = typeOrder.indexOf(b.tipe) === -1 ? 99 : typeOrder.indexOf(b.tipe);
    return orderA - orderB;
  });
  
  // Write fixed file
  fs.writeFileSync(filePath, JSON.stringify(fixedData, null, 2), 'utf8');
  console.log('  Updated ' + filePath);
  console.log('  Total entries: ' + fixedData.length);
  console.log('  Types:', JSON.stringify(fixedData.reduce((acc, item) => {
    acc[item.tipe] = (acc[item.tipe] || 0) + 1;
    return acc;
  }, {})));
  console.log();
});

// Create a master vocabulary file
console.log('Creating kotoba-master.json...');
const allFiles = ['public/kotoba-benda.json', 'public/kotoba-kerja.json', 'public/kotoba-sifat.json', 'public/kotoba-ungkapan.json'];
const master = [];
allFiles.forEach(file => {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  data.forEach(item => {
    master.push({
      ...item,
      source: path.basename(file, '.json'),
      jar: item.tipe
    });
  });
});

// Sort by type
master.sort((a, b) => {
  const order = { kanji: 0, noun: 1, verb: 2, adjective: 3, expression: 4, kana: 5, katakana: 6 };
  const orderA = order[a.tipe] || 99;
  const orderB = order[b.tipe] || 99;
  return orderA - orderB || a.kanji.localeCompare(b.kanji);
});

fs.writeFileSync('public/kotoba-master.json', JSON.stringify(master, null, 2), 'utf8');
console.log('Master file created with ' + master.length + ' entries');

// Summary
console.log('\n=== Summary ===');
console.log('Total entries: ' + master.length);
console.log('By type:');
const typeCount = {};
master.forEach(item => {
  typeCount[item.tipe] = (typeCount[item.tipe] || 0) + 1;
});
console.log(JSON.stringify(typeCount));
