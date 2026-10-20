// kanji.js — tabel daftar kanji (cari + sortir header + muat bertahap)
// Format KANJI_DATA: [kanji, bacaan, arti, "contoh1、contoh2", "paket1,paket2"]
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var all = [], shown = 200, sortK = 0, sortD = 1;
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  var COLS = [
    { k: 0, label: "Kanji" }, { k: 1, label: "Bacaan" }, { k: 2, label: "Arti" },
    { k: 3, label: "Contoh kata" }, { k: 4, label: "Paket" }
  ];
  function arrow(k) { if (sortK !== k) return " <span class='text-slate-300'>⇅</span>"; return sortD === 1 ? " <span class='text-fuji-600'>▲</span>" : " <span class='text-fuji-600'>▼</span>"; }
  function headHtml() {
    return "<tr>" + COLS.map(function (c) {
      return "<th class='text-left font-extrabold px-4 py-3'><button data-k='" + c.k + "' class='hover:text-fuji-600 uppercase tracking-wide'>" + c.label + arrow(c.k) + "</button></th>";
    }).join("") + "</tr>";
  }
  function render() {
    var kw = $("jCari").value.trim().toLowerCase();
    var list = all.filter(function (o) {
      if (!kw) return true;
      return (o.join(" ") + "").toLowerCase().indexOf(kw) >= 0;
    });
    list.sort(function (a, b) { return String(a[sortK] || "").localeCompare(String(b[sortK] || ""), "ja") * sortD; });
    $("jCount").textContent = list.length + " kanji";
    var h = "";
    list.slice(0, shown).forEach(function (o) {
      h += "<tr class='hover:bg-fuji-50/60 transition-colors'>"
        + "<td class='px-4 py-2.5 font-black text-slate-800 text-[22px] leading-none'>" + esc(o[0]) + "</td>"
        + "<td class='px-4 py-2.5 text-slate-600'>" + esc(o[1] || "-") + "</td>"
        + "<td class='px-4 py-2.5 text-slate-700'>" + esc(o[2] || "-") + "</td>"
        + "<td class='px-4 py-2.5 text-slate-600'>" + esc(o[3] || "-") + "</td>"
        + "<td class='px-4 py-2.5'>" + String(o[4] || "").split(",").filter(Boolean).map(function (p) { return "<span class='inline-block bg-fuji-50 text-fuji-700 border border-fuji-200 text-[11px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap mr-1 mb-1'>" + esc(p) + "</span>"; }).join("") + "</td></tr>";
    });
    $("jRows").innerHTML = h || "<tr><td colspan='5' class='py-10 text-center text-slate-400 text-[13px]'>Tidak ada yang cocok.</td></tr>";
    var more = $("jMore"), habis = shown >= list.length;
    more.disabled = habis; more.classList.toggle("opacity-50", habis);
    more.innerHTML = habis ? "Semua sudah ditampilkan ✓" : "Muat 200 lagi <i class='fa-solid fa-chevron-down ml-1'></i>";
  }
  function bindHead() {
    $("jHead").querySelectorAll("[data-k]").forEach(function (b) {
      b.onclick = function () { var k = +b.getAttribute("data-k"); if (sortK === k) sortD = -sortD; else { sortK = k; sortD = 1; } $("jHead").innerHTML = headHtml(); bindHead(); render(); };
    });
  }
  all = (window.KANJI_DATA || []).slice();
  $("jHead").innerHTML = headHtml(); bindHead(); render();
  $("jCari").oninput = function () { clearTimeout(window._jT); window._jT = setTimeout(function () { shown = 200; render(); }, 300); };
  $("jMore").onclick = function () { shown += 200; render(); };
})();
