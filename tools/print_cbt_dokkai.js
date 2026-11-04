const fs = require('fs');

for (let i = 41; i <= 52; i++) {
  const c = fs.readFileSync('tools/card_' + i + '.txt', 'utf8');
  const q_m = c.match(/<div class="review-pertanyaan"[^>]*>([\s\S]*?)<\/div>/);
  console.log('No.' + i + ': ' + (q_m ? q_m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : ''));
}

