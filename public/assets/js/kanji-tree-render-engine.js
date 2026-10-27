// kanji-tree-render-engine.js
(function() {
  'use strict';
  if (!window.__KanjiTree) { console.error('__KanjiTree helpers not loaded!'); return; }
  var h = window.__KanjiTree;
  var GROUPS = h.GROUPS, KANJI_TO_RADICAL = h.KANJI_TO_RADICAL;
  var KANJI_RUN_REGEX = /[\u4e00-\u9fff\u3400-\u9fff\u3005\u3006\u3007\u303c]+/g;
  var esc = h.esc, colorizePhrase = h.colorizePhrase;

  // LEVEL 4-5: JUKUGO + KOTOBA
  function renderJukugoLevel(vs, k, currentRad) {
    var parts = [];
    if (!vs || vs.length === 0) return parts;
    var jukugoMap = {};
    vs.forEach(function(v) {
      var runs = (v.k.match(KANJI_RUN_REGEX) || []);
      runs.filter(function(x) { return x.length >= 2; }).forEach(function(jr) {
        if (!jukugoMap[jr]) jukugoMap[jr] = [];
        var existing = jukugoMap[jr].find(function(e) { return e.k === v.k; });
        if (!existing) jukugoMap[jr].push({ k: v.k, kana: v.kana || '', rom: v.rom || '', a: v.a || '', asal: v.asal || '' });
      });
    });
    Object.keys(jukugoMap).forEach(function(jr) {
      var kotobaList = jukugoMap[jr];
      var labelClass = (KANJI_TO_RADICAL[jr[0]] === currentRad) ? 'blue' : 'yellow';
      var meanings = Array.from(new Set(kotobaList.map(function(e) { return e.a; }).filter(function(x) { return x; })));
      parts.push('<div class="node"><div class="grid"><div class="box box-left">');
      parts.push('<div class="label level-4 ' + labelClass + '"><span class="badge">4</span></div>');
      parts.push('<div class="kanji">' + colorizePhrase(jr, currentRad) + '</div>');
      parts.push('<div class="desc">' + esc(meanings.join(' / ') || '') + '</div>');
      parts.push('<div class="desc" style="margin-top:.3rem;">' + esc(kotobaList[0].kana || '') + '</div></div>');
      parts.push('<div class="box"><div class="label">Penjelasan</div>');
      var kanjiDesc = [...jr].map(function(ch) {
        var cls = KANJI_TO_RADICAL[ch] === currentRad ? 'blue' : 'yellow';
        return '<span class="' + cls + '">' + esc(ch) + '</span>';
      }).join(' + ');
      parts.push('<div class="desc">Gabungan elemen ' + kanjiDesc + ' \u2192 makna gabungan.</div></div></div>');
      parts.push('<div class="branch">');
      for (var ki = 0; ki < Math.min(kotobaList.length, 2); ki++) {
        var v = kotobaList[ki];
        parts.push('<div class="node"><div class="grid"><div class="box box-left">');
        parts.push('<div class="label level-5 yellow"><span class="badge">5</span></div>');
        parts.push('<div class="kanji">' + colorizePhrase(v.k, currentRad) + '</div>');
        parts.push('<div class="desc">' + esc(v.rom || '') + '</div>');
        if (v.a) parts.push('<div class="desc" style="margin-top:.3rem;">' + esc(v.a) + '</div>');
        parts.push('</div><div class="box"><div class="label">Penjelasan</div>');
        parts.push('<div class="desc">' + esc(v.kana || '') + '</div></div></div></div>');
      }
      parts.push('</div></div>');
    });
    return parts;
  }
  window.__KanjiTree.renderJukugoLevel = renderJukugoLevel;
})();