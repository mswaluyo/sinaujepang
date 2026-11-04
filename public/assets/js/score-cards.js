// Estimasi skor JFT-Basic skala 10-250 (proporsional, bukan scaled-score resmi).
// Resmi: LULUS >=200 (A2); 175-199 A2.1; 145-174 A1. Estimasi: 10 + p/100*240.
function jftEst(p) { return Math.round(10 + (p / 100) * 240); }
function jftLevel(j) { return j >= 200 ? "A2" : j >= 175 ? "A2.1" : j >= 145 ? "A1" : "-"; }
// Kartu jenis soal di homepage: selipkan badge skor terakhir.
// Kartu punya data-paket="{slug}" atau href /quiz.html?p={slug}-quiz ; badge baca IndexedDB dulu (instan),
// lalu Firestore bila login (async, tanpa blokir). Render ulang saat auth siap.
(function () {
  function slugOf(a) {
    try {
      if (a.getAttribute("data-paket")) return a.getAttribute("data-paket").toLowerCase();
      var raw = String(a.getAttribute("href") || a.href || "");
      var m = raw.match(/[?&]p=([a-z0-9_-]+-quiz)/i);
      return m ? m[1].toLowerCase() : null;
    } catch (e) { return null; }
  }
  function findPaketConfig(slug) {
    try {
      var cfg = window.PAKET_CONFIG;
      if (!cfg || !cfg.kategori) return null;
      for (var i = 0; i < cfg.kategori.length; i++) {
        var pkts = cfg.kategori[i].paket || [];
        for (var j = 0; j < pkts.length; j++) {
          if (pkts[j].slug === slug) return pkts[j];
        }
      }
    } catch (e) {}
    return null;
  }
  function jftPos(j) { return Math.max(0, Math.min(100, ((j - 10) / 240) * 100)); }
  function badgeHTML(r, slug) {
    var has = !!r;
    var j = has ? jftEst(r.skor) : 0, lv = has ? jftLevel(j) : "-";
    var lvCls = has ? (j >= 200 ? "bg-emerald-100 text-emerald-700" : j >= 145 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700") : "bg-sky-100 text-sky-700";
    var benar = has ? (r.benar || 0) : 0;
    var total = has ? (r.total || 0) : 0;
    var jawab = has ? (r.jawab != null ? r.jawab : benar) : 0;
    var pct = has && r.skor != null ? r.skor : 0;
    // ── Tanggal (didefinisikan SEBELUM dipakai headLine) ──
    var tgl = '';
    if (has && r.at) {
      try {
        var d = new Date(r.at);
        tgl = '<span class="text-[10px] text-slate-400">' + d.toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' }) + '</span>';
      } catch(e){}
    }
    // ── 3 segmen tabel: BENAR | SKOR | LEVEL (satu baris, border pemisah) ──
    var headLine = has
      ? '<div class="flex items-center justify-between text-[11px] mb-2 pb-2 border-b border-slate-200/60">'
        + '<span class="text-slate-500">BENAR <b class="text-slate-800">' + benar + '/' + total + '</b></span>'
        + '<span aria-hidden="true" class="w-2"></span>'
        + '<span class="text-slate-500">SKOR <b class="text-slate-800">' + j + '/250</b></span>'
        + '<span aria-hidden="true" class="w-2"></span>'
        + '<span class="text-slate-500">LEVEL <b class="' + (j>=200?'text-emerald-600':j>=145?'text-amber-600':'text-rose-600') + '">' + lv + '</b></span>'
        + (tgl ? ' <span class="text-slate-400">' + tgl + '</span>' : '')
        + '</div>'
      : '<div class="flex items-center justify-between text-[11px] mb-2 pb-2 border-b border-slate-200/60 text-slate-400">Belum mengerjakan</div>';
    var pos = has ? jftPos(j) : 0;
    var posStr = pos.toFixed(2);
    // ── Bar utama (gradient + threshold markers) ──
    var barInner = has
      ? '<div class="absolute top-0 bottom-0 w-[2px] bg-slate-700" style="left:56.25%"></div><div class="absolute top-0 bottom-0 w-[2px] bg-slate-700" style="left:68.75%"></div><div class="absolute top-0 bottom-0 w-[2px] bg-slate-700" style="left:79.17%"></div>'
      : '<div class="absolute top-0 bottom-0 w-[2px] bg-slate-300" style="left:56.25%"></div><div class="absolute top-0 bottom-0 w-[2px] bg-slate-300" style="left:68.75%"></div><div class="absolute top-0 bottom-0 w-[2px] bg-slate-300" style="left:79.17%"></div>';
    // ── Pin skor (di ATAS bar, ujung segitiga menempel bar) ──
    var pin = has
      ? '<div class="absolute z-10 pointer-events-none" style="left:' + posStr + '%;bottom:100%;transform:translateX(-50%);margin-bottom:-1px">'
        + '<span class="bg-slate-800 text-white font-bold text-[10px] px-1.5 py-0.5 rounded-md shadow inline-block whitespace-nowrap">' + j + '</span>'
        + '<div class="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-slate-800 mx-auto"></div>'
        + '</div>'
      : '';
    var bar = has
      ? '<div class="w-full h-2.5 rounded-full bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400 relative shadow-inner overflow-visible">' + pin + barInner + '</div>'
      : '<div class="w-full h-2.5 rounded-full bg-slate-200 relative">' + barInner + '</div>';
    // ── Skala 10–250 (di bawah bar) ──
    var skala = '<div class="relative text-[11px] text-slate-500 font-bold mt-1.5 h-6" style="padding-left:4px;padding-right:4px">'
      + '<span style="position:absolute;left:4px;top:0">10</span>'
      + '<span class="absolute text-center top-0 font-normal" style="left:56.25%;transform:translateX(-50%)">145<br/><span class="text-[9px] text-slate-400">A1</span></span>'
      + '<span class="absolute text-center top-0 font-normal" style="left:68.75%;transform:translateX(-50%)">175<br/><span class="text-[9px] text-slate-400">A2.1</span></span>'
      + '<span class="absolute text-center top-0 text-emerald-600 font-bold" style="left:79.17%;transform:translateX(-50%)">200<br/><span class="text-[9px] text-emerald-600 font-normal">A2</span></span>'
      + '<span style="position:absolute;right:4px;top:0">250</span>'
      + '</div>';
    return '<div class="rounded-xl border border-slate-200/80 bg-white p-3 my-2 shadow-inner select-none">'
      + headLine
      + '<div class="relative" style="margin-top:28px;margin-bottom:8px">'
      + bar
      + skala
      + '</div>'
      + '</div>';
  }
  function footHTML(a, r, slug) {
    try {
      var foot = a.querySelector(".card-foot");
      if (!foot) return;
      var pCfg = findPaketConfig(slug);
      var extraBtn = "";
      if (pCfg && pCfg.soalTambahan) {
        extraBtn = '<div class="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between">'
          + '<span class="text-[11px] text-slate-500 font-medium flex items-center gap-1"><i class="fa-solid fa-layer-group text-emerald-500"></i><span>Tersedia ' + pCfg.soalTambahan.total + ' soal tambahan</span></span>'
          + '<a href="/quiz.html?p=' + pCfg.soalTambahan.slug + '" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 transition-all shadow-sm hover:scale-105">'
          + '<span>' + pCfg.soalTambahan.nama + '</span><i class="fa-solid fa-arrow-right text-[10px]"></i></a>'
          + '</div>';
      }

      var ok = false, fin = false, txtAct = "Mulai Simulasi";
      var footStatus = '<span class="score-foot text-[11px] text-slate-400 font-medium flex items-center gap-1"><i class="fa-solid fa-play text-sky-400"></i><span>Siap Mengerjakan</span></span>';
      
      if (r) {
        var j = jftEst(r.skor);
        ok = j >= 200;
        fin = (r.total && (r.jawab == null || r.jawab >= r.total));
        footStatus = '<span class="score-foot text-[11px] font-semibold flex items-center gap-1 ' + (ok ? "text-emerald-600" : "text-rose-500") + '">'
          + (ok ? '<i class="fa-solid fa-circle-check"></i><span>Lulus (Min. 200)</span>' : '<i class="fa-solid fa-circle-xmark"></i><span>Belum Lulus (Min. 200)</span>')
          + '</span>';
        txtAct = fin ? "Ulangi Simulasi" : "Lanjutkan (" + (r.jawab || r.benar) + "/" + r.total + ")";
      }

      var mainRow = '<div class="flex items-center justify-between w-full">'
        + footStatus
        + '<span class="flex items-center gap-2">'
        + '<a href="/cetak.html?paket=' + slug + '" target="_blank" rel="noopener" title="Unduh soal PDF" class="pdf-btn inline-flex items-center gap-1 bg-white hover:bg-rose-50 text-rose-600 font-semibold text-xs px-3 py-2 rounded-xl border border-rose-200 transition-all"><i class="fa-solid fa-file-pdf"></i><span>PDF</span></a>'
        + '<a href="/quiz.html?p=' + slug + '" class="bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm">'
        + '<span class="act-txt">' + txtAct + '</span><i class="fa-solid fa-arrow-right text-[10px]"></i></a>'
        + '</span></div>';

      foot.innerHTML = mainRow + extraBtn;
    } catch (e) {}
  }
  async function paint(force) {
    var cards = document.querySelectorAll('[data-paket]');
    // 1) instan dari IndexedDB + localStorage fallback
    var instants = {};
    try {
      var all = await window.IndexedDB.getAllBySlug("jft_attempts_");
      if (all) {
        Object.keys(all).forEach(function (k) {
          var arr = all[k];
          if (Array.isArray(arr) && arr.length) instants[k] = arr[arr.length - 1];
        });
      }
    } catch (e) {}
    try {
      var rawLs = localStorage.getItem("jft_hasil_all");
      var lsHasil = rawLs ? JSON.parse(rawLs) : {};
      Object.keys(lsHasil).forEach(function (k) {
        if (!instants[k]) instants[k] = lsHasil[k];
      });
    } catch (e) {}
    cards.forEach(function (a) {
      var slug = slugOf(a);
      if (!slug) return;
      var instant = instants[slug] || null;
      var foot = a.querySelector(".card-foot");
      var host = a.querySelector(".score-host");
      if (host) {
        host.innerHTML = '<div class="score-body" data-hasil="/hasil.html?paket=' + slug + '" style="cursor:pointer" title="Lihat lembar hasil">' + badgeHTML(instant, slug) + '</div>';
      }
      if (foot) {
        footHTML(a, instant, slug);
      }
    });
    // 2) segarkan SEMUA dari Firestore 1x query (bebas index)
    refreshAll();
  }
  function refreshAll() {
    try {
      if (window.fujiScore && window.fujiScore.latestAll) {
        window.fujiScore.latestAll().then(function (all) {
          if (!all) return;
          var cards = document.querySelectorAll('[data-paket]');
          cards.forEach(function (a) {
            var slug = slugOf(a);
            if (!slug) return;
            var r = all[slug] || null;
            var foot = a.querySelector(".card-foot");
            var host = a.querySelector(".score-host");
            if (host) host.innerHTML = '<div class="score-body" data-hasil="/hasil.html?paket=' + slug + '" style="cursor:pointer" title="Lihat lembar hasil">' + badgeHTML(r, slug) + '</div>';
            if (foot) footHTML(a, r, slug);
          });
        }).catch(function () {});
      }
    } catch (e) {}
  }
  document.addEventListener("click", function (e) {
    try {
      var pdf = e.target && e.target.closest ? e.target.closest(".pdf-btn") : null;
      if (pdf) { return; }
      var h = e.target && e.target.closest ? e.target.closest("[data-hasil]") : null;
      if (h && h.getAttribute("data-hasil")) { e.preventDefault(); location.href = h.getAttribute("data-hasil"); }
    } catch (err) {}
  }, true);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { paint(false); });
  else paint(false);
  window.addEventListener("pageshow", function () { paint(true); });
  window.addEventListener("fuji:auth", function () { paint(true); });
  var _n = 0;
  var _t = setInterval(function () {
    _n++;
    try {
      if (window.fujiUser && window.fujiUser.email) { paint(true); clearInterval(_t); }
      else if (_n >= 3) clearInterval(_t);
      else paint(false);
    } catch (e) {}
  }, 1500);
})();
