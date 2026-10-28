const fs = require('fs');

// Read the extracted HTML
const htmlContent = fs.readFileSync('d:\\soal-jft\\extracted_html.txt', 'utf8');

// Decode HTML entities (including URL-encoded)
function decodeHtmlEntities(str) {
  return str
    .replace(/&#x([0-9a-fA-F]+);/g, (match, m) => String.fromCodePoint(parseInt(m, 16)))
    .replace(/&#([0-9]+);/g, (match, m) => String.fromCharCode(parseInt(m, 10)))
    .replace(/3D=/g, '=')  // URL-encoded "="
    .replace(/3D"/g, '"')  // URL-encoded '"'
    .replace(/3D/g, '=');  // URL-encoded "=" (for unquoted)
}

// Find question blocks
function extractQuestions() {
  const questions = [];
  
  // Find question block: question ID, then options, then feedback
  // The structure is: <div class="zS667" id="i123"> ...options... <div class="fKfAyc">feedback</div>
  const pattern = /<div class=3D"zS667" id=3D"i(\d+)"[^>]*>([\s\S]*?)<div class=3D"fKfAyc">([^<]*)<\/div>/g;
  
  let match;
  while ((match = pattern.exec(htmlContent)) !== null) {
    const questionId = parseInt(match[1]);
    const optionContent = match[2];
    const feedback = match[3];
    
    // Extract all data-value and aria-label from this question block
    const dataValues = optionContent.match(/data-value=3D"([^"]*)"/g) || [];
    const dataLabels = optionContent.match(/aria-label=3D"([^"]*)"/g) || [];
    
    const options = [];
    const numOptions = Math.min(dataValues.length, dataLabels.length, 4);
    
    for (let i = 0; i < numOptions; i++) {
      const encodedData = dataValues[i];
      const encodedLabel = dataLabels[i];
      
      if (encodedData) {
        // Remove "data-value=" prefix and decode
        let text = encodedData.replace('data-value=', '');
        text = decodeHtmlEntities(text);
        
        // If label is longer, use it
        if (encodedLabel) {
          const labelText = encodedLabel.replace('aria-label=', '');
          const labelDecoded = decodeHtmlEntities(labelText);
          if (labelDecoded.length > text.length) {
            text = labelDecoded;
          }
        }
        
        const isCorrect = optionContent.includes('aria-checked=3D"true"');
        
        options.push({
          text: text.substring(0, 400),
          isCorrect: isCorrect
        });
      }
    }
    
    if (options.length > 0) {
      // Find correct answer
      let answer = 0;
      for (let i = 0; i < options.length; i++) {
        if (options[i].isCorrect) {
          answer = i;
          break;
        }
      }
      
      questions.push({
        no: questionId,
        section: 'SESI 1 : MOJIGOI',
        title: '',
        img: `assets/basu2_${String(questionId).padStart(2, '0')}.jpg`,
        options: options,
        answer: answer,
        score: '0/4',
        trans: '',
        trans_rom: '-',
        mnn: 'Mojigoi',
        analisis: '',
        opt_detail: options.map((o, i) => ({
          kana: o.text,
          rom: '-',
          arti: '-',
          alasan: ''
        })),
        opt_note: options.map(o => `(${o.text.substring(0, 50)})`),
        kunci_id: options[answer] ? options[answer].text.substring(0, 100) : '',
        salah: 'Pilihan lain tidak cocok dengan kunci PDF hal.13.',
        audio: ''
      });
    }
  }
  
  return questions;
}

const questions = extractQuestions();
console.log('Questions:', questions.length);

const jsonContent = JSON.stringify(questions, null, 2);
fs.writeFileSync('d:\\soal-jft\\public\\basu2-quiz\\quiz-data.json', jsonContent);
console.log('JSON written');
