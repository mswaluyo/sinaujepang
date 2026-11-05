// CONTROLLER bag.2 — render soal + jawab (butuh QuizView.fbHTML dari view2.js).
QuizController.renderOne = function () {
  var M = QuizModel, V = QuizView, C = QuizController;
  var q = M.getQ();
  var sec = V.SECMAP[q.section] || "sec_ssw";
  C.markTab(sec);
  var headConf = V.SECHEAD[sec] || ["EVALUASI KEAHLIAN SSW", "Ujian evaluasi keahlian Tokutei Ginou.", "from-emerald-600 to-teal-700"];
  document.getElementById("sec-head").className = "bg-gradient-to-r " + headConf[2] + " rounded-2xl p-4 text-white flex justify-between items-center";
  document.getElementById("sec-title").textContent = headConf[0];
  document.getElementById("sec-desc").textContent = headConf[1];
  document.getElementById("sec-count").textContent = M.QS.filter(function (x) { return (V.SECMAP[x.section] || "sec_ssw") === sec; }).length + " Soal";
  var secItems = M.QS.filter(function (x) { return (V.SECMAP[x.section] || "sec_ssw") === sec; });
  var secIdx = 1;
  for (var si = 0; si < secItems.length; si++) { if (secItems[si].no === q.no) { secIdx = si + 1; break; } }
  document.getElementById("pos").textContent = "Nomor " + secIdx + " / " + secItems.length + " (" + (V.SECFULL[sec] || "SSW") + " - Total Soal ke-" + (M.cur + 1) + " dari " + M.QS.length + ")";
  var navEl = document.getElementById("sec-nav-numbers");
  if (navEl) {
    var navH = "";
    secItems.forEach(function (sq, sidx) {
      var num = sidx + 1;
      var isCur = (sq.no === q.no);
      var isLocked = !!M.locked[sq.no];
      var isCorrect = isLocked && (M.picked[sq.no] === sq.answer);
      var btnClass = "w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center ";
      if (isCur) { btnClass += "ring-2 ring-fuji-600 ring-offset-1 bg-fuji-600 text-white shadow-md font-extrabold scale-105"; }
      else if (isLocked) { btnClass += isCorrect ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200" : "bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200"; }
      else { btnClass += "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"; }
      navH += "<button onclick=\"QuizController.jumpToNo(" + sq.no + ")\" class=\"" + btnClass + "\" title=\"Nomor " + num + "\">" + num + "</button>";
    });
    navEl.innerHTML = navH;
  }
  var box = document.getElementById("one"); var h = "";
  h += '<div class="flex flex-wrap justify-between items-center mb-3 gap-2"><div class="flex items-center space-x-2"><span class="bg-slate-800 text-white text-xs font-extrabold px-3 py-1 rounded-lg">Nomor ' + secIdx + '</span><span class="bg-fuji-50 text-fuji-700 border border-fuji-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-md">' + V.esc(q.mnn || "JFT Basic") + '</span></div><span class="text-xs font-semibold px-2.5 py-1 rounded-md ' + (M.locked[q.no] ? "text-emerald-700 bg-emerald-50 border" : "text-slate-400 bg-slate-100") + '">' + (M.locked[q.no] ? (M.picked[q.no] === q.answer ? "Benar" : "Salah - kunci " + V.letter(q.answer)) : "Belum dikonfirmasi") + '</span></div>';
  if (q.audio) h += '<div class="mb-3 rounded-xl border border-amber-200 bg-amber-50 p-3 flex items-center gap-3"><i class="fa-solid fa-headphones text-amber-600"></i><audio controls preload="none" src="' + q.audio + '" class="w-full"></audio></div>';
  if (q.img) h += '<div class="bg-slate-50 border rounded-xl p-2 mb-3 flex justify-center"><img src="' + q.img + '" class="q-img"></div>';
    var rawTitle = V.titleOf(q);
  var isDokkai = (sec === "sec4") || (q.section && q.section.indexOf("DOKKAI") > -1);
  var hasSplitPattern = /\[\s*Pertanyaan\s*\]|【\s*質問\s*】|\[\s*質問\s*\]|問\s*[:：]/i.test(rawTitle);

  if (isDokkai && hasSplitPattern) {
    var parts = rawTitle.split(/\[\s*Pertanyaan\s*\]|【\s*質問\s*】|\[\s*質問\s*\]|問\s*[:：]/i);
    var bPart = (parts[0] || "").replace(/\[\s*Bacaan\s*\]/gi, "").replace(/\[\s*dokkai\s*\]/gi, "").trim();
    var pPart = (parts[1] || "").replace(/^\s*\d+[\.\)]\s*/gm, "").trim();
    h += '<div class="mb-4 space-y-3">';
    if (bPart) {
      h += '<div class="rounded-2xl border border-sky-200 bg-sky-50/60 p-4 shadow-sm">';
      h += '<div class="text-xs font-bold text-sky-800 uppercase tracking-wider mb-2 flex items-center gap-1.5"><i class="fa-solid fa-book-open text-sky-600"></i> Bacaan (Dokkai):</div>';
      h += '<div class="japanese-text text-base leading-relaxed text-slate-800 bg-white p-3.5 rounded-xl border border-sky-200" style="white-space:pre-line">' + V.esc(bPart) + '</div>';
      h += '</div>';
    }
    if (pPart) {
      h += '<div class="rounded-2xl border border-amber-300 bg-amber-50/70 p-4 shadow-sm">';
      h += '<div class="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5"><i class="fa-solid fa-circle-question text-amber-600"></i> Pertanyaan:</div>';
      h += '<div class="japanese-text text-base font-semibold leading-relaxed text-slate-900 bg-white p-3.5 rounded-xl border border-amber-200" style="white-space:pre-line">' + V.esc(pPart) + '</div>';
      h += '</div>';
    }
    h += '</div>';
  } else if (isDokkai) {
    h += '<div class="rounded-2xl border border-amber-300 bg-amber-50/70 p-4 mb-4 shadow-sm">';
    h += '<div class="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5"><i class="fa-solid fa-circle-question text-amber-600"></i> Pertanyaan Dokkai:</div>';
    h += '<div class="japanese-text text-base font-semibold leading-relaxed text-slate-900 bg-white p-3.5 rounded-xl border border-amber-200" style="white-space:pre-line">' + V.esc(rawTitle) + '</div>';
    h += '</div>';
  } else {
    h += '<p class="japanese-text text-base font-bold mb-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-slate-900" style="white-space:pre-line">' + V.esc(rawTitle) + '</p>';
  }
  h += '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">';
  q.options.forEach(function (o, i) {
    var cls = "flex items-center justify-between p-3.5 rounded-xl border text-left text-base text-slate-800", ic = "fa-regular fa-circle text-slate-300";
    if (M.picked[q.no] === i && !M.locked[q.no]) { cls = "flex items-center justify-between p-3.5 rounded-xl border-2 border-fuji-500 bg-fuji-50 text-left text-base text-slate-900"; ic = "fa-solid fa-circle-dot text-fuji-600"; }
    if (M.locked[q.no]) {
      if (i === q.answer) { cls = "flex items-center justify-between p-3.5 rounded-xl border-2 border-emerald-500 bg-emerald-50 text-left text-base text-emerald-950"; ic = "fa-solid fa-circle-check text-emerald-600"; }
      else if (i === M.picked[q.no]) { cls = "flex items-center justify-between p-3.5 rounded-xl border-2 border-rose-500 bg-rose-50 text-left text-base text-rose-950"; ic = "fa-solid fa-circle-xmark text-rose-600"; }
      else { cls = "flex items-center justify-between p-3.5 rounded-xl border text-left text-base text-slate-800 opacity-60"; }
    }
    h += '<button ' + (M.locked[q.no] ? "disabled" : "") + ' onclick="QuizController.pick(' + i + ')" class="' + cls + '"><span><strong>' + V.letter(i) + '.</strong> ' + (o.img ? '<img src="' + o.img + '" class="opt-img">' : "") + (o.text ? '<span class="japanese-text text-slate-800">' + V.esc(o.text) + '</span>' : '<span class="text-slate-400">(lihat gambar)</span>') + '</span><i class="' + ic + '"></i></button>';
  });
  h += '</div>';
  if (M.locked[q.no]) { h += V.fbHTML(q, M.picked[q.no], M.picked[q.no] === q.answer); }
  box.innerHTML = h;
  C.paintMainBtn(); C.updateProgress();
};
QuizController.pick = function (i) {
  var M = QuizModel, C = QuizController;
  var q = M.getQ(); if (M.locked[q.no]) return;
  var p = M.picked; p[q.no] = i; M.picked = p;
  var l = M.locked; l[q.no] = true; M.locked = l;
  C.renderOne();
  // Autosave progres tiap konfirmasi (bukan hanya saat Rekap) — badge homepage hidup.
  try { C.autosave(); } catch (e) {}
  // Auto-scroll ke penjelasan (Kartu 1) setelah menjawab.
  setTimeout(function () {
    var fb = document.querySelector('#one .fb-box');
    if (fb && fb.scrollIntoView) fb.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 60);
};
QuizController.calcScore = function () {
  var M = QuizModel, V = QuizView;
  var tot = 0, secs = {}, done = 0;
  V.SECT.forEach(function (s) { secs[s] = { benar: 0, total: 0 }; });
  M.QS.forEach(function (q) {
    var s = V.SECMAP[q.section];
    if (secs[s]) secs[s].total++;
    if (M.locked[q.no]) { done++; if (M.picked[q.no] === q.answer) { tot++; if (secs[s]) secs[s].benar++; } }
  });
  var p = M.QS.length ? Math.round(tot / M.QS.length * 100) : 0;
  var fin = (M.QS.length && done >= M.QS.length);
  return { benar: tot, total: M.QS.length, skor: p, secs: secs, at: Date.now(), done: fin, jawab: done };
};
QuizController.quizSlug = function () {
  return window.QUIZ_SLUG || ((window.QUIZ_META && window.QUIZ_META.slug) ? window.QUIZ_META.slug : null)
    || (function () { try { var m = (location.search || "").match(/[?&]p=([a-z0-9_-]+-quiz)/i); return m ? m[1].toLowerCase() : null; } catch (e) { return null; } })()
    || (location.pathname.match(/([a-z0-9_-]+-quiz)/i) || [null, null])[1];
};
QuizController.autosave = function () {
  try {
    var slug = QuizController.quizSlug();
    if (!slug) return;
    var r = QuizController.calcScore();
    // Hanya update progres lokal (badge homepage). JANGAN tulis ke Firestore di sini:
    // saveAttempt tiap jawaban = 1 dokumen autosave per soal (inilah yg bikin 124x).
    // Firestore hanya ditulis SEKALI saat kuis selesai via openResultModal (controller3.js).
    (async function(){
      try {
        var raw = await window.IndexedDB.getItem("jft_hasil");
        var all = {};
        if (raw) { all = typeof raw === "string" ? JSON.parse(raw) : raw; }
        all[slug] = r;
        await window.IndexedDB.setItem("jft_hasil", all);
      } catch (e) {}
    })();
    // Resume lintas device: tulis sesi ke cloud (throttled 2 dtk, 1 dokumen, TTL 24 jam).
    try {
      if (window.fujiProgress) window.fujiProgress.save(slug, { picked: JSON.parse(JSON.stringify(M.picked)), locked: JSON.parse(JSON.stringify(M.locked)), cur: M.cur, timerSec: M.timerSec });
    } catch (e) {}
  } catch (e) {}
};
