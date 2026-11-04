const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/basu3-quiz/quiz-data.json', 'utf8'));
[20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34].forEach(no => {
  const q = data.find(item => item.no === no);
  if (q) {
    console.log('basu3 Q' + q.no + ': title=' + (q.title ? q.title.replace(/\n/g, ' ') : '') + ' | img=' + q.img + ' | ans=' + q.options[q.answer].text);
  }
});

