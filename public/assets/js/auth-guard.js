// ============================================================
// auth-guard.js — Penjaga Akses Materi SinauJepang
// Cek sesi login Google (jft_user).
// ============================================================
(function () {
  'use strict';

  function getUser() {
    try {
      var cached = localStorage.getItem('jft_user');
      if (cached) {
        var parsed = JSON.parse(cached);
        if (parsed && (parsed.email || parsed.name || parsed.uid)) return parsed;
      }
    } catch (e) { }
    return null;
  }

  var user = getUser();

  // Belum login Google: tampilkan modal login seragam atau kembali ke beranda jika dipanggil sebelum layout
  if (!user) {
    if (typeof window.openLoginModal === 'function') {
      window.openLoginModal();
    } else {
      window.addEventListener('DOMContentLoaded', function () {
        if (typeof window.openLoginModal === 'function') {
          window.openLoginModal();
        } else {
          window.location.replace('/');
        }
      });
    }
    return;
  }
})();
