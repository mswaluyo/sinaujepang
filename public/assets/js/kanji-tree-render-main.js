// kanji-tree-render-main.js
(function() {
  'use strict';
  if (!window.__KanjiTree) { console.error('__KanjiTree not loaded'); return; }
  var h = window.__KanjiTree;
  var GROUPS = h.GROUPS, esc = h.esc, colorizePhrase = h.colorizePhrase;
  var renderJukugoLevel = h.renderJukugoLevel;

  function renderTree(container) {
    var data = window.EXPLORER_DATA || {};
    var parts = [];
    Object.keys(GROUPS).forEach(function(icon) {
      var g = GROUPS[icon];
      var radPresent = g.radikals.filter(function(r) { return !!data[r]; });
      if (radPresent.length === 0) return;

      parts.push('<div class="node">');
      parts.push('<div class="grid-full"><div class="box box-left">');
      parts.push('<div class="label level-1"><span class="badge">1</span></div>');
      parts.push('<div class="title blue">' + esc(g.name) + '</div>');
      parts.push('<div class="desc">' + esc(g.desc) + '</div>');
      if (g.subtitle) parts.push('<div class="desc" style="margin-top:.3rem;font-style:italic;">' + esc(g.subtitle) + '</div>');
      parts.push('</div></div>');
      parts.push('<div class="branch">');

      radPresent.forEach(function(rad) {
        var r = data[rad], ks = (r.kanji || []);
        if (!ks.length) return;
        parts.push('<div class="node"><div class="grid">');
        parts.push('<div class="box box-left">');
        parts.push('<div class="label level-2"><span class="badge">2</span></div>');
        parts.push('<div class="kanji">' + esc(rad) + '</div>');
        parts.push('<div class="desc">' + esc(r.kana || '') + ' \u2014 ' + esc(r.romaji || '') + '</div>');
        parts.push('<div class="desc">' + esc(r.arti || '') + '</div>');
        parts.push('</div>'); // close box-left
        parts.push('<div class="box"><div class="label">Penjelasan</div>');
        parts.push('<div class="desc">Radikal ' + esc(rad) + ' adalah fondasi dari ' + ks.length + ' karakter kanji turunan.</div></div>');
        parts.push('</div>'); // close .grid
        parts.push('<div class="branch">'); // open branch for kanji level

        ks.forEach(function(k) {
          var vs = k.vocab || [];
          parts.push('<div class="node"><div class="grid">');
          parts.push('<div class="box box-left">');
          parts.push('<div class="label level-3"><span class="badge">3</span></div>');
          parts.push('<div class="kanji">' + esc(k.ch) + '</div>');
          parts.push('<div class="desc">' + esc(k.bacaan || '') + '</div>');
          parts.push('</div>'); // close box-left
          parts.push('<div class="box"><div class="label">Penjelasan</div>');
          parts.push('<div class="desc">' + esc(k.arti || '') + '</div></div>');
          parts.push('</div>'); // close .grid
          parts.push('<div class="branch">'); // open branch for jukugo/kotoba
          parts = parts.concat(renderJukugoLevel(vs, k, rad));
          parts.push('</div>'); // close .branch for jukugo/kotoba
          parts.push('</div>'); // close .node for kanji tunggal
        });
        parts.push('</div>'); // close .branch for all kanji under this radical
        parts.push('</div></div>'); // close .grid + .node for radical
      });
      parts.push('</div>'); // close .branch for rumpun
      parts.push('</div>'); // close .node for rumpun
    });
    container.innerHTML = parts.join('');
  }

  window.KanjiTreeRender = { renderTree: renderTree };
})();
