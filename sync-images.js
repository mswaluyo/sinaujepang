const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const jsonPath = './public/basu3-quiz/quiz-data.json';
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const items = Array.isArray(data) ? data : (data.questions || []);

  for (const item of items) {
    if (item.link && item.img) {
      try {
        const viewSource = await page.goto(item.link);
        const dest = path.join('./public/basu3-quiz/', item.img);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, await viewSource.buffer());
        console.log('Saved: ' + item.img);
      } catch (e) {
        console.log('Failed: ' + item.img + ' - ' + e.message);
      }
    }
  }
  await browser.close();
})();