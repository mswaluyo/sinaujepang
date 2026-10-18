// CONTROLLER bag.3 — tombol utama, progres, modal hasil, timer/boot.
QuizController.paintMainBtn = function () {
  var M = QuizModel, C = QuizController;
  var q = M.getQ(), b = document.getElementById("mainBtn"); if (!b) return;
  if (!M.locked[q.no]) { b.disabled = true; b.className = "px-8 py-3 rounded-xl bg-slate-200 text-slate-400 font-extrabold text-sm shadow"; b.innerHTML = 'Pilih salah satu jawaban di atas'; }
  else if (M.cur < M.order.length - 1) { b.disabled = false; b.className = "px-8 py-3 rounded-xl bg-fuji-600 hover:bg-fuji-700 text-white font-extrabold text-sm shadow"; b.innerHTML = 'Lanjutkan <i class="fa-solid fa-arrow-right ml-1"></i>'; }
  else { b.disabled = false; b.className = "px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow"; b.innerHTML = '<i class="fa-solid fa-flag-checkered mr-1"></i> Selesai'; }
};
QuizController.mainAction = function () {
  var M = QuizModel, C = QuizController;
  var q = M.getQ(); if (!M.locked[q.no]) return;
  if (M.cur < M.order.length - 1) { M.cur = M.cur + 1; C.renderOne(); window.scrollTo({ top: 0, behavior: "smooth" }); }
  else { C.openResultModal(); }
};
QuizController.updateProgress = function () {
  var M = QuizModel;
  var n = Object.keys(M.locked).length;
  if (M.QS.length) document.getElementById("global-progress").style.width = Math.round(n / M.QS.length * 100) + "%";
  document.getElementById("prog-txt").textContent = n + " / " + M.QS.length + " dikonfirmasi";
};
QuizController.openResultModal = function () {
  var M = QuizModel, V = QuizView;
  var c = { sec1: 0, sec2: 0, sec3: 0, sec4: 0 }, t = { sec1: 0, sec2: 0, sec3: 0, sec4: 0 };
  M.QS.forEach(function (q) {
    var s = V.SECMAP[q.section]; t[s]++;
    if (M.locked[q.no] && M.picked[q.no] === q.answer) c[s]++;
  });
  var tot = c.sec1 + c.sec2 + c.sec3 + c.sec4;
  var p = M.QS.length ? Math.round(tot / M.QS.length * 100) : 0;
  var done = (M.QS.length && Object.keys(M.locked).length >= M.QS.length);
  // Simpan SEKALI per penyelesaian kuis: hanya saat selesai penuh & belum disimpan sesi ini.
  // Mencegah duplikat dari klik Selesai / buka-tutup modal berulang.
  try {
    var slug = QuizController.quizSlug();
    var sig = slug + "|" + tot + "|" + M.QS.length;
    if (slug && done && QuizController._savedSig !== sig) {
      QuizController._savedSig = sig;
      var secsObj = {};
      ["sec1","sec2","sec3","sec4"].forEach(function(k){ secsObj[k] = { benar: c[k], total: t[k] }; });
      QuizRepository.saveAttempt(slug, { benar: tot, total: M.QS.length, skor: p, secs: secsObj, done: true });
    }
  } catch (e) { /* abaikan */ }
  document.getElementById("score-percentage").textContent = p + "%";
  document.getElementById("score-count").textContent = tot + " / " + M.QS.length + " Benar";
  try {
    var _j = Math.round(10 + (p / 100) * 240);
    var _lv = _j >= 200 ? "A2" : _j >= 175 ? "A2.1" : _j >= 145 ? "A1" : "-";
    var _el = document.getElementById("score-count");
    if (_el) _el.textContent = tot + " / " + M.QS.length + " Benar • " + _j + "/250 (" + _lv + ")";
  } catch (e) {}
  document.getElementById("breakdown-sec1").textContent = c.sec1 + " / " + t.sec1;
  document.getElementById("breakdown-sec2").textContent = c.sec2 + " / " + t.sec2;
  document.getElementById("breakdown-sec3").textContent = c.sec3 + " / " + t.sec3;
  document.getElementById("breakdown-sec4").textContent = c.sec4 + " / " + t.sec4;
  var st = document.getElementById("result-status-title"), ds = document.getElementById("result-status-desc");
  if (p >= 75) { st.textContent = "LULUS"; st.className = "text-xl font-bold text-emerald-600"; ds.textContent = "Bagus!"; }
  else { st.textContent = "BELUM LULUS"; st.className = "text-xl font-bold text-rose-600"; ds.textContent = "Pelajari lagi analisa."; }
  var m = document.getElementById("result-modal"); m.classList.remove("hidden"); m.classList.add("flex");
  try {
    var slug = QuizController.quizSlug();
    var btn = document.getElementById("detail-btn");
    if (!btn) {
      var wrap = m.querySelector(".bg-white.rounded-3xl");
      if (wrap) {
        btn = document.createElement("a");
        btn.id = "detail-btn";
        btn.className = "block text-center w-full mt-3 px-4 py-3 rounded-xl bg-slate-800 text-white text-sm font-bold";
        btn.innerHTML = '<i class="fa-solid fa-file-lines mr-1"></i>Lihat Lembar Hasil + Saran';
        wrap.appendChild(btn);
      }
    }
    if (btn && slug) btn.href = "/hasil.html?paket=" + slug;
  } catch (e) {}
};
QuizController.reviewWrong = function () {
  var M = QuizModel, C = QuizController;
  var m = document.getElementById("result-modal"); m.classList.add("hidden"); m.classList.remove("flex");
  for (var i = 0; i < M.order.length; i++) {
    var q = M.byNo(M.order[i]);
    if (M.locked[q.no] && M.picked[q.no] !== q.answer) { M.cur = i; C.renderOne(); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
  }
  M.cur = 0; C.renderOne(); window.scrollTo({ top: 0, behavior: "smooth" });
};
QuizController.closeResultModal = function () { var m = document.getElementById("result-modal"); m.classList.add("hidden"); m.classList.remove("flex"); };
QuizController.resetAllQuiz = function () {
  var M = QuizModel, C = QuizController;
  M.picked = {}; M.locked = {}; M.cur = 0; M.timerSec = 0; C.renderOne(); C.closeResultModal(); window.scrollTo({ top: 0, behavior: "smooth" });
  try { QuizController._savedSig = null; } catch (e) {}
};
// BOOT — satu-satunya kode yang jalan saat file dimuat.
setInterval(function () {
  QuizModel.timerSec = QuizModel.timerSec + 1;
  var m = String(Math.floor(QuizModel.timerSec / 60)).padStart(2, "0"), s = String(QuizModel.timerSec % 60).padStart(2, "0");
  var el = document.getElementById("timer-display"); if (el) el.textContent = m + ":" + s;
}, 1000);
function mainAction() { QuizController.mainAction(); }
function openResultModal() { QuizController.openResultModal(); }
function reviewWrong() { QuizController.reviewWrong(); }
function closeResultModal() { QuizController.closeResultModal(); }
function resetAllQuiz() { QuizController.resetAllQuiz(); }
QuizModel.load().then(function () { QuizController.buildTabs(); QuizController.renderOne(); })
.catch(function (e) {
  var box = document.getElementById('one');
  if (box) box.innerHTML = '<p class="text-rose-600 text-sm">Gagal memuat soal: ' + String((e && e.message) || e) + '</p>';
  if (window.console) console.error(e);
});
