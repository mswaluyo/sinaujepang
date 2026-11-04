const fs = require('fs');

let content = fs.readFileSync('public/jft-a2.html', 'utf8');

// Normalize CRLF to LF temporarily for matching
const isCRLF = content.includes('\r\n');
if (isCRLF) {
  content = content.replace(/\r\n/g, '\n');
}

// 1. Fetch resPicfilo
const targetFetch = `        const [resKanji, resKotoba, resHyougen, resDokkai] = await Promise.all([
          fetch('/kanji-jft-a2.json'),
          fetch('/kotoba-lolosyuk.json'),
          fetch('/hyougen-jft-a2.json'),
          fetch('/dokkai-jft-a2.json')
        ]);`;

const replFetch = `        const [resKanji, resKotoba, resHyougen, resDokkai, resPicfilo] = await Promise.all([
          fetch('/kanji-jft-a2.json'),
          fetch('/kotoba-lolosyuk.json'),
          fetch('/hyougen-jft-a2.json'),
          fetch('/dokkai-jft-a2.json'),
          fetch('/assets/data/kanji-picfilo.json')
        ]);`;

if (content.includes(targetFetch)) {
  content = content.replace(targetFetch, replFetch);
  console.log('Replaced targetFetch');
} else {
  console.log('targetFetch not found!');
}

const targetAssign = `        kanjiData = await resKanji.json();
        kotobaData = await resKotoba.json();
        hyougenData = await resHyougen.json();
        dokkaiData = await resDokkai.json();`;

const replAssign = `        kanjiData = await resKanji.json();
        kotobaData = await resKotoba.json();
        hyougenData = await resHyougen.json();
        dokkaiData = await resDokkai.json();
        try {
          const picfiloList = await resPicfilo.json();
          picfiloMap = {};
          (picfiloList || []).forEach(item => { if (item && item.kanji) picfiloMap[item.kanji] = item; });
        } catch (e) {
          console.warn('Gagal parse picfilo:', e);
        }`;

if (content.includes(targetAssign)) {
  content = content.replace(targetAssign, replAssign);
  console.log('Replaced targetAssign');
} else {
  console.log('targetAssign not found!');
}

// 2. Radical wrapper
const targetRad = `                    <span class="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-black jp-font text-base shadow-xs select-none">
                      \${currentRadical}
                    </span>`;

const replRad = `                    <div class="has-picfilo-tip inline-flex">
                      <span class="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-black jp-font text-base shadow-xs select-none hover:ring-2 hover:ring-sky-300 transition-all">
                        \${currentRadical}
                      </span>
                      \${makePicfiloBubble(currentRadical, rMeta.arti)}
                    </div>`;

if (content.includes(targetRad)) {
  content = content.replace(targetRad, replRad);
  console.log('Replaced targetRad');
} else {
  console.log('targetRad not found!');
}

// 3. Kanji Box wrapper
const targetBox = `                <span class="w-9 h-9 inline-flex items-center justify-center kanji-box-tunggal border rounded-lg text-2xl jp-kanji-clear shadow-xs">
                  \${k.kanji}
                </span>`;

const replBox = `                <div class="has-picfilo-tip inline-flex">
                  <span class="w-9 h-9 inline-flex items-center justify-center kanji-box-tunggal border rounded-lg text-2xl jp-kanji-clear shadow-xs hover:border-sky-500 hover:ring-2 hover:ring-sky-200 transition-all">
                    \${k.kanji}
                  </span>
                  \${makePicfiloBubble(k.kanji, k.arti)}
                </div>`;

if (content.includes(targetBox)) {
  content = content.replace(targetBox, replBox);
  console.log('Replaced targetBox');
} else {
  console.log('targetBox not found!');
}

if (isCRLF) {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync('public/jft-a2.html', content, 'utf8');
console.log('Done writing jft-a2.html');
