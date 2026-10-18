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
function renderNilai() {
  const slug = ($("qSlug") || {}).value || "", em = (($("qEmail") || {}).value || "").trim().toLowerCase();
  _q.mode = ($("qMode") || {}).value || "ringkas";
  let list = _q.rows.filter(v => (!slug || v.slug === slug) && (!em || ((v.email || "").toLowerCase().includes(em) || (v.name || "").toLowerCase().includes(em))));
  let html = "";
  const head = $("qHead");
  if (_q.mode === "ringkas") {
    if (head) head.innerHTML = "<tr class='text-left text-slate-500 border-b'><th class='py-2 pr-2'>Siswa</th><th class='pr-2'>Paket</th><th class='pr-2'>Skor Terbaik</th><th class='pr-2'>Benar</th><th class='pr-2'>Percobaan</th><th class='pr-2'>Terakhir</th><th>Status</th></tr>";
    // 1 baris per siswa+paket: nilai TERBAIK + percobaan terakhir
    const g = {};
    list.forEach(v => {
      const k = (v.email || "?") + "|" + (v.slug || "?");
      if (!g[k]) g[k] = { name: v.name || "", email: v.email || "", slug: v.slug || "", best: 0, bestBenar: 0, total: v.total || 0, n: 0, last: 0, ids: [] };
      const o = g[k]; o.n++; o.ids.push(v._id);
      if ((v.skor || 0) >= o.best) { o.best = v.skor || 0; o.bestBenar = v.benar || 0; o.total = v.total || o.total; }
      if (v._t > o.last) { o.last = v._t; o.name = v.name || o.name; }
    });
    const arr = Object.values(g).sort((a, b) => b.best - a.best).slice(0, _q.shown);
    arr.forEach(o => {
      const lulus = o.best >= 80 ? "<span class='bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full'>Lulus</span>" : "<span class='bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full'>Belum</span>";
      html += "<tr class='border-b'><td class='py-2 pr-2'>" + (o.name || "").replace(/</g, "&lt;") + "<div class='text-slate-400'>" + (o.email || "") + "</div></td><td class='pr-2 font-bold'>" + o.slug + "</td><td class='pr-2 font-black text-fuji-700'>" + o.best + "</td><td class='pr-2'>" + o.bestBenar + "/" + o.total + "</td><td class='pr-2'>" + o.n + "x</td><td class='pr-2'>" + _qFmt(o.last) + "</td><td>" + lulus + "</td></tr>";
    });
    $("qCount").textContent = Object.keys(g).length + " siswa-paket • " + _q.rows.length + " percobaan dimuat";
  } else {
    if (head) head.innerHTML = "<tr class='text-left text-slate-500 border-b'><th class='py-2 pr-2'>Waktu</th><th class='pr-2'>Siswa</th><th class='pr-2'>Paket</th><th class='pr-2'>Skor</th><th></th></tr>";
    const arr = list.sort((a, b) => b._t - a._t).slice(0, _q.shown);
    arr.forEach(v => {
      html += "<tr class='border-b'><td class='py-2 pr-2 whitespace-nowrap'>" + _qFmt(v._t) + "</td><td class='pr-2'>" + ((v.name || "").replace(/</g, "&lt;")) + "<div class='text-slate-400'>" + (v.email || "") + "</div></td><td class='pr-2 font-bold'>" + (v.slug || "") + "</td><td class='pr-2 font-black'>" + (v.skor || 0) + "</td><td><button data-del='" + v._id + "' class='text-rose-600 hover:underline'>hapus</button></td></tr>";
    });
    $("qCount").textContent = list.length + " cocok • " + _q.rows.length + " dimuat";
  }
  $("qRows").innerHTML = html || "<tr><td class='py-4 text-slate-400'>Kosong.</td></tr>";
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
  let list = _q.rows.filter(v => (!slug || v.slug === slug) && (!em || ((v.email || "").toLowerCase().includes(em) || (v.name || "").toLowerCase().includes(em))));
  let csv = mode === "ringkas" ? "nama,email,paket,skor_terbaik,benar,total,percobaan,terakhir\n" : "waktu,nama,email,paket,benar,total,skor\n";
  if (mode === "ringkas") {
    const g = {};
    list.forEach(v => { const k = (v.email || "?") + "|" + (v.slug || "?"); if (!g[k]) g[k] = { name: v.name || "", email: v.email || "", slug: v.slug || "", best: 0, bestBenar: 0, total: 0, n: 0, last: 0 }; const o = g[k]; o.n++; if ((v.skor || 0) >= o.best) { o.best = v.skor || 0; o.bestBenar = v.benar || 0; o.total = v.total || o.total; } if (v._t > o.last) { o.last = v._t; o.name = v.name || o.name; } });
    Object.values(g).sort((a, b) => b.best - a.best).forEach(o => { csv += '"' + (o.name || "").replace(/"/g, '""') + '","' + o.email + '","' + o.slug + '",' + o.best + ',' + o.bestBenar + ',' + o.total + ',' + o.n + ',"' + new Date(o.last).toLocaleString("id-ID") + '"\n'; });
  } else {
    list.sort((a, b) => b._t - a._t).forEach(v => { csv += '"' + new Date(v._t).toLocaleString("id-ID") + '","' + ((v.name || "").replace(/"/g, '""')) + '","' + (v.email || "") + '","' + (v.slug || "") + '",' + (v.benar || 0) + ',' + (v.total || 0) + ',' + (v.skor || 0) + '\n'; });
  }
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv" })); a.download = "nilai-" + (slug || "semua") + ".csv"; a.click();
};
window._aInitNilaiBar = function () {
  $("qGo").onclick = () => window._aLoadNilai(true);
  $("qMore").onclick = window._aMoreNilai;
  $("qCsv").onclick = window._aCsvNilai;
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
