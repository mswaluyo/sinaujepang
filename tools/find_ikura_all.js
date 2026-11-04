const fs = require('fs');
const files = fs.readdirSync('public').filter(f => f.endsWith('-quiz'));
files.forEach(dir => {
  const p = 'public/' + dir + '/quiz-data.json';
  if (fs.existsSync(p)) {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    data.forEach(q => {
      const s = JSON.stringify(q);
      if (s.includes('いくらですか') || s.includes('おいくら') || s.includes('値札') || s.includes('値段')) {
        console.log(`[${dir}] No.${q.no} | Type: ${q.section}`);
        console.log(`  Title: ${q.title ? q.title.replace(/\n/g, ' ') : ''}`);
        console.log(`  Sub: ${q.subTitle}`);
        console.log(`  Options: ${JSON.stringify(q.options.map(o => o.text))}`);
        console.log(`  Ans: ${q.answer}`);
        console.log('---');
      }
    });
  }
});

