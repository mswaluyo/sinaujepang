// Estimasi skor JFT-Basic skala 10-250 (proporsional, bukan scaled-score resmi).
// Resmi: LULUS >=200 (A2); 175-199 A2.1; 145-174 A1. Estimasi: 10 + p/100*240.
function jftEst(p) { return Math.round(10 + (p / 100) * 240); }
function jftLevel(j) { return j >= 200 ? "A2" : j >= 175 ? "A2.1" : j >= 145 ? "A1" : "-"; }
// Kartu jenis soal di homepage: selipkan badge skor terakhir.
// Kartu punya href /quiz.html?p={slug}-quiz ; badge baca IndexedDB dulu (instan),
// lalu Firestore bila login (async, tanpa blokir). Render ulang saat auth siap.
(function () {
  function slugOf(a) {
    try {
      var raw = String(a.getAttribute("href") || a.href || "");
      var m = raw.match(/[?&]p=([a-z0-9]+-quiz)/i);
      return m ? m[1].toLowerCase() : null;
    } catch (e) { return null; }
  }
  function jftPos(j) { return Math.max(0, Math.min(100, ((j - 10) / 240) * 100)); }
  function badgeHTML(r, slug) {
    // SATU MODEL untuk semua: pin+bar+threshold+label SELALU sama.
    // Beda hanya WARNA: dikerjakan = bar warna + pil level; belum = bar abu + pil target.
    var has = !!r;
    var j = has ? jftEst(r.skor) : 0, lv = has ? jftLevel(j) : "-";
    var lvCls = has ? (j >= 200 ? "bg-emerald-100 text-emerald-700" : j >= 145 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700") : "bg-sky-100 text-sky-700";
    var headL = has
      ? 'Total Skor: <strong class="text-slate-800 text-sm">' + j + '</strong> / 250'
      : 'Total Skor: <strong class="text-slate-800 text-sm">0</strong> / 250';
    var headR = has ? 'Hasil: Level ' + lv : 'Target: A2 (200+)';
    var pos = has ? jftPos(j) : 0;
    var posStr = pos.toFixed(2);
    var bar = has
      ? '<div class="w-full h-2.5 rounded-full bg-gradient-to-r from-rose-400 via-amber-300 via-amber-400 to-emerald-500 relative shadow-inner"><div class="absolute top-0 bottom-0 w-[2px] bg-slate-700" style="left:56.25%"></div><div class="absolute top-0 bottom-0 w-[2px] bg-slate-700" style="left:68.75%"></div><div class="absolute top-0 bottom-0 w-[2px] bg-slate-700" style="left:79.17%"></div></div>'
      : '<div class="w-full h-2.5 rounded-full bg-slate-200 relative"><div class="absolute top-0 bottom-0 w-[2px] bg-slate-300" style="left:56.25%"></div><div class="absolute top-0 bottom-0 w-[2px] bg-slate-300" style="left:68.75%"></div><div class="absolute top-0 bottom-0 w-[2px] bg-slate-300" style="left:79.17%"></div></div>';
    var pin = has
      ? '<div class="absolute flex flex-col items-center" style="left:' + posStr + '%;transform:translateX(-50%);top:-26px"><span class="bg-slate-800 text-white font-bold text-[10px] px-1.5 py-0.5 rounded-md shadow">' + j + '</span><div class="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-slate-800"></div></div>'
      : '';
    return '<div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 mb-1 text-xs"><div class="flex items-center justify-between" style="margin-bottom:10px"><span class="font-medium text-slate-500">' + headL + '</span><span class="font-bold px-2 py-0.5 rounded ' + lvCls + ' text-[11px]">' + headR + '</span></div>'
      + '<div class="relative" style="margin-top:28px;margin-bottom:8px">' + pin
      + bar
      + '<div class="relative text-[11px] text-slate-600 font-bold mt-1 h-5" style="padding-left:4px;padding-right:4px"><span style="position:absolute;left:4px;top:0;background:#fff;padding:0 4px">10</span><span class="absolute text-center top-0" style="left:56.25%;transform:translateX(-50%)">145<br/><span class="text-[9px] text-slate-400 font-semibold">A1</span></span><span class="absolute text-center top-0" style="left:68.75%;transform:translateX(-50%)">175<br/><span class="text-[9px] text-slate-400 font-semibold">A2.1</span></span><span class="absolute text-center text-emerald-600 top-0" style="left:79.17%;transform:translateX(-50%)">200<br/><span class="text-[9px]">A2</span></span><span style="position:absolute;right:4px;top:0;background:#fff;padding:0 4px">250</span></div></div></div>';
  }
  function footHTML(a, r) {
    try {
      var foot = a.querySelector(".score-foot"), act = a.querySelector(".act-txt");
      if (!foot) return;
      if (r) {
        var j = jftEst(r.skor);
        var ok = j >= 200;
        var fin = (r.total && (r.jawab == null || r.jawab >= r.total));
        foot.className = "score-foot text-[11px] font-semibold flex items-center gap-1 " + (ok ? "text-emerald-600" : "text-rose-500");
        foot.innerHTML = ok ? '<i class="fa-solid fa-circle-check"></i><span>Lulus (Min. 200)</span>' : '<i class="fa-solid fa-circle-xmark"></i><span>Belum Lulus (Min. 200)</span>';
        if (act) act.textContent = fin ? "Ulangi Simulasi" : "Lanjutkan (" + (r.jawab || r.benar) + "/" + r.total + ")";
      } else {
        foot.className = "score-foot text-[11px] text-slate-400 font-medium flex items-center gap-1";
        foot.innerHTML = '<i class="fa-solid fa-play text-sky-400"></i><span>Siap Mengerjakan</span>';
        if (act) act.textContent = "Mulai Simulasi";
      }
    } catch (e) {}
  }
  async function paint(force) {
    var cards = document.querySelectorAll('a[href*="quiz.html?p="]');
    // 1) instan dari IndexedDB — load SEMUA attempt sekali, lalu loop kartu
    var instants = {};
    try {
      var all = await window.IndexedDB.getAllBySlug("jft_attempts_");
      // all = array of {key: "jft_attempts_slug", value: attempt, ...}
      // kelompokkan per slug
      all.forEach(function (item) {
        var slug = String(item.key || "").replace(/^jft_attempts_/, "");
        if (!slug) return;
        if (!instants[slug]) instants[slug] = [];
        instants[slug].push(item.value);
      });
      // ambil terakhir per slug
      Object.keys(instants).forEach(function (k) {
        var arr = instants[k];
        instants[k] = arr[arr.length - 1];
      });
    } catch (e) {}
    cards.forEach(function (a) {
      var slug = slugOf(a);
      if (!slug) return;
      var old = a.querySelector(".score-body");
      var isPlaceholder = old && /Target: A2/i.test(old.textContent || "");
      if (old && !force && !isPlaceholder) return;
      var instant = instants[slug] || null;
      // KUNCI URUTAN: grafik (.score-host) selalu di atas, footer (.card-foot) di bawah.
      // Bangun ulang footer kartu: [grafik][footer] agar cache HTML lama tak bisa membalik.
      var foot = a.querySelector(":scope > .card-foot");
      if (!foot) {
        foot = document.createElement("div");
        foot.className = "card-foot";
        a.appendChild(foot);
      }
      foot.className = "card-foot flex items-center justify-between pt-3 mt-1 border-t border-slate-100";
      foot.innerHTML = '<span class="score-foot text-[11px] text-slate-400 font-medium flex items-center gap-1"><i class="fa-solid fa-play text-sky-400"></i><span>Siap Mengerjakan</span></span><span class="bg-sky-600 group-hover:bg-sky-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"><span class="act-txt">Mulai Simulasi</span><i class="fa-solid fa-arrow-right text-[10px]"></i></span>';
      var host = a.querySelector(":scope > .score-host");
      if (!host) {
        host = document.createElement("div");
        host.className = "score-host";
        a.insertBefore(host, foot);
      } else if (host.nextElementSibling !== foot) {
        a.insertBefore(host, foot);
      }
      host.outerHTML = '<div class="score-host score-body" data-hasil="/hasil.html?paket=' + slug + '" style="cursor:pointer" title="Lihat lembar hasil">' + badgeHTML(instant, slug) + '</div>';
      footHTML(a, instant);
    });
    // 2) segarkan SEMUA dari Firestore 1x query (bebas index)
    refreshAll();
  }
  function refreshAll() {
    try {
      if (window.fujiScore && window.fujiScore.latestAll) {
        window.fujiScore.latestAll().then(function (all) {
          if (!all) return;
          var cards = document.querySelectorAll('a[href*="quiz.html?p="]');
          cards.forEach(function (a) {
            var slug = slugOf(a);
            if (!slug) return;
            // Kunci urutan juga di sini agar kartu KOSONG ikut rapi (grafik atas, footer bawah).
            var foot = a.querySelector(":scope > .card-foot");
            var host = a.querySelector(":scope > .score-host");
            if (foot && host && host.nextElementSibling !== foot) a.insertBefore(host, foot);
            var r = all[slug] || null;
            if (host) host.outerHTML = '<div class="score-host score-body" data-hasil="/hasil.html?paket=' + slug + '" style="cursor:pointer" title="Lihat lembar hasil">' + badgeHTML(r, slug) + '</div>';
            footHTML(a, r);
          });
        }).catch(function () {});
      }
    } catch (e) {}
  }
  document.addEventListener("click", function (e) {
    try {
      var h = e.target && e.target.closest ? e.target.closest(".score-host[data-hasil]") : null;
      if (h && h.getAttribute("data-hasil")) { e.preventDefault(); e.stopPropagation(); location.href = h.getAttribute("data-hasil"); }
    } catch (err) {}
  }, true);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { paint(false); });
  else paint(false);
  // render ulang saat kembali dari kuis (bfcache) agar skor baru tampil
  window.addEventListener("pageshow", function () { paint(true); });
  // render ulang saat auth Firestore siap (fujiUser tadinya null saat paint pertama)
  window.addEventListener("fuji:auth", function () { paint(true); });
  // polling ringan 3x (auth async) bila badge masih Belum dikerjakan
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
