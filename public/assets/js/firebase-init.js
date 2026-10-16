// Firebase init 1 pintu (project sinau-jepang + Analytics + Auth + Firestore).
// Dipakai: index.html, login.html, quiz.html
// Skor online: model.js memanggil window.fujiScore.save(slug, {benar,total,skor}).
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, where, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyDjbVGm1rjPJADixh8k5Zbc7-xX4cm5uos",
  authDomain: "sinau-jepang.firebaseapp.com",
  projectId: "sinau-jepang",
  storageBucket: "sinau-jepang.firebasestorage.app",
  messagingSenderId: "164715270928",
  appId: "1:164715270928:web:bb5803e1fdee66454b4b95",
  measurementId: "G-K6E9PVSWVB"
};
window.firebaseApp = initializeApp(firebaseConfig);
try { window.fujiAnalytics = getAnalytics(window.firebaseApp); } catch (e) {}
window.fujiAuth = getAuth(window.firebaseApp);
window.fujiDb = null;
try { window.fujiDb = getFirestore(window.firebaseApp); } catch (e) {}
window.fujiUser = null;
try {
  onAuthStateChanged(window.fujiAuth, function (u) {
    window.fujiUser = u || null;
    try {
      if (u) localStorage.setItem("jft_user", JSON.stringify({ name: u.displayName, email: u.email, photo: u.photoURL }));
    } catch (e) {}
    try { window.dispatchEvent(new Event("fuji:auth")); } catch (e) {}
  });
} catch (e) {}
// API skor online 1 pintu: Firestore (wajib login) + fallback localStorage selalu jalan.
window.fujiScore = {
  save: async function (slug, attempt) {
    if (!slug) {
      try {
        if (window.QUIZ_SLUG) slug = window.QUIZ_SLUG;
        else if (window.QUIZ_META && window.QUIZ_META.slug) slug = window.QUIZ_META.slug;
        else { var m = (location.search || "").match(/[?&]p=([a-z0-9]+-quiz)/i); if (m) slug = m[1].toLowerCase(); }
      } catch (e) {}
    }
    if (!slug) { if (window.console) console.warn("[fujiScore] save dibatalkan: slug null"); return "skip"; }
    // Pisahkan rincian seksi (secs) dari angka inti agar kolom Firestore tetap angka (int64).
    var secs = (attempt && attempt.secs) || null;
    var rec = { slug: slug, at: Date.now(), benar: (attempt && attempt.benar) || 0, total: (attempt && attempt.total) || 0, skor: (attempt && attempt.skor) || 0 };
    if (secs) rec.secs = secs;
    try {
      var u = null;
      try { u = JSON.parse(localStorage.getItem("jft_user") || "null"); } catch (e) {}
      if (u) { rec.name = u.name || ""; rec.email = u.email || ""; }
    } catch (e) {}
    if (window.fujiDb && window.fujiUser && window.fujiUser.email) {
      try {
        rec.email = window.fujiUser.email;
        rec.name = window.fujiUser.displayName || rec.name || "";
        rec.createdAt = serverTimestamp();
        await addDoc(collection(window.fujiDb, "attempts"), rec);
        return "firestore";
      } catch (e) {
        if (window.console) console.warn("[fujiScore] firestore gagal, fallback lokal:", e);
      }
    }
    return "local";
  },
  // Kunci pemetaan dokumen lama slug=null via total (1 pintu).
  _legacyTotal: { "aoi-quiz": 29, "basu-quiz": 26, "jinja-quiz": 28, "kagi-quiz": 36, "tamago-quiz": 26 },
  _legacyKey: function (v) {
    if (!v || v.slug || !v.total) return null;
    for (var k in window.fujiScore._legacyTotal) if (window.fujiScore._legacyTotal[k] === v.total) return k;
    return null;
  },
  // Waktu dokumen untuk pilih TERBARU (createdAt Timestamp / at millis).
  _recTime: function (v) {
    try {
      if (v.createdAt && v.createdAt.toMillis) return v.createdAt.toMillis();
      if (v.createdAt && v.createdAt.seconds) return v.createdAt.seconds * 1000;
    } catch (e) {}
    return v.at || 0;
  },
  // API baca SEMUA skor user 1x query (bebas index: email saja, saring di klien).
  // Dipakai homepage agar 14 kartu cukup 1 query, bukan 14 query.
  // Ambil dokumen TERBARU per slug (banding createdAt/at, fallback at).
  latestAll: async function () {
    var out = {};
    try {
      if (window.fujiDb && window.fujiUser && window.fujiUser.email) {
        var snap = await getDocs(query(collection(window.fujiDb, "attempts"), where("email", "==", window.fujiUser.email), limit(100)));
        snap.forEach(function (d) {
          var v = d.data() || {};
          var key = v.slug || window.fujiScore._legacyKey(v);
          if (!key) return;
          var cur = out[key];
          if (!cur || window.fujiScore._recTime(v) >= window.fujiScore._recTime(cur._v)) {
            out[key] = { benar: v.benar, total: v.total, skor: v.skor, src: v.slug ? "firestore" : "firestore-legacy", _v: v };
          }
        });
        Object.keys(out).forEach(function (k) { try { delete out[k]._v; } catch (e) {} });
      }
    } catch (e) {
      if (window.console) console.warn("[fujiScore] latestAll gagal:", e);
    }
    try {
      var all = JSON.parse(localStorage.getItem("jft_attempts") || "{}");
      Object.keys(all).forEach(function (k) {
        if (!out[k] && all[k].length) {
          var last = all[k][all[k].length - 1];
          out[k] = { benar: last.benar, total: last.total, skor: last.skor, src: "local" };
        }
      });
    } catch (e) {}
    return out;
  },
  // API baca skor TERAKHIR per slug: Firestore (login) -> localStorage.
  // Dipakai homepage untuk badge skor di kartu Simulasi JFT per Paket.
  // Fallback warisan: dokumen lama slug=null dipetakan via total (AOI=29).
  // TANPA orderBy agar bebas composite-index (saring+urut di klien).
  latest: async function (slug) {
    var all = await window.fujiScore.latestAll();
    return all[slug] || null;
  }
};

