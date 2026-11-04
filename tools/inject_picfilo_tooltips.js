const fs = require('fs');

let content = fs.readFileSync('public/jft-a2.html', 'utf8');

// 1. Add CSS before </style>
const cssTooltip = `
    /* Picto-Filo Floating Tooltip Card */
    .has-picfilo-tip {
      position: relative;
      cursor: help;
    }
    .has-picfilo-tip .picfilo-bubble {
      visibility: hidden;
      opacity: 0;
      position: absolute;
      bottom: calc(100% + 8px);
      left: 0;
      width: 290px;
      max-width: 85vw;
      background: #0f172a;
      color: #f8fafc;
      padding: 10px 12px;
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(56, 189, 248, 0.35);
      z-index: 60;
      pointer-events: none;
      transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      transform: translateY(6px);
      font-size: 11px;
      line-height: 1.45;
      font-weight: normal;
      text-align: left;
    }
    .has-picfilo-tip:hover .picfilo-bubble,
    .has-picfilo-tip:focus-within .picfilo-bubble {
      visibility: visible;
      opacity: 1;
      transform: translateY(0);
    }
    .has-picfilo-tip .picfilo-bubble::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 18px;
      border-width: 6px;
      border-style: solid;
      border-color: #0f172a transparent transparent transparent;
    }
  </style>`;

content = content.replace('  </style>', cssTooltip);

// 2. Add picfiloData variable and load in init()
content = content.replace('let kanjiData = [];', 'let kanjiData = [];\n    let picfiloMap = {};');

const oldPromiseAll = `        const [resKanji, resKotoba, resHyougen, resDokkai] = await Promise.all([
          fetch('/kanji-jft-a2.json'),
          fetch('/kotoba-lolosyuk.json'),
          fetch('/hyougen-jft-a2.json'),
          fetch('/dokkai-jft-a2.json')
        ]);`;

const newPromiseAll = `        const [resKanji, resKotoba, resHyougen, resDokkai, resPicfilo] = await Promise.all([
          fetch('/kanji-jft-a2.json'),
          fetch('/kotoba-lolosyuk.json'),
          fetch('/hyougen-jft-a2.json'),
          fetch('/dokkai-jft-a2.json'),
          fetch('/assets/data/kanji-picfilo.json')
        ]);`;

content = content.replace(oldPromiseAll, newPromiseAll);

const oldAfterJson = `        kanjiData = await resKanji.json();
        kotobaData = await resKotoba.json();
        hyougenData = await resHyougen.json();
        dokkaiData = await resDokkai.json();`;

const newAfterJson = `        kanjiData = await resKanji.json();
        kotobaData = await resKotoba.json();
        hyougenData = await resHyougen.json();
        dokkaiData = await resDokkai.json();
        const picfiloList = await resPicfilo.json();
        picfiloMap = {};
        (picfiloList || []).forEach(item => { if (item && item.kanji) picfiloMap[item.kanji] = item; });`;

content = content.replace(oldAfterJson, newAfterJson);

// 3. Helper function for tooltip bubble
const helperFn = `
    function makePicfiloBubble(char, defaultArti) {
      const info = picfiloMap[char];
      if (!info || (!info.pic && !info.filo)) return '';
      const arti = info.meaning || defaultArti || '';
      return \`
        <div class="picfilo-bubble">
          <div class="flex items-center gap-1.5 font-bold text-sky-300 pb-1.5 mb-1.5 border-b border-slate-700 text-xs">
            <span class="jp-kanji-clear text-sm font-black text-white bg-sky-900/60 px-1.5 py-0.5 rounded border border-sky-500/40">\${char}</span>
            <span>\${arti}</span>
          </div>
          <div class="space-y-1.5">
            \${info.pic ? \`<div><span class="text-amber-300 font-semibold text-[10px] uppercase tracking-wider block">🎨 Piktograf:</span><span class="text-slate-200">\${info.pic}</span></div>\` : ''}
            \${info.filo ? \`<div><span class="text-emerald-300 font-semibold text-[10px] uppercase tracking-wider block">💡 Filosofi / Logika:</span><span class="text-slate-200">\${info.filo}</span></div>\` : ''}
          </div>
        </div>
      \`;
    }
`;

content = content.replace('    function renderKanjiTable() {', helperFn + '\n    function renderKanjiTable() {');

// 4. Update radical rendering with tooltip
const oldRadicalHtml = `                    <span class="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-black jp-font text-base shadow-xs select-none">
                      \${currentRadical}
                    </span>`;

const newRadicalHtml = `                    <div class="has-picfilo-tip inline-flex">
                      <span class="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-black jp-font text-base shadow-xs select-none">
                        \${currentRadical}
                      </span>
                      \${makePicfiloBubble(currentRadical, rMeta.arti)}
                    </div>`;

content = content.replace(oldRadicalHtml, newRadicalHtml);

// 5. Update kanji tunggal box with tooltip
const oldKanjiBox = `                <span class="w-9 h-9 inline-flex items-center justify-center kanji-box-tunggal border rounded-lg text-2xl jp-kanji-clear shadow-xs">
                  \${k.kanji}
                </span>`;

const newKanjiBox = `                <div class="has-picfilo-tip inline-flex">
                  <span class="w-9 h-9 inline-flex items-center justify-center kanji-box-tunggal border rounded-lg text-2xl jp-kanji-clear shadow-xs">
                    \${k.kanji}
                  </span>
                  \${makePicfiloBubble(k.kanji, k.arti)}
                </div>`;

content = content.replace(oldKanjiBox, newKanjiBox);

fs.writeFileSync('public/jft-a2.html', content, 'utf8');
console.log('Successfully injected tooltips to public/jft-a2.html');

