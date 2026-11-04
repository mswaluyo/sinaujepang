const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/shimemasu2-quiz/quiz-data.json', 'utf8'));
const hyougen = data.filter(q => q.section.includes('HYOUGEN'));
console.log('Total hyougen:', hyougen.length);
hyougen.forEach((q, idx) => {
  console.log(`[#${idx+1}] No.${q.no}:`);
  console.log('  Title: ' + (q.title ? q.title.replace(/\n/g, ' ') : ''));
  console.log('  Sub: ' + q.subTitle);
  console.log('  Ans: ' + q.answer + ' (' + q.options[q.answer].text + ')');
  console.log('  Analisis: ' + q.analisis);
  console.log('  Opts: ' + q.options.map(o => o.text).join(' | '));
  console.log('---');
});

