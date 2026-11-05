// SSW Quiz Module — Khusus simulasi ujian Specified Skilled Worker (Tokutei Ginou)
(function () {
  'use strict';

  var S = {
    slug: 'ssw-peternakan-quiz',
    sectorTitle: 'SSW Peternakan (Chikusan / 畜産)',
    passThreshold: 65,
    questions: [],
    cur: 0,
    picked: {},
    locked: {},
    savedSig: null,
    timerSec: 0,
    timerInterval: null
  };

  // Helper sanitasi string
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function letter(i) {
    return String.fromCharCode(65 + i);
  }

  function getSlug() {
    try {
      var m = (location.search || '').match(/[?&]p=([a-z0-9_-]+)/i);
      if (m) return m[1].toLowerCase();
    } catch (e) {}
    return 'ssw-peternakan-quiz';
  }

  // Inisialisasi data kuis
  async function init() {
    S.slug = getSlug();
    var contentEl = document.getElementById('ssw-content');
    if (!contentEl) return;

    try {
      var res = await fetch('/quizzes/' + S.slug + '/quiz-data.json');
      if (!res.ok) throw new Error('Data kuis tidak ditemukan (' + res.status + ')');
      S.questions = await res.json();
      if (!Array.isArray(S.questions) || !S.questions.length) {
        throw new Error('Format butir soal tidak valid atau kosong.');
      }

      // Deteksi judul sektor dari soal pertama bila tersedia
      if (S.questions[0].mnn) S.sectorTitle = S.questions[0].mnn;
      if (S.questions[0].section) S.sectorTitle += ' - ' + S.questions[0].section;

      var topPaketEl = document.getElementById('ssw-top-paket');
      if (topPaketEl) {
        topPaketEl.textContent = S.slug.replace('-quiz', '').replace('ssw-', 'SSW ').toUpperCase();
      }

      renderBaseLayout();
      renderQuestion();
      startTimer();
    } catch (err) {
      contentEl.innerHTML = '<div class="p-8 text-center bg-white rounded-2xl border border-rose-200 text-rose-600 font-bold max-w-lg mx-auto shadow-sm">' +
        '<i class="fa-solid fa-triangle-exclamation text-3xl mb-3 text-rose-500 block"></i>' +
        'Gagal memuat bank soal SSW: ' + esc(err.message) +
        '<div class="mt-4"><a href="/ssw.html" class="px-4 py-2 bg-slate-800 text-white text-xs rounded-xl inline-block">Kembali ke Daftar SSW</a></div>' +
        '</div>';
    }
  }

  // Kerangka dasar halaman
  function renderBaseLayout() {
    var contentEl = document.getElementById('ssw-content');
    var h = '';

    // Header info
    h += '<div class="mb-5 bg-ssw-banner rounded-2xl p-5 text-white shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">';
    h += '  <div>';
    h += '    <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold tracking-wide uppercase mb-1.5">';
    h += '      <i class="fa-solid fa-briefcase text-emerald-200"></i> SSW Kejuruan';
    h += '    </div>';
    h += '    <h1 class="text-xl sm:text-2xl font-black text-white" id="ssw-header-title">' + esc(S.sectorTitle) + '</h1>';
    h += '    <p class="text-xs text-emerald-100 mt-0.5">Standar kelulusan evaluasi keahlian SSW: minimal 65% jawaban benar.</p>';
    h += '  </div>';
    h += '  <div class="text-right shrink-0 bg-white/10 px-4 py-2.5 rounded-xl border border-white/15">';
    h += '    <div class="text-[11px] text-emerald-100 font-medium">Total Soal</div>';
    h += '    <div class="text-lg font-black text-white">' + S.questions.length + ' Butir</div>';
    h += '  </div>';
    h += '</div>';

    // Bar Navigasi nomor soal
    h += '<div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-5">';
    h += '  <div class="flex items-center justify-between mb-3 text-xs font-bold text-slate-700">';
    h += '    <span id="ssw-pos">Nomor 1 dari ' + S.questions.length + '</span>';
    h += '    <span id="ssw-progress-txt" class="text-emerald-700">0 / ' + S.questions.length + ' terjawab</span>';
    h += '  </div>';
    h += '  <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3.5">';
    h += '    <div id="ssw-progress-bar" class="bg-emerald-500 h-full w-0 transition-all duration-300"></div>';
    h += '  </div>';
    h += '  <div id="ssw-nav-numbers" class="flex flex-wrap gap-2 max-h-36 overflow-y-auto custom-scrollbar p-1"></div>';
    h += '</div>';

    // Wadah Soal Tunggal
    h += '<div id="ssw-card" class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 mb-5"></div>';

    // Tombol Navigasi Bawah
    h += '<div class="flex flex-wrap items-center justify-between gap-3 mb-10">';
    h += '  <button id="ssw-btn-prev" class="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-all"><i class="fa-solid fa-arrow-left mr-1"></i> Soal Sebelumnya</button>';
    h += '  <div class="flex items-center gap-2">';
    h += '    <button id="ssw-btn-next" class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all">Soal Berikutnya <i class="fa-solid fa-arrow-right ml-1"></i></button>';
    h += '    <button id="ssw-btn-finish" class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-sm transition-all"><i class="fa-solid fa-flag-checkered mr-1"></i> Selesai Ujian</button>';
    h += '  </div>';
    h += '</div>';

    // Modal Hasil
    h += renderResultModalHtml();

    contentEl.innerHTML = h;

    // Pasang handler tombol navigasi
    document.getElementById('ssw-btn-prev').onclick = prevQuestion;
    document.getElementById('ssw-btn-next').onclick = nextQuestion;
    document.getElementById('ssw-btn-finish').onclick = openResultModal;
  }

  // Render butir soal aktif
  function renderQuestion() {
    var q = S.questions[S.cur];
    if (!q) return;

    var num = S.cur + 1;
    var total = S.questions.length;
    var isLocked = !!S.locked[q.no];
    var pickedAns = S.picked[q.no];

    document.getElementById('ssw-pos').textContent = 'Nomor ' + num + ' dari ' + total;
    updateProgress();
    renderNavNumbers();

    var card = document.getElementById('ssw-card');
    var h = '';

    // Label nomor & kategori
    var catLabel = q.category_label || (q.no <= 20 ? "1. Pengetahuan & Istilah Teknis (Gakka)" : (q.no <= 35 ? "2. Prosedur & Keselamatan Kerja" : "3. Praktik Operasional Keahlian (Jitsugi)"));
    h += '<div class="flex flex-wrap justify-between items-center mb-4 gap-2">';
    h += '  <div class="flex items-center flex-wrap gap-2">';
    h += '    <span class="bg-slate-900 text-white text-xs font-black px-3 py-1 rounded-lg">Soal ' + num + '</span>';
    h += '    <span class="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-md">' + esc(catLabel) + '</span>';
    h += '  </div>';
    h += '  <span class="text-xs font-bold px-2.5 py-1 rounded-md ' + (isLocked ? (pickedAns === q.answer ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 'text-rose-700 bg-rose-50 border border-rose-200') : 'text-slate-400 bg-slate-100') + '">';
    h += isLocked ? (pickedAns === q.answer ? '<i class="fa-solid fa-check mr-1"></i>Benar' : '<i class="fa-solid fa-xmark mr-1"></i>Kunci: ' + letter(q.answer)) : 'Belum Dijawab';
    h += '  </span>';
    h += '</div>';

    // Gambar soal (jika ada)
    var imgSrc = q.img || q.image;
    if (imgSrc) {
      h += '<div class="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 flex justify-center max-h-72 overflow-hidden">';
      h += '  <img src="' + imgSrc + '" class="q-img max-h-64 object-contain rounded-lg" alt="Ilustrasi Soal">';
      h += '</div>';
    }

    // Teks Soal
    h += '<div class="text-base sm:text-lg font-bold text-slate-800 mb-5 leading-relaxed whitespace-pre-line">' + esc(q.title || '') + '</div>';

    // Opsi Jawaban
    h += '<div class="space-y-3 mb-5">';
    q.options.forEach(function (opt, idx) {
      var isPicked = (pickedAns === idx);
      var optClass = 'w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all flex items-start gap-3 ';

      if (isLocked) {
        if (idx === q.answer) {
          optClass += 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
        } else if (isPicked) {
          optClass += 'bg-rose-50 border-rose-300 text-rose-950';
        } else {
          optClass += 'bg-slate-50 border-slate-200 text-slate-400 opacity-75';
        }
      } else {
        optClass += 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 active:scale-[0.99]';
      }

      h += '<button onclick="window.SSWModule.pick(' + idx + ')" ' + (isLocked ? 'disabled' : '') + ' class="' + optClass + '">';
      h += '  <span class="w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ' + (isLocked && idx === q.answer ? 'bg-emerald-600 text-white' : (isPicked ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600')) + '">' + letter(idx) + '</span>';
      h += '  <div class="flex-grow pt-0.5">';
      h += '    <div>' + esc(opt.text || opt.title || '') + '</div>';
      if (opt.img) {
        h += '    <img src="' + opt.img + '" class="opt-img mt-2 rounded border border-slate-200 max-h-32" alt="Opsi ' + letter(idx) + '">';
      }
      h += '  </div>';
      h += '</button>';
    });
    h += '</div>';

    // Penjelasan Analisa Jawaban (langsung muncul saat terkunci seperti JFT)
    if (isLocked) {
      h += '<div class="mt-5 p-4 rounded-xl border ' + (pickedAns === q.answer ? 'bg-emerald-50/70 border-emerald-200' : 'bg-amber-50/70 border-amber-200') + '">';
      h += '  <div class="flex items-center gap-2 font-bold text-xs ' + (pickedAns === q.answer ? 'text-emerald-800' : 'text-amber-800') + ' mb-2">';
      h += '    <i class="fa-solid ' + (pickedAns === q.answer ? 'fa-circle-check text-emerald-600' : 'fa-circle-exclamation text-amber-600') + '"></i> Penjelasan Soal:';
      h += '  </div>';
      h += '  <p class="text-xs text-slate-700 leading-relaxed">' + esc(q.analisis || q.penjelasan || 'Kunci jawaban yang tepat adalah opsi ' + letter(q.answer)) + '</p>';
      h += '</div>';
    }

    card.innerHTML = h;

    // Visibilitas tombol navigasi berikutnya vs selesai
    var isLast = (S.cur === S.questions.length - 1);
    var btnNext = document.getElementById('ssw-btn-next');
    var btnFinish = document.getElementById('ssw-btn-finish');
    
    document.getElementById('ssw-btn-prev').disabled = (S.cur === 0);
    if (btnNext) {
      btnNext.style.display = isLast ? 'none' : 'inline-flex';
    }
    if (btnFinish) {
      btnFinish.style.display = isLast ? 'inline-flex' : 'none';
    }
  }

  // Update daftar nomor navigasi
  function renderNavNumbers() {
    var nav = document.getElementById('ssw-nav-numbers');
    if (!nav) return;

    var h = '';
    S.questions.forEach(function (q, idx) {
      var num = idx + 1;
      var isCur = (idx === S.cur);
      var isLocked = !!S.locked[q.no];
      var isCorrect = isLocked && (S.picked[q.no] === q.answer);

      var btnClass = 'w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center ';
      if (isCur) {
        btnClass += 'ring-2 ring-emerald-500 bg-emerald-600 text-white font-black scale-105';
      } else if (isLocked) {
        btnClass += isCorrect ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300';
      } else if (S.picked[q.no] != null) {
        btnClass += 'bg-amber-100 text-amber-800 border border-amber-300';
      } else {
        btnClass += 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200';
      }

      h += '<button onclick="window.SSWModule.jumpTo(' + idx + ')" class="' + btnClass + '" title="Nomor ' + num + '">' + num + '</button>';
    });

    nav.innerHTML = h;
  }

  function startTimer() {
    if (S.timerInterval) clearInterval(S.timerInterval);
    S.timerInterval = setInterval(function () {
      S.timerSec++;
      var m = String(Math.floor(S.timerSec / 60)).padStart(2, '0');
      var s = String(S.timerSec % 60).padStart(2, '0');
      var tEl = document.getElementById('ssw-timer-display');
      if (tEl) tEl.textContent = m + ':' + s;
    }, 1000);
  }

  function updateProgress() {
    var lockedCount = Object.keys(S.locked).length;
    var total = S.questions.length;
    var pct = total ? Math.round(lockedCount / total * 100) : 0;

    var bar = document.getElementById('ssw-progress-bar');
    var topBar = document.getElementById('ssw-top-progress');
    var txt = document.getElementById('ssw-progress-txt');
    if (bar) bar.style.width = pct + '%';
    if (topBar) topBar.style.width = pct + '%';
    if (txt) txt.textContent = lockedCount + ' / ' + total + ' terjawab (' + pct + '%)';
  }

  function pick(optIdx) {
    var q = S.questions[S.cur];
    if (!q || S.locked[q.no]) return;
    
    // Otomatis simpan & kunci pilihan (seperti metode JFT)
    S.picked[q.no] = optIdx;
    S.locked[q.no] = true;
    
    renderQuestion();
    saveAttemptSilently(false);

    // Auto-scroll halus ke kotak penjelasan setelah menjawab
    setTimeout(function () {
      var fb = document.querySelector('#ssw-card .rounded-xl.border');
      if (fb && fb.scrollIntoView) {
        fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 60);
  }

  function jumpTo(idx) {
    if (idx < 0 || idx >= S.questions.length) return;
    S.cur = idx;
    renderQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function nextQuestion() {
    if (S.cur < S.questions.length - 1) jumpTo(S.cur + 1);
  }

  function prevQuestion() {
    if (S.cur > 0) jumpTo(S.cur - 1);
  }

  // Kalkulasi Skor
  function calcScore() {
    var benar = 0;
    var total = S.questions.length;
    S.questions.forEach(function (q) {
      if (S.locked[q.no] && S.picked[q.no] === q.answer) benar++;
    });
    var skorPct = total ? Math.round(benar / total * 100) : 0;
    var isPass = skorPct >= S.passThreshold;

    var cats = {
      gakka: { benar: 0, total: 0 },
      anzen: { benar: 0, total: 0 },
      jitsugi: { benar: 0, total: 0 }
    };

    S.questions.forEach(function (q) {
      var cat = q.category || (q.no <= 20 ? 'gakka' : (q.no <= 35 ? 'anzen' : 'jitsugi'));
      if (!cats[cat]) cats[cat] = { benar: 0, total: 0 };
      cats[cat].total++;
      if (S.locked[q.no] && S.picked[q.no] === q.answer) {
        cats[cat].benar++;
      }
    });

    return { benar: benar, total: total, skor: skorPct, pass: isPass, cats: cats };
  }

  // Simpan hasil ke IndexedDB / LocalStorage & Firestore (sama dengan standar JFT)
  function saveAttemptSilently(done) {
    try {
      var sc = calcScore();
      var data = {
        benar: sc.benar,
        total: sc.total,
        skor: sc.skor,
        cats: sc.cats || null,
        done: !!done,
        at: Date.now(),
        slug: S.slug
      };

      if (window.IndexedDB && window.IndexedDB.setItem) {
        window.IndexedDB.setItem('jft_attempts_' + S.slug, data);
      }

      var hasilRaw = JSON.parse(localStorage.getItem('jft_hasil') || '{}');
      hasilRaw[S.slug] = data;
      localStorage.setItem('jft_hasil', JSON.stringify(hasilRaw));

      // Kirim ke Firestore (hanya saat selesai penuh untuk mencegah multi-write duplikat)
      if (done && window.fujiScore && window.fujiScore.save) {
        window.fujiScore.save(S.slug, data).catch(function () {});
      }
    } catch (e) {}
  }

  // HTML Modal Hasil SSW
  function renderResultModalHtml() {
    var h = '';
    h += '<div id="ssw-result-modal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden items-center justify-center p-4">';
    h += '  <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative text-center">';
    h += '    <button onclick="window.SSWModule.closeModal()" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"><i class="fa-solid fa-xmark"></i></button>';
    h += '    <div class="w-28 h-28 mx-auto rounded-full ssw-score-circle flex flex-col items-center justify-center mb-3">';
    h += '      <span id="ssw-score-num" class="text-3xl font-black text-white">0%</span>';
    h += '      <span id="ssw-score-correct" class="text-[10px] text-emerald-100 font-bold">0 / 0 Benar</span>';
    h += '    </div>';
    h += '    <h3 id="ssw-status-title" class="text-xl font-black text-slate-800">Evaluasi Selesai</h3>';
    h += '    <p id="ssw-status-desc" class="text-xs text-slate-500 mt-1 mb-5">Standar kelulusan ujian keahlian SSW minimal 65%.</p>';
    h += '    <div class="space-y-2 mb-6 text-left">';
    h += '      <div class="flex justify-between items-center p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs">';
    h += '        <span class="font-bold text-emerald-900"><i class="fa-solid fa-award mr-1.5 text-emerald-600"></i> Standar Kelulusan SSW</span>';
    h += '        <span class="font-black text-emerald-700">Min. 65%</span>';
    h += '      </div>';
    h += '    </div>';
    h += '    <div class="space-y-2">';
    h += '      <a id="ssw-btn-detail" href="#" class="block w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all"><i class="fa-solid fa-file-invoice mr-1.5"></i> Buka Lembar Hasil &amp; Sertifikat</a>';
    h += '      <div class="flex space-x-2">';
    h += '        <button onclick="window.SSWModule.resetQuiz()" class="w-1/2 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs"><i class="fa-solid fa-rotate-right mr-1"></i> Ulangi</button>';
    h += '        <button onclick="window.SSWModule.closeModal()" class="w-1/2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs">Tinjau Soal</button>';
    h += '      </div>';
    h += '    </div>';
    h += '  </div>';
    h += '</div>';
    return h;
  }

  function openResultModal() {
    var sc = calcScore();
    saveAttemptSilently(true);

    document.getElementById('ssw-score-num').textContent = sc.skor + '%';
    document.getElementById('ssw-score-correct').textContent = sc.benar + ' / ' + sc.total + ' Benar';

    var st = document.getElementById('ssw-status-title');
    var sd = document.getElementById('ssw-status-desc');

    if (sc.pass) {
      st.textContent = 'LULUS (MIN. 65%)';
      st.className = 'text-xl font-black text-emerald-600';
      sd.textContent = 'Selamat! Anda telah memenuhi kriteria nilai kelulusan keahlian SSW.';
    } else {
      st.textContent = 'BELUM LULUS (<65%)';
      st.className = 'text-xl font-black text-rose-600';
      sd.textContent = 'Skor masih di bawah 65%. Silakan pelajari kembali materi dan coba lagi.';
    }

    var btnDetail = document.getElementById('ssw-btn-detail');
    if (btnDetail) btnDetail.href = '/ssw-hasil.html?paket=' + encodeURIComponent(S.slug);

    var modal = document.getElementById('ssw-result-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  }

  function closeModal() {
    var modal = document.getElementById('ssw-result-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  }

  function resetQuiz() {
    S.picked = {};
    S.locked = {};
    S.cur = 0;
    S.timerSec = 0;
    var tEl = document.getElementById('ssw-timer-display');
    if (tEl) tEl.textContent = '00:00';
    closeModal();
    renderQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Ekspos API modul ke window
  window.SSWModule = {
    init: init,
    pick: pick,
    jumpTo: jumpTo,
    nextQuestion: nextQuestion,
    prevQuestion: prevQuestion,
    openResultModal: openResultModal,
    closeModal: closeModal,
    resetQuiz: resetQuiz
  };

  document.addEventListener('DOMContentLoaded', init);
})();

