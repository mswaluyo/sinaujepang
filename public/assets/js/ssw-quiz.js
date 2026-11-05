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
    var isKaigo = (S.slug.indexOf('kaigo') > -1);
    S.passThreshold = isKaigo ? 60 : 65;

    var contentEl = document.getElementById('ssw-content');
    if (!contentEl) return;

    try {
      var res = await fetch('/quizzes/' + S.slug + '/quiz-data.json?v=' + Date.now(), { cache: 'no-store' });
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

  // Timer pengerjaan ujian
  function startTimer() {
    if (S.timerInterval) clearInterval(S.timerInterval);
    var timerEl = document.getElementById('ssw-timer-display');
    S.timerInterval = setInterval(function () {
      S.timerSec++;
      var m = String(Math.floor(S.timerSec / 60)).padStart(2, '0');
      var s = String(S.timerSec % 60).padStart(2, '0');
      if (timerEl) timerEl.textContent = m + ':' + s;
    }, 1000);
  }

  // Render wadah utama
  function renderBaseLayout() {
    var contentEl = document.getElementById('ssw-content');
    var total = S.questions.length;

    var h = '';
    // Banner Ringkasan Sektor Ujian SSW
    h += '<div class="bg-ssw-banner rounded-2xl p-5 sm:p-6 mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">';
    h += '  <div>';
    h += '    <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider mb-2">';
    h += '      <i class="fa-solid fa-certificate"></i> Tokutei Ginou No. 1 Evaluation';
    h += '    </div>';
    h += '    <h1 class="text-xl sm:text-2xl font-black text-white" id="ssw-header-title">' + esc(S.sectorTitle) + '</h1>';
    h += '    <p class="text-xs text-emerald-100 mt-0.5">Standar kelulusan evaluasi keahlian SSW: minimal ' + S.passThreshold + '% jawaban benar.</p>';
    h += '  </div>';
    h += '  <div class="flex items-center gap-2 self-start sm:self-auto bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">';
    h += '    <i class="fa-solid fa-list-check text-white text-lg"></i>';
    h += '    <div class="text-left">';
    h += '      <div class="text-[10px] text-emerald-100 font-bold uppercase">Total Soal</div>';
    h += '      <div class="text-base font-black text-white leading-tight">' + total + ' Butir</div>';
    h += '    </div>';
    h += '  </div>';
    h += '</div>';

    // Panel Indikator Navigasi Soal (Nomor & Progress)
    h += '<div class="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 mb-5">';
    h += '  <div class="flex flex-wrap items-center justify-between gap-2 mb-3">';
    h += '    <div class="flex items-center gap-2">';
    h += '      <span id="ssw-pos" class="font-extrabold text-slate-800 text-sm">Nomor 1 dari ' + total + '</span>';
    h += '      <span id="ssw-answered-count" class="text-xs text-slate-500 font-medium">(0 Terjawab)</span>';
    h += '    </div>';
    h += '    <div class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200" id="ssw-pct-badge">0% Selesai</div>';
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

  // Pilih jawaban (auto-confirm seperti format JFT)
  function pick(idx) {
    var q = S.questions[S.cur];
    if (!q || S.locked[q.no]) return;

    S.picked[q.no] = idx;
    S.locked[q.no] = true;

    saveAttemptSilently(false);
    renderQuestion();
  }

  // Navigasi soal
  function nextQuestion() {
    if (S.cur < S.questions.length - 1) {
      S.cur++;
      renderQuestion();
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  }

  function prevQuestion() {
    if (S.cur > 0) {
      S.cur--;
      renderQuestion();
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  }

  function jumpTo(idx) {
    if (idx >= 0 && idx < S.questions.length) {
      S.cur = idx;
      renderQuestion();
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  }

  // Update progress bar
  function updateProgress() {
    var total = S.questions.length;
    var answered = Object.keys(S.locked).length;
    var pct = total ? Math.round(answered / total * 100) : 0;

    var pBar = document.getElementById('ssw-progress-bar');
    var topPBar = document.getElementById('ssw-top-progress');
    var badge = document.getElementById('ssw-pct-badge');
    var ansCount = document.getElementById('ssw-answered-count');

    if (pBar) pBar.style.width = pct + '%';
    if (topPBar) topPBar.style.width = pct + '%';
    if (badge) badge.textContent = pct + '% Selesai';
    if (ansCount) ansCount.textContent = '(' + answered + ' Terjawab)';
  }

  // Render kisi nomor soal
  function renderNavNumbers() {
    var navEl = document.getElementById('ssw-nav-numbers');
    if (!navEl) return;

    var h = '';
    S.questions.forEach(function (q, idx) {
      var isCur = (idx === S.cur);
      var isLock = !!S.locked[q.no];
      var isCorrect = isLock && (S.picked[q.no] === q.answer);

      var cls = 'w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all ';
      if (isCur) {
        cls += 'ring-2 ring-emerald-500 font-extrabold ';
      }
      if (isLock) {
        cls += isCorrect ? 'bg-emerald-600 text-white shadow-xs' : 'bg-rose-500 text-white shadow-xs';
      } else {
        cls += 'bg-slate-100 hover:bg-slate-200 text-slate-700';
      }

      h += '<button onclick="window.SSWModule.jumpTo(' + idx + ')" class="' + cls + '">' + (idx + 1) + '</button>';
    });

    navEl.innerHTML = h;
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
    } catch (e) {
      console.warn('Gagal menyimpan riwayat kuis SSW:', e);
    }
  }

  // HTML Modal Hasil SSW
  function renderResultModalHtml() {
    var h = '';
    h += '<div id="ssw-result-modal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden items-center justify-center p-4">';
    h += '  <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative text-center">';
    h += '    <button onclick="window.SSWModule.closeModal()" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"><i class="fa-solid fa-xmark"></i></button>';
    h += '    <div class="w-28 h-28 mx-auto rounded-full ssw-score-circle flex flex-col items-center justify-center mb-3" style="background:linear-gradient(135deg,#059669 0%,#0d9488 100%) !important;color:#ffffff !important;border:4px solid #d1fae5 !important;box-shadow:0 10px 15px -3px rgba(5,150,105,0.3) !important;">';
    h += '      <span id="ssw-score-num" class="text-3xl font-black text-white" style="color:#ffffff !important;display:block;">0%</span>';
    h += '      <span id="ssw-score-correct" class="text-[10px] text-white font-bold" style="color:#d1fae5 !important;display:block;">0 / 0 Benar</span>';
    h += '    </div>';
    h += '    <h3 id="ssw-status-title" class="text-xl font-black text-slate-800">Evaluasi Selesai</h3>';
    h += '    <p id="ssw-status-desc" class="text-xs text-slate-500 mt-1 mb-5">Standar kelulusan ujian keahlian SSW minimal ' + S.passThreshold + '%.</p>';
    h += '    <div class="space-y-2 mb-6 text-left">';
    h += '      <div class="flex justify-between items-center p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs">';
    h += '        <span class="font-bold text-emerald-900"><i class="fa-solid fa-award mr-1.5 text-emerald-600"></i> Standar Kelulusan SSW</span>';
    h += '        <span id="ssw-pass-mark-label" class="font-black text-emerald-700">Min. ' + S.passThreshold + '%</span>';
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

    var scoreNumEl = document.getElementById('ssw-score-num');
    var scoreCorrEl = document.getElementById('ssw-score-correct');
    if (scoreNumEl) scoreNumEl.textContent = sc.skor + '%';
    if (scoreCorrEl) scoreCorrEl.textContent = sc.benar + ' / ' + sc.total + ' Benar';

    var st = document.getElementById('ssw-status-title');
    var sd = document.getElementById('ssw-status-desc');
    var pml = document.getElementById('ssw-pass-mark-label');
    if (pml) pml.textContent = 'Min. ' + S.passThreshold + '%';

    if (sc.pass) {
      if (st) {
        st.textContent = 'LULUS (MIN. ' + S.passThreshold + '%)';
        st.className = 'text-xl font-black text-emerald-600';
      }
      if (sd) sd.textContent = 'Selamat! Anda telah memenuhi kriteria nilai kelulusan keahlian SSW.';
    } else {
      if (st) {
        st.textContent = 'BELUM LULUS (<' + S.passThreshold + '%)';
        st.className = 'text-xl font-black text-rose-600';
      }
      if (sd) sd.textContent = 'Skor masih di bawah ' + S.passThreshold + '%. Silakan pelajari kembali materi dan coba lagi.';
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
    if (!confirm('Apakah Anda yakin ingin mengulang ujian ini dari awal?')) return;
    S.cur = 0;
    S.picked = {};
    S.locked = {};
    S.timerSec = 0;
    closeModal();
    renderQuestion();
  }

  // Ekspor API modul ke window
  window.SSWModule = {
    init: init,
    pick: pick,
    nextQuestion: nextQuestion,
    prevQuestion: prevQuestion,
    jumpTo: jumpTo,
    openResultModal: openResultModal,
    closeModal: closeModal,
    resetQuiz: resetQuiz
  };

  // Jalankan saat DOM siap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
