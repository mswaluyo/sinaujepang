const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/shimemasu2-quiz/quiz-data.json', 'utf8'));
for (let n = 14; n <= 28; n++) {
  const q = data.find(item => item.no === n);
  console.log(`Hyougen #${n-13} (No.${n}):`);
  console.log('  img: ' + q.img);
  console.log('  title: ' + (q.title ? q.title.replace(/\n/g, ' ') : '(kosong)'));
  console.log('  analisis: ' + q.analisis);
  console.log('  kunci: ' + q.options[q.answer].text);
  console.log('---');
}

