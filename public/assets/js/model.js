// REPOSITORY — SATU-SATUNYA tempat data disentuh (fetch + validasi + attempts).
// Pindah sumber (JSON -> Firestore) cukup ganti isi objek ini; Model/View/Controller utuh.
var QuizRepository = (function () {
  // Base absolut per kuis: tahan terhadap cleanUrls/trailingSlash Firebase.
  // /kuroi-quiz, /kuroi-quiz/, /kuroi-quiz/index.html -> /kuroi-quiz/quiz-data.json
  function quizSlug() {
    try {
      var q = (location && location.search) || "";
      var m = q.match(/[?&]p=([a-z0-9]+-quiz)/i);
      if (m) return m[1].toLowerCase();
    } catch (e) {}
    if (window.QUIZ_META && window.QUIZ_META.slug) return window.QUIZ_META.slug;
    return null;
  }
  function quizBase() {
    var s = quizSlug();
    if (s) return "/" + s + "/";
    var p = String((location && location.pathname) || "/");
    var m = p.match(/\/([a-z0-9]+-quiz)\/?(?:index\.html)?$/i);
    if (m) return "/" + m[1] + "/";
    return p.charAt(p.length - 1) === "/" ? p : p.substring(0, p.lastIndexOf("/") + 1);
  }
  var DATA_URL = quizBase() + "quiz-data.json"; // absolut per paket
  var ATTEMPT_KEY = "jft_attempts";         // localStorage sekarang; Firestore nanti
  // Validasi skema: no unik, answer dalam rentang, kunci_id cocok (cermin guard QuizSeeder).
  function validate(items) {
    var warnings = [];
    var seen = {};
    items.forEach(function (q) {
      if (seen[q.no]) warnings.push("no duplikat: " + q.no);
      seen[q.no] = true;
      var n = (q.options || []).length;
      var opt = (q.options || [])[q.answer] || {};
      var txt = (opt && opt.text !== undefined) ? opt.text : String(opt);
      if (!(q.answer >= 0 && q.answer < n)) warnings.push("no." + q.no + ": answer di luar rentang");
      else if (q.kunci_id !== txt) warnings.push("no." + q.no + ": kunci_id mismatch");
    });
    if (warnings.length && window.console) console.warn("[QuizRepository]", warnings.join("; "));
    return warnings;
  }
  function assetUrl(p) {
    if (!p) return p;
    if (/^(https?:)?\/\//i.test(p) || p.charAt(0) === "/") return p;
    var base = quizBase();
    var rel = String(p).replace(/^\.\//, "").replace(/^assets\//, "assets/");
    if (/^assets\//.test(rel)) return base + rel;
    return base + rel;
  }
  function normalizeQuiz(items) {
    items.forEach(function (q) {
      if (q.img) q.img = assetUrl(q.img);
      if (q.audio) q.audio = assetUrl(q.audio);
      (q.options || []).forEach(function (o) { if (o && o.img) o.img = assetUrl(o.img); });
    });
    return items;
  }
  async function fetchQuiz() {
    var r = await fetch(DATA_URL);
    if (!r.ok) throw new Error("Gagal memuat " + DATA_URL + " (" + r.status + ")");
    var items = await r.json();
    validate(items);
    return normalizeQuiz(items);
  }
  function saveAttempt(slug, attempt) {
    try {
      var all = JSON.parse(window.IndexedDB.getItem(ATTEMPT_KEY) || "{}");
      (all[slug] = all[slug] || []).push(Object.assign({ at: Date.now() }, attempt));
      window.IndexedDB.setItem(ATTEMPT_KEY, JSON.stringify(all));
    } catch (e) { /* mode privat: abaikan */ }
    // Skor online: Firestore bila login (async, tanpa blokir UI).
    try {
      if (window.fujiScore && window.fujiScore.save) {
        window.fujiScore.save(slug, attempt).catch(function () {});
      }
    } catch (e) {}
  }
  function loadAttempts(slug) {
    try {
      var all = JSON.parse(window.IndexedDB.getItem(ATTEMPT_KEY) || "{}");
      return all[slug] || [];
    } catch (e) { return []; }
  }
  return { fetchQuiz: fetchQuiz, validate: validate, saveAttempt: saveAttempt, loadAttempts: loadAttempts };
})();

// MODEL — state + cache. DILARANG fetch langsung; lewat QuizRepository.
var QuizModel = (function () {
  var QS = [], order = [], cur = 0, picked = {}, locked = {}, timerSec = 0;
  async function load() {
    QS = await QuizRepository.fetchQuiz();
    order = QS.map(function (q) { return q.no; });
  }
  function getQ() { return QS.filter(function (x) { return x.no === order[cur]; })[0]; }
  function byNo(no) { return QS.filter(function (x) { return x.no === no; })[0]; }
  return {
    load: load, getQ: getQ, byNo: byNo,
    get QS() { return QS; }, get order() { return order; },
    get cur() { return cur; }, set cur(v) { cur = v; },
    get picked() { return picked; }, set picked(v) { picked = v; },
    get locked() { return locked; }, set locked(v) { locked = v; },
    get timerSec() { return timerSec; }, set timerSec(v) { timerSec = v; }
  };
})();
