const fs = require('fs');

for (let i = 14; i <= 28; i++) {
  const card = fs.readFileSync('tools/card_' + i + '.txt', 'utf8');
  const hyNum = i - 13;
  const keyMatch = card.match(/Kunci:\s*<strong[^>]*>([A-C])<\/strong>/);
  const key = keyMatch ? keyMatch[1] : '?';
  const optMatches = [...card.matchAll(/<div class="review-jawaban-item">[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/g)].map(m => m[1].trim());
  const expMatch = card.match(/<div class="review-penjelasan">([\s\S]*?)<\/div>/);
  const exp = expMatch ? expMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';

  console.log('Card ' + i + ' (Hyougen #' + hyNum + '): Kunci=' + key + ' | Opts=[' + optMatches.join(', ') + ']');
  console.log('   Exp: ' + exp.slice(0, 100));
}

