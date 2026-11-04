const fs = require('fs');
let code = fs.readFileSync('public/assets/js/controller2.js', 'utf8');
code = code.replace(/\r\n/g, '\n');

// 1. Teks soal utama dibuat font-bold text-slate-900 (tebal dan hitam pekat persis kanjiVal di feedback)
const oldP = "h += '<p class=\"japanese-text text-base mb-4 bg-slate-50 p-3 rounded-xl border\" style=\"white-space:pre-line\">' + V.esc(rawTitle) + '</p>';";
const newP = "h += '<p class=\"japanese-text text-base font-bold mb-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-900\" style=\"white-space:pre-line\">' + V.esc(rawTitle) + '</p>';";
code = code.replace(oldP, newP);

// 2. Opsi jawaban dinaikkan ukuran dan ketebalannya: text-base font-bold text-slate-900
const oldCls = 'var cls = "flex items-center justify-between p-3.5 rounded-xl border text-left text-sm", ic = "fa-regular fa-circle text-slate-300";';
const newCls = 'var cls = "flex items-center justify-between p-3.5 rounded-xl border text-left text-base text-slate-900 font-semibold", ic = "fa-regular fa-circle text-slate-300";';
code = code.replace(oldCls, newCls);

const oldPick = 'if (M.picked[q.no] === i && !M.locked[q.no]) { cls = "flex items-center justify-between p-3.5 rounded-xl border-2 border-fuji-500 bg-fuji-50 text-left text-sm font-bold"; ic = "fa-solid fa-circle-dot text-fuji-600"; }';
const newPick = 'if (M.picked[q.no] === i && !M.locked[q.no]) { cls = "flex items-center justify-between p-3.5 rounded-xl border-2 border-fuji-500 bg-fuji-50 text-left text-base font-bold text-slate-900"; ic = "fa-solid fa-circle-dot text-fuji-600"; }';
code = code.replace(oldPick, newPick);

const oldAns = 'if (i === q.answer) { cls = "flex items-center justify-between p-3.5 rounded-xl border-2 border-emerald-500 bg-emerald-50 text-left text-sm font-bold"; ic = "fa-solid fa-circle-check text-emerald-600"; }';
const newAns = 'if (i === q.answer) { cls = "flex items-center justify-between p-3.5 rounded-xl border-2 border-emerald-500 bg-emerald-50 text-left text-base font-bold text-emerald-950"; ic = "fa-solid fa-circle-check text-emerald-600"; }';
code = code.replace(oldAns, newAns);

const oldWrong = 'else if (i === M.picked[q.no]) { cls = "flex items-center justify-between p-3.5 rounded-xl border-2 border-rose-500 bg-rose-50 text-left text-sm font-bold"; ic = "fa-solid fa-circle-xmark text-rose-600"; }';
const newWrong = 'else if (i === M.picked[q.no]) { cls = "flex items-center justify-between p-3.5 rounded-xl border-2 border-rose-500 bg-rose-50 text-left text-base font-bold text-rose-950"; ic = "fa-solid fa-circle-xmark text-rose-600"; }';
code = code.replace(oldWrong, newWrong);

const oldElse = 'else { cls = "flex items-center justify-between p-3.5 rounded-xl border text-left text-sm opacity-50"; }';
const newElse = 'else { cls = "flex items-center justify-between p-3.5 rounded-xl border text-left text-base text-slate-900 opacity-60 font-semibold"; }';
code = code.replace(oldElse, newElse);

const oldSpan = "(o.text ? '<span class=\"japanese-text\">' + V.esc(o.text) + '</span>' : '<span class=\"text-slate-400\">(lihat gambar)</span>')";
const newSpan = "(o.text ? '<span class=\"japanese-text font-bold text-slate-900\">' + V.esc(o.text) + '</span>' : '<span class=\"text-slate-400 font-normal\">(lihat gambar)</span>')";
code = code.replace(oldSpan, newSpan);

fs.writeFileSync('public/assets/js/controller2.js', code, 'utf8');
console.log('Successfully updated controller2.js styling!');

