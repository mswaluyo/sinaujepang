// kanji.js — Kanji Explorer: grid kartu + filter badge + cari + modal detail
// Format KANJI_DATA: [kanji, bacaan, arti, "contoh1、contoh2", "paket1,paket2"]
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var all = [], shown = 100, lvl = "";
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function nContoh(o) { return String(o[3] || "").split("、").filter(Boolean).length; }
  var LVLS = [
    { k: "", label: "Semua" },
    { k: "1", label: "1 kata" },
    { k: "2", label: "2 kata" },
    { k: "3", label: "3+ kata" }
  ];
  function renderLevel() {
    $("jLevel").innerHTML = LVLS.map(function (l) {
      var on = lvl === l.k;
      return "<button data-lv='" + l.k + "' class='text-[12px] font-bold px-3.5 py-1.5 rounded-full border transition-all "
        + (on ? "bg-fuji-600 text-white border-fuji-600 shadow-md" : "bg-white text-slate-600 border-slate-200 hover:border-fuji-300") + "'>" + l.label + "</button>";
    }).join("");
    $("jLevel").querySelectorAll("[data-lv]").forEach(function (b) {
      b.onclick = function () { lvl = b.getAttribute("data-lv"); shown = 100; renderLevel(); render(); };
    });
  }
  function filtered() {
    var kw = $("jCari").value.trim().toLowerCase();
    return all.filter(function (o) {
      if (lvl === "1" && nContoh(o) !== 1) return false;
      if (lvl === "2" && nContoh(o) !== 2) return false;
      if (lvl === "3" && nContoh(o) < 3) return false;
      if (kw && (o.join(" ") + "").toLowerCase().indexOf(kw) < 0) return false;
      return true;
    });
  }
  function render() {
    var list = filtered();
    $("jCount").textContent = list.length + " kanji";
    var h = "";
    list.slice(0, shown).forEach(function (o, i) {
      h += "<button data-j='" + i + "' class='jcard bg-white border border-slate-200 hover:border-fuji-400 hover:shadow-md rounded-xl p-2 flex flex-col items-center gap-0.5 transition-all'>"
        + "<span class='font-black text-slate-800 text-[26px] leading-none'>" + esc(o[0]) + "</span>"
        + "<span class='text-[10px] text-slate-500 truncate w-full text-center'>" + esc((o[2] || "-").split(" / ")[0]) + "</span></button>";
    });
    $("jGrid").innerHTML = h || "<p class='col-span-full py-10 text-center text-slate-400 text-[13px]'>Tidak ada yang cocok.</p>";
    $("jGrid").querySelectorAll(".jcard").forEach(function (b) {
      b.onclick = function () { detail(list[+b.getAttribute("data-j")]); };
    });
    var more = $("jMore"), habis = shown >= list.length;
    more.disabled = habis; more.classList.toggle("opacity-50", habis);
    more.innerHTML = habis ? "Semua sudah ditampilkan ✓" : "Muat 100 lagi <i class='fa-solid fa-chevron-down ml-1'></i>";
  }
  function detail(o) {
    if (!o) return;
    var contoh = String(o[3] || "").split("、").filter(Boolean);
    var paket = String(o[4] || "").split(",").filter(Boolean);
    $("jDetail").innerHTML =
      "<div class='text-center mb-4'><div class='font-black text-slate-800 text-[64px] leading-none mb-1'>" + esc(o[0]) + "</div>"
      + "<div class='text-sm text-slate-500'>💡 Klik karakter kanji untuk lihat detail — di bawah ini rinciannya:</div></div>"
      + "<div class='bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-[13px]'>"
      + "<div><span class='font-bold text-slate-500'>Arti Utama: </span><span class='font-bold text-slate-800'>" + esc(o[2] || "-") + "</span></div>"
      + "<div><span class='font-bold text-slate-500'>Bacaan (dari kosakata): </span><span class='text-slate-700'>" + esc(o[1] || "-") + "</span></div>"
      + "<div><span class='font-bold text-slate-500'>Contoh kata (" + contoh.length + "): </span><div class='mt-1 flex flex-wrap gap-1.5'>" + (contoh.map(function (c) { return "<span class='bg-white border border-slate-200 rounded-lg px-2.5 py-1 font-bold text-slate-700'>" + esc(c) + "</span>"; }).join("") || "<span class='text-slate-400'>-</span>") + "</div></div>"
      + "<div><span class='font-bold text-slate-500'>Paket soal: </span><div class='mt-1 flex flex-wrap gap-1.5'>" + (paket.map(function (p) { return "<span class='bg-fuji-50 text-fuji-700 border border-fuji-200 text-[11px] font-bold px-2 py-0.5 rounded-md'>" + esc(p) + "</span>"; }).join("") || "<span class='text-slate-400'>-</span>") + "</div></div>"
      + "</div>";
    var m = $("jModal"); m.classList.remove("hidden"); m.classList.add("flex");
  }
  window._jClose = function () { var m = $("jModal"); m.classList.add("hidden"); m.classList.remove("flex"); };
  all = (window.KANJI_DATA || []).slice();
  renderLevel(); render();
  $("jCari").oninput = function () { clearTimeout(window._jT); window._jT = setTimeout(function () { shown = 100; render(); }, 300); };
  $("jMore").onclick = function () { shown += 100; render(); };
  try { $("jModal").addEventListener("click", function (e) { if (e.target === $("jModal")) window._jClose(); }); } catch (e) {}
})();

