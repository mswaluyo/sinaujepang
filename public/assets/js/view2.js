// VIEW lanjutan — potongan render yang butuh QuizView dasar.
// Dipisah agar file view.js tetap kecil; digabung saat deploy bila perlu.
QuizView.optListHTML = function (q) {
  var esc = QuizView.esc, letter = QuizView.letter, dedupReason = QuizView.dedupReason;
  var h = '<div class="bg-white border border-emerald-100 rounded-xl p-4 space-y-2">';
  h += '<div class="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">3. Analisis Pilihan Jawaban</div>';
  h += '<ul class="space-y-2.5 text-xs sm:text-sm">';
  q.options.forEach(function (o, i) {
    var ok = i === q.answer;
    var dd = (q.opt_detail && q.opt_detail[i]) || {};
    var kk = dd.kana || o.text || '(lihat gambar)';
    var rr = dd.rom || '';
    var aa = dd.arti || ((q.opt_note && q.opt_note[i]) || '');
    var rawR = String(dd.alasan || '').replace(/^(BENAR|SALAH).\s*/i, '');
    var reason = dedupReason(kk, rr, aa, rawR); if (!reason) { reason = rawR; }
    var head = '<strong>' + letter(i) + '. ' + esc(kk) + (rr ? ' (' + esc(rr) + ')' : '') + ':</strong> ';
    if (ok) {
      h += '<li class="flex items-start gap-2.5 text-emerald-900 bg-emerald-50/40 p-2 rounded-lg border border-emerald-100">';
      h += '<i class="fa-solid fa-circle-check text-emerald-500 mt-0.5 text-base"></i><div>' + head + esc(aa) + (reason ? ' <span class="text-slate-400">—</span> <span class="text-emerald-700/80">' + esc(reason) + '</span>' : '') + '</div></li>';
    } else {
      h += '<li class="flex items-start gap-2.5 text-slate-700 p-2">';
      h += '<i class="fa-solid fa-circle-xmark text-rose-500 mt-0.5 text-base"></i><div>' + head + esc(aa) + (reason ? ' <span class="text-slate-400">—</span> <span class="text-slate-500">' + esc(reason) + '</span>' : '') + '</div></li>';
    }
  });
  return h + '</ul></div>';
};

QuizView.fbHTML = function (q, my, ok) {
  var esc = QuizView.esc, titleOf = QuizView.titleOf;
  var trans = q.trans || titleOf(q);
  var transR = q.trans_rom || '-';
  var fullT = titleOf(q);
  var emptyTitle = !q.title || !String(q.title || '').trim();
  var looksLikeSoalNum = /^soal\s*\d+$/i.test(String(fullT || ''));
  var isImgQ = (emptyTitle || looksLikeSoalNum);
  var kanaVal = (!isImgQ) ? fullT : '-';
  var cleanAna = String(q.analisis || '-').replace(/\s*Kunci\s*:\s*[a-dA-D][.\s]*/g, ' ').replace(/\s{2,}/g, ' ').trim() || '-';
  var h = '';
  if (ok) {
    h += '<div class="fb-box mt-4 rounded-2xl p-5 sm:p-6 border border-emerald-200 bg-emerald-50/60 text-sm space-y-5" style="scroll-margin-top:140px">';
    h += '<div class="flex items-center gap-2 border-b border-emerald-200/60 pb-3"><span class="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold"><i class="fa-solid fa-check"></i></span><h2 class="text-emerald-900 font-bold text-base tracking-wide uppercase">Jawaban Benar!</h2></div>';
  } else {
    h += '<div class="fb-box mt-4 rounded-2xl p-5 sm:p-6 border border-rose-200 bg-rose-50/60 text-sm space-y-5" style="scroll-margin-top:140px">';
    h += '<div class="flex items-center gap-2 border-b border-rose-200/60 pb-3"><span class="flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-white text-xs font-bold"><i class="fa-solid fa-xmark"></i></span><h2 class="text-rose-900 font-bold text-base tracking-wide uppercase">Jawaban Salah!</h2></div>';
  }
  h += '<div class="bg-white border border-emerald-100 rounded-xl p-4 space-y-3">';
  h += '<div class="text-xs font-bold text-emerald-800 uppercase tracking-wider border-b border-slate-100 pb-2">1. Analisis Kalimat Soal</div>';
  h += '<div class="space-y-2.5">';
  if (kanaVal && kanaVal.trim() !== "" && kanaVal.trim() !== "-") { h += '<div class="bg-slate-50 p-2.5 rounded-lg border border-slate-100"><span class="text-slate-400 block text-xs font-medium mb-0.5">Kanji / Kana:</span><span class="font-bold text-slate-900 text-base japanese-text" style="white-space:pre-line">' + esc(kanaVal) + '</span></div>'; }
  if (transR && transR.trim() !== "" && transR.trim() !== "-") { h += '<div class="bg-slate-50 p-2.5 rounded-lg border border-slate-100"><span class="text-slate-400 block text-xs font-medium mb-0.5">Cara Baca (Romaji):</span><span class="italic text-slate-700 text-sm" style="white-space:pre-line">' + esc(transR) + '</span></div>'; }
  h += '<div class="bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100"><span class="text-emerald-700 block text-xs font-semibold mb-0.5">Terjemahan Utuh:</span><span class="font-medium text-emerald-950 text-sm" style="white-space:pre-line">' + esc(trans) + '</span></div>';
  h += '</div></div>';
  h += '<div class="bg-white border border-emerald-100 rounded-xl p-4 space-y-2">';
  h += '<div class="text-xs font-bold text-emerald-800 uppercase tracking-wider">2. Pola Tata Bahasa (Grammar)</div>';
  h += '<p class="text-slate-700 text-sm leading-relaxed">' + esc(cleanAna) + '</p></div>';
  h += QuizView.optListHTML(q) + '</div>';
  return h;
};
