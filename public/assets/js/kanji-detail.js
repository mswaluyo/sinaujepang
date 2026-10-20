// kanji-detail.js — BAGIAN 2: layer kanji per radikal + panel kosakata TUNGGAL hafalan.
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var KJ = window._KJ || (window._KJ = {});
  function esc(s) { return KJ.esc ? KJ.esc(s) : String(s == null ? "" : s); }
  KJ.openRad = function (r) {
    KJ.curRad = r; KJ.curKanji = null; $("jDetail").innerHTML = "";
    var d = KJ.RAD[r] || { kana: "", arti: "", kanji: [] };
    $("jRadTitle").textContent = r + " · " + (d.arti || "") + (d.kana ? " (" + d.kana + ")" : "");
    $("jKanjiCount").textContent = d.kanji.length + " kanji";
    $("jGrid").innerHTML = d.kanji.map(function (ch) {
      var info = KJ.KANJI[ch] || {};
      return "<button data-k='" + esc(ch) + "' class='bg-white border border-slate-200 hover:border-fuji-400 hover:shadow-md rounded-xl p-2 flex flex-col items-center transition-all'>"
        + "<span class='font-black text-slate-800 text-[26px] leading-none'>" + esc(ch) + "</span>"
        + "<span class='text-[10px] text-slate-500 truncate w-full text-center'>" + esc((info.arti || "-").split(" / ")[0]) + "</span></button>";
    }).join("") || "<p class='col-span-full text-center text-slate-400 text-[13px]'>Belum ada kanji.</p>";
    $("jGrid").querySelectorAll("[data-k]").forEach(function (b) {
      b.onclick = function () { KJ.openKanji(b.getAttribute("data-k")); };
    });
    KJ.show(3);
  };
  KJ.kosakataKanji = function (ch) {
    return KJ.KOTOBA.filter(function (w) { return (w.k || "").indexOf(ch) >= 0; })
      .sort(function (a, b) { return (a.k || "").length - (b.k || "").length; }).slice(0, 12);
  };
  KJ.openKanji = function (ch) {
    KJ.curKanji = ch;
    var info = KJ.KANJI[ch] || { bacaan: "", arti: "" };
    var vocab = KJ.kosakataKanji(ch);
    $("jDetail").innerHTML =
      "<div class='mt-2 bg-slate-50 border border-slate-200 rounded-xl p-4'>"
      + "<div class='text-center mb-3'><div class='font-black text-slate-800 text-[56px] leading-none'>" + esc(ch) + "</div>"
      + "<div class='font-bold text-slate-800 mt-1'>" + esc(info.arti || "-") + "</div>"
      + "<div class='text-[12px] text-slate-500'>" + esc(info.bacaan || "") + "</div></div>"
      + "<div class='text-[13px] font-extrabold text-slate-700 mb-1.5'>📚 Kosakata hafalan (" + vocab.length + " kata tunggal dari soal):</div>"
      + (vocab.map(function (w) {
        return "<div class='bg-white border border-slate-200 rounded-lg px-3 py-2 mb-1.5 flex flex-wrap items-baseline gap-x-2'>"
          + "<span class='font-bold text-slate-800 text-[15px]'>" + esc(w.k) + "</span>"
          + "<span class='text-[12px] text-fuji-600'>" + esc(w.kana || "") + "</span>"
          + "<span class='text-[12px] text-slate-500 italic'>" + esc(w.rom || "") + "</span>"
          + "<span class='text-[13px] text-slate-700'>= " + esc(w.a || "") + "</span>"
          + (w.asal ? "<span class='text-[10px] text-slate-400 w-full'>◁ " + esc(w.asal) + "</span>" : "") + "</div>";
      }).join("") || "<p class='text-slate-400 text-[13px]'>Belum ada kosakata.</p>")
      + "</div>";
    try { $("jDetail").scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) {}
  };
  KJ.renderSearch = function (kw) {
    var box = $("jSearchGrid");
    if (!kw) { box.classList.add("hidden"); box.innerHTML = ""; return; }
    var list = Object.keys(KJ.KANJI).filter(function (ch) {
      var o = KJ.KANJI[ch] || {};
      return (ch + " " + (o.bacaan || "") + " " + (o.arti || "")).toLowerCase().indexOf(kw) >= 0;
    }).slice(0, 40);
    box.classList.remove("hidden");
    box.innerHTML = list.map(function (ch) {
      return "<button data-k='" + esc(ch) + "' class='bg-white border border-slate-200 hover:border-fuji-400 rounded-xl p-2 font-black text-slate-800 text-[22px]'>" + esc(ch) + "</button>";
    }).join("") || "<p class='col-span-full text-center text-slate-400 text-[13px]'>Tidak ada yang cocok.</p>";
    box.querySelectorAll("[data-k]").forEach(function (b) {
      b.onclick = function () {
        var ch = b.getAttribute("data-k");
        var r = (window.RAD_OF || {})[ch];
        if (r && KJ.RAD[r]) KJ.openRad(r);
        KJ.openKanji(ch);
      };
    });
  };
})();
