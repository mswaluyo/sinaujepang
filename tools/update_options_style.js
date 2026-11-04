const fs = require('fs');
let code = fs.readFileSync('public/assets/js/controller2.js', 'utf8');

// Kembalikan opsi ke tanpa bold (font-normal / regular), tapi tetap ukuran jelas (text-base text-slate-800)
code = code.replace(
  'var cls = "flex items-center justify-between p-3.5 rounded-xl border text-left text-base text-slate-900 font-semibold", ic = "fa-regular fa-circle text-slate-300";',
  'var cls = "flex items-center justify-between p-3.5 rounded-xl border text-left text-base text-slate-800", ic = "fa-regular fa-circle text-slate-300";'
);

code = code.replace(
  'if (M.picked[q.no] === i && !M.locked[q.no]) { cls = "flex items-center justify-between p-3.5 rounded-xl border-2 border-fuji-500 bg-fuji-50 text-left text-base font-bold text-slate-900"; ic = "fa-solid fa-circle-dot text-fuji-600"; }',
  'if (M.picked[q.no] === i && !M.locked[q.no]) { cls = "flex items-center justify-between p-3.5 rounded-xl border-2 border-fuji-500 bg-fuji-50 text-left text-base text-slate-900"; ic = "fa-solid fa-circle-dot text-fuji-600"; }'
);

code = code.replace(
  'if (i === q.answer) { cls = "flex items-center justify-between p-3.5 rounded-xl border-2 border-emerald-500 bg-emerald-50 text-left text-base font-bold text-emerald-950"; ic = "fa-solid fa-circle-check text-emerald-600"; }',
  'if (i === q.answer) { cls = "flex items-center justify-between p-3.5 rounded-xl border-2 border-emerald-500 bg-emerald-50 text-left text-base text-emerald-950"; ic = "fa-solid fa-circle-check text-emerald-600"; }'
);

code = code.replace(
  'else if (i === M.picked[q.no]) { cls = "flex items-center justify-between p-3.5 rounded-xl border-2 border-rose-500 bg-rose-50 text-left text-base font-bold text-rose-950"; ic = "fa-solid fa-circle-xmark text-rose-600"; }',
  'else if (i === M.picked[q.no]) { cls = "flex items-center justify-between p-3.5 rounded-xl border-2 border-rose-500 bg-rose-50 text-left text-base text-rose-950"; ic = "fa-solid fa-circle-xmark text-rose-600"; }'
);

code = code.replace(
  'else { cls = "flex items-center justify-between p-3.5 rounded-xl border text-left text-base text-slate-900 opacity-60 font-semibold"; }',
  'else { cls = "flex items-center justify-between p-3.5 rounded-xl border text-left text-base text-slate-800 opacity-60"; }'
);

code = code.replace(
  '(o.text ? \'<span class=\"japanese-text font-bold text-slate-900\">\' + V.esc(o.text) + \'</span>\' : \'<span class=\"text-slate-400 font-normal\">(lihat gambar)</span>\')',
  '(o.text ? \'<span class=\"japanese-text text-slate-800\">\' + V.esc(o.text) + \'</span>\' : \'<span class=\"text-slate-400\">(lihat gambar)</span>\')'
);

fs.writeFileSync('public/assets/js/controller2.js', code, 'utf8');
console.log('Options styling updated to non-bold successfully!');

