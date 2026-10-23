// package-render.js — Render kartu paket soal dari PAKET_CONFIG secara dinamis.
// Menjaga kompatibilitas dengan pack-section-scores.js dan score-cards.js
// (data-paket, .pack-section-scores, .score-host, .card-foot).
(function () {
  'use strict';

  function warnaCls(w) {
    return {
      sky: 'sky',
      rose: 'rose',
      emerald: 'emerald',
      amber: 'amber',
    }[w] || 'sky';
  }

  function renderPaket() {
    var cfg = window.PAKET_CONFIG;
    if (!cfg) return;

    var container = document.getElementById('paket-render-container');
    if (!container) return;

    var html = '';
    cfg.kategori.forEach(function (kat) {
      var w = warnaCls(kat.warna);
      html +=
        '<div class="mb-8">' +
        '<div class="flex items-center gap-2 mb-4">' +
        '<span class="text-white text-sm font-black px-4 py-2 rounded-full bg-gradient-to-r shadow-md border border-white/40 [text-shadow:0_1px_3px_rgba(0,0,0,0.7)] ' +
        kat.badgeGradien +
        ' shadow">' +
        '&#10024; ' + kat.nama +
        '</span>' +
        '<span class="text-xs text-slate-500 font-semibold">' +
        kat.paket.length + ' paket</span>' +
        '</div>' +
        '<div class="grid grid-cols-1 md:grid-cols-2 gap-5">';

      kat.paket.forEach(function (p) {
        html +=
          '<a href="/quiz.html?p=' + p.slug + '" data-paket="' + p.slug + '" ' +
          'class="bg-white rounded-2xl border border-' + w + '-100 shadow-sm hover:shadow-md transition-all p-5 relative overflow-hidden group hover:border-' + w + '-300 flex flex-col justify-between">' +
          '<div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-' + w + '-400 to-' + w + '-600"></div>' +
          '<div>' +
          '<div class="flex items-start justify-between gap-3 mb-3">' +
          '<div class="flex items-center gap-3">' +
          '<div class="w-11 h-11 rounded-xl bg-' + w + '-100 text-' + w + '-600 font-extrabold text-lg flex items-center justify-center shrink-0 group-hover:bg-' + w + '-600 group-hover:text-white transition-colors">' +
          p.ikon +
          '</div>' +
          '<div>' +
          '<h3 class="font-bold text-slate-800 text-base leading-snug group-hover:text-' + w + '-600 transition-colors">' +
          p.nama +
          '</h3>' +
          '<div class="pack-section-scores" data-paket="' + p.slug + '"></div>' +
          '</div>' +
          '</div>' +
          '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-' + w + '-50 text-' + w + '-700 text-xs font-semibold border border-' + w + '-200 shrink-0">' +
          '<i class="fa-solid fa-list-check text-' + w + '-500"></i>' +
          '<span>' + p.total + ' Soal</span>' +
          '</span>' +
          '</div>' +
          '<div class="score-host"></div>' +
          '<div class="card-foot"></div>' +
          '</div>' +
          '</a>';
      });

      html += '</div></div>';
    });

    container.innerHTML = html;

    // Trigger render skor untuk pack-section-scores
    if (typeof window.renderPackSectionScoresAll === 'function') {
      window.renderPackSectionScoresAll();
    }
    // score-cards.js memiliki polling internal (setInterval 3x) yang akan
    // menemukan kartu baru secara otomatis, tidak perlu dipanggil manual.
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderPaket);
  } else {
    renderPaket();
  }
})();