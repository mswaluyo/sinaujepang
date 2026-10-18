import { collection, getDocs, getDoc, doc, setDoc, deleteDoc, query, orderBy, limit, startAfter, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
const $ = id => document.getElementById(id);
const PACKS = ["aoi-quiz", "basu-quiz", "jinja-quiz", "kagi-quiz", "tamago-quiz", "gakusei-quiz", "magarimasu-quiz"];
const _q = { mode: "ringkas", rows: [], shown: 50, lastDoc: null, done: false, loading: false };
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
function _qLulus(p) {
  return p >= 75 ? "Lulus" : "Belum";
}
window._aLoadNilai = async function (reset) {
  const db = window._aDb;
  if (reset) { _q.rows = []; _q.shown = 50; _q.lastDoc = null; _q.done = false; }
  if (_q.loading || (_q.done && !reset)) { renderNilai(); return; }
  _q.loading = true;
  $("qRows").innerHTML = "<tr><td class='py-4 text-slate-400'>Memuat...</td></tr>";
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
  } catch (e) { $("qRows").innerHTML = "<tr><td>Gagal: " + (e.message || e.code) + "</td></tr>"; }
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
    if (head) head.innerHTML = "<tr><th>Waktu</th><th>Siswa</th><th>Paket</th><th>Soal</th><th>Benar</th><th>Skor</th><th>JFT</th><th>Ujian</th><th>Status</th><th>Detail</th></tr>";
    const g = {};
    listFin.forEach(v => {
      const k = (v.email || "?") + "|" + (v.slug || "?");
      if (!g[k]) g[k] = { name: v.name || "", email: v.email || "", slug: v.slug || "", best: -1, bestBenar: 0, total: v.total || 0, n: 0, last: 0, bestT: 0, bestSecs: null };
      const o = g[k]; o.n++;
      if ((v.skor || 0) > o.best) { o.best = v.skor || 0; o.bestBenar = v.benar || 0; o.total = v.total || o.total; o.bestT = v._t; o.bestSecs = v.secs || null; }
      if (v._t > o.last) { o.last = v._t; o.name = v.name || o.name; }
    });
    window._qLastD = Object.values(g).sort((a, b) => b.best - a.best).slice(0, _q.shown); window._qLastD.forEach((o, _ix) => {
      _qDetailRows.push({ name: o.name, email: o.email, slug: o.slug, benar: o.bestBenar, total: o.total, t: o.bestT || o.last, secs: o.bestSecs });
      const di = _qDetailRows.length - 1;
      html += "<tr><td>" + _qFmt(o.bestT || o.last) + "</td><td>" + o.name + " " + o.email + "</td><td>" + o.slug + "</td><td>" + o.total + "</td><td>" + o.bestBenar + "</td><td>" + o.best + "%</td><td>" + _qJft(o.best) + "</td><td>" + o.n + "x</td><td>" + _qLulus(o.best) + "</td><td><button onclick='window._aDetail(" + di + ")'>detail</button></td></tr>";
    });
    $("qCount").textContent = Object.keys(g).length + " siswa-paket";
  } else {
    if (head) head.innerHTML = "<tr><th>Waktu</th><th>Siswa</th><th>Paket</th><th>Soal</th><th>Benar</th><th>Skor</th><th>JFT</th><th>Hapus</th><th>Detail</th></tr>";
    listFin.sort((a, b) => b._t - a._t).slice(0, _q.shown).forEach(v => {
      _qDetailRows.push({ name: v.name, email: v.email, slug: v.slug, benar: v.benar, total: v.total, t: v._t, secs: v.secs || null });
      const di = _qDetailRows.length - 1;
      html += "<tr><td>" + _qFmt(v._t) + "</td><td>" + (v.name || "") + "</td><td>" + (v.slug || "") + "</td><td>" + (v.total || 0) + "</td><td>" + (v.benar || 0) + "</td><td>" + (v.skor || 0) + "%</td><td>" + _qJft(v.skor || 0) + "</td><td><button data-del='" + v._id + "'>hapus</button></td><td><button onclick='window._aDetail(" + di + ")'>detail</button></td></tr>";
    });
    $("qCount").textContent = listFin.length + " ujian";
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

window._aDetail = function (i) {
  const r = _qDetailRows[i]; if (!r) return;
  const pc = r.benar || 0, tot = r.total || 0;
  const pct = tot ? Math.round(pc / tot * 100) : 0;
  const J = Math.round(10 + (tot ? (pc / tot) * 240 : 0));
  const lv = J >= 200 ? "A2" : J >= 175 ? "A2.1" : J >= 145 ? "A1" : "-";
  const lulus = J >= 200;
  const dt = r.t ? new Date(r.t).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-";
  const SECN = { sec1: "Mojigoi", sec2: "Hyogen", sec3: "Choukai", sec4: "Dokkai" };
  let secsHtml = "";
  ["sec1", "sec2", "sec3", "sec4"].forEach(k => {
    const s = r.secs && r.secs[k]; if (!s) return;
    const p2 = s.total ? Math.round(s.benar / s.total * 100) : 0;
    secsHtml += "<p>" + SECN[k] + ": " + s.benar + "/" + s.total + " (" + p2 + "%)</p>";
  });
  if (!secsHtml) secsHtml = "<p>Rincian seksi tidak tersimpan.</p>";
  const bar = Math.max(0, Math.min(100, ((J - 10) / 240) * 100));
  const JPN = { sec1: "文字と語彙", sec2: "会話と表現", sec3: "聴解", sec4: "読解" };
  const ENG = { sec1: "Script and Vocabulary", sec2: "Conversation and Expression", sec3: "Listening Comprehension", sec4: "Reading Comprehension" };
  let richSecs = "";
  ["sec1","sec2","sec3","sec4"].forEach(k => {
    const s = r.secs && r.secs[k]; if (!s || !s.total) return;
    const p2 = Math.round(s.benar / s.total * 100);
    richSecs += "<div style='margin-bottom:10px'><div style='display:flex;justify-content:space-between;margin-bottom:3px'><span style='font-weight:700;font-size:13px'>"+JPN[k]+"</span><span style='font-size:11px;color:#6b7280'>"+s.benar+"/"+s.total+" <b style='font-size:13px;color:#1f2937'>"+p2+"%</b></span></div><div style='display:flex;align-items:center;gap:8px'><span style='font-size:11px;color:#6b7280;width:170px;flex-shrink:0'>"+ENG[k]+"</span><div style='flex:1;position:relative;height:14px;background:#e5e7eb;border-radius:4px'><div style='position:absolute;top:50%;transform:translateY(-50%);width:12px;height:12px;border-radius:50%;background:#fff;border:2px solid #f97316;left:calc("+p2+"% - 6px)'></div></div></div></div>";
  });
  if (!richSecs) richSecs = "<p style='font-size:12px;color:#6b7280'>Rincian seksi tidak tersimpan pada dokumen lama.</p>";
  const nm = String(r.name || "-").replace(/</g, "&lt;");
  const em2 = String(r.email || "");
  const sl = String(r.slug || "").replace("-quiz","").toUpperCase();
  document.getElementById("dSheet").innerHTML = ""
    + "<div style='display:flex;justify-content:space-between;border-bottom:2px solid #e2e8f0;padding-bottom:12px;margin-bottom:16px'><div><div style='font-size:20px;font-weight:900'>SinauJepang <span style='font-size:11px;color:#94a3b8'>MOGI SHIKEN</span></div><div style='font-size:11px;color:#64748b'>Lembar Hasil Simulasi JFT-Basic (estimasi)</div></div>"
    + "<div style='text-align:right'><div style='font-size:11px;font-weight:700;color:#e11d48;border:2px solid #e11d48;border-radius:6px;padding:2px 12px;display:inline-block;letter-spacing:2px'>SIMULASI</div><div style='font-size:10px;color:#94a3b8;margin-top:4px'>"+dt+"</div></div></div>"
    + "<h1 style='text-align:center;font-weight:700;font-size:16px;margin-bottom:2px'>NOTIFIKASI HASIL <span style='font-weight:400;font-size:12px'>/ Notification of assessment results</span></h1>"
    + "<p style='text-align:center;font-size:11px;color:#64748b;margin-bottom:16px'>Estimasi proporsional 10 + benar/total x 240 - bukan scaled-score resmi.</p>"
    + "<div style='background:#f8fafc;border:1px solid #e2e8f0;padding:12px;margin-bottom:14px;font-size:13px;display:grid;grid-template-columns:1fr 1fr;gap:8px'>"
    + "<div><span style='color:#64748b;font-size:11px'>Nama / Name</span><div style='font-weight:700'>"+nm+"</div><div style='font-size:11px;color:#64748b'>"+em2+"</div></div>"
    + "<div><span style='color:#64748b;font-size:11px'>Paket / Test</span><div style='font-weight:700'>"+sl+"</div></div>"
    + "<div><span style='color:#64748b;font-size:11px'>Tanggal / Date</span><div style='font-weight:700'>"+dt+"</div></div>"
    + "<div><span style='color:#64748b;font-size:11px'>Benar / Correct</span><div style='font-weight:700'>"+pc+" / "+tot+" ("+pct+"%)</div></div></div>"
    + "<div style='border:2px solid #94a3b8;padding:16px;margin-bottom:14px'><div style='display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px'>"
    + "<div><div style='font-weight:700;font-size:13px;color:#334155'>Total Score</div><div style='font-size:34px;font-weight:900'>"+J+"</div></div>"
    + "<div><div style='font-weight:700;font-size:13px;color:#334155'>Range : 10-250</div><div style='font-size:20px;font-weight:800'>"+lv+"</div></div></div>"
    + "<div style='height:10px;border-radius:9999px;background:linear-gradient(to right,#fda4af 0%,#f472b6 46%,#fb923c 62%,#facc15 75%,#a3e635 100%);position:relative;margin:26px 4px 8px'><div style='position:absolute;top:-2px;bottom:-2px;width:2px;background:#1e293b;left:79.1%'></div><div style='position:absolute;top:50%;transform:translate(-50%,-50%);left:"+bar+"%'><span style='position:absolute;bottom:14px;left:50%;transform:translateX(-50%);font-size:12px;font-weight:700;color:#fff;background:#1e293b;padding:2px 8px;border-radius:6px;white-space:nowrap'>"+J+"</span><span style='display:block;width:18px;height:18px;border-radius:50%;background:#fff;border:4px solid #f97316'></span></div></div>"
    + "<div style='display:flex;justify-content:space-between;font-size:10px;color:#64748b'><span>10</span><span>200 LULUS</span><span>250</span></div>"
    + "<div style='text-align:center;margin-top:10px'><span style='display:inline-block;font-weight:800;font-size:15px;padding:6px 26px;border-radius:9999px;background:"+(lulus?"#d1fae5;color:#065f46":"#fee2e2;color:#991b1b")+"'>"+(lulus?"LULUS":"BELUM LULUS")+"</span></div></div>"
    + "<div style='margin-bottom:6px'><div style='font-weight:700;font-size:13px'>Rincian seksi:</div><div style='font-size:11px;color:#64748b'>The percentage of correct answers for each section</div></div>"
    + richSecs;
  const m = document.getElementById("dModal"); m.classList.remove("hidden"); m.classList.add("flex");
};
window._aCsvNilai = function () {
  let csv = "nama,email,paket,soal,benar,skor\n";
  _qDetailRows.forEach(o => { csv += o.name + "," + o.email + "," + o.slug + "," + o.total + "," + o.benar + "\n"; });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = "nilai.csv"; a.click();
};
window._qPrint = function () { window.print(); };
window._aInitSoal = function () {
  $("sPack").innerHTML = PACKS.map(p => "<option>" + p + "</option>").join("");
  $("qGo").onclick = function () { window._aLoadNilai(true); };
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