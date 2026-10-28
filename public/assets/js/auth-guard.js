// ============================================================
// auth-guard.js — Penjaga Akses Materi SinauJepang
// 1. Cek sesi login Google (jft_user).
// 2. Cek status aktivasi Link Bio TikTok (?akses=tiktok atau jft_tiktok_unlocked).
// ============================================================
(function () {
  'use strict';

  // 1. Tangkap aktivasi via URL parameter dari Link Bio TikTok
  try {
    var params = new URLSearchParams(window.location.search);
    var aksesParam = params.get('akses');
    if (aksesParam && (aksesParam === 'tiktok' || aksesParam === 'tiktok-follower')) {
      localStorage.setItem('jft_tiktok_unlocked', 'true');
      // Bersihkan param dari address bar agar rapi tanpa reload
      params.delete('akses');
      var newQuery = params.toString() ? '?' + params.toString() : '';
      var newUrl = window.location.pathname + newQuery + window.location.hash;
      window.history.replaceState({}, document.title, newUrl);
    }
  } catch (e) {}

  function getUser() {
    try {
      var cached = localStorage.getItem('jft_user');
      if (cached) {
        var parsed = JSON.parse(cached);
        if (parsed && (parsed.email || parsed.name || parsed.uid)) return parsed;
      }
    } catch (e) {}
    return null;
  }

  function isTikTokUnlocked(u) {
    // Admin selalu unlock
    if (u && (u.email || '').toLowerCase() === 'mswaluyo@gmail.com') return true;
    try {
      if (localStorage.getItem('jft_tiktok_unlocked') === 'true') return true;
      if (u && u.tiktokUnlocked === true) return true;
    } catch (e) {}
    return false;
  }

  var user = getUser();

  // A. Belum login Google: redirect ke halaman login
  if (!user) {
    try {
      if (document.documentElement) document.documentElement.style.display = 'none';
    } catch (e) {}
    var target = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.replace('/login.html?redirect=' + target);
    return;
  }

  // B. Sudah login tapi belum klik link bio TikTok: redirect ke halaman beranda untuk unlock
  if (!isTikTokUnlocked(user)) {
    try {
      if (document.documentElement) document.documentElement.style.display = 'none';
    } catch (e) {}
    window.location.replace('/?kunci=tiktok&redirect=' + encodeURIComponent(window.location.pathname + window.location.search));
    return;
  }
})();
