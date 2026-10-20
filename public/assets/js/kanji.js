// kanji.js — Kanji Explorer 3-layer, BAGIAN 1: data + layer kategori/radikal.
// Lihat kanji-detail.js untuk layer kanji + kosakata hafalan.
(function () {
  var $ = function (id) { return document.getElementById(id); };
  window._KJ = window._KJ || {};
  var KJ = window._KJ;
  KJ.esc = function (s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
  KJ.KANJI = {}; KJ.KOTOBA = []; KJ.RAD = (window.RAD_DATA || {});
  KJ.curCat = null; KJ.curRad = null; KJ.curKanji = null;
  KJ.radCat = function (r) {
    var m = {
      "人": "manusia", "女": "manusia", "子": "manusia", "大": "manusia", "小": "manusia", "老": "manusia",
      "日": "alam", "月": "alam", "夕": "alam", "風": "alam", "雨": "alam", "木": "alam", "水": "alam", "火": "alam", "土": "alam", "山": "alam", "川": "alam", "田": "alam",
      "犬": "hewan", "牛": "hewan", "馬": "hewan", "鳥": "hewan", "魚": "hewan", "虫": "hewan",
      "門": "bangunan", "宀": "bangunan", "戸": "bangunan", "广": "bangunan", "穴": "bangunan", "里": "bangunan", "谷": "bangunan",
      "刀": "alat", "金": "alat", "糸": "alat", "衣": "alat", "車": "alat", "舟": "alat", "矢": "alat", "玉": "alat", "弓": "alat", "缶": "alat", "皿": "alat", "示": "alat", "頁": "alat", "革": "alat",
      "行": "aksi", "走": "aksi", "辶": "aksi", "止": "aksi", "方": "aksi", "入": "aksi", "立": "aksi", "彳": "aksi", "戈": "aksi",
      "一": "garis", "二": "garis", "八": "garis",
      "目": "indra", "耳": "indra", "口": "indra", "心": "indra", "手": "indra", "足": "indra", "力": "indra", "言": "indra", "食": "indra", "見": "indra", "音": "indra", "香": "indra", "色": "indra", "白": "indra", "青": "indra"
    };
    return m[r] || "lain";
  };
  KJ.CATS = [
    { id: "manusia", icon: "👥", title: "Manusia & Relasi" },
    { id: "alam", icon: "🌿", title: "Alam & Elemen" },
    { id: "hewan", icon: "🐾", title: "Hewan" },
    { id: "bangunan", icon: "🏠", title: "Bangunan & Tempat" },
    { id: "alat", icon: "⚔️", title: "Alat & Benda" },
    { id: "aksi", icon: "🏃", title: "Aksi & Gerak" },
    { id: "indra", icon: "✨", title: "Indra & Sifat" },
    { id: "garis", icon: "〰️", title: "Garis Dasar" },
    { id: "lain", icon: "🧩", title: "Lainnya" }
  ];
  KJ.show = function (n) {
    [1, 2, 3].forEach(function (i) { var s = $("rLayer" + i); if (s) s.classList.toggle("hidden", i > n); });
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) {}
  };
  window._jBack = function (n) {
    if (n === 1) { KJ.curCat = null; KJ.curRad = null; KJ.curKanji = null; KJ.show(1); }
    if (n === 2) { KJ.curKanji = null; $("jDetail").innerHTML = ""; KJ.show(2); }
  };
  KJ.renderCats = function () {
    var counts = {};
    Object.keys(KJ.RAD).forEach(function (r) { var c = KJ.radCat(r); counts[c] = (counts[c] || 0) + 1; });
    $("jCount").textContent = Object.keys(KJ.RAD).length + " radikal";
    $("jCats").innerHTML = KJ.CATS.map(function (c) {
      var n = counts[c.id] || 0;
      if (!n) return "";
      return "<button data-cat='" + c.id + "' class='flex items-center gap-2 p-3 rounded-xl border-2 border-slate-200 bg-white hover:border-fuji-400 text-left transition-all'>"
        + "<span class='text-[22px]'>" + c.icon + "</span>"
        + "<span><span class='font-bold text-[13px] text-slate-800 block'>" + c.title + "</span>"
        + "<span class='text-[11px] text-slate-500'>" + n + " radikal</span></span></button>";
    }).join("");
    $("jCats").querySelectorAll("[data-cat]").forEach(function (b) {
      b.onclick = function () { KJ.openCat(b.getAttribute("data-cat")); };
    });
  };
  KJ.openCat = function (id) {
    KJ.curCat = id; KJ.curRad = null; KJ.curKanji = null;
    var cat = KJ.CATS.filter(function (c) { return c.id === id; })[0] || { title: id };
    $("jCatTitle").textContent = cat.icon + " " + cat.title;
    var rads = Object.keys(KJ.RAD).filter(function (r) { return KJ.radCat(r) === id; }).sort();
    $("jRads").innerHTML = rads.map(function (r) {
      var d = KJ.RAD[r], n = (d.kanji || []).length;
      return "<button data-rad='" + KJ.esc(r) + "' class='relative flex flex-col items-center p-2 rounded-xl border-2 border-slate-200 bg-white hover:border-fuji-400 transition-all'>"
        + "<span class='absolute top-1 right-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-full px-1.5'>" + n + "</span>"
        + "<span class='font-black text-slate-800 text-[24px] leading-tight'>" + KJ.esc(r) + "</span>"
        + "<span class='text-[12px] font-bold text-fuji-600'>" + KJ.esc(d.kana || "") + "</span>"
        + "<span class='text-[10px] text-slate-500 truncate w-full text-center'>" + KJ.esc(d.arti || "") + "</span></button>";
    }).join("") || "<p class='col-span-full text-center text-slate-400 text-[13px]'>Kosong.</p>";
    $("jRads").querySelectorAll("[data-rad]").forEach(function (b) {
      b.onclick = function () { KJ.openRad(b.getAttribute("data-rad")); };
    });
    KJ.show(2);
  };
  // Boot data
  (window.KANJI_DATA || []).forEach(function (e) {
    KJ.KANJI[e[0]] = { bacaan: e[1], arti: e[2], contoh: e[3], paket: e[4] };
  });
  [["KOTOBA_VERB", "V"], ["KOTOBA_ADJ", "A"], ["KOTOBA_NOUN", "N"]].forEach(function (pj) {
    (window[pj[0]] || []).forEach(function (e) {
      KJ.KOTOBA.push({ k: e[0], kana: e[1], rom: e[2], a: e[3], p: e[4], asal: e[5] || "", j: pj[1] });
    });
  });
  KJ.renderCats();
  $("jCari").oninput = function () { clearTimeout(window._jT); window._jT = setTimeout(function () { KJ.renderSearch($("jCari").value.trim().toLowerCase()); }, 300); };
})();


