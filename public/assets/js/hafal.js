// hafal.js — tabel daftar kosakata (filter paket + cari + sortir header + muat bertahap)
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var all = [], shown = 200, sortK = "kanji", sortD = 1;
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  var COLS = [
    { k: "kanji", label: "Kanji / Kata" }, { k: "kana", label: "Kana" },
    { k: "rom", label: "Romaji" }, { k: "arti", label: "Arti" }, { k: "paket", label: "Paket" }
  ];
  function arrow(k) { if (sortK !== k) return " <span class='text-slate-300'>⇅</span>"; return sortD === 1 ? " <span class='text-fuji-600'>▲</span>" : " <span class='text-fuji-600'>▼</span>"; }
  function headHtml() {
    return "<tr>" + COLS.map(function (c) {
      return "<th class='text-left font-extrabold px-4 py-3'><button data-k='" + c.k + "' class='hover:text-fuji-600 uppercase tracking-wide'>" + c.label + arrow(c.k) + "</button></th>";
    }).join("") + "</tr>";
  }
  function val(o, k) { return k === "paket" ? (o.paket || []).join(",") : String(o[k] || "").toLowerCase(); }
  function render() {
    var pk = $("kPaket").value, kw = $("kCari").value.trim().toLowerCase();
    var list = all.filter(function (o) {
      if (pk && (o.paket || []).indexOf(pk) < 0) return false;
      if (kw) { var s = ((o.kanji || "") + " " + (o.kana || "") + " " + (o.rom || "") + " " + (o.arti || "")).toLowerCase(); if (s.indexOf(kw) < 0) return false; }
      return true;
    });
    list.sort(function (a, b) { return val(a, sortK).localeCompare(val(b, sortK), "ja") * sortD; });
    $("kCount").textContent = list.length + " kosakata";
    var h = "";
    list.slice(0, shown).forEach(function (o) {
      h += "<tr class='hover:bg-fuji-50/60 transition-colors'>"
        + "<td class='px-4 py-2.5 font-bold text-slate-800 text-[15px]'>" + esc(o.kanji || "-") + "</td>"
        + "<td class='px-4 py-2.5 text-slate-600'>" + esc(o.kana || "-") + "</td>"
        + "<td class='px-4 py-2.5 text-slate-500 italic'>" + esc(o.rom || "-") + "</td>"
        + "<td class='px-4 py-2.5 text-slate-700'>" + esc(o.arti || "-") + "</td>"
        + "<td class='px-4 py-2.5'>" + (o.paket || []).map(function (p) { return "<span class='inline-block bg-fuji-50 text-fuji-700 border border-fuji-200 text-[11px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap mr-1 mb-1'>" + esc(p.replace("-quiz", "")) + "</span>"; }).join("") + "</td></tr>";
    });
    $("kRows").innerHTML = h || "<tr><td colspan='5' class='py-10 text-center text-slate-400 text-[13px]'>Tidak ada yang cocok.</td></tr>";
    var more = $("kMore"), habis = shown >= list.length;
    more.disabled = habis; more.classList.toggle("opacity-50", habis);
    more.innerHTML = habis ? "Semua sudah ditampilkan ✓" : "Muat 200 lagi <i class='fa-solid fa-chevron-down ml-1'></i>";
  }
  function bindHead() {
    $("kHead").querySelectorAll("[data-k]").forEach(function (b) {
      b.onclick = function () { var k = b.getAttribute("data-k"); if (sortK === k) sortD = -sortD; else { sortK = k; sortD = 1; } $("kHead").innerHTML = headHtml(); bindHead(); render(); };
    });
  }
  fetch("/kosakata.json", { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (j) {
    all = j.data || [];
    var ps = {};
    all.forEach(function (o) { (o.paket || []).forEach(function (p) { ps[p] = 1; }); });
    Object.keys(ps).sort().forEach(function (p) { var op = document.createElement("option"); op.value = p; op.textContent = p; $("kPaket").appendChild(op); });
    $("kHead").innerHTML = headHtml(); bindHead(); render();
  }).catch(function () { $("kRows").innerHTML = "<tr><td colspan='5' class='py-10 text-center text-rose-500'>Gagal memuat kosakata.json</td></tr>"; });
  $("kPaket").onchange = function () { shown = 200; render(); };
  $("kCari").oninput = function () { clearTimeout(window._kT); window._kT = setTimeout(function () { shown = 200; render(); }, 300); };
  $("kMore").onclick = function () { shown += 200; render(); };
})();
