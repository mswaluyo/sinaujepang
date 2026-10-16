// VIEW — hanya bangun string HTML, tanpa state global.
// Semua data soal (q) dan status (picked/locked) dioper sebagai argumen (MVP pasif).
var QuizView = (function () {
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function letter(i) { return String.fromCharCode(65 + i); }
  var SECMAP = { "SESI 1 : MOJIGOI": "sec1", "SESI 2 : HYOUGEN": "sec2", "SESI 3 : CHOUKAI": "sec3", "SESI 4 : DOKKAI": "sec4" };
  var SECT = ["sec1", "sec2", "sec3", "sec4"];
  var SECFULL = { sec1: "SESI 1 : MOJIGOI", sec2: "SESI 2 : HYOUGEN", sec3: "SESI 3 : CHOUKAI", sec4: "SESI 4 : DOKKAI" };
  var SECHEAD = {
    sec1: ["SESI 1 : MOJIGOI (文字語彙)", "Huruf & kosakata - baca gambar soal lalu pilih.", "from-fuji-600 to-fuji-400"],
    sec2: ["SESI 2 : HYOUGEN (表現)", "Respon percakapan yang sesuai konteks.", "from-emerald-500 to-teal-600"],
    sec3: ["SESI 3 : CHOUKAI (聴解)", "Gambar soal + gambar opsi - pilih lalu konfirmasi.", "from-amber-500 to-orange-600"],
    sec4: ["SESI 4 : DOKKAI (読解)", "Baca gambar/teks soal lalu pilih.", "from-rose-500 to-pink-600"]
  };
  function titleOf(q) { var t = (q.title || "").trim(); if (t && !/^\d+$/.test(t)) return t; return "Soal " + q.no; }
  function dedupReason(kk, rr, aa, reason) {
    var r = String(reason || ''); var k = String(kk || '').trim(); var m = String(aa || '').trim();
    if (k) { r = r.split(k).join(' ').trim(); }
    var rm = String(rr || '').trim();
    if (rm) { r = r.split('(' + rm + ')').join(' ').split(rm).join(' ').trim(); }
    if (m) {
      var escm = m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      r = r.replace(new RegExp('^berarti\\s+' + escm, 'i'), '').trim();
      var ix2 = r.indexOf(m); if (ix2 === 0) { r = r.slice(m.length).trim(); }
    }
    r = r.replace(/^[\-:,.\s]+/, '').replace(/^berarti\s+/i, '').trim();
    r = r.replace(/\(\s*\)/g, '').replace(/\s{2,}/g, ' ').trim();
    return r;
  }
  return { esc: esc, letter: letter, SECMAP: SECMAP, SECT: SECT, SECFULL: SECFULL, SECHEAD: SECHEAD, titleOf: titleOf, dedupReason: dedupReason };
})();
