const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/shimemasu2-quiz/quiz-data.json', 'utf8'));

console.log('=== HYOUGEN (No. 14 - 28) ===');
for (let n = 14; n <= 28; n++) {
  const q = data.find(item => item.no === n);
  const hyNo = n - 13;
  console.log('No.' + n + ' (Hyougen #' + hyNo + '):');
  console.log('  title: ' + (q.title ? q.title.replace(/\n/g, ' ') : '(kosong)'));
  console.log('  kunci: ' + q.options[q.answer].text);
  console.log('  current_img: ' + q.img);
}

console.log('\n=== DOKKAI (No. 41 - 52) ===');
for (let n = 41; n <= 52; n++) {
  const q = data.find(item => item.no === n);
  const dokNo = n - 40;
  console.log('No.' + n + ' (Dokkai #' + dokNo + '):');
  console.log('  title: ' + (q.title ? q.title.replace(/\n/g, ' ').slice(0, 80) : '(kosong)'));
  console.log('  kunci: ' + q.options[q.answer].text);
  console.log('  current_img: ' + q.img);
}

