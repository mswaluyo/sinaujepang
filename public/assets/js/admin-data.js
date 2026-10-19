import { collection, getDocs, getDoc, doc, setDoc, deleteDoc, query, orderBy, limit, startAfter, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
const $ = id => document.getElementById(id);
const PACKS = ["aoi-quiz", "basu-quiz", "jinja-quiz", "kagi-quiz", "tamago-quiz", "gakusei-quiz", "magarimasu-quiz"];
const _q = { mode: "ringkas", rows: [], shown: 50, lastDoc: null, done: false, loading: false, sort: "waktu", dir: -1 };
function _qJftNum(p) { return Math.round(10 + ((p || 0) / 100) * 240); }
// Definisi kolom sortable: key -> label, align, dan fungsi nilai
function _qCols() {
  const ujian = _q.mode === "ringkas";
  return [
    { k: "waktu", label: "Waktu", align: "left", cls: "px-4 whitespace-nowrap", val: o => o._t || 0 },
    { k: "siswa", label: "Siswa", align: "left", cls: "px-3", val: o => ((o.name || "") + " " + (o.email || "")).toLowerCase() },
    { k: "paket", label: "Paket", align: "left", cls: "px-3", val: o => (o.slug || "").toLowerCase() },
    { k: "soal", label: "Soal", align: "center", cls: "px-3", val: o => (o.total || 0) },
    { k: "benar", label: "Benar", align: "center", cls: "px-3", val: o => (o.benar ?? o.bestBenar ?? 0) },
    { k: "skor", label: "Skor", align: "center", cls: "px-3", val: o => (o.skor ?? o.best ?? 0) },
    { k: "jft", label: "Skala JFT", align: "left", cls: "px-3", val: o => _qJftNum(o.skor ?? o.best ?? 0) },
    ujian
      ? { k: "ujian", label: "Ujian", align: "center", cls: "px-3", val: o => (o.n || 0) }
      : { k: "hapus", label: "Hapus", align: "center", cls: "px-3", val: null },
  ];
}
function _qHeadHtml(extraRight, withStatus) {
  const arrow = k => {
    if (_q.sort !== k) return " <span class='text-slate-300'>⇅</span>";
    return _q.dir === 1 ? " <span class='text-fuji-600'>▲</span>" : " <span class='text-fuji-600'>▼</span>";
  };
  const th = c => {
    const a = c.align === "center" ? "text-center" : c.align === "right" ? "text-right" : "text-left";
    if (!c.val) return "<th class='" + a + " font-extrabold " + c.cls + " py-3'>" + c.label + "</th>";
    return "<th class='" + a + " font-extrabold " + c.cls + " py-3'><button data-sort='" + c.k + "' title='Urutkan " + c.label + "' class='hover:text-fuji-600 uppercase tracking-wide'>" + c.label + arrow(c.k) + "</button></th>";
  };
  return "<tr>" + _qCols().map(th).join("") + (withStatus === false ? "" : "<th class='text-left font-extrabold px-3 py-3'>Status</th>") + "<th class='font-extrabold px-4 py-3 text-right'>" + (extraRight || "Aksi") + "</th></tr>";
}
function _qBindSort(head) {
  if (!head) return;
  head.querySelectorAll("[data-sort]").forEach(b => b.onclick = () => {
    const k = b.getAttribute("data-sort");
    if (_q.sort === k) _q.dir = -_q.dir;
    else { _q.sort = k; _q.dir = (k === "siswa" || k === "paket") ? 1 : -1; }
    renderNilai();
  });
}
function _qSortRows(rows) {
  const col = _qCols().find(c => c.k === _q.sort);
  if (!col || !col.val) return rows;
  const d = _q.dir || 1;
  return rows.slice().sort((a, b) => {
    const va = col.val(a), vb = col.val(b);
    if (typeof va === "string") return va.localeCompare(vb) * d || ((b._t || 0) - (a._t || 0));
    return ((va || 0) - (vb || 0)) * d || ((b._t || 0) - (a._t || 0));
  });
}
let _qDetailRows = [];
function _qTime(v) {
  try {
    if (v.createdAt && v.createdAt.toDate) return v.createdAt.toDate().getTime();
    if (v.createdAt && v.createdAt.seconds) return v.createdAt.seconds * 1000;
  } catch (e) {}
  return v.at || 0;
}
function _qFmt(t) { try { return t ? new Date(t).toLocaleString("id-ID", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "-"; } catch (e) { return "-"; } }
function _qJft(p) {
  const J = Math.round(10 + (p / 100) * 240);
  const lv = J >= 200 ? "A2" : J >= 175 ? "A2.1" : J >= 145 ? "A1" : "-";
  return J + "/250 (" + lv + ")";
}
function _qEsc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
function _qBadge(txt, ok) { return "<span class='inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full border " + (ok ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200") + "'><span class='w-1.5 h-1.5 rounded-full " + (ok ? "bg-emerald-500" : "bg-rose-400") + "'></span>" + _qEsc(txt) + "</span>"; }
function _qSlugBadge(slug) { return "<span class='inline-block bg-fuji-50 text-fuji-700 border border-fuji-200 text-[11px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap'>" + _qEsc((slug || "-").replace("-quiz", "")) + "</span>"; }
window._aLoadNilai = async function (reset) {
  const db = window._aDb;
  if (reset) { _q.rows = []; _q.shown = 50; _q.lastDoc = null; _q.done = false; }
  if (_q.loading || (_q.done && !reset)) { renderNilai(); return; }
  _q.loading = true;
  $("qRows").innerHTML = "<tr><td colspan='10' class='py-10 text-center text-slate-400 text-[13px]'><i class='fa-solid fa-circle-notch fa-spin mr-2'></i>Memuat nilai…</td></tr>";
  try {
    let qq;
    try {
      qq = _q.lastDoc ? query(collection(db, "attempts"), orderBy("createdAt", "desc"), startAfter(_q.lastDoc), limit(500)) : query(collection(db, "attempts"), orderBy("createdAt", "desc"), limit(500));
    } catch (e) { qq = query(collection(db, "attempts"), limit(500)); }
    const snap = await getDocs(qq);
    if (snap.size) _q.lastDoc = snap.docs[snap.docs.length - 1];
    if (snap.size < 500) _q.done = true;
    snap.forEach(d => { const v = d.data() || {}; v._id = d.id; v._t = _qTime(v); _q.rows.push(v); });
    renderNilai();
  } catch (e) { $("qRows").innerHTML = "<tr><td colspan='10' class='py-10 text-center text-rose-500 text-[13px]'>Gagal memuat: " + _qEsc(e.message || e.code || e) + "</td></tr>"; }
  _q.loading = false;
};
function renderNilai() {
  const slug = ($("qSlug") || {}).value || "";
  const em = (($("qEmail") || {}).value || "").trim().toLowerCase();
  _q.mode = ($("qMode") || {}).value || "ringkas";
  const head = $("qHead");
  let list = _q.rows.filter(v => (!slug || v.slug === slug) && (!em || (v.email || "").toLowerCase().includes(em) || (v.name || "").toLowerCase().includes(em)));
  const listFin = list.filter(v => v.done !== false);
  const spam = list.length - listFin.length;
  let html = "";
  _qDetailRows = [];
  if (_q.mode === "ringkas") {
    if (head) { head.innerHTML = _qHeadHtml("Aksi"); _qBindSort(head); }
    const g = {};
    listFin.forEach(v => {
      const k = (v.email || "?") + "|" + (v.slug || "?");
      if (!g[k]) g[k] = { name: v.name || "", email: v.email || "", slug: v.slug || "", best: -1, bestBenar: 0, total: v.total || 0, n: 0, last: 0, bestT: 0, bestSecs: null };
      const o = g[k]; o.n++;
      if ((v.skor || 0) > o.best) { o.best = v.skor || 0; o.bestBenar = v.benar || 0; o.total = v.total || o.total; o.bestT = v._t; o.bestSecs = v.secs || null; }
      if (v._t > o.last) { o.last = v._t; o.name = v.name || o.name; }
    });
    // Samakan field agregat dengan accessor sorter (_t = waktu terbaik, skor = nilai terbaik)
    Object.values(g).forEach(o => { o._t = o.bestT || o.last; o.skor = o.best; o.benar = o.bestBenar; });
    window._qLastD = _qSortRows(Object.values(g)).slice(0, _q.shown); window._qLastD.forEach((o, _ix) => {
      _qDetailRows.push({ name: o.name, email: o.email, slug: o.slug, benar: o.bestBenar, total: o.total, t: o.bestT || o.last, secs: o.bestSecs });
      const di = _qDetailRows.length - 1;
      const ok = o.best >= 75;
      html += "<tr class='hover:bg-fuji-50/60 transition-colors'>"
        + "<td class='px-4 py-2.5 text-slate-500 whitespace-nowrap'>" + _qFmt(o.bestT || o.last) + "</td>"
        + "<td class='px-3 py-2.5'><div class='font-bold text-slate-800 leading-tight'>" + _qEsc(o.name || "-") + "</div><div class='text-[11px] text-slate-400'>" + _qEsc(o.email || "") + "</div></td>"
        + "<td class='px-3 py-2.5'>" + _qSlugBadge(o.slug) + "</td>"
        + "<td class='px-3 py-2.5 text-center text-slate-500'>" + (o.total || 0) + "</td>"
        + "<td class='px-3 py-2.5 text-center font-bold text-slate-700'>" + o.bestBenar + "</td>"
        + "<td class='px-3 py-2.5 text-center font-extrabold " + (ok ? "text-emerald-600" : "text-slate-700") + "'>" + o.best + "%</td>"
        + "<td class='px-3 py-2.5 text-slate-600 whitespace-nowrap'>" + _qJft(o.best) + "</td>"
        + "<td class='px-3 py-2.5 text-center'><span class='text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full'>" + o.n + "x</span></td>"
        + "<td class='px-3 py-2.5 text-center'>" + _qBadge(ok ? "Lulus" : "Belum", ok) + "</td>"
        + "<td class='px-4 py-2.5 text-right'><button onclick='window._aDetail(" + di + ")' class='inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 text-white text-[12px] font-bold px-3 py-1.5 rounded-lg transition-colors'><i class='fa-solid fa-file-lines'></i>Detail</button></td></tr>";
    });
    $("qCount").textContent = Object.keys(g).length + " siswa-paket";
  } else {
    if (head) { head.innerHTML = _qHeadHtml("Aksi", false); _qBindSort(head); }
    _qSortRows(listFin).slice(0, _q.shown).forEach(v => {
      _qDetailRows.push({ name: v.name, email: v.email, slug: v.slug, benar: v.benar, total: v.total, t: v._t, secs: v.secs || null });
      const di = _qDetailRows.length - 1;
      const ok = (v.skor || 0) >= 75;
      html += "<tr class='hover:bg-fuji-50/60 transition-colors'>"
        + "<td class='px-4 py-2.5 text-slate-500 whitespace-nowrap'>" + _qFmt(v._t) + "</td>"
        + "<td class='px-3 py-2.5'><div class='font-bold text-slate-800 leading-tight'>" + _qEsc(v.name || "-") + "</div><div class='text-[11px] text-slate-400'>" + _qEsc(v.email || "") + "</div></td>"
        + "<td class='px-3 py-2.5'>" + _qSlugBadge(v.slug) + "</td>"
        + "<td class='px-3 py-2.5 text-center text-slate-500'>" + (v.total || 0) + "</td>"
        + "<td class='px-3 py-2.5 text-center font-bold text-slate-700'>" + (v.benar || 0) + "</td>"
        + "<td class='px-3 py-2.5 text-center font-extrabold " + (ok ? "text-emerald-600" : "text-slate-700") + "'>" + (v.skor || 0) + "%</td>"
        + "<td class='px-3 py-2.5 text-slate-600 whitespace-nowrap'>" + _qJft(v.skor || 0) + "</td>"
        + "<td class='px-3 py-2.5 text-center'><button data-del='" + v._id + "' title='Hapus percobaan ini' class='inline-flex items-center gap-1 text-[12px] font-bold text-rose-500 hover:text-white hover:bg-rose-500 border border-rose-200 hover:border-rose-500 px-2.5 py-1.5 rounded-lg transition-colors'><i class='fa-solid fa-trash-can'></i></button></td>"
        + "<td class='px-4 py-2.5 text-right'><button onclick='window._aDetail(" + di + ")' class='inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 text-white text-[12px] font-bold px-3 py-1.5 rounded-lg transition-colors'><i class='fa-solid fa-file-lines'></i>Detail</button></td></tr>";
    });
    $("qCount").textContent = listFin.length + " ujian";
  }
  $("qRows").innerHTML = html || "<tr><td colspan='10' class='py-10 text-center text-slate-400 text-[13px]'><i class='fa-regular fa-folder-open text-2xl block mb-2'></i>Belum ada data yang cocok dengan filter.</td></tr>";
  const more = $("qMore"); if (more) { const habis = _q.done && _qDetailRows.length >= listFin.length; more.disabled = habis; more.classList.toggle("opacity-50", habis); more.innerHTML = habis ? "Semua data sudah ditampilkan ✓" : "Muat 100 lagi <i class='fa-solid fa-chevron-down ml-1'></i>"; }
  if (typeof renderUsers === "function") { try { renderUsers(); } catch (e) {} }
  $("qRows").querySelectorAll("[data-del]").forEach(b => b.onclick = async () => {
    if (!confirm("Hapus percobaan ini? Tindakan tidak bisa dibatalkan.")) return;
    await deleteDoc(doc(window._aDb, "attempts", b.dataset.del));
    _q.rows = _q.rows.filter(x => x._id !== b.dataset.del); renderNilai();
  });
}
window._aMoreNilai = async function () { _q.shown += 100; if (!_q.done && _q.shown > _q.rows.length) { await window._aLoadNilai(false); } else renderNilai(); };

function _qCsvCell(s) { s = String(s == null ? "" : s); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
window._aCsvNilai = function () {
  const rows = [["nama", "email", "paket", "soal", "benar", "skor_persen", "skala_jft"]];
  (_qDetailRows || []).forEach(o => { rows.push([o.name || "", o.email || "", o.slug || "", o.total || 0, o.benar || 0, Math.round((o.total ? o.benar / o.total : 0) * 100), Math.round(10 + (o.total ? (o.benar / o.total) * 240 : 0))]); });
  const csv = "﻿" + rows.map(r => r.map(_qCsvCell).join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  a.download = "nilai-siswa.csv"; document.body.appendChild(a); a.click(); a.remove();
};
window._qPrint = function () { window.print(); };
window._aInitSoal = function () {
  $("sPack").innerHTML = PACKS.map(p => "<option>" + p + "</option>").join("");
  const _qRe = () => { _q.shown = 50; renderNilai(); };
  $("qGo").onclick = function () { window._aLoadNilai(true); };
  if ($("qMode")) $("qMode").onchange = _qRe;
  if ($("qSlug")) $("qSlug").onchange = _qRe;
  if ($("qEmail")) $("qEmail").oninput = () => { clearTimeout(window._qT); window._qT = setTimeout(_qRe, 350); };
  const qMore = $("qMore"); if (qMore) qMore.onclick = window._aMoreNilai;
  const qCsv = $("qCsv"); if (qCsv) qCsv.onclick = window._aCsvNilai;
  const qPrint = $("qPrint"); if (qPrint) qPrint.onclick = window._qPrint;
  $("sLoad").onclick = async () => {
    const slug = $("sPack").value, db = window._aDb;
    try {
      const d = await getDoc(doc(db, "quiz_packs", slug));
      if (d.exists()) { $("sTitle").value = d.data().title || ""; $("sJson").value = JSON.stringify(d.data().items || [], null, 1); $("sInfo").textContent = "Dari Firestore."; }
      else {
        const r = await fetch("/" + slug + "/quiz-data.json"); const j = await r.json();
        $("sTitle").value = slug; $("sJson").value = JSON.stringify(j, null, 1); $("sInfo").textContent = "Dari file (" + j.length + " soal).";
      }
    } catch (e) { $("sInfo").textContent = "Gagal: " + (e.message || e.code); }
  };
  $("sSave").onclick = async () => {
    try {
      const items = JSON.parse($("sJson").value);
      await setDoc(doc(window._aDb, "quiz_packs", $("sPack").value), { slug: $("sPack").value, title: $("sTitle").value || $("sPack").value, items, updatedAt: serverTimestamp(), updatedBy: window._aAuth.currentUser.email });
      $("sInfo").textContent = "OK tersimpan (" + items.length + " soal).";
    } catch (e) { $("sInfo").textContent = "ERR " + (e.message || e.code); }
  };
};
window._aLoadAdmins = async function () {
  const db = window._aDb;
  try {
    const snap = await getDocs(collection(db, "admins"));
    $("aList").innerHTML = "";
    snap.forEach(d => {
      const v = d.data() || {};
      const row = document.createElement("div");
      row.textContent = (v.email || d.id);
      $("aList").appendChild(row);
    });
    if (!snap.size) $("aList").innerHTML = "<p>Kosong.</p>";
  } catch (e) { $("aList").innerHTML = "Gagal: " + (e.message || e.code); }
};
// --- Daftar Pengguna: dari koleksi /users + statistik attempts ---
let _uRows = [], _uAll = [], _uLoading = false, _uLoaded = false;
function _uTime(v) {
  try {
    if (v && v.toDate) return v.toDate().getTime();
    if (v && v.seconds) return v.seconds * 1000;
  } catch (e) {}
  return 0;
}
function _uStats() {
  const g = {};
  (_q.rows || []).filter(v => v.done !== false).forEach(v => {
    const em = (v.email || "").trim().toLowerCase();
    if (!em) return;
    if (!g[em]) g[em] = { n: 0, best: -1, packs: {} };
    const o = g[em]; o.n++;
    if ((v.skor || 0) > o.best) o.best = v.skor || 0;
    if (v.slug) o.packs[v.slug] = true;
  });
  return g;
}
async function _uLoad() {
  const box = $("uRows");
  if (_uLoaded) { renderUsers(); return; }
  if (_uLoading) return;
  _uLoading = true;
  if (box) box.innerHTML = "<tr><td colspan='6' class='py-10 text-center text-slate-400 text-[13px]'><i class='fa-solid fa-circle-notch fa-spin mr-2'></i>Memuat pengguna…</td></tr>";
  try {
    const db = window._aDb;
    let snap;
    try { snap = await getDocs(query(collection(db, "users"), orderBy("lastLoginAt", "desc"), limit(500))); }
    catch (e) { snap = await getDocs(collection(db, "users")); }
    _uAll = [];
    snap.forEach(d => { const v = d.data() || {}; v._uid = d.id; v._last = _uTime(v.lastLoginAt) || _uTime(v.createdAt); _uAll.push(v); });
    _uAll.sort((a, b) => b._last - a._last);
    _uLoaded = true;
    renderUsers();
  } catch (e) {
    if (box) box.innerHTML = "<tr><td colspan='6' class='py-10 text-center text-rose-500 text-[13px]'>Gagal memuat: " + _qEsc(e.message || e.code || e) + "</td></tr>";
  }
  _uLoading = false;
}
function renderUsers() {
  const box = $("uRows"); if (!box) return;
  if (!_uLoaded) { _uLoad(); return; }
  const kw = (($("uSearch") || {}).value || "").trim().toLowerCase();
  const stats = _uStats();
  _uRows = _uAll.filter(o => !kw || (o.email || "").toLowerCase().includes(kw) || (o.name || "").toLowerCase().includes(kw));
  const cnt = $("uCount"); if (cnt) cnt.textContent = _uRows.length + " pengguna";
  if (!_uRows.length) { box.innerHTML = "<tr><td colspan='6' class='py-10 text-center text-slate-400 text-[13px]'><i class='fa-regular fa-folder-open text-2xl block mb-2'></i>Belum ada pengguna yang login.</td></tr>"; return; }
  box.innerHTML = _uRows.map((o) => {
    const st = stats[(o.email || "").toLowerCase()] || { n: 0, best: null, packs: {} };
    const packs = Object.keys(st.packs).map(p => _qSlugBadge(p)).join(" ");
    const bestTxt = (st.best == null || st.best < 0) ? "<span class='text-slate-400'>-</span>" : "<span class='" + (st.best >= 75 ? "text-emerald-600" : "text-slate-700") + "'>" + st.best + "%</span>";
    const foto = o.photo ? "<img src='" + _qEsc(o.photo) + "' class='w-8 h-8 rounded-full object-cover' alt='' loading='lazy'>" : "<span class='w-8 h-8 rounded-full bg-fuji-100 text-fuji-700 flex items-center justify-center text-[13px] font-extrabold'>" + _qEsc((o.name || o.email || "?").charAt(0).toUpperCase()) + "</span>";
    const loginInfo = (o.loginCount ? o.loginCount + "x login" : "") + (o._last ? " • " + _qFmt(o._last) : "");
    return "<tr class='hover:bg-fuji-50/60 transition-colors'>"
      + "<td class='px-4 py-2.5'><div class='flex items-center gap-2.5'>" + foto + "<div><div class='font-bold text-slate-800 leading-tight'>" + _qEsc(o.name || "-") + "</div><div class='text-[11px] text-slate-400'>" + _qEsc(o.email || "") + "</div></div></div></td>"
      + "<td class='px-3 py-2.5 text-center'><span class='text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full'>" + st.n + "x</span></td>"
      + "<td class='px-3 py-2.5'>" + (packs || "<span class='text-slate-400'>-</span>") + "</td>"
      + "<td class='px-3 py-2.5 text-center font-extrabold'>" + bestTxt + "</td>"
      + "<td class='px-3 py-2.5 text-slate-500 whitespace-nowrap text-[12px]'>" + _qEsc(loginInfo || "-") + "</td>"
      + "<td class='px-4 py-2.5 text-right'><button data-uemail='" + _qEsc(o.email) + "' class='inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 text-white text-[12px] font-bold px-3 py-1.5 rounded-lg transition-colors'><i class='fa-solid fa-chart-line'></i>Lihat Nilai</button></td></tr>";
  }).join("");
  box.querySelectorAll("[data-uemail]").forEach(b => b.onclick = () => {
    const em = b.getAttribute("data-uemail") || "";
    const tabBtn = document.querySelector('.tabBtn[data-tab="nilai"]'); if (tabBtn) tabBtn.click();
    const f = $("qEmail"); if (f) { f.value = em; }
    const m = $("qMode"); if (m) { m.value = "semua"; }
    window._aLoadNilai(true);
  });
}
window._aCsvUsers = function () {
  const stats = _uStats();
  const rows = [["nama", "email", "jml_login", "jml_ujian", "paket", "nilai_terbaik", "terakhir_login"]];
  (_uRows || []).forEach(o => {
    const st = stats[(o.email || "").toLowerCase()] || { n: 0, best: null, packs: {} };
    rows.push([o.name || "", o.email || "", o.loginCount || 0, st.n, Object.keys(st.packs).join(";"), (st.best == null || st.best < 0) ? "" : st.best, o._last ? new Date(o._last).toLocaleString("id-ID") : ""]);
  });
  const csv = "﻿" + rows.map(r => r.map(_qCsvCell).join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  a.download = "daftar-pengguna.csv"; document.body.appendChild(a); a.click(); a.remove();
};
window._aInitUsers = function () {
  const s = $("uSearch"); if (s) s.oninput = () => { clearTimeout(window._uT); window._uT = setTimeout(renderUsers, 350); };
  const c = $("uCsv"); if (c) c.onclick = window._aCsvUsers;
  const im = $("uImport"); if (im && !im.dataset.bound) { im.dataset.bound = "1"; im.onchange = window._aImportUsers; }
  renderUsers();
};
// Import daftar user Auth dari CSV (hasil tools/sync-users.mjs) ke /users/{uid}.
// Format header: uid,nama,email,foto,dibuat,login_terakhir
window._aImportUsers = async function (ev) {
  const msg = $("uImportMsg");
  const say = t => { if (msg) msg.textContent = t; };
  try {
    const f = (ev.target.files || [])[0];
    if (!f) return;
    say("Membaca file…");
    let txt = await f.text();
    if (txt.charCodeAt(0) === 0xFEFF) txt = txt.slice(1);
    const lines = txt.split(/\r?\n/).filter(l => l.trim());
    if (lines.length < 2) { say("File kosong."); return; }
    const split = l => { const out = []; let cur = "", q = false; for (let i = 0; i < l.length; i++) { const c = l[i]; if (q) { if (c === '"') { if (l[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; } else if (c === '"') q = true; else if (c === ",") { out.push(cur); cur = ""; } else cur += c; } out.push(cur); return out; };
    const head = split(lines[0]).map(h => h.trim().toLowerCase());
    const ix = n => head.indexOf(n);
    const iUid = ix("uid"), iNama = ix("nama"), iEmail = ix("email"), iFoto = ix("foto");
    const iBuat = ix("dibuat"), iLogin = ix("login_terakhir");
    if (iUid < 0 || iEmail < 0) { say("Header CSV tidak cocok (perlu uid,nama,email,…)."); return; }
    const db = window._aDb;
    let ok = 0, fail = 0;
    for (let k = 1; k < lines.length; k++) {
      const c = split(lines[k]);
      const uid = (c[iUid] || "").trim(), email = (c[iEmail] || "").trim();
      if (!uid || !email) { fail++; continue; }
      try {
        const payload = { name: c[iNama] || "", email, photo: c[iFoto] || "", syncedAt: serverTimestamp() };
        const toTs = s => { const t = Date.parse(s || ""); return isNaN(t) ? null : new Date(t); };
        // Jangan timpa data login live: hanya isi bila dokumen belum ada / field kosong
        const ref = doc(db, "users", uid);
        let prev = null; try { prev = await getDoc(ref); } catch (e) {}
        if (prev && prev.exists()) {
          const p = prev.data() || {};
          if (!p.name && payload.name) payload.name = payload.name;
          else delete payload.name;
          if (!p.photo && payload.photo) { /* keep */ } else delete payload.photo;
          delete payload.email;
          const pv = {};
          if (!p.createdAt && iBuat >= 0) { const t = toTs(c[iBuat]); if (t) pv.createdAt = t; }
          if (!p.lastLoginAt && iLogin >= 0) { const t = toTs(c[iLogin]); if (t) pv.lastLoginAt = t; }
          Object.assign(payload, pv);
          if (!Object.keys(payload).filter(k => k !== "syncedAt").length) { ok++; continue; }
        } else {
          const t1 = iBuat >= 0 ? toTs(c[iBuat]) : null, t2 = iLogin >= 0 ? toTs(c[iLogin]) : null;
          if (t1) payload.createdAt = t1;
          if (t2) payload.lastLoginAt = t2;
          payload.loginCount = 0;
        }
        await setDoc(ref, payload, { merge: true });
        ok++;
      } catch (e) { fail++; }
      if (k % 10 === 0) say(`Mengimpor… ${k}/${lines.length - 1}`);
    }
    say(`Selesai: ${ok} ok${fail ? ", " + fail + " gagal" : ""}.`);
    _uLoaded = false; _uLoad();
  } catch (e) { say("Gagal: " + (e.message || e.code)); }
  try { ev.target.value = ""; } catch (e) {}
};
// --- Detail per baris: lembar hasil ala hasil.html ---
window._aDetail = function (di) {
  const d = (_qDetailRows || [])[di];
  if (!d) return;
  const J = Math.round(10 + (d.benar / Math.max(1, d.total)) * 240);
  const lv = J >= 200 ? "A2" : J >= 175 ? "A2.1" : J >= 145 ? "A1" : "-";
  const st = J >= 200 ? "LULUS" : "BELUM LULUS";
  const stBg = J >= 200 ? "background:#d1fae5;color:#065f46" : "background:#fee2e2;color:#991b1b";
  const pct = Math.max(0, Math.min(100, ((J - 10) / 240) * 100));
  const slugUp = (d.slug || "").replace("-quiz", "").toUpperCase();
  const tgl = _qFmt(d.t);
  const pc = d.total ? Math.round(d.benar / d.total * 100) : 0;
  const SECN = { sec1: ["文字と語彙", "Script and Vocabulary"], sec2: ["会話と表現", "Conversation and Expression"], sec3: ["聴解", "Listening Comprehension"], sec4: ["読解", "Reading Comprehension"] };
  let secs = "";
  ["sec1", "sec2", "sec3", "sec4"].forEach(k => {
    const s = d.secs && d.secs[k]; if (!s) return;
    const p = s.total ? Math.round(s.benar / s.total * 100) : 0;
    secs += "<div style='margin-bottom:10px'><div style='display:flex;justify-content:space-between;margin-bottom:3px'><span style='font-weight:700;font-size:13px'>" + SECN[k][0] + "</span><span style='font-size:11px;color:#6b7280'>" + s.benar + "/" + s.total + " <b>" + p + "%</b></span></div><div style='display:flex;align-items:center;gap:8px'><span style='font-size:11px;color:#6b7280;width:170px'>" + SECN[k][1] + "</span><div style='flex:1;position:relative;height:14px;background:#e5e7eb;border-radius:4px'><div style='position:absolute;top:50%;transform:translateY(-50%);width:12px;height:12px;border-radius:50%;background:#fff;border:2px solid #f97316;left:calc(" + p + "% - 6px)'></div></div></div></div>";
  });
  if (!secs) secs = "<p style='font-size:12px;color:#6b7280'>Rincian seksi tidak tersedia.</p>";
  $("dSheet").innerHTML = "<div style='display:flex;justify-content:space-between;border-bottom:2px solid #e2e8f0;padding-bottom:12px;margin-bottom:14px'><div><div style='font-size:20px;font-weight:900'>SinauJepang <span style='font-size:12px;color:#94a3b8'>模擬試験</span></div><div style='font-size:11px;color:#64748b'>Lembar Hasil Simulasi JFT-Basic (estimasi)</div></div><div style='text-align:right'><div style='font-size:11px;font-weight:700;color:#dc2626;border:2px solid #dc2626;border-radius:6px;padding:2px 12px;display:inline-block;letter-spacing:2px'>SIMULASI</div><div style='font-size:10px;color:#94a3b8;margin-top:4px'>" + tgl + "</div></div></div>";
  $("dSheet").innerHTML += "<h1 style='text-align:center;font-weight:700;font-size:16px'>判定結果通知書 <span style='font-weight:400;font-size:13px'>/ Notification of assessment results</span></h1><p style='text-align:center;font-size:11px;color:#64748b;margin-bottom:14px'>Estimasi 10 + benar/total x 240 — bukan skor resmi.</p>";
  $("dSheet").innerHTML += "<div style='background:#f8fafc;border:1px solid #e2e8f0;padding:14px;margin-bottom:14px;font-size:14px;display:grid;grid-template-columns:1fr 1fr;gap:8px'><div><span style='color:#64748b;font-size:12px'>Nama</span><div style='font-weight:700'>" + String(d.name || "-").replace(/</g, "&lt;") + "</div><div style='font-size:11px;color:#64748b'>" + String(d.email || "") + "</div></div><div><span style='color:#64748b;font-size:12px'>Paket</span><div style='font-weight:700'>" + slugUp + "</div></div><div><span style='color:#64748b;font-size:12px'>Tanggal</span><div style='font-weight:700'>" + tgl + "</div></div><div><span style='color:#64748b;font-size:12px'>Benar</span><div style='font-weight:700'>" + d.benar + " / " + d.total + " (" + pc + "%)</div></div></div>";
  $("dSheet").innerHTML += "<div style='border:2px solid #94a3b8;padding:14px 18px;margin-bottom:14px'><div style='display:flex;align-items:center;gap:12px;margin-bottom:8px'><div><div style='font-weight:700;font-size:14px'>総合得点</div><div style='font-size:10px;color:#94a3b8'>Total Score</div></div><div style='font-size:34px;font-weight:900'>" + J + "</div><span style='font-weight:800;font-size:13px;padding:4px 14px;border-radius:9999px;" + stBg + "'>" + st + "</span><span style='margin-left:auto;font-size:12px'>Level: <b style='font-size:16px'>" + lv + "</b></span></div><div style='font-weight:700;font-size:13px;margin-bottom:4px'>得点範圍 : 10-250</div><div style='height:10px;border-radius:9999px;background:linear-gradient(to right,#fda4af,#f472b6 46%,#fb923c 62%,#facc15 75%,#a3e635);position:relative'><div style='position:absolute;top:-2px;bottom:-2px;width:2px;background:#1e293b;left:79.16%'></div><div style='position:absolute;top:50%;transform:translate(-50%,-50%);left:" + pct + "%'><span style='position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);font-size:12px;font-weight:700;color:#fff;background:#1e293b;padding:2px 8px;border-radius:6px;white-space:nowrap'>" + J + "</span><span style='display:block;width:18px;height:18px;border-radius:50%;background:#fff;border:4px solid #f97316'></span></div></div><div style='display:flex;justify-content:space-between;font-size:10px;color:#64748b;margin-top:2px'><span>10</span><span>200 Lulus</span><span>250</span></div></div>";
  $("dSheet").innerHTML += "<div style='margin-bottom:8px'><div style='font-weight:700;font-size:13px'>セクション毎の正答率:</div><div style='font-size:11px;color:#64748b;margin-bottom:8px'>The percentage of correct answers for each section</div>" + secs + "</div>";
  const m = $("dModal"); m.classList.remove("hidden"); m.classList.add("flex");
};
window._aCloseDetail = function () { const m = $("dModal"); m.classList.add("hidden"); m.classList.remove("flex"); };
window._aPrintDetail = function () { window.print(); };