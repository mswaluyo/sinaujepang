// CONTROLLER bag.2 — render soal + jawab (butuh QuizView.fbHTML dari view2.js).
QuizController.renderOne = function () {
  var M = QuizModel, V = QuizView, C = QuizController;
  var q = M.getQ(), sec = V.SECMAP[q.section]; C.markTab(sec);
  document.getElementById("sec-head").className = "bg-gradient-to-r " + V.SECHEAD[sec][2] + " rounded-2xl p-4 text-white flex justify-between items-center";
  document.getElementById("sec-title").textContent = V.SECHEAD[sec][0];
  document.getElementById("sec-desc").textContent = V.SECHEAD[sec][1];
  document.getElementById("sec-count").textContent = M.QS.filter(function (x) { return V.SECMAP[x.section] === sec; }).length + " Soal";
  document.getElementById("pos").textContent = "Soal " + (M.cur + 1) + " / " + M.QS.length + " (No." + q.no + " - " + V.SECFULL[sec] + ")";
  var box = document.getElementById("one"); var h = "";
  h += '<div class="flex flex-wrap justify-between items-center mb-3 gap-2"><div class="flex items-center space-x-2"><span class="bg-slate-800 text-white text-xs font-extrabold px-3 py-1 rounded-lg">Soal ' + q.no + '</span><span class="bg-fuji-50 text-fuji-700 border border-fuji-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-md">' + V.esc(q.mnn || "JFT Basic") + '</span></div><span class="text-xs font-semibold px-2.5 py-1 rounded-md ' + (M.locked[q.no] ? "text-emerald-700 bg-emerald-50 border" : "text-slate-400 bg-slate-100") + '">' + (M.locked[q.no] ? (M.picked[q.no] === q.answer ? "Benar" : "Salah - kunci " + V.letter(q.answer)) : "Belum dikonfirmasi") + '</span></div>';
  if (q.audio) h += '<div class="mb-3 rounded-xl border border-amber-200 bg-amber-50 p-3 flex items-center gap-3"><i class="fa-solid fa-headphones text-amber-600"></i><audio controls preload="none" src="' + q.audio + '" class="w-full"></audio></div>';
  if (q.img) h += '<div class="bg-slate-50 border rounded-xl p-2 mb-3 flex justify-center"><img src="' + q.img + '" class="q-img"></div>';
  h += '<p class="japanese-text text-base mb-4 bg-slate-50 p-3 rounded-xl border" style="white-space:pre-line">' + V.esc(V.titleOf(q)) + '</p><div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">';
  q.options.forEach(function (o, i) {
    var cls = "flex items-center justify-between p-3.5 rounded-xl border text-left text-sm", ic = "fa-regular fa-circle text-slate-300";
    if (M.picked[q.no] === i && !M.locked[q.no]) { cls = "flex items-center justify-between p-3.5 rounded-xl border-2 border-fuji-500 bg-fuji-50 text-left text-sm font-bold"; ic = "fa-solid fa-circle-dot text-fuji-600"; }
    if (M.locked[q.no]) {
      if (i === q.answer) { cls = "flex items-center justify-between p-3.5 rounded-xl border-2 border-emerald-500 bg-emerald-50 text-left text-sm font-bold"; ic = "fa-solid fa-circle-check text-emerald-600"; }
      else if (i === M.picked[q.no]) { cls = "flex items-center justify-between p-3.5 rounded-xl border-2 border-rose-500 bg-rose-50 text-left text-sm font-bold"; ic = "fa-solid fa-circle-xmark text-rose-600"; }
      else { cls = "flex items-center justify-between p-3.5 rounded-xl border text-left text-sm opacity-50"; }
    }
    h += '<button ' + (M.locked[q.no] ? "disabled" : "") + ' onclick="QuizController.pick(' + i + ')" class="' + cls + '"><span><strong>' + V.letter(i) + '.</strong> ' + (o.img ? '<img src="' + o.img + '" class="opt-img">' : "") + (o.text ? '<span class="japanese-text">' + V.esc(o.text) + '</span>' : '<span class="text-slate-400">(lihat gambar)</span>') + '</span><i class="' + ic + '"></i></button>';
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
    || (function () { try { var m = (location.search || "").match(/[?&]p=([a-z0-9]+-quiz)/i); return m ? m[1].toLowerCase() : null; } catch (e) { return null; } })()
    || (location.pathname.match(/([a-z0-9]+-quiz)/i) || [null, null])[1];
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
  } catch (e) {}
};
