const fs = require('fs');

for (let i = 14; i <= 28; i++) {
  const c = fs.readFileSync('tools/card_' + i + '.txt', 'utf8');
  const num_m = c.match(/<div class="review-nomor"[^>]*>#(.*?)<\/div>/);
  const num = num_m ? num_m[1] : i;
  const imgs = [...c.matchAll(/<img[^>]+src="([^">]+)"/g)].map(m => m[1]);
  const q_m = c.match(/<div class="review-pertanyaan"[^>]*>([\s\S]*?)<\/div>/);
  const q_text = q_m ? q_m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
  console.log(`Card ${i} (Nomor #${num}): imgs=[${imgs.join(', ')}], Q=${q_text.slice(0, 70)}`);
}

