const fs = require('fs');

// Read the JSON
const jsonContent = fs.readFileSync('d:\\soal-jft\\public\\basu2-quiz\\quiz-data.json', 'utf8');
const data = JSON.parse(jsonContent);

// New image paths (relative to public/basu2-quiz/)
// Images are now in: public/basu2-quiz/assets/images/
// So path should be: assets/images/filename.jpg
const newImagePathMap = {
  1: 'assets/images/御膳が汚いです.jpg',
  2: 'assets/images/くみたてます.jpg',
  3: 'assets/images/人数をかぞえます.jpg',
  4: 'assets/images/しらべます.jpg',
  5: 'assets/images/会議を開く.jpg',
  6: 'assets/images/おとします.jpg',
  7: 'assets/images/バス.jpg',
  8: 'assets/images/目.jpg',
  9: 'assets/images/しかります.jpg',
  10: 'assets/images/そうかもしれませんね.jpg',
  11: 'assets/images/ちょっとしんぱいです.jpg',
  12: 'assets/images/たてられた.jpg'
};

// Update main question images (Q1-12)
data.forEach(q => {
  if (q.no >= 1 && q.no <= 12 && newImagePathMap[q.no]) {
    q.img = newImagePathMap[q.no];
  }
});

// Update option images to match
data.forEach(q => {
  if (q.no >= 1 && q.no <= 12 && newImagePathMap[q.no]) {
    q.options.forEach(opt => {
      opt.img = newImagePathMap[q.no];
    });
  }
});

// Write back to file
const updatedJson = JSON.stringify(data, null, 2);
fs.writeFileSync('d:\\soal-jft\\public\\basu2-quiz\\quiz-data.json', updatedJson);

console.log('Updated JSON with new image paths');
console.log('Questions with images:', data.filter(q => q.img).length);


