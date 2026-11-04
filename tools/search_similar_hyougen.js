const fs = require('fs');
const files = fs.readdirSync('public').filter(f => f.endsWith('-quiz'));
files.forEach(dir => {
  const p = 'public/' + dir + '/quiz-data.json';
  if (fs.existsSync(p)) {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    data.forEach(q => {
      const s = JSON.stringify(q);
      if (s.includes('たてられた') || s.includes('せかい') || s.includes('ミサトさん') || s.includes('そうじき') || s.includes('あの 機能') || s.includes('もちましょうか')) {
        console.log(`[${dir}] Q${q.no}: title=${q.title ? q.title.replace(/\n/g, ' ') : ''} | img=${q.img}`);
      }
    });
  }
});

