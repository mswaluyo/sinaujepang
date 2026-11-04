const fs = require('fs');

for (let i = 39; i <= 50; i++) {
  const p = 'tools/genkan_card_' + i + '.txt';
  if (fs.existsSync(p)) {
    const card = fs.readFileSync(p, 'utf8');
    const num_m = card.match(/<div class="review-nomor"[^>]*>(.*?)<\/div>/);
    const q_m = card.match(/<div class="review-pertanyaan"[^>]*>([\s\S]*?)<\/div>/);
    const exp_m = card.match(/<div class="review-penjelasan">([\s\S]*?)<\/div>/);
    console.log('=== CARD ' + i + ' (#' + (num_m ? num_m[1] : '?') + ') ===');
    console.log('Q: ' + (q_m ? q_m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : ''));
    console.log('Exp: ' + (exp_m ? exp_m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : ''));
  }
}

