const fs = require('fs');

for (let i = 1; i <= 52; i++) {
  if (fs.existsSync('tools/card_' + i + '.txt')) {
    const card = fs.readFileSync('tools/card_' + i + '.txt', 'utf8');
    const num_m = card.match(/<div class="review-nomor"[^>]*>(.*?)<\/div>/);
    const q_m = card.match(/<div class="review-pertanyaan"[^>]*>([\s\S]*?)<\/div>/);
    const num = num_m ? num_m[1] : '?';
    const q = q_m ? q_m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
    if (i >= 40) {
      console.log('Card ' + i + ' (#' + num + '): ' + q.slice(0, 60));
    }
  }
}

