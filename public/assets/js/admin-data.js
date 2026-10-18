import { collection, getDocs, getDoc, doc, setDoc, deleteDoc, query, orderBy, limit, startAfter, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
const $ = id => document.getElementById(id);
const PACKS = ["aoi-quiz", "basu-quiz", "jinja-quiz", "kagi-quiz", "tamago-quiz", "gakusei-quiz", "magarimasu-quiz"];
// State tab nilai
const _q = { mode: "ringkas", rows: [], shown: 50, lastDoc: null, done: false, loading: false };
function _qTime(v) {
  try {
    if (v.createdAt && v.createdAt.toDate) return v.createdAt.toDate().getTime();
    if (v.createdAt && v.createdAt.seconds) return v.createdAt.seconds * 1000;
  } catch (e) {}
  return v.at || 0;
}
function _qFmt(t) { try { return t ? new Date(t).toLocaleString("id-ID", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "-"; } catch (e) { return "-"; } }
function _qJft(p) { var j = Math.round(10 + ((p || 0) / 100) * 240); var lv = j >= 200 ? "A2" : j >= 175 ? "A2.1" : j >= 145 ? "A1" : "-"; return j + "/250 (" + lv + ")"; }
window._aLoadNilai = async function (isReset) {
  const db = window._aDb;
  const reset = isReset !== false;
  if (reset) { _q.rows = []; _q.shown = 50; _q.lastDoc = null; _q.done = false; }
  else if (_q.loading || _q.done) { renderNilai(); return; }
  _q.loading = true;
  $("qRows").innerHTML = "<tr><td class='py-4 text-slate-400'>Memuat...</td></tr>";
  try {
    const slug = $("qSlug").value, em = $("qEmail").value.trim().toLowerCase();
    let parts = [collection(db, "attempts")];
    // Query 500 per halaman; filter email/paket di klien agar bebas index
    let qq;
    try { qq = query(collection(db, "attempts"), orderBy("createdAt", "desc"), limit(500)); if (_q.lastDoc) qq = query(collection(db, "attempts"), orderBy("createdAt", "desc"), startAfter(_q.lastDoc), limit(500)); }
    catch (e) { qq = query(collection(db, "attempts"), limit(500)); }
    const snap = await getDocs(qq);
    if (snap.size) _q.lastDoc = snap.docs[snap.docs.length - 1];
    if (snap.size < 500) _q.done = true;
    snap.forEach(d => { const v = d.data() || {}; v._id = d.id; v._t = _qTime(v); _q.rows.push(v); });
    renderNilai();
  } catch (e) { $("qRows").innerHTML = "<tr><td class='text-rose-600'>Gagal: " + (e.message || e.code) + "</td></tr>"; }
  _q.loading = false;
};
function lulusPill(p){return p>=75?"<span class='bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full'>Lulus</span>":"<span class='bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full'>Belum</span>";}
function _qPrint() {
  const slug = ($("qSlug") || {}).value || "semua";
  const rows = $("qRows").innerHTML, head = $("qHead").innerHTML;
  const w = window.open("", "_blank");
  w.document.write("<html><head><title>Hasil Penilaian - " + slug + "</title><style>body{font-family:Arial,sans-serif;padding:24px}h1{font-size:18px}table{border-collapse:collapse;width:100%;font-size:12px}th,td{border:1px solid #999;padding:6px;text-align:left}th{background:#eee}@media print{.noprint{display:none}}</style></head><body>");
  w.document.write("<h1>Hasil Penilaian SinauJepang - " + slug + "</h1><p>" + new Date().toLocaleString("id-ID") + " • " + $("qCount").textContent + "</p>");
  w.document.write("<table><thead>" + head + "</thead><tbody>" + rows + "</tbody></table>");
  w.document.write("<p class='noprint'><button onclick='window.print()'>Cetak / Simpan PDF</button></p></body></html>");
  w.document.close();
}
function renderNilai() {
  const slug = ($("qSlug") || {}).value || "", em = (($("qEmail") || {}).value || "").trim().toLowerCase();
  _q.mode = ($("qMode") || {}).value || "ringkas";
  let list = _q.rows.filter(v => (!slug || v.slug === slug) && (!em || ((v.email || "").toLowerCase().includes(em) || (v.name || "").toLowerCase().includes(em))));
  const isFinish = v => v.done !== false;
  let listFin = list.filter(isFinish);
  const spam = list.length - listFin.length;
  let html = "";
  const head = $("qHead");
  if (_q.mode === "ringkas") {
    if (head) head.innerHTML = "<tr class='text-left text-slate-500 border-b'><th class='py-2 pr-2'>Waktu</th><th class='pr-2'>Siswa</th><th class='pr-2'>Paket (soal)</th><th class='pr-2'>Benar</th><th class='pr-2'>Skor %</th><th class='pr-2'>Skala JFT</th><th class='pr-2'>Ujian</th><th>Status</th></tr>";
    const g = {};
    listFin.forEach(v => {
      const k = (v.email || "?") + "|" + (v.slug || "?");
      if (!g[k]) g[k] = { name: v.name || "", email: v.email || "", slug: v.slug || "", best: -1, bestBenar: 0, total: v.total || 0, n: 0, bestT: 0 };
      const o = g[k]; o.n++;
      if ((v.skor || 0) > o.best) { o.best = v.skor || 0; o.bestBenar = v.benar || 0; o.total = v.total || o.total; o.bestT = v._t; }
      if (v._t > (o.last || 0)) { o.last = v._t; o.name = v.name || o.name; }
    });
    Object.values(g).sort((a, b) => b.best - a.best).slice(0, _q.shown).forEach(o => {
      const lulus = lulusPill(o.best);
      html += "<tr class='border-b hover:bg-fuji-50/50'><td class='py-2 pr-2 whitespace-nowrap'>" + _qFmt(o.bestT || o.last) + "</td><td class='pr-2'>" + String(o.name || "").replace(/</g, "&lt;") + "<div class='text-slate-400'>" + o.email + "</div></td><td>" + o.slug + " <span class='text-slate-400'>(" + o.total + " soal)</span></td><td class='pr-2 font-bold'>" + o.bestBenar + "</td><td class='pr-2 font-black text-fuji-700'>" + o.best + "%</td><td class='pr-2 whitespace-nowrap'>" + _qJft(o.best) + "</td><td class='pr-2'>" + o.n + "x</td><td>" + lulusPill(o.best) + "</td></tr>";
    });
    $("qCount").textContent = Object.keys(g).length + " siswa-paket | " + listFin.length + " ujian selesai" + (spam ? " | " + spam + " progres disembunyikan" : "");
  } else {
    if (head) head.innerHTML = "<tr class='text-left text-slate-500 border-b'><th class='py-2 pr-2'>Waktu</th><th class='pr-2'>Siswa</th><th class='pr-2'>Paket (soal)</th><th class='pr-2'>Benar</th><th class='pr-2'>Skor %</th><th class='pr-2'>Skala JFT</th><th>Hapus</th></tr>";
    listFin.sort((a, b) => b._t - a._t).slice(0, _q.shown).forEach(v => {
      html += "<tr class='border-b hover:bg-fuji-50/50'><td class='py-2 pr-2 whitespace-nowrap'>" + _qFmt(v._t) + "</td><td class='pr-2'>" + String(v.name || "").replace(/</g, "&lt;") + "<div class='text-slate-400'>" + (v.email || "") + "</div></td><td>" + (v.slug || "") + " <span class='text-slate-400'>(" + (v.total || 0) + " soal)</span></td><td class='pr-2 font-bold'>" + (v.benar || 0) + "</td><td class='pr-2 font-black text-fuji-700'>" + (v.skor || 0) + "%</td><td class='pr-2 whitespace-nowrap'>" + _qJft(v.skor) + "</td><td><button class='text-rose-600 hover:underline' data-del='" + v._id + "'>hapus</button></td></tr>";
    });
    $("qCount").textContent = listFin.length + " ujian selesai" + (spam ? " | " + spam + " progres disembunyikan" : "") + " | " + _q.rows.length + " dimuat";
  }
  $("qRows").innerHTML = html || "<tr><td>Kosong.</td></tr>";
  const more = $("qMore"); if (more) more.classList.toggle("hidden", _q.done);
  $("qRows").querySelectorAll("[data-del]").forEach(b => b.onclick = async () => {
    if (!confirm("Hapus?")) return;
    await deleteDoc(doc(window._aDb, "attempts", b.dataset.del));
    _q.rows = _q.rows.filter(x => x._id !== b.dataset.del); renderNilai();
  });
}
window._aMoreNilai = async function () { _q.shown += 100; if (_q.shown > _q.rows.length && !_q.done) { await window._aLoadNilai(false); } else renderNilai(); };
window._aCsvNilai = function () {
  const slug = (($("qSlug") || {}).value || ""), em = ((($("qEmail") || {}).value || "").trim().toLowerCase());
  const mode = (($("qMode") || {}).value || "ringkas");
  let list = _q.rows.filter(v => (!slug || v.slug === slug) && (!em || ((v.email || "").toLowerCase().includes(em) || (v.name || "").toLowerCase().includes(em)))).filter(v => v.done !== false);
  let csv = mode === "ringkas" ? "nama,email,paket,skor_terbaik,benar,total,percobaan,terakhir\n" : "waktu,nama,email,paket,benar,total,skor\n";
  if (mode === "ringkas") {
    const g = {};
    list.forEach(v => { const k = (v.email || "?") + "|" + (v.slug || "?"); if (!g[k]) g[k] = { name: v.name || "", email: v.email || "", slug: v.slug || "", best: 0, bestBenar: 0, total: 0, n: 0, last: 0 }; const o = g[k]; o.n++; if ((v.skor || 0) >= o.best) { o.best = v.skor || 0; o.bestBenar = v.benar || 0; o.total = v.total || o.total; } if (v._t > o.last) { o.last = v._t; o.name = v.name || o.name; } });
    Object.values(g).sort((a, b) => b.best - a.best).forEach(o => { csv += '"' + new Date(o.bestT||o.last).toLocaleString("id-ID") + '","'+ (o.name||"").replace(/"/g,'""') + '","'+ o.email + '","'+ o.slug + '","'+ o.total + '","'+ o.bestBenar + '","'+ o.best + '","'+ _qJft(o.best) + '","'+ o.n + '","'+ (o.best>=75?"Lulus":"Belum") + '"\\n'; });
  } else {
    list.sort((a, b) => b._t - a._t).forEach(v => { csv += '"' + new Date(v._t).toLocaleString("id-ID") + '","'+ ((v.name||"").replace(/"/g,'""')) + '","'+ (v.email||"") + '","'+ (v.slug||"") + '","'+ (v.total||0) + '","'+ (v.benar||0) + '","'+ (v.skor||0) + '","'+ _qJft(v.skor) + '"\\n'; });
  }
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv" })); a.download = "nilai-" + (slug || "semua") + ".csv"; a.click();
};
window._aInitNilaiBar = function () {
  $("qGo").onclick = () => window._aLoadNilai(true);
  $("qMore").onclick = window._aMoreNilai;
  $("qCsv").onclick = window._aCsvNilai; if ($("qPrint")) $("qPrint").onclick = _qPrint;
  $("qMode").onchange = renderNilai;
  $("qSlug").onchange = renderNilai;
  $("qEmail").oninput = () => { clearTimeout(window._qT); window._qT = setTimeout(renderNilai, 300); };
};
window._aInitSoal = function () {
  $("sPack").innerHTML = PACKS.map(p => "<option>" + p + "</option>").join("");
  $("sLoad").onclick = async () => {
    const slug = $("sPack").value, db = window._aDb;
    try { const d = await getDoc(doc(db, "quiz_packs", slug));
      if (d.exists()) { $("sTitle").value = d.data().title || ""; $("sJson").value = JSON.stringify(d.data().items || [], null, 1); $("sInfo").textContent = "Dari Firestore."; }
      else { const r = await fetch("/" + slug + "/quiz-data.json"); const j = await r.json();
        $("sTitle").value = slug; $("sJson").value = JSON.stringify(j, null, 1); $("sInfo").textContent = "Dari file statis (" + j.length + " soal). Simpan utk migrasi."; }
    } catch (e) { $("sInfo").textContent = "Gagal: " + (e.message || e.code); }
  };
  $("sSave").onclick = async () => {
    try {
      const items = JSON.parse($("sJson").value);
      if (!Array.isArray(items)) throw new Error("JSON harus array");
      await setDoc(doc(window._aDb, "quiz_packs", $("sPack").value), { slug: $("sPack").value, title: $("sTitle").value || $("sPack").value, items, updatedAt: serverTimestamp(), updatedBy: window._aAuth.currentUser.email });
      $("sInfo").textContent = "OK tersimpan (" + items.length + " soal).";
    } catch (e) { $("sInfo").textContent = "ERR " + (e.message || e.code); }
  };
};
window._aLoadAdmins = async function () {
  const db = window._aDb;
  try { const snap = await getDocs(collection(db, "admins"));
    $("aList").innerHTML = "";
    snap.forEach(d => { const v = d.data() || {};
      const row = document.createElement("div");
      row.className = "py-2 flex items-center gap-2";
      const s = document.createElement("span"); s.innerHTML = "👑 <b>" + (v.email || d.id) + "</b>";
      const del = document.createElement("button");
      del.className = "ml-auto text-xs text-rose-600"; del.textContent = "cabut";
      del.onclick = async () => { if (confirm("Cabut?")) { await deleteDoc(doc(db, "admins", d.id)); window._aLoadAdmins(); } };
      row.appendChild(s); row.appendChild(del); $("aList").appendChild(row);
    });
    if (!snap.size) $("aList").innerHTML = "<p class='text-xs text-slate-400'>Kosong (login via custom claim).</p>";
  } catch (e) { $("aList").innerHTML = "Gagal: " + (e.message || e.code); }
};
