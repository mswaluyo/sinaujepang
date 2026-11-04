const fs = require('fs');

// Baca card_14 sampai card_28
for (let i = 14; i <= 28; i++) {
  const c = fs.readFileSync('tools/card_' + i + '.txt', 'utf8');
  console.log(`=== CBT CARD ${i} (Nomor Hyougen #${i-13}) ===`);
  const lines = c.split('\n');
  lines.forEach(l => {
    if (l.includes('review-nomor') || l.includes('review-pertanyaan') || l.includes('review-penjelasan') || l.includes('img') || l.includes('review-jawaban-key')) {
      console.log('  ' + l.trim());
    }
  });
}

