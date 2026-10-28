import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, where, limit, getDocs, doc, getDoc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
// IndexedDB utility (ganti localStorage)
import "./indexeddb.js";
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
// Override soal oleh admin: baca /quiz_packs/{slug} (publik). Return array items atau null.
window.fujiQuizPack = async function (slug) {
  try {
    if (!window.fujiDb || !slug) return null;
    var d = await getDoc(doc(window.fujiDb, "quiz_packs", slug));
    if (d.exists() && d.data() && Array.isArray(d.data().items) && d.data().items.length) return d.data().items;
  } catch (e) {}
  return null;
};
try {
  onAuthStateChanged(window.fujiAuth, function (u) {
    window.fujiUser = u || null;
    try {
      if (u) {
        var uData = { uid: u.uid, name: u.displayName, email: u.email, photo: u.photoURL };
        window.IndexedDB.setItem("jft_user", uData);
        localStorage.setItem("jft_user", JSON.stringify(uData));
      }
    } catch (e) {}
    // Catat profil user ke /users/{uid} (merge, aman dipanggil tiap login)
    try { if (u && window.fujiDb) window.fujiTouchUser(u); } catch (e) {}
    try { window.dispatchEvent(new Event("fuji:auth")); } catch (e) {}
  });
} catch (e) {}
// Upsert profil user saat login: /users/{uid} = { name, email, photo, lastLoginAt, loginCount, createdAt }
// Dipakai tab Pengguna di halaman admin. Gagal tulis tidak mengganggu alur login.
window.fujiTouchUser = async function (u) {
  try {
    if (!u || !u.uid || !window.fujiDb) return;
    var ref = doc(window.fujiDb, "users", u.uid);
    var prev = null;
    try { prev = await getDoc(ref); } catch (e) {}
    var n = 1;
    try { if (prev && prev.exists() && prev.data().loginCount) n = prev.data().loginCount + 1; } catch (e) {}
    if (prev && prev.exists() && prev.data().tiktokUnlocked === true) {
      try {
        localStorage.setItem("jft_tiktok_unlocked", "true");
        if (window.IndexedDB && window.IndexedDB.setItem) {
          window.IndexedDB.setItem("jft_tiktok_unlocked", true);
        }
      } catch (e) {}
    }
    var payload = {
      name: u.displayName || "", email: u.email || "", photo: u.photoURL || "",
      lastLoginAt: serverTimestamp(), loginCount: n
    };
    try { if (!prev || !prev.exists()) payload.createdAt = serverTimestamp(); } catch (e) {}
    await setDoc(ref, payload, { merge: true });
  } catch (e) {
    if (window.console) console.warn("[fujiTouchUser] gagal:", e);
  }
};
// API skor online 1 pintu: Firestore (wajib login) + fallback IndexedDB (local).
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
      try { u = JSON.parse(window.IndexedDB.getItem("jft_user") || "null"); } catch (e) {}
      if (u) { rec.name = u.name || ""; rec.email = u.email || ""; }
    } catch (e) {}
    if (window.fujiDb && window.fujiUser && window.fujiUser.email) {
      try {
        rec.email = window.fujiUser.email;
        rec.name = window.fujiUser.displayName || rec.name || "";
        rec.createdAt = serverTimestamp();
        // Upsert 1 dokumen per siswa-paket: {uid}_{slug} (gabung bila proses baru,
        // bukan tambah dokumen). Riwayat percobaan disimpan di array history (maks 20).
        var uid = window.fujiUser.uid || String(window.fujiUser.email).replace(/[^a-z0-9]/gi, "_");
        var ref = doc(window.fujiDb, "attempts", uid + "_" + slug);
        var prev = null;
        try { prev = await getDoc(ref); } catch (e) {}
        var hist = [];
        try { if (prev && prev.exists() && Array.isArray(prev.data().history)) hist = prev.data().history; } catch (e) {}
        hist.unshift({ benar: rec.benar, total: rec.total, skor: rec.skor, secs: rec.secs || null, at: rec.at });
        if (hist.length > 20) hist = hist.slice(0, 20);
        rec.history = hist;
        rec.n = hist.length;
        await setDoc(ref, rec, { merge: true });
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
            out[key] = { benar: v.benar, total: v.total, skor: v.skor, secs: v.secs || null, at: v.at || null, src: v.slug ? "firestore" : "firestore-legacy", _v: v };
          }
        });
        Object.keys(out).forEach(function (k) { try { delete out[k]._v; } catch (e) {} });
      }
    } catch (e) {
      if (window.console) console.warn("[fujiScore] latestAll gagal:", e);
    }
    try {
      // Key format: "jft_attempts_<slug>" → value = attempt terakhir
      var all = await window.IndexedDB.getAllBySlug("jft_attempts_");
      all.forEach(function (item) {
        var slug = String(item.key || "").replace(/^jft_attempts_/, "");
        if (!slug || out[slug]) return;
        var last = item.value || {};
        out[slug] = { benar: last.benar || 0, total: last.total || 0, skor: last.skor || 0, src: "local" };
      });
    } catch (e) {}
    return out;
  },
  // API baca skor TERAKHIR per slug: Firestore (login) -> IndexedDB.
  // Dipakai homepage untuk badge skor di kartu Simulasi JFT per Paket.
  // Fallback warisan: dokumen lama slug=null dipetakan via total (AOI=29).
  // TANPA orderBy agar bebas composite-index (saring+urut di klien).
  latest: async function (slug) {
    var all = await window.fujiScore.latestAll();
    return all[slug] || null;
  }
};
// Progres sesi lintas device: 1 dokumen /progress/{uid}_{slug}, kedaluwarsa 24 jam.
// Ditulis throttled (debounce) agar tidak spam; dihapus saat kuis selesai / reset.
// Hanya untuk user login (wajib UID agar aman di rules).
window.fujiProgress = {
  TTL_MS: 24 * 60 * 60 * 1000,
  _t: null,
  _key: function (slug) {
    try {
      var u = window.fujiUser || (window.fujiAuth && window.fujiAuth.currentUser);
      if (!u || !u.uid || !slug) return null;
      return "progress/" + u.uid + "_" + slug;
    } catch (e) { return null; }
  },
  // Tulis progres (debounce 2 detik). picked/locked = objek {no: idx/true}.
  save: function (slug, state) {
    var self = this;
    try { clearTimeout(self._t); } catch (e) {}
    self._t = setTimeout(function () { self._write(slug, state); }, 2000);
  },
  _write: async function (slug, state) {
    try {
      var key = window.fujiProgress._key(slug);
      if (!key || !window.fujiDb) return;
      var u = window.fujiUser || window.fujiAuth.currentUser;
      var n = 0; try { n = Object.keys((state && state.locked) || {}).length; } catch (e) {}
      if (!n) return; // belum ada jawaban: jangan buat dokumen kosong
      var id = key.split("/")[1];
      await setDoc(doc(window.fujiDb, "progress", id), {
        uid: u.uid, email: u.email || "", slug: slug,
        picked: (state && state.picked) || {}, locked: (state && state.locked) || {},
        cur: (state && state.cur) || 0, timerSec: (state && state.timerSec) || 0,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (e) {
      if (window.console) console.warn("[fujiProgress] save gagal:", e);
    }
  },
  // Baca progres; return null bila tidak ada / basi (>24 jam) / sudah selesai penuh.
  load: async function (slug, totalSoal) {
    try {
      var key = window.fujiProgress._key(slug);
      if (!key || !window.fujiDb) return null;
      var d = await getDoc(doc(window.fujiDb, "progress", key.split("/")[1]));
      if (!d.exists()) return null;
      var v = d.data() || {};
      var t = 0;
      try {
        if (v.updatedAt && v.updatedAt.toMillis) t = v.updatedAt.toMillis();
        else if (v.updatedAt && v.updatedAt.seconds) t = v.updatedAt.seconds * 1000;
      } catch (e) {}
      if (!t || (Date.now() - t) > window.fujiProgress.TTL_MS) {
        try { await window.fujiProgress.clear(slug); } catch (e) {}
        return null;
      }
      var n = 0; try { n = Object.keys(v.locked || {}).length; } catch (e) {}
      if (!n) return null;
      if (totalSoal && n >= totalSoal) { try { await window.fujiProgress.clear(slug); } catch (e) {} return null; }
      return { picked: v.picked || {}, locked: v.locked || {}, cur: v.cur || 0, timerSec: v.timerSec || 0, at: t };
    } catch (e) { return null; }
  },
  clear: async function (slug) {
    try {
      var key = window.fujiProgress._key(slug);
      if (!key || !window.fujiDb) return;
      await deleteDoc(doc(window.fujiDb, "progress", key.split("/")[1]));
    } catch (e) {}
  }
};