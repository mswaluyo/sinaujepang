// pack-section-scores.js - render S1..S4 totals dari /paket-sesi.json
(function () {
  'use strict';
  function load() {
    return fetch('/paket-sesi.json').then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }
  function totalsFor(packData, slug) {
    var out = { 1: 0, 2: 0, 3: 0, 4: 0 };
    ['1', '2', '3', '4'].forEach(function (k) {
      var arr = packData[k] || [];
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].slug === slug) { out[k] = arr[i].total || 0; break; }
      }
    });
    return out;
  }
  function renderAll() {
    var els = document.querySelectorAll('.pack-section-scores[data-paket]');
    if (!els.length) return Promise.resolve();
    return load().then(function (packData) {
      els.forEach(function (el) {
        var slug = el.getAttribute('data-paket') || '';
        var t = totalsFor(packData, slug);
        var parts = [];
        if (t[1]) parts.push('S1: ' + t[1]);
        if (t[2]) parts.push('S2: ' + t[2]);
        if (t[3]) parts.push('S3: ' + t[3]);
        if (t[4]) parts.push('S4: ' + t[4]);
        el.textContent = parts.join(' \u2022 ');
        el.className = 'pack-section-scores text-xs text-slate-500 font-medium';
      });
    }).catch(function () {});
  }
  window.renderPackSectionScoresAll = renderAll;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderAll);
  else renderAll();
})();
