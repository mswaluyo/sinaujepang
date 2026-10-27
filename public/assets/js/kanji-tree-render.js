// kanji-tree-render.js
// Engine rendering 5-level hierarchy: Rumpun -> Radikal -> Tankanji -> Jukugo -> Kotoba
// Berdasarkan gaya layout dari _arsip/gemini-code-1792886470164.html
// Data: window.EXPLORER_DATA (di-load oleh <script src="explorer-data.js">)
(function() {
  'use strict';

  // ===== GRUP STRUKTUR PEMBENTUK (TINGKATAN 1) =====
  var GROUPS = {
    "🏏🌧": {
      name: "Alam & Elemen Alam", subtitle: "Nature & Natural Elements",
      desc: "Unsur alam: kayu, air, api, tanah, dan guratan geografis.",
      radikals: ["木","水","火","土","山","氏","禾","見","石"]
    },
    "👨‍👦": {
      name: "Manusia & Relasi Sosial", subtitle: "People & Social Relations",
      desc: "Karakter yang menggambiskan peran manusia dan hubungan sosial.",
      radikals: ["人","子","女","手","耳","目","口","言","心"]
    },
    "🔢": {
      name: "Angka & Simbol Dasar", subtitle: "Numbers & Basic Symbols",
      desc: "Unit dasar hitungan dan garis fondasi penulisan kanji.",
      radikals: ["一","二","弓","戈","田","止","方"]
    },
    "🐶": {
      name: "Hewan", subtitle: "Animals",
      desc: "Karakter yang merepresentasikan berbagai spesies hewan.",
      radikals: ["牛","貝","白","癶","風","面","鬼","方"]
    },
    "🍽": {
      name: "Tumbuhan & Makanan", subtitle: "Plants & Food",
      desc: "Tanaman, pertumbuhan, dan segala terkait makanan.",
      radikals: ["食","禾","米","糸","力","白","癶"]
    },
    "🏠": {
      name: "Bangunan & Tempat", subtitle: "Buildings & Places",
      desc: "Karakter untuk bangunan, lokasi, dan struktur arsitektur.",
      radikals: ["門","示","車","邑","囗","网","羊"]
    },
    "🔧": {
      name: "Alat & Benda", subtitle: "Tools & Objects",
      desc: "Alat, perabot, senjata, dan benda-benda fisik manusia.",
      radikals: ["糸","力","白","癶","風"]
    },
    "🌀": {
      name: "Aksi & Gerakan", subtitle: "Actions & Movement",
      desc: "Verba dan kata kerja yang menggambarkan gerakan.",
      radikals: ["行","立","生","青","刀","儿","大","頁","网","羊"]
    },
    "💡": {
      name: "Bentuk & Bingkai", subtitle: "Forms & Frames",
      desc: "Elemen garis dan struktur pembatas.",
      radikals: ["囗","网","冖","宀","亅","彳","八","乚","入","干"]
    }
  };

  // ===== GLOBAL LOOKUP: Kanji -> Radikal =====
  var KANJI_TO_RADICAL = {};
  for (var rad in window.EXPLORER_DATA) {
    var rd = window.EXPLORER_DATA[rad];
    (rd.kanji || []).forEach(function(k) {
      if (k.ch && !KANJI_TO_RADICAL[k.ch]) {
        KANJI_TO_RADICAL[k.ch] = rad;
      }
    });
  }

  var KANJI_RUN_REGEX = /[\u4e00-\u9fff\u3400-\u9fff\u3005\u3006\u3007\u303c]+/g;

  function e(s) { s = s || ''; return String(s); }
  function esc(s) {
    return e(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function colorizeKanji(ch, currentRad) {
    var belongsTo = KANJI_TO_RADICAL[ch];
    return belongsTo === currentRad
      ? '<span class="blue">' + esc(ch) + '</span>'
      : '<span class="yellow">' + esc(ch) + '</span>';
  }

  function colorizePhrase(str, currentRad) {
    var result = '', lastIndex = 0, match;
    KANJI_RUN_REGEX.lastIndex = 0;
    while ((match = KANJI_RUN_REGEX.exec(str)) !== null) {
      result += esc(str.slice(lastIndex, match.index));
      var run = match[0];
      for (var i = 0; i < run.length; i++) {
        result += colorizeKanji(run[i], currentRad);
      }
      lastIndex = match.index + run.length;
    }
    result += esc(str.slice(lastIndex));
    return result;
  }

  // Export helpers ke global
  window.__KanjiTree = {
    GROUPS: GROUPS,
    KANJI_TO_RADICAL: KANJI_TO_RADICAL,
    esc: esc,
    colorizePhrase: colorizePhrase
  };
})();