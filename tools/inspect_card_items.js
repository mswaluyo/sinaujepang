const fs = require('fs');

for (let i = 14; i <= 28; i++) {
  const card = fs.readFileSync('tools/card_' + i + '.txt', 'utf8');
  const num = i - 13;
  const items = [...card.matchAll(/<span[^>]*Noto Serif JP[^>]*>([\s\S]*?)<\/span>/g)].map(m => m[1].trim());
  const expMatch = card.match(/<div class="review-penjelasan">([\s\S]*?)<\/div>/);
  console.log('Hyougen #' + num + ' items: ' + JSON.stringify(items));
  if (expMatch) console.log('  Exp: ' + expMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

