const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/shimemasu2-quiz/quiz-data.json', 'utf8'));

for (let no = 41; no <= 52; no++) {
  const q = data.find(i => i.no === no);
  console.log('No.' + no + ' (Dokkai #' + (no - 40) + '):');
  console.log('  title: ' + (q.title ? q.title.replace(/\r?\n/g, ' ') : ''));
  console.log('  subTitle: ' + q.subTitle);
  console.log('  trans: ' + (q.trans ? q.trans.replace(/\r?\n/g, ' ') : ''));
}

