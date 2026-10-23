const fs = require('fs');
const path = require('path');

const jsFiles = fs.readdirSync('public/assets/js')
  .filter(f => f.endsWith('.js'))
  .map(f => path.join('public/assets/js', f));

const allRefs = new Set();

jsFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    // Find all JSON references (with quotes or without)
    const patterns = content.match(/"([^"]+\.json)"/g) || [];
    const singleQuotes = content.match(/'([^']+\.json)'/g) || [];
    const noQuotes = content.match(/(\S+\.json)/g) || [];
    
    [...patterns, ...singleQuotes, ...noQuotes].forEach(ref => {
      // Clean up the reference
      let refClean = ref.replace(/['"]/g, '').trim();
      if (refClean) {
        allRefs.add(refClean);
      }
    });
  } catch (e) {
    console.log('Error reading ' + file + ': ' + e.message);
  }
});

console.log('=== JSON files referenced in JS files ===');
Array.from(allRefs).forEach(ref => {
  console.log('  - ' + ref);
});
