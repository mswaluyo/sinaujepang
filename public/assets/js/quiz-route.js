// QUIZ dinamis 1 pintu: /quiz.html?p={slug}-quiz
// Mendukung semua paket kuis dari PAKET_CONFIG maupun paket SSW
(function () {
  function getSupportedPacks() {
    var list = [];
    if (window.PAKET_CONFIG && window.PAKET_CONFIG.kategori) {
      window.PAKET_CONFIG.kategori.forEach(function (kat) {
        (kat.paket || []).forEach(function (p) {
          if (p.slug) list.push(p.slug);
          if (p.soalTambahan && p.soalTambahan.slug) list.push(p.soalTambahan.slug);
        });
      });
    }
    return list;
  }

  function slug() {
    var search = location.search || "";
    // Mendukung ?p=saifu-quiz maupun ?p=saifu
    var m = search.match(/[?&]p=([a-z0-9_-]+)/i);
    if (m) {
      var s = m[1].toLowerCase();
      if (!/-quiz$/i.test(s)) s += "-quiz";
      return s;
    }
    // Jika tidak ada parameter ?p=, ambil paket pertama dari kategori teratas jika ada
    var supported = getSupportedPacks();
    if (supported.length > 0) return supported[0];
    return "saifu-quiz";
  }

  window.QUIZ_SLUG = slug();
  var nama = window.QUIZ_SLUG.replace("-quiz", "").replace(/[-_]/g, " ").toUpperCase();
  window.QUIZ_META = { judul: nama, total: 0, slug: window.QUIZ_SLUG };
})();

// Lengkapi judul + total dari quiz-data dan perbarui tampilan header secara dinamis
(function () {
  var slug = window.QUIZ_SLUG || "saifu-quiz";
  var nama = slug.replace("-quiz", "").replace(/[-_]/g, " ").toUpperCase();
  
  // Cari nama resmi yang rapi dari PAKET_CONFIG jika ada
  if (window.PAKET_CONFIG && window.PAKET_CONFIG.kategori) {
    window.PAKET_CONFIG.kategori.forEach(function (kat) {
      (kat.paket || []).forEach(function (p) {
        if (p.slug === slug) nama = p.nama;
        if (p.soalTambahan && p.soalTambahan.slug === slug) nama = p.soalTambahan.nama + " (" + p.nama + ")";
      });
    });
  }

  fetch("/quizzes/" + slug + "/quiz-data.json?v=" + Date.now(), { cache: "no-store" })
    .then(function (r) { return r.json(); })
    .then(function (items) {
      var titleText = nama + " (" + items.length + " Soal)";
      window.QUIZ_META = { judul: titleText, total: items.length, slug: slug };
      try { document.title = nama + " - SinauJepang"; } catch (e) {}

      // Update elemen judul di header jika layout sudah ter-render
      var titleEl = document.getElementById("quiz-title");
      if (titleEl) {
        titleEl.innerHTML = '<span id="prog-txt" class="hidden">' + titleText + '</span>' + titleText;
      }
      var scoreCountEl = document.getElementById("score-count");
      if (scoreCountEl && scoreCountEl.textContent.indexOf('/') > -1) {
        var parts = scoreCountEl.textContent.split('/');
        scoreCountEl.textContent = parts[0] + '/ ' + items.length + ' Soal';
      }
    })
    .catch(function () {
      window.QUIZ_META = { judul: nama, total: 0, slug: slug };
    });
})();
