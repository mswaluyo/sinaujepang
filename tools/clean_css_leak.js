const fs = require('fs');

const files = ['public/orimasu2-quiz/quiz-data.json', 'public/shimemasu2-quiz/quiz-data.json'];

files.forEach(file => {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  let modified = 0;
  data.forEach(q => {
    if (q.trans && q.trans.includes('color:var(--text3)')) {
      // Hilangkan string CSS bocor
      q.trans = q.trans.replace(/color:var\(--text3\)[^>]*\">\s*\(?/g, '(').replace(/color:var\(--text3\)[^>]*\">\s*/g, '');
      modified++;
    }
  });
  if (modified > 0) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Cleaned ${modified} questions in ${file}`);
  }
});

