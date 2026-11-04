const fs = require('fs');

let content = fs.readFileSync('public/jft-a2.html', 'utf8');
const isCRLF = content.includes('\r\n');
if (isCRLF) content = content.replace(/\r\n/g, '\n');

// 1. Update CSS
const oldCss = `    /* Picto-Filo Floating Tooltip Card */
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
    }`;

const newCss = `    /* Picto-Filo Floating Tooltip Card (White Clean Background) */
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
      width: 300px;
      max-width: 85vw;
      background: #ffffff;
      color: #1e293b;
      padding: 12px 14px;
      border-radius: 14px;
      box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1), 0 0 0 1px rgba(226, 232, 240, 0.9);
      border: 1px solid #cbd5e1;
      z-index: 60;
      pointer-events: none;
      transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      transform: translateY(6px);
      font-size: 11.5px;
      line-height: 1.5;
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
      border-color: #ffffff transparent transparent transparent;
    }
    .has-picfilo-tip .picfilo-bubble::before {
      content: '';
      position: absolute;
      top: 100%;
      left: 17px;
      border-width: 7px;
      border-style: solid;
      border-color: #cbd5e1 transparent transparent transparent;
    }`;

content = content.replace(oldCss, newCss);

// 2. Update makePicfiloBubble HTML
const oldBubble = `    function makePicfiloBubble(char, defaultArti) {
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
    }`;

const newBubble = `    function makePicfiloBubble(char, defaultArti) {
      const info = picfiloMap[char];
      if (!info || (!info.pic && !info.filo)) return '';
      const arti = info.meaning || defaultArti || '';
      return \`
        <div class="picfilo-bubble">
          <div class="flex items-center gap-2 font-bold text-slate-800 pb-2 mb-2 border-b border-slate-100 text-xs">
            <span class="jp-kanji-clear text-base font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200 shadow-2xs">\${char}</span>
            <span class="text-slate-700 font-extrabold">\${arti}</span>
          </div>
          <div class="space-y-2">
            \${info.pic ? \`<div class="bg-amber-50/70 border border-amber-200/80 rounded-lg p-2"><span class="text-amber-700 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1 mb-0.5"><i class="fa-solid fa-paintbrush text-amber-500"></i> Piktograf Bentuk</span><span class="text-slate-700 text-[11px] leading-relaxed block">\${info.pic}</span></div>\` : ''}
            \${info.filo ? \`<div class="bg-emerald-50/70 border border-emerald-200/80 rounded-lg p-2"><span class="text-emerald-700 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1 mb-0.5"><i class="fa-solid fa-lightbulb text-emerald-500"></i> Filosofi & Logika</span><span class="text-slate-700 text-[11px] leading-relaxed block">\${info.filo}</span></div>\` : ''}
          </div>
        </div>
      \`;
    }`;

content = content.replace(oldBubble, newBubble);

if (isCRLF) content = content.replace(/\n/g, '\r\n');
fs.writeFileSync('public/jft-a2.html', content, 'utf8');
console.log('Successfully updated tooltip style to white background with distinct title colors');

