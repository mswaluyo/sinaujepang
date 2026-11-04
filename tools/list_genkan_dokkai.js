const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/genkan-quiz/quiz-data.json', 'utf8'));
const dokkai = data.filter(q => q.section.includes('DOKKAI'));
console.log('Total Dokkai questions in genkan-quiz:', dokkai.length);
dokkai.forEach(q => {
  console.log('Q' + q.no + ': img=' + q.img + ' | title=' + (q.title ? q.title.replace(/\r?\n/g, ' ').slice(0, 70) : '(kosong)') + ' | answer=' + q.options[q.answer].text);
});

