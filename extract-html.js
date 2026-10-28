const fs = require('fs');

// Read the MHTML file
const mhtmlPath = 'd:\\soal-jft\\_arsip\\basu2\\BASU (OKTOBER-NOVEMBER).mhtml';
const content = fs.readFileSync(mhtmlPath, 'utf8');

// Find the main HTML content
// MHTML format: headers + boundary + HTML content
const boundaries = content.match(/boundary="([^"]+)"/g);
console.log('Found boundaries:', boundaries);

// Look for HTML content
const htmlMatch = content.match(/<!DOCTYPE html>.*?<\/html>/s);
if (htmlMatch) {
  const htmlContent = htmlMatch[0];
  console.log('Found HTML content, length:', htmlContent.length);
  
  // Save to file for inspection
  fs.writeFileSync('d:\\soal-jft\\extracted_html.txt', htmlContent);
  console.log('Saved HTML to extracted_html.txt');
  
  // Count form questions
  const questionCount = (htmlContent.match(/name="[^"]*"/g) || []).length;
  console.log('Form fields found:', questionCount);
  
  // Look for question-related patterns
  const questionPatterns = [
    /question/i,
    /field/i,
    /q\d+/i,
    /item/i
  ];
  
  let questionCount2 = 0;
  questionPatterns.forEach(pattern => {
    const matches = htmlContent.match(pattern);
    if (matches) {
      console.log(`  Pattern "${pattern}": ${matches.length} matches`);
      questionCount2 += matches.length;
    }
  });
  
  console.log('Estimated questions:', questionCount2);
} else {
  console.log('No HTML content found');
}

// Find all base64 image data
const imageCount = (content.match(/iVBORw0KGgoAAAANSUhEUg/g) || []).length;
console.log('Base64 image markers found:', imageCount);
