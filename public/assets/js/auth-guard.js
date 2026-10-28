// ============================================================
// auth-guard.js — Penjaga Akses Materi SinauJepang
// Mencegah akses langsung via bookmark, url, atau browser history.
// ============================================================
(function () {
  'use strict';

  function checkUserSession() {
    try {
      // 1. Cek cepat via localStorage (sinkron, tanpa jeda/flicker)
      var cached = localStorage.getItem('jft_user');
      if (cached) {
        var parsed = JSON.parse(cached);
        if (parsed && (parsed.email || parsed.name || parsed.uid)) {
          return true;
        }
      }
    } catch (e) {}
    return false;
  }

  // Jika belum ada sesi user yang valid, kunci halaman dan redirect seketika
  if (!checkUserSession()) {
    // Sembunyikan konten secara instan jika dokumen sudah mulai parse
    try {
      if (document.documentElement) {
        document.documentElement.style.display = 'none';
      }
    } catch (e) {}

    // Arahkan ke halaman login dengan parameter redirect kembali
    var target = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.replace('/login.html?redirect=' + target);
  }
})();
