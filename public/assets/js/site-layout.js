// ============================================================
// site-layout.js — SATU header + SATU footer untuk seluruh web.
// Sumber tunggal: semua halaman biasa memakai markup dari file ini,
// jadi perubahan nav/footer cukup diedit di satu tempat.
//
// Cara pakai (tepat setelah tag <body ...>):
//   <script src="/assets/js/indexeddb.js"></script>   <!-- kalau halaman belum memuatnya -->
//   <script src="/assets/js/site-layout.js"></script>
// Footer otomatis dipasang di akhir <body>.
// Halaman kuis: set window.SITE_NO_CHROME = true sebelum memuat skrip ini
// (kuis punya header khusus timer dari layout.js, tapi footernya tetap dari sini).
// ============================================================
(function () {
  if (window.SiteLayout) return;

  // Kelas aktif per menu — dilampirkan otomatis sesuai path halaman berjalan
  var NAV_ACTIVE = {
    latihan: "bg-fuji-50 text-fuji-700",
    kotoba: "bg-emerald-50 text-emerald-700",
    kanji: "bg-rose-50 text-rose-700"
  };

  // Tombol login versi awal (ikon Google + teks); diganti renderUser bila sudah ada sesi
  var LOGIN_DEFAULT =
    '<svg class="w-4 h-4" viewBox="0 0 24 24">' +
    '<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>' +
    '<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>' +
    '<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>' +
    '<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>' +
    "</svg><span>Masuk Google</span>";

  function headerHTML() {
    var h = "";
    h += '<header id="site-header" class="no-print sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-fuji-100 shadow-sm">';
    h += '<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">';
    h += '<a href="/" class="flex items-center gap-2.5">';
    h += '<div class="w-9 h-9 rounded-full bg-gradient-to-tr from-fuji-600 to-fuji-400 flex items-center justify-center text-white font-bold shadow-md shadow-fuji-500/20"><span class="text-xs font-extrabold tracking-tighter">学び</span></div>';
    h += '<div class="flex flex-col"><span class="font-bold text-slate-800 text-lg leading-tight">SinauJepang</span><span class="text-[10px] text-fuji-600 font-semibold tracking-wider">BELAJAR &amp; LATIHAN GRATIS</span></div>';
    h += "</a>";
    h += '<div class="flex items-center gap-3">';
    // Nav desktop (pill) — menu aktif diberi warna sendiri via NAV_ACTIVE
    h += '<nav class="hidden md:flex items-center gap-1 text-[13px] font-bold">';
    h += '<a href="/#latihan-soal" data-nav="latihan" class="px-3 py-1.5 rounded-full text-slate-600 hover:text-fuji-600 hover:bg-fuji-50 transition-all">Latihan</a>';
    h += '<a href="/kotoba" data-nav="kotoba" class="px-3 py-1.5 rounded-full text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all"><i class="fa-solid fa-book-open mr-1"></i>Kotoba</a>';
    h += '<a href="/kanji" data-nav="kanji" class="px-3 py-1.5 rounded-full text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all"><i class="fa-solid fa-language mr-1"></i>Kanji</a>';
    h += '<a href="/jft-a2.html" data-nav="jft-a2" class="px-3 py-1.5 rounded-full text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-all"><i class="fa-solid fa-graduation-cap mr-1"></i>JFT-A2</a>';
    h += "</nav>";
    h += '<a id="adminBtn" href="/admin" class="hidden items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-3.5 py-1.5 rounded-full transition-all text-xs border border-amber-500"><i class="fa-solid fa-shield-halved"></i><span>Admin</span></a>';
    h += '<button onclick="SiteLayout.donate()" class="hidden sm:flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold px-3.5 py-1.5 rounded-full border border-amber-200 transition-all text-xs"><i class="fa-solid fa-mug-hot text-amber-600"></i><span>Traktir Kopi</span></button>';
    h += '<span id="uInfo" class="hidden text-xs text-slate-500"></span>';
    h += '<button id="loginBtn" onclick="SiteLayout.login()" class="flex items-center gap-2.5 bg-white hover:bg-slate-50 text-slate-700 font-medium px-4 py-2 rounded-full border border-slate-200 shadow-sm transition-all hover:shadow text-sm">' + LOGIN_DEFAULT + "</button>";
    h += "</div></div>";
    // Baris nav versi layar kecil (di desktop nav pill di atas sudah cukup)
    h += '<div class="md:hidden border-t border-fuji-100 bg-white/70"><div class="max-w-6xl mx-auto px-4 py-1.5 flex items-center gap-1 text-[12px] font-bold">';
    h += '<a href="/" data-nav="latihan" class="px-2.5 py-1 rounded-full text-slate-600 hover:text-fuji-600 hover:bg-fuji-50 transition-all">Latihan</a>';
    h += '<a href="/kotoba" data-nav="kotoba" class="px-2.5 py-1 rounded-full text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all"><i class="fa-solid fa-book-open mr-1"></i>Kotoba</a>';
    h += '<a href="/kanji" data-nav="kanji" class="px-2.5 py-1 rounded-full text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-all"><i class="fa-solid fa-language mr-1"></i>Kanji</a>';
    h += '<a href="/jft-a2.html" data-nav="jft-a2" class="px-2.5 py-1 rounded-full text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-all"><i class="fa-solid fa-graduation-cap mr-1"></i>JFT-A2</a>';
    h += "</div></div>";
    h += "</header>";
    return h;
  }


  function footerHTML() {
    var f = "";
    f += '<footer id="site-footer" class="no-print bg-white border-t border-slate-200 py-8 mt-auto">';
    f += '<div class="max-w-5xl mx-auto px-4 text-center">';
    f += '<p class="text-slate-700 font-bold text-sm mb-1">SinauJepang (sinaujepang.web.app)</p>';
    f += '<p class="text-slate-600 text-xs mb-3">Didedikasikan untuk seluruh pejuang Tokutei Ginou Indonesia. Semoga sukses melangkah ke Jepang!</p>';
    f += '<div class="flex items-center justify-center gap-3 mt-2">';
    f += '<a href="https://wa.me/6285649049086" target="_blank" rel="noopener" class="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1eb856] text-white font-semibold px-4 py-2 rounded-full text-xs shadow-sm transition-all"><i class="fa-brands fa-whatsapp text-sm"></i><span>Sugeng Waluyo</span></a>';
    f += '<a href="https://www.facebook.com/maswaluyo/" target="_blank" rel="noopener" class="inline-flex items-center gap-2 bg-[#1877F2] hover:bg-[#1464cc] text-white font-semibold px-4 py-2 rounded-full text-xs shadow-sm transition-all"><i class="fa-brands fa-facebook text-sm"></i><span>Sugeng Waluyo</span></a>';
    f += '<a href="https://www.tiktok.com/@danyangkedungselur" target="_blank" rel="noopener" class="inline-flex items-center gap-2 bg-white hover:bg-black text-slate-800 hover:text-white border border-slate-300 hover:border-black font-semibold px-4 py-2 rounded-full text-xs shadow-sm transition-all"><i class="fa-brands fa-tiktok text-sm"></i><span>@danyangkedungselur</span></a>';
    f += "</div></div></footer>";
    return f;
  }

  function currentSection() {
    var p = (location.pathname || "/").toLowerCase().replace(/\.html$/, "").replace(/\/+$/, "");
    if (p === "" || p === "/") return "latihan";
    if (p === "/kotoba") return "kotoba";
    if (p === "/kanji") return "kanji";
    if (p === "/quiz" || p === "/hasil") return "latihan";
    return "";
  }

  // Login: modal cepat di beranda; di halaman lain buka halaman masuk
  function login() {
    if (typeof window.openLoginModal === "function") { window.openLoginModal(); return; }
    location.href = "/login.html";
  }

  // Keluar: pakai fujiLogout bila ada (beranda); selain itu lewat ?out=1 di login.html
  function logoutFallback() {
    try { localStorage.removeItem("jft_user"); } catch (e) {}
    try { window.IndexedDB.removeItem("jft_user"); } catch (e) {}
    location.replace("/login.html?out=1");
  }

  // Traktir Kopi: modal di beranda; selain itu bawa ke beranda + buka otomatis (?donasi=1)
  function donate() {
    if (typeof window.openDonationModal === "function") { window.openDonationModal(); return; }
    location.replace("/?donasi=1");
  }

  // Sinkronkan tampilan login di header dengan sesi tersimpan (jft_user)
  function renderUser() {
    if (!window.IndexedDB || !window.IndexedDB.getItem) return;
    var b = document.getElementById("loginBtn");
    var info = document.getElementById("uInfo");
    if (!b) return;
    Promise.resolve(window.IndexedDB.getItem("jft_user")).then(function (u) {
      var ab = document.getElementById("adminBtn");
      if (u) {
        b.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i><span>Keluar</span>';
        b.onclick = function () {
          if (typeof window.fujiLogout === "function") { window.fujiLogout(); return; }
          logoutFallback();
        };
        if (info) { info.textContent = "Hi, " + (u.name || u.email); info.classList.remove("hidden"); }
        if (ab && (u.email || "").toLowerCase() === "mswaluyo@gmail.com") {
          ab.style.setProperty("display", "flex", "important");
        } else if (ab) {
          ab.style.setProperty("display", "none", "important");
        }
      } else {
        b.innerHTML = LOGIN_DEFAULT;
        b.onclick = login;
        if (info) info.classList.add("hidden");
        if (ab) ab.style.setProperty("display", "none", "important");
      }
    }).catch(function () {});
  }

  // Di halaman admin, admin-auth.js menampilkan #aUser (Hi, …) + #aOut (Keluar).
  // Saat identitas admin tampil, sembunyikan loginBtn/uInfo agar tidak ganda.
  function watchAdminIdentity() {
    var au = document.getElementById("aUser");
    if (!au || !window.MutationObserver) return;
    function sync() {
      var logged = !au.classList.contains("hidden");
      ["loginBtn", "uInfo"].forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        if (logged) el.style.setProperty("display", "none", "important");
        else el.style.removeProperty("display");
      });
    }
    new MutationObserver(sync).observe(au, { attributes: true, attributeFilter: ["class"] });
    sync();
  }

  function mountHeader() {
    if (document.getElementById("site-header")) return;
    document.body.insertAdjacentHTML("afterbegin", headerHTML());
    var sec = currentSection();
    if (sec && NAV_ACTIVE[sec]) {
      var links = document.querySelectorAll('#site-header [data-nav="' + sec + '"]');
      var cls = NAV_ACTIVE[sec].split(" ");
      for (var i = 0; i < links.length; i++) {
        for (var j = 0; j < cls.length; j++) links[i].classList.add(cls[j]);
      }
    }
    // Tombol Admin secara default tersembunyi, hanya tampil jika login sebagai admin
    var ab = document.getElementById("adminBtn");
    if (ab) ab.style.display = "none";
  }

  function mountFooter() {
    if (document.getElementById("site-footer")) return;
    document.body.insertAdjacentHTML("beforeend", footerHTML());
  }

  window.SiteLayout = {
    header: headerHTML,
    footer: footerHTML,
    mountHeader: mountHeader,
    mountFooter: mountFooter,
    login: login,
    logout: logoutFallback,
    donate: donate,
    renderUser: renderUser
  };

  if (window.SITE_NO_CHROME !== true && document.body) {
    mountHeader();
    var init = function () { mountFooter(); renderUser(); watchAdminIdentity(); };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
  }
})();
