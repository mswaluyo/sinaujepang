const fs = require('fs');
let s = fs.readFileSync('firebase.json', 'utf8');
s = s.replace(/^\uFEFF/, '');
const j = JSON.parse(s);
console.log('hosting targets:', j.hosting.map(h => h.target).join(', '));
console.log('firestore rules:', j.firestore.rules);
