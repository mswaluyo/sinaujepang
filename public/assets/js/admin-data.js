// run immediately
const btnSave = document.getElementById('btnSaveSettings');
console.log('btnSaveSettings', btnSave);
  const inpToken = document.getElementById('setToken');
  const inpRepo = document.getElementById('setRepo');
  async function loadCfg() {
    try {
      const db = window._aDb;
      if (!db) { setTimeout(loadCfg, 500); return; }
      const snap = await getDoc(doc(db, 'settings', 'github'));
      if (snap.exists()) {
        const d = snap.data();
        if (inpToken) inpToken.value = d.token || '';
        if (inpRepo) inpRepo.value = d.repo || 'mswaluyo/sinaujepang';
      }
      console.log('saved');
      alert('Konfigurasi disimpan.');
    } catch (e) { console.error(e); alert('Gagal simpan: ' + e.message); }
  });
import { collection, getDocs, getDoc, doc, setDoc, deleteDoc, query, orderBy, limit, startAfter, serverTimestamp, documentId } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
const $ = id => document.getElementById(id);
const PACKS = (window.PAKET_CONFIG ? window.PAKET_CONFIG.kategori.flatMap(k => k.paket.map(p => p.slug)) : ["hare-quiz","aoi-quiz","basu-quiz","gakusei-quiz"]);
const _q = { mode: "ringkas", rows: [], shown: 50, lastDoc: null, done: false, loading: false, sort: "waktu", dir: -1 };
function _qJftNum(p) { return Math.round(10 + ((p || 0) / 100) * 240); }
// J eksak dari benar/total (tanpa lewat persen bulat) — SAMA dengan hasil.html & Detail.
function _qJftExact(benar, total) {
  benar = benar || 0; total = total || 0;
  if (!total) return 10;
  return Math.round(10 + (benar / total) * 240);
}
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
    { k: "jft", label: "Skala JFT", align: "left", cls: "px-3", val: o => _qJftExact(o.benar ?? o.bestBenar ?? 0, o.total ?? 0) },
    ujian
      ? { k: "ujian", label: "Ujian", align: "center", cls: "px-3", val: o => (o.nShow ?? o.n ?? 0) }
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
function _qJft(p, benar, total) {
  const J = (benar != null && total != null) ? _qJftExact(benar, total) : Math.round(10 + (p / 100) * 240);
  const lv = J >= 200 ? "A2" : J >= 175 ? "A2.1" : J >= 145 ? "A1" : "0";
  const c = J >= 200 ? "text-emerald-600" : J >= 175 ? "text-lime-600" : J >= 145 ? "text-amber-600" : "text-slate-400";
  return J + "-<span class='font-extrabold " + c + "'>" + lv + "</span>";
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
    // Pagination stabil: orderBy(documentId()) selalu ada & unik -> startAfter tak akan
    // mengulang/melewatkan dokumen (sebelumnya orderBy createdAt tak stabil utk dok lama
    // tanpa field itu -> dokumen ganda -> hitungan Ujian membengkak). Sortir waktu di klien.
    let qq;
    try {
      qq = _q.lastDoc ? query(collection(db, "attempts"), orderBy(documentId()), startAfter(_q.lastDoc), limit(500)) : query(collection(db, "attempts"), orderBy(documentId()), limit(500));
    } catch (e) { qq = query(collection(db, "attempts"), limit(500)); }
    const snap = await getDocs(qq);
    if (snap.size) _q.lastDoc = snap.docs[snap.docs.length - 1];
    if (snap.size < 500) _q.done = true;
    const seen = new Set(_q.rows.map(r => r._id));
    snap.forEach(d => {
      if (seen.has(d.id)) return; // cegah duplikat antar-halaman (query orderBy createdAt tak stabil utk dok lama tanpa field itu)
      seen.add(d.id);
      const v = d.data() || {}; v._id = d.id; v._t = _qTime(v); _q.rows.push(v);
    });
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
      const o = g[k];
      // n = total percobaan beneran dari field n dokumen gabungan; fallback hitung baris.
      // Ambil nilai terbesar (bukan akumulasi) agar dokumen ganda tak menggandakan angka.
      if (v.n > 0) o.n = Math.max(o.n, v.n);
      else o.rows = (o.rows || 0) + 1;
      o.nShow = Math.max(o.n, o.rows || 0);
      if ((v.skor || 0) > o.best) { o.best = v.skor || 0; o.bestBenar = v.benar || 0; o.total = v.total || o.total; o.bestT = v._t; o.bestSecs = v.secs || null; }
      if (v._t > o.last) { o.last = v._t; o.name = v.name || o.name; }
    });
    // Samakan field agregat dengan accessor sorter (_t = waktu terbaik, skor = nilai terbaik)
    Object.values(g).forEach(o => { o._t = o.bestT || o.last; o.skor = o.best; o.benar = o.bestBenar; });
    window._qLastD = _qSortRows(Object.values(g)).slice(0, _q.shown); window._qLastD.forEach((o, _ix) => {
      _qDetailRows.push({ name: o.name, email: o.email, slug: o.slug, benar: o.bestBenar, total: o.total, t: o.bestT || o.last, secs: o.bestSecs, n: o.nShow });
      const di = _qDetailRows.length - 1;
      const ok = o.best >= 75;
      html += "<tr class='hover:bg-fuji-50/60 transition-colors'>"
        + "<td class='px-4 py-2.5 text-slate-500 whitespace-nowrap'>" + _qFmt(o.bestT || o.last) + "</td>"
        + "<td class='px-3 py-2.5'><div class='font-bold text-slate-800 leading-tight'>" + _qEsc(o.name || "-") + "</div><div class='text-[11px] text-slate-400'>" + _qEsc(o.email || "") + "</div></td>"
        + "<td class='px-3 py-2.5'>" + _qSlugBadge(o.slug) + "</td>"
        + "<td class='px-3 py-2.5 text-center text-slate-500'>" + (o.total || 0) + "</td>"
        + "<td class='px-3 py-2.5 text-center font-bold text-slate-700'>" + o.bestBenar + "</td>"
        + "<td class='px-3 py-2.5 text-center font-extrabold " + (ok ? "text-emerald-600" : "text-slate-700") + "'>" + o.best + "%</td>"
        + "<td class='px-3 py-2.5 text-slate-600 whitespace-nowrap'>" + _qJft(o.best, o.bestBenar, o.total) + "</td>"
        + "<td class='px-3 py-2.5 text-center'><span class='text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full'>" + o.nShow + "x</span></td>"
        + "<td class='px-3 py-2.5 text-center'>" + _qBadge(ok ? "Lulus" : "Belum", ok) + "</td>"
        + "<td class='px-4 py-2.5 text-right'><button onclick='window._aDetail(" + di + ")' class='inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 text-white text-[12px] font-bold px-3 py-1.5 rounded-lg transition-colors'><i class='fa-solid fa-file-lines'></i>Detail</button></td></tr>";
    });
    $("qCount").textContent = Object.keys(g).length + " siswa-paket";
    if ($("qSoal")) { let tb = 0, tt = 0; window._qLastD.forEach(o => { tb += o.bestBenar || 0; tt += o.total || 0; }); $("qSoal").textContent = "Soal: " + tb + "/" + tt + " benar"; }
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
        + "<td class='px-3 py-2.5 text-slate-600 whitespace-nowrap'>" + _qJft(v.skor || 0, v.benar, v.total) + "</td>"
        + "<td class='px-3 py-2.5 text-center'><button data-del='" + v._id + "' title='Hapus percobaan ini' class='inline-flex items-center gap-1 text-[12px] font-bold text-rose-500 hover:text-white hover:bg-rose-500 border border-rose-200 hover:border-rose-500 px-2.5 py-1.5 rounded-lg transition-colors'><i class='fa-solid fa-trash-can'></i></button></td>"
        + "<td class='px-4 py-2.5 text-right'><button onclick='window._aDetail(" + di + ")' class='inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-700 text-white text-[12px] font-bold px-3 py-1.5 rounded-lg transition-colors'><i class='fa-solid fa-file-lines'></i>Detail</button></td></tr>";
    });
    $("qCount").textContent = listFin.length + " ujian";
    if ($("qSoal")) { let tb = 0, tt = 0; _qDetailRows.forEach(o => { tb += o.benar || 0; tt += o.total || 0; }); $("qSoal").textContent = "Soal: " + tb + "/" + tt + " benar"; }
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
window._aJsonNilai = function () {
  const data = (_qDetailRows || []).map(o => {
    const total = o.total || 0, benar = o.benar || 0;
    return {
      nama: o.name || "", email: o.email || "", paket: o.slug || "",
      soal: total, benar,
      skor_persen: total ? Math.round(benar / total * 100) : 0,
      skala_jft: total ? Math.round(10 + (benar / total) * 240) : 10,
      ujian_n: o.n || null, // hitungan percobaan (hanya mode ringkas)
      waktu: o.t ? new Date(o.t).toISOString() : null,
      secs: o.secs || null
    };
  });
  const out = {
    diekspor_pada: new Date().toISOString(),
    mode: _q.mode, jumlah: data.length,
    total_dokumen_dimuat: (_q.rows || []).length,
    filter: { paket: ($("qSlug") || {}).value || "", kata_kunci: ($("qEmail") || {}).value || "" },
    data
  };
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(out, null, 2)], { type: "application/json;charset=utf-8" }));
  a.download = "nilai-siswa.json"; document.body.appendChild(a); a.click(); a.remove();
};
window._aInitSoal = function () {
  $("sPack").innerHTML = PACKS.map(p => "<option value='" + p + "'>" + p + "</option>").join("");
  
  // Nilai Tab Events (dipertahankan)
  const _qRe = () => { _q.shown = 50; renderNilai(); };
  $("qGo").onclick = function () { window._aLoadNilai(true); };
  if ($("qMode")) $("qMode").onchange = _qRe;
  if ($("qSlug")) $("qSlug").onchange = _qRe;
  if ($("qEmail")) $("qEmail").oninput = () => { clearTimeout(window._qT); window._qT = setTimeout(_qRe, 350); };
  const qMore = $("qMore"); if (qMore) qMore.onclick = window._aMoreNilai;
  const qCsv = $("qCsv"); if (qCsv) qCsv.onclick = window._aCsvNilai;
  const qJson = $("qJson"); if (qJson) qJson.onclick = window._aJsonNilai;
  const qPrint = $("qPrint"); if (qPrint) qPrint.onclick = window._qPrint;

  // State Soal Editor
  var _sItems = [];
  var _sIdx = -1;
  var _sModeJson = false;

  function _validateItem(q) {
    if (!q) return { ok: false, level: "err", reason: "Data soal kosong" };
    if (!Array.isArray(q.options) || q.options.length < 2) {
      return { ok: false, level: "err", reason: "Pilihan jawaban minimal 2 opsi" };
    }
    if (typeof q.answer !== "number" || q.answer < 0 || q.answer >= q.options.length) {
      return { ok: false, level: "err", reason: "Kunci jawaban di luar pilihan" };
    }
    if (!q.title && !q.img && !q.audio) {
      return { ok: false, level: "err", reason: "Materi soal (teks/gambar/audio) belum ada" };
    }
    if (!q.analisis || !q.analisis.trim()) {
      return { ok: false, level: "warn", reason: "Pembahasan / Analisis belum diisi" };
    }
    if (!q.trans || !q.trans.trim()) {
      return { ok: false, level: "warn", reason: "Terjemahan soal belum diisi" };
    }
    return { ok: true, level: "ok", reason: "Lengkap & Valid" };
  }

  function _syncJson() {
    if ($("sJson")) $("sJson").value = JSON.stringify(_sItems, null, 1);
  }

  function _renderQList() {
    const listEl = $("sQList");
    if (!listEl) return;
    $("sCountBadge").textContent = _sItems.length;

    // Kumpulkan daftar seksi unik untuk filter
    const secSelect = $("sFilterSec");
    const currentFilterSec = secSelect.value;
    const secSet = new Set();
    _sItems.forEach(q => { if (q.section) secSet.add(q.section.trim()); });
    secSelect.innerHTML = "<option value=''>Semua Sesi (" + secSet.size + " sesi)</option>" +
      Array.from(secSet).map(s => "<option value='" + s + "'" + (s === currentFilterSec ? " selected" : "") + ">" + s + "</option>").join("");

    const filterText = ($("sFilterText").value || "").toLowerCase().trim();
    const filterSec = secSelect.value;

    listEl.innerHTML = "";
    if (!_sItems.length) {
      listEl.innerHTML = "<div class='text-center py-8 text-slate-400 text-xs'>Belum ada soal. Klik 'Tambah Soal' atau 'Muat Soal'.</div>";
      return;
    }

    _sItems.forEach((q, idx) => {
      const secMatch = !filterSec || (q.section || "").trim() === filterSec;
      const textMatch = !filterText ||
        String(q.no || (idx + 1)).includes(filterText) ||
        (q.title || "").toLowerCase().includes(filterText) ||
        (q.analisis || "").toLowerCase().includes(filterText) ||
        (q.trans || "").toLowerCase().includes(filterText);

      if (!secMatch || !textMatch) return;

      const v = _validateItem(q);
      const isActive = idx === _sIdx;

      const itemCard = document.createElement("div");
      itemCard.className = "p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 " +
        (isActive
          ? "bg-fuji-50 border-fuji-400 shadow-sm ring-1 ring-fuji-400"
          : "bg-white hover:bg-slate-50 border-slate-200");

      let iconHtml = '<i class="fa-solid fa-circle-check text-emerald-500 text-sm shrink-0 mt-0.5" title="Valid & Lengkap"></i>';
      if (v.level === "warn") {
        iconHtml = '<i class="fa-solid fa-triangle-exclamation text-amber-500 text-sm shrink-0 mt-0.5" title="' + v.reason + '"></i>';
      } else if (v.level === "err") {
        iconHtml = '<i class="fa-solid fa-circle-xmark text-rose-500 text-sm shrink-0 mt-0.5" title="' + v.reason + '"></i>';
      }

      const qTitleText = q.title ? q.title.replace(/\n/g, " ") : (q.img ? "[Gambar: " + q.img + "]" : (q.audio ? "[Audio Choukai]" : "(Soal belum ada teks)"));

      itemCard.innerHTML = iconHtml +
        "<div class='flex-1 min-w-0'>" +
          "<div class='flex items-center justify-between gap-1 mb-0.5'>" +
            "<span class='text-xs font-bold " + (isActive ? "text-fuji-700" : "text-slate-800") + "'>No. " + (q.no || (idx + 1)) + "</span>" +
            "<span class='text-[10px] text-slate-400 truncate max-w-[120px]'>" + (q.section || "") + "</span>" +
          "</div>" +
          "<p class='text-[11px] text-slate-600 line-clamp-1 truncate'>" + qTitleText + "</p>" +
        "</div>";

      itemCard.onclick = () => {
        _sIdx = idx;
        _renderQList();
        _renderActiveForm();
      };

      listEl.appendChild(itemCard);
    });
  }

  function _renderActiveForm() {
    const emptyBox = $("sFormEmpty");
    const formBody = $("sFormBody");
    if (!emptyBox || !formBody) return;

    if (_sIdx < 0 || _sIdx >= _sItems.length) {
      emptyBox.classList.remove("hidden");
      formBody.classList.add("hidden");
      return;
    }

    emptyBox.classList.add("hidden");
    formBody.classList.remove("hidden");

    const q = _sItems[_sIdx];
    const packSlug = $("sPack").value;

    $("fNo").value = q.no != null ? q.no : (_sIdx + 1);
    $("fSection").value = q.section || "";
    $("fTitle").value = q.title || "";
    $("fTrans").value = q.trans || "";
    $("fImg").value = q.img || "";
    $("fAudio").value = q.audio || "";
    $("fMnn").value = q.mnn || "";
    $("fAnalisis").value = q.analisis || "";

    const imgBox = $("fImgPreviewBox");
    const imgEl = $("fImgPreview");
    const missingEl = $("fImgMissing");
    if ((q.link && q.link.trim()) || (q.img && q.img.trim())) {
      const raw = (q.link && q.link.trim()) ? q.link.trim() : q.img.trim();
      const src = (raw.startsWith("/") || raw.startsWith("http")) ? raw : ("/" + packSlug + "/" + raw);
      imgEl.src = src;
      imgEl.onerror = () => {
        imgEl.style.display = 'none';
        if (missingEl) missingEl.classList.remove("hidden");
      };
      imgEl.onload = () => { imgEl.style.display = ''; if (missingEl) missingEl.classList.add("hidden"); };
      imgBox.classList.remove("hidden");
    } else {
      imgBox.classList.add("hidden");
      if (missingEl) missingEl.classList.add("hidden");
    }

     // (Download gambar lama dihapus)


    // Audio preview
    const audioEl = $("fAudioPlayer");
    if (q.audio && q.audio.trim()) {
      const src = (q.audio.startsWith("/") || q.audio.startsWith("http")) ? q.audio : ("/" + packSlug + "/" + q.audio);
      audioEl.src = src;
      audioEl.classList.remove("hidden");
    } else {
      audioEl.classList.add("hidden");
    }

    // Options rendering
    const optContainer = $("fOptionsContainer");
    optContainer.innerHTML = "";
    if (!Array.isArray(q.options)) q.options = [{ text: "" }, { text: "" }, { text: "" }, { text: "" }];
    if (!Array.isArray(q.opt_detail)) q.opt_detail = [];

    const LETTERS = ["A", "B", "C", "D", "E", "F"];
    q.options.forEach((opt, oi) => {
      const isCorrect = q.answer === oi;
      const detail = q.opt_detail[oi] || {};
      const optRow = document.createElement("div");
      optRow.className = "p-3 rounded-xl border transition-all " +
        (isCorrect
          ? "bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300"
          : "bg-slate-50 border-slate-200");

      optRow.innerHTML =
        "<div class='flex items-center gap-2 mb-2'>" +
          "<label class='cursor-pointer flex items-center gap-2'>" +
            "<input type='radio' name='fAnsKey' value='" + oi + "' " + (isCorrect ? "checked" : "") + " class='w-4 h-4 text-emerald-600 focus:ring-emerald-500'>" +
            "<span class='w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center " +
              (isCorrect ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700") + "'>" +
              (LETTERS[oi] || (oi + 1)) +
            "</span>" +
            "<span class='text-xs font-bold " + (isCorrect ? "text-emerald-800" : "text-slate-700") + "'>" +
              (isCorrect ? "Kunci Jawaban Benar" : "Pilihan " + (LETTERS[oi] || (oi + 1))) +
            "</span>" +
          "</label>" +
        "</div>" +
        "<div class='grid grid-cols-1 md:grid-cols-2 gap-2'>" +
          "<div>" +
            "<input placeholder='Teks Pilihan (contoh: あかい / akai)' class='optText border border-slate-300 bg-white rounded-lg px-2.5 py-1.5 text-xs w-full text-slate-800' value='" + (opt.text ? String(opt.text).replace(/'/g, "&#39;") : "") + "'>" +
          "</div>" +
          "<div>" +
            "<input placeholder='Penjelasan Opsi / Arti (contoh: merah, lawan dari biru)' class='optReason border border-slate-200 bg-white rounded-lg px-2.5 py-1.5 text-xs w-full text-slate-600' value='" + ((detail.alasan || detail.arti || "") ? String(detail.alasan || detail.arti).replace(/'/g, "&#39;") : "") + "'>" +
          "</div>" +
        "</div>";

      // Radio button change
      const radio = optRow.querySelector("input[type=radio]");
      radio.onchange = () => {
        q.answer = oi;
        _syncJson();
        _renderQList();
        _renderActiveForm();
      };

      // Option text change
      const textInput = optRow.querySelector(".optText");
      textInput.oninput = () => {
        opt.text = textInput.value;
        _syncJson();
        _renderQList();
        _updateStatusBadge();
      };

      // Option reason change
      const reasonInput = optRow.querySelector(".optReason");
      reasonInput.oninput = () => {
        if (!q.opt_detail[oi]) q.opt_detail[oi] = {};
        q.opt_detail[oi].alasan = reasonInput.value;
        q.opt_detail[oi].arti = reasonInput.value;
        _syncJson();
      };

      optContainer.appendChild(optRow);
    });

    _updateStatusBadge();
  }

  function _updateStatusBadge() {
    const badge = $("fStatusBadge");
    if (!badge || _sIdx < 0 || !_sItems[_sIdx]) return;
    const v = _validateItem(_sItems[_sIdx]);
    if (v.level === "ok") {
      badge.className = "text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1";
      badge.innerHTML = '<i class="fa-solid fa-circle-check"></i> ' + v.reason;
    } else if (v.level === "warn") {
      badge.className = "text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1";
      badge.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> ' + v.reason;
    } else {
      badge.className = "text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 flex items-center gap-1";
      badge.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> ' + v.reason;
    }
  }

  // Bind Form Input Changes
  $("fNo").oninput = () => {
    if (_sIdx >= 0 && _sItems[_sIdx]) {
      _sItems[_sIdx].no = parseInt($("fNo").value) || (_sIdx + 1);
      _syncJson();
      _renderQList();
    }
  };
  $("fSection").oninput = () => {
    if (_sIdx >= 0 && _sItems[_sIdx]) {
      _sItems[_sIdx].section = $("fSection").value;
      _syncJson();
      _renderQList();
    }
  };
  $("fTitle").oninput = () => {
    if (_sIdx >= 0 && _sItems[_sIdx]) {
      _sItems[_sIdx].title = $("fTitle").value;
      _syncJson();
      _renderQList();
      _updateStatusBadge();
    }
  };
  $("fTrans").oninput = () => {
    if (_sIdx >= 0 && _sItems[_sIdx]) {
      _sItems[_sIdx].trans = $("fTrans").value;
      _syncJson();
      _updateStatusBadge();
    }
  };
  $("fImg").oninput = () => {
    if (_sIdx >= 0 && _sItems[_sIdx]) {
      _sItems[_sIdx].img = $("fImg").value;
      _syncJson();
      _renderActiveForm();
    }
  };
  $("fAudio").oninput = () => {
    if (_sIdx >= 0 && _sItems[_sIdx]) {
      _sItems[_sIdx].audio = $("fAudio").value;
      _syncJson();
      _renderActiveForm();
    }
  };
  $("fMnn").oninput = () => {
    if (_sIdx >= 0 && _sItems[_sIdx]) {
      _sItems[_sIdx].mnn = $("fMnn").value;
      _syncJson();
    }
  };
  $("fAnalisis").oninput = () => {
    if (_sIdx >= 0 && _sItems[_sIdx]) {
      _sItems[_sIdx].analisis = $("fAnalisis").value;
      _syncJson();
      _renderQList();
      _updateStatusBadge();
    }
  };

  // Tambah Soal
  $("sAddQ").onclick = () => {
    const lastSec = _sItems.length ? _sItems[_sItems.length - 1].section : "SESI 1 : MOJIGOI";
    const newQ = {
      no: _sItems.length + 1,
      section: lastSec,
      title: "",
      img: "",
      audio: "",
      options: [
        { text: "" },
        { text: "" },
        { text: "" },
        { text: "" }
      ],
      answer: 0,
      trans: "",
      analisis: "",
      opt_detail: [{}, {}, {}, {}]
    };
    _sItems.push(newQ);
    _sIdx = _sItems.length - 1;
    _syncJson();
    _renderQList();
    _renderActiveForm();
  };

  // Duplikat Soal
  $("fDuplicate").onclick = () => {
    if (_sIdx < 0 || !_sItems[_sIdx]) return;
    const clone = JSON.parse(JSON.stringify(_sItems[_sIdx]));
    clone.no = _sItems.length + 1;
    _sItems.splice(_sIdx + 1, 0, clone);
    _sIdx = _sIdx + 1;
    _syncJson();
    _renderQList();
    _renderActiveForm();
  };

  // Hapus Soal
  $("fDelete").onclick = () => {
    if (_sIdx < 0 || !_sItems[_sIdx]) return;
    if (!confirm("Hapus soal No. " + (_sItems[_sIdx].no || (_sIdx + 1)) + "?")) return;
    _sItems.splice(_sIdx, 1);
    if (_sIdx >= _sItems.length) _sIdx = _sItems.length - 1;
    _syncJson();
    _renderQList();
    _renderActiveForm();
  };

  // Search & Filter
  $("sFilterText").oninput = () => _renderQList();
  $("sFilterSec").onchange = () => _renderQList();

  // Audit Seluruh Paket
  $("sAudit").onclick = () => {
    const box = $("sAuditBox");
    if (!box) return;
    if (!_sItems.length) {
      box.className = "mb-4 p-3 rounded-xl border bg-slate-50 border-slate-200 text-slate-600 block";
      box.textContent = "Belum ada soal untuk diaudit. Muat soal terlebih dahulu.";
      return;
    }

    let okCount = 0, warnCount = 0, errCount = 0;
    const issues = [];

    _sItems.forEach((q, idx) => {
      const v = _validateItem(q);
      const qNum = "Soal #" + (q.no || (idx + 1));
      if (v.level === "ok") {
        okCount++;
      } else if (v.level === "warn") {
        warnCount++;
        issues.push({ idx, qNum, level: "warn", reason: v.reason });
      } else {
        errCount++;
        issues.push({ idx, qNum, level: "err", reason: v.reason });
      }
    });

    box.classList.remove("hidden");
    if (errCount === 0 && warnCount === 0) {
      box.className = "mb-4 p-3.5 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-800 block";
      box.innerHTML = "<div class='flex items-center gap-2 font-bold mb-1'><i class='fa-solid fa-circle-check text-emerald-600 text-base'></i> Seluruh Soal Valid (" + okCount + "/" + _sItems.length + " Soal Lengkap)!</div><p class='text-[11px] text-emerald-700'>Semua soal memiliki teks/media materi, pilihan jawaban, kunci jawaban sah, terjemahan, dan pembahasan.</p>";
    } else {
      box.className = "mb-4 p-3.5 rounded-xl border bg-amber-50 border-amber-200 text-amber-900 block";
      let html = "<div class='flex items-center justify-between mb-2'>" +
        "<span class='font-bold flex items-center gap-1.5'><i class='fa-solid fa-clipboard-check text-amber-600'></i> Hasil Audit: " + okCount + " Valid, " + warnCount + " Peringatan, " + errCount + " Bermasalah</span>" +
        "<button id='sCloseAudit' class='text-[11px] font-bold text-amber-700 hover:text-amber-900 underline'>Tutup</button>" +
      "</div>" +
      "<div class='max-h-36 overflow-y-auto space-y-1 pr-1'>";

      issues.forEach(it => {
        const color = it.level === "err" ? "text-rose-700 bg-rose-100/60" : "text-amber-800 bg-amber-100/50";
        html += "<div class='flex items-center justify-between px-2 py-1 rounded " + color + "'>" +
          "<span><strong>" + it.qNum + ":</strong> " + it.reason + "</span>" +
          "<button class='auditJump font-bold underline text-[11px] ml-2 shrink-0' data-idx='" + it.idx + "'>Buka Soal</button>" +
        "</div>";
      });
      html += "</div>";
      box.innerHTML = html;

      box.querySelector("#sCloseAudit").onclick = () => box.classList.add("hidden");
      box.querySelectorAll(".auditJump").forEach(btn => {
        btn.onclick = () => {
          _sIdx = parseInt(btn.dataset.idx);
          _renderQList();
          _renderActiveForm();
        };
      });
    }
  };

  // Toggle Mode JSON / Visual
  $("sToggleMode").onclick = () => {
    _sModeJson = !_sModeJson;
    const vCont = $("sVisualContainer");
    const jCont = $("sJsonContainer");
    const label = $("sModeLabel");
    if (_sModeJson) {
      vCont.classList.add("hidden");
      jCont.classList.remove("hidden");
      label.textContent = "Mode Form Visual";
      _syncJson();
    } else {
      try {
        const parsed = JSON.parse($("sJson").value);
        if (Array.isArray(parsed)) {
          _sItems = parsed;
          if (_sIdx >= _sItems.length) _sIdx = _sItems.length ? 0 : -1;
           window._sItems = _sItems; window._sIdx = _sIdx;

        }
      } catch (e) {
        alert("JSON tidak valid, perbaiki sebelum kembali ke mode visual: " + e.message);
        return;
      }
      vCont.classList.remove("hidden");
      jCont.classList.add("hidden");
      label.textContent = "Mode JSON";
      _renderQList();
      _renderActiveForm();
    }
  };

  // Muat Soal
  $("sLoad").onclick = async () => {
    const slug = $("sPack").value, db = window._aDb;
    $("sInfo").textContent = "Memuat...";
    try {
      let loadedItems = [];
      let sourceName = "";
      const d = await getDoc(doc(db, "quiz_packs", slug));
      if (d.exists() && d.data() && Array.isArray(d.data().items)) {
        $("sTitle").value = d.data().title || slug;
        loadedItems = d.data().items;
        sourceName = "Firestore";
      } else {
        const r = await fetch("/" + slug + "/quiz-data.json");
        const j = await r.json();
        $("sTitle").value = slug;
        loadedItems = Array.isArray(j) ? j : [];
        sourceName = "File Lokal (" + loadedItems.length + " soal)";
      }
      _sItems = loadedItems;
      _sIdx = _sItems.length ? 0 : -1;
       window._sItems = _sItems; window._sIdx = _sIdx;
      _syncJson();
      _renderQList();
      _renderActiveForm();
      $("sInfo").textContent = "Dimuat dari " + sourceName + ".";
      if ($("sAuditBox")) $("sAuditBox").classList.add("hidden");
    } catch (e) {
      $("sInfo").textContent = "Gagal muat: " + (e.message || e.code);
    }
  };

  // Simpan ke Firestore
  $("sSave").onclick = async () => {
    try {
      if (_sModeJson) {
        _sItems = JSON.parse($("sJson").value);
         window._sItems = _sItems;
      }
      if (!Array.isArray(_sItems)) throw new Error("Data harus berupa array soal.");
      $("sInfo").textContent = "Menyimpan ke Firestore...";
      await setDoc(doc(window._aDb, "quiz_packs", $("sPack").value), {
        slug: $("sPack").value,
        title: $("sTitle").value || $("sPack").value,
        items: _sItems,
        updatedAt: serverTimestamp(),
        updatedBy: window._aAuth.currentUser.email
      });
      $("sInfo").textContent = "✅ Tersimpan di Firestore (" + _sItems.length + " soal).";
    } catch (e) {
      $("sInfo").textContent = "ERR: " + (e.message || e.code);
    }
  };

  // Auto load paket saat inisialisasi jika ada
  setTimeout(() => {
    if ($("sLoad") && !_sItems.length) $("sLoad").click();
  }, 200);
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
  // Agregat per email dari _q.rows yang SUDAH didedup by _id.
  // Abaikan: tanpa email, tanpa slug (data onboarding lama), skor 0 + secs kosong (latihan kosong/test).
  const seen = new Set(), g = {};
  (_q.rows || []).filter(v => v.done !== false).forEach(v => {
    if (!v._id || seen.has(v._id)) return;
    seen.add(v._id);
    const em = (v.email || "").trim().toLowerCase();
    if (!em || !v.slug) return;
    if (!(v.skor > 0) && !v.secs) return;
    if (!g[em]) g[em] = { n: 0, best: -1, packs: {} };
    const o = g[em]; o.n++;
    if ((v.skor || 0) > o.best) o.best = v.skor || 0;
    o.packs[v.slug] = true;
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
    if (window._aShowTab) window._aShowTab("nilai"); else { const tabBtn = document.querySelector('.tabBtn[data-tab="nilai"]'); if (tabBtn) tabBtn.click(); }
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
// --- Detail per baris: tampilkan cetakan peserta (hasil.html) persis via iframe ---
// Data siswa dikirim via param URL (base64 JSON) agar andal di dalam iframe.
window._aDetail = function (di) {
  const d = (_qDetailRows || [])[di];
  if (!d) return;
  let payload = "";
  try {
    payload = btoa(unescape(encodeURIComponent(JSON.stringify({
      nama: d.name || "-", email: d.email || "", benar: d.benar || 0,
      total: d.total || 0, secs: d.secs || null, at: d.t || Date.now()
    }))));
  } catch (e) {}
  const slug = d.slug || "orimasu-quiz";
  window._aDetailUrl = "/hasil.html?paket=" + encodeURIComponent(slug) + "&preview=admin&d=" + encodeURIComponent(payload);
  $("dSheet").innerHTML = "<iframe src=\"" + window._aDetailUrl + "\" class=\"w-full\" style=\"height:65vh;border:0;background:#fff\" title=\"Lembar hasil\"></iframe>";
  const m = $("dModal"); m.classList.remove("hidden"); m.classList.add("flex");
};
document.addEventListener('DOMContentLoaded', () => {
  const isLocal = ['localhost','127.0.0.1'].includes(location.hostname);
  const btnUploadUrl = document.getElementById('btnUploadUrl');
  if (!isLocal) btnUploadUrl?.remove();
  if (!isLocal) {
    document.getElementById('fImgUrl')?.remove();
    document.getElementById('btnGitPull')?.remove();
  }
  if (btnUploadUrl) {
    btnUploadUrl.addEventListener('click', async () => {
      const q = (window._sItems && window._sIdx != null) ? window._sItems[window._sIdx] : null;
      const imgUrl = (document.getElementById('fImgUrl')?.value || '').trim() || (q && q.link && q.link.trim()) ? (q && q.link && q.link.trim()) : '';
      if (!imgUrl || !/^https?:\/\//i.test(imgUrl)) { alert('Field gambar/link harus berisi link http/https'); return; }
       const noSoal = (window._sIdx != null ? window._sIdx + 1 : 1);
       const targetFileName = (q && q.img) ? q.img.split('/').pop() : ('soal_' + noSoal + '.jpg');
       const folderPath = 'public/basu3-quiz/images/';
       const fullPath = folderPath + targetFileName;
       const db = window._aDb;
       let token = '', repo = 'mswaluyo/sinaujepang';
       try {
         const snap = await getDoc(doc(db, 'settings', 'github'));
         if (snap.exists()) { token = snap.data().token || ''; repo = snap.data().repo || repo; }
       } catch (e) {}
       if (!token) token = prompt('Masukkan GitHub Personal Access Token (repo scope):');
       if (!token) { alert('Token diperlukan. Buka Pengaturan.'); return; }
       btnUploadUrl.disabled = true;
       btnUploadUrl.textContent = 'Mengunggah...';
       try {
         const imgRes = await fetch(imgUrl, { mode: 'cors' });
         if (!imgRes.ok) throw new Error('Gagal fetch gambar: ' + imgRes.status);
         const blob = await imgRes.blob();
         const base64 = await new Promise((resolve, reject) => {
           const reader = new FileReader();
           reader.onloadend = () => resolve(reader.result.split(',')[1]);
           reader.onerror = reject;
           reader.readAsDataURL(blob);
         });
         const putRes = await fetch('https://api.github.com/repos/' + repo + '/contents/' + fullPath, {
           method: 'PUT',
           headers: { 'Authorization': 'token ' + token, 'Content-Type': 'application/json' },
           body: JSON.stringify({ message: 'Upload image ' + targetFileName, content: base64 })
         });
         const putJson = await putRes.json();
         if (putRes.ok) alert('Berhasil upload ke GitHub: ' + (putJson.content && putJson.content.path));
         else alert('Gagal: ' + (putJson.message || putRes.status));
       } catch (e) {
         alert('Gagal: ' + (e.message || e));
       } finally {
         btnUploadUrl.disabled = false;
         btnUploadUrl.textContent = 'Upload dari Link ke GitHub';
       }
    });
  }
  const btnDownloadImg = document.getElementById('btnDownloadImg');
  if (btnDownloadImg) {
    btnDownloadImg.addEventListener('click', async () => {
      const q = (_sItems && _sIdx != null) ? _sItems[_sIdx] : null;
      const url = q ? (q.link || q.img) : '';
      const name = q && q.img ? q.img.split('/').pop() : 'gambar.jpg';
      if (!url) { alert('Tidak ada gambar untuk diunduh.'); return; }
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
      } catch (e) {
        alert('Gagal koneksi ke server lokal.');
      } finally {
        btnGitPull.disabled = false;
        btnGitPull.textContent = 'Sync / Pull Gambar';
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btnSaveBrowse');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const fileInput = document.getElementById('fImgBrowse');
    const file = fileInput?.files?.[0];
    if (!file) { alert('Pilih file gambar dari laptop kamu dulu!'); return; }
    const noSoal = (window._sIdx != null ? window._sIdx + 1 : 1);
    const targetFileName = 'soal_' + noSoal + '.jpg';
    const formData = new FormData();
    formData.append('image', file);
    formData.append('fileName', targetFileName);
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Mengunggah...';
    try {
      const response = await fetch('http://localhost:3000/api/upload-to-github', { method: 'POST', body: formData });
      const result = await response.json();
      if (result.success) {
        alert('Berhasil upload ke GitHub: ' + result.path);
      } else {
        alert('Gagal: ' + (result.error || 'unknown'));
      }
    } catch (err) {
      alert('Gagal koneksi ke server lokal.');
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btnSaveBrowse');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const fileInput = document.getElementById('fImgBrowse');
    const file = fileInput?.files?.[0];
    if (!file) { alert('Pilih file gambar dari laptop kamu dulu!'); return; }
    const noSoal = (window._sIdx != null ? window._sIdx + 1 : 1);
    const targetFileName = 'soal_' + noSoal + '.jpg';
    const folderPath = 'public/basu3-quiz/images/';
    const formData = new FormData();
    formData.append('image', file);
    formData.append('fileName', targetFileName);
    formData.append('folderPath', folderPath);
    try {
      const response = await fetch('http://localhost:3000/api/save-image', { method: 'POST', body: formData });
      const result = await response.json();
      if (result.success) {
        alert('Berhasil! Gambar disimpan ke ' + folderPath + targetFileName);
        location.reload();
      }
    } catch (err) {
      alert('Gagal simpan! Pastikan node server-upload.js berjalan di port 3000.');
    }
  });
});

window._aCloseDetail = function () { const m = $("dModal"); m.classList.add("hidden"); m.classList.remove("flex"); };
window._aOpenDetail = function () { try { window.open(window._aDetailUrl || "/hasil.html", "_blank"); } catch (e) {} };
window._aPrintDetail = function () {
  try {
    const f = $("dSheet").querySelector("iframe");
    if (f && f.contentWindow) { f.contentWindow.focus(); f.contentWindow.print(); return; }
  } catch (e) {}
  window._aOpenDetail();
};
