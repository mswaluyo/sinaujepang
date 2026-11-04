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
    home: "bg-fuji-50 text-fuji-700",
    simulasi: "bg-sky-50 text-sky-700",
    ssw: "bg-amber-50 text-amber-700",
    kanji: "bg-rose-50 text-rose-700",
    "jft-a2": "bg-sky-50 text-sky-700",
    game: "bg-indigo-50 text-indigo-700"
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
    h += '<a id="adminBtn" href="/admin" class="hidden items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-3.5 py-1.5 rounded-full transition-all text-xs border border-amber-500"><i class="fa-solid fa-shield-halved"></i><span>Admin</span></a>';
    h += '<span id="uInfo" class="hidden text-xs text-slate-500"></span>';
    h += '<button id="loginBtn" onclick="SiteLayout.login()" class="flex items-center gap-2.5 bg-white hover:bg-slate-50 text-slate-700 font-medium px-4 py-2 rounded-full border border-slate-200 shadow-sm transition-all hover:shadow text-sm">' + LOGIN_DEFAULT + "</button>";
    h += "</div></div>";
    h += "</header>";
    return h;
  }


  function footerHTML() {
    var f = "";
    f += '<footer id="site-footer" class="no-print bg-white border-t border-slate-200 py-8 mt-auto">';
    f += '<div class="max-w-5xl mx-auto px-4 text-center">';
    f += '<p class="text-slate-700 font-bold text-sm mb-1">SinauJepang (sinaujepang.web.app)</p>';
    f += '<p class="text-slate-500 text-xs">Didedikasikan untuk seluruh pejuang Tokutei Ginou Indonesia. Semoga sukses melangkah ke Jepang!</p>';
    f += "</div></footer>";
    return f;
  }

  function currentSection() {
    var p = (location.pathname || "/").toLowerCase().replace(/\.html$/, "").replace(/\/+$/, "");
    if (p === "" || p === "/") return "home";
    if (p === "/simulasi" || p === "/quiz" || p === "/hasil") return "simulasi";
    if (p === "/ssw") return "ssw";
    if (p === "/kanji") return "kanji";
    if (p === "/jft-a2") return "jft-a2";
    if (p === "/game") return "game";
    return "";
  }

  // Modal Login Standar SinauJepang (seragam di semua halaman)
  function loginModalHTML() {
    var m = "";
    m += '<div id="loginModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">';
    m += '<div class="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-200">';
    m += '<button onclick="SiteLayout.closeLoginModal()" class="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-all">';
    m += '<i class="fa-solid fa-xmark text-sm"></i>';
    m += '</button>';
    m += '<div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-fuji-600 text-white flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg shadow-sky-500/25">';
    m += '<i class="fa-solid fa-user-check"></i>';
    m += '</div>';
    m += '<h2 class="text-2xl font-extrabold text-slate-800 mb-1">Masuk ke SinauJepang</h2>';
    m += '<h3 class="text-xs font-bold uppercase tracking-wider text-fuji-600 mb-3">Akun Belajar &amp; Simulasi CBT</h3>';
    m += '<p class="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 max-w-xs mx-auto">';
    m += 'Masuk dengan akun Google Anda untuk membuka simulasi CBT, menyimpan statistik belajar, riwayat nilai ujian, dan materi persiapan kerja.';
    m += '</p>';
    m += '<button onclick="SiteLayout.simulateLogin()" class="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-sky-600 to-fuji-600 hover:from-sky-700 hover:to-fuji-700 text-white font-bold py-3.5 px-6 rounded-full shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02] mb-3 text-sm">';
    m += '<i class="fa-brands fa-google text-base"></i>';
    m += '<span>Masuk Sekarang — Gratis</span>';
    m += '</button>';
    m += '<p class="text-[11px] text-slate-400">100% Gratis &amp; Aman • Bebas Akses Selamanya</p>';
    m += '</div></div>';
    return m;
  }

  function mountModal() {
    if (document.getElementById("loginModal")) return;
    document.body.insertAdjacentHTML("beforeend", loginModalHTML());
  }

  function openLoginModal() {
    mountModal();
    var m = document.getElementById("loginModal");
    if (m) m.classList.remove("hidden");
  }

  function closeLoginModal() {
    var m = document.getElementById("loginModal");
    if (m) m.classList.add("hidden");
    // Jika belum login dan menutup modal di halaman selain home, kembalikan ke home (/)
    var isLogged = false;
    try {
      if (localStorage.getItem("jft_user") || window.fujiUser) isLogged = true;
    } catch (e) {}
    var p = (location.pathname || "/").toLowerCase().replace(/\.html$/, "").replace(/\/+$/, "");
    if (!isLogged && p !== "" && p !== "/" && p !== "/index") {
      window.location.replace("/");
    }
  }

  async function getFirebaseAuthInstance() {
    if (window.fujiAuth) return window.fujiAuth;
    try {
      var appMod = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
      var authMod = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
      var firebaseConfig = {
        apiKey: "AIzaSyDjbVGm1rjPJADixh8k5Zbc7-xX4cm5uos",
        authDomain: "sinau-jepang.firebaseapp.com",
        projectId: "sinau-jepang",
        storageBucket: "sinau-jepang.firebasestorage.app",
        messagingSenderId: "164715270928",
        appId: "1:164715270928:web:bb5803e1fdee66454b4b95",
        measurementId: "G-K6E9PVSWVB"
      };
      var app = window.firebaseApp || appMod.getApps()[0] || appMod.initializeApp(firebaseConfig);
      window.firebaseApp = app;
      window.fujiAuth = authMod.getAuth(app);
      return window.fujiAuth;
    } catch (e) {
      console.warn("Firebase Auth init error:", e);
      return null;
    }
  }

  async function simulateLogin() {
    try {
      var authMod = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
      var auth = await getFirebaseAuthInstance();
      if (!auth) throw new Error("Gagal menginisialisasi autentikasi Google.");
      var r = await authMod.signInWithPopup(auth, new authMod.GoogleAuthProvider());
      var u = r.user;
      var uObj = { uid: u.uid, name: u.displayName, email: u.email, photo: u.photoURL };
      try { localStorage.setItem("jft_user", JSON.stringify(uObj)); } catch (e) {}
      try { if (window.IndexedDB && window.IndexedDB.setItem) window.IndexedDB.setItem("jft_user", uObj); } catch (e) {}
      window.fujiUser = uObj;
      closeLoginModal();
      renderUser();
      // Reload atau re-render halaman jika ada handler khusus
      if (typeof window.checkUserStatus === "function") window.checkUserStatus();
      else if (typeof window.renderPackSectionScoresAll === "function") window.renderPackSectionScoresAll();
      else location.reload();
    } catch (e) {
      alert("Gagal masuk: " + (e.message || e.code));
    }
  }

  // Login: selalu buka modal seragam
  function login() {
    openLoginModal();
  }

  // Keluar: pakai fujiLogout bila ada (beranda); selain itu lewat ?out=1 di login.html
  function logoutFallback() {
    try { localStorage.removeItem("jft_user"); } catch (e) {}
    try { window.IndexedDB.removeItem("jft_user"); } catch (e) {}
    location.replace("/login.html?out=1");
  }

  // Traktir Kopi: tidak lagi aktif
  function donate() {}

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

  // Enforce login di seluruh halaman kecuali beranda (Home)
  function enforceAuth() {
    var p = (location.pathname || "/").toLowerCase().replace(/\.html$/, "").replace(/\/+$/, "");
    if (p === "" || p === "/" || p === "/index") return; // Beranda bebas diakses tanpa login

    var isLogged = false;
    try {
      if (localStorage.getItem("jft_user") || window.fujiUser) isLogged = true;
    } catch (e) {}
    if (!isLogged) {
      openLoginModal();
    }
  }

  window.openLoginModal = openLoginModal;
  window.closeLoginModal = closeLoginModal;
  window.simulateLogin = simulateLogin;

  window.SiteLayout = {
    header: headerHTML,
    footer: footerHTML,
    mountHeader: mountHeader,
    mountFooter: mountFooter,
    mountModal: mountModal,
    openLoginModal: openLoginModal,
    closeLoginModal: closeLoginModal,
    simulateLogin: simulateLogin,
    enforceAuth: enforceAuth,
    login: login,
    logout: logoutFallback,
    donate: donate,
    renderUser: renderUser
  };

  if (window.SITE_NO_CHROME !== true && document.body) {
    mountHeader();
    mountModal();
    var init = function () {
      mountFooter();
      mountModal();
      renderUser();
      watchAdminIdentity();
      enforceAuth();
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
  }
})();
