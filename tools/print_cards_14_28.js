const fs = require('fs');
for (let i = 14; i <= 28; i++) {
  const c = fs.readFileSync('tools/card_' + i + '.txt', 'utf8');
  console.log('=== CARD ' + i + ' ===');
  const num = c.match(/<div class="review-nomor"[^>]*>(.*?)<\/div>/);
  const q = c.match(/<div class="review-pertanyaan"[^>]*>([\s\S]*?)<\/div>/);
  const exp = c.match(/<div class="review-penjelasan">([\s\S]*?)<\/div>/);
  if (num) console.log('Nomor: ' + num[1]);
  if (q) console.log('Q: ' + q[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  if (exp) console.log('Exp: ' + exp[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

