// QUIZ dinamis 1 pintu: /quiz.html?p={slug}-quiz
// Slug valid = 14 paket; QUIZ_META dibaca dari quiz-data + judul dari slug.
(function () {
  var PAKET = ["hare-quiz","aoi-quiz","basu3-quiz","basu-quiz","gakusei-quiz","jinja-quiz","kagi-quiz",
    "konpyuutaa-quiz","kuroi-quiz","kutsushita-quiz","magarimasu-quiz","orimasu-quiz","orimasu2-quiz","shimemasu2-quiz","genkan-quiz","gakusei2-quiz",
    "shatsu-quiz","tamago-quiz","tomemasu-quiz","hashi-quiz","haburashi-quiz","basu0001-quiz"];
  function slug() {
    var m = (location.search || "").match(/[?&]p=([a-z0-9_-]+-quiz)/i);
    if (m && PAKET.indexOf(m[1]) > -1) return m[1];
    return "kuroi-quiz";
  }
  window.QUIZ_SLUG = slug();
  // Judul humanis + total dibaca saat model load (tanpa fetch ganda: judul dari slug dulu)
  var nama = window.QUIZ_SLUG.replace("-quiz", "").toUpperCase();
  window.QUIZ_META = { judul: nama, total: 0, slug: window.QUIZ_SLUG };
})();

// Lengkapi judul + total dari quiz-data (1 fetch, di-cache browser bersama model.js).
(function () {
  var slug = window.QUIZ_SLUG || "kuroi-quiz";
  var nama = slug.replace("-quiz", "").toUpperCase();
  fetch("/" + slug + "/quiz-data.json?v=" + Date.now(), { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (items) {
    window.QUIZ_META = { judul: nama + " (" + items.length + " Soal)", total: items.length, slug: slug };
    try { document.title = nama + " - SinauJepang"; } catch (e) {}
  }).catch(function () {
    window.QUIZ_META = { judul: nama, total: 0, slug: slug };
  });
})();
