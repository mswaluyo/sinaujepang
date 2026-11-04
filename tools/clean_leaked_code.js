const fs = require('fs');
const glob = ['public/orimasu2-quiz/quiz-data.json', 'public/shimemasu2-quiz/quiz-data.json'];
const bad = 'color:var(--text3);font-style:italic;margin-top:6px;border-top:1px dashed rgba(188,47,47,0.12);padding-top:6px;font-family:\'Plus Jakarta Sans\',sans-serif">';

glob.forEach(file => {
  let text = fs.readFileSync(file, 'utf8');
  if (text.includes(bad)) {
    text = text.split(bad + '(').join('(');
    text = text.split(bad).join('');
    fs.writeFileSync(file, text, 'utf8');
    console.log('Successfully cleaned:', file);
  }
});

