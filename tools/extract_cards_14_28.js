const fs = require('fs');
const html = fs.readFileSync('tools/shimemasu2_kunci.html', 'utf8');

for (let n = 14; n <= 28; n++) {
  const p = html.indexOf('#' + n);
  if (p !== -1) {
    const nextP = html.indexOf('#' + (n + 1), p);
    const slice = html.substring(p, nextP !== -1 ? nextP : p + 800);
    const qMatch = slice.match(/<div class="review-pertanyaan"[^>]*>([\s\S]*?)<\/div>/);
    const expMatch = slice.match(/<div class="review-penjelasan">([\s\S]*?)<\/div>/);
    console.log('=== #' + n + ' ===');
    if (qMatch) console.log('Q:', qMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    if (expMatch) console.log('Exp:', expMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  }
}

