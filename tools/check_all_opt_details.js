const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/shimemasu2-quiz/quiz-data.json', 'utf8'));

for (let no = 14; no <= 28; no++) {
  const q = data.find(i => i.no === no);
  console.log('=== No.' + no + ' ===');
  console.log('Title: ' + (q.title ? q.title.replace(/\r?\n/g, ' ') : '(kosong)'));
  console.log('Img: ' + q.img);
  console.log('Options: ' + q.options.map(o => o.text).join(' | '));
  console.log('opt_detail kana: ' + q.opt_detail.map(o => o.kana).join(' | '));
}

