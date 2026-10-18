import { collection, getDocs, getDoc, doc, setDoc, deleteDoc, query, orderBy, limit, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
const $ = id => document.getElementById(id);
const PACKS = ["aoi-quiz", "basu-quiz", "jinja-quiz", "kagi-quiz", "tamago-quiz"];
window._aLoadNilai = async function () {
  const em = $("qEmail").value.trim();
  $("qRows").innerHTML = "<tr><td class='py-4 text-slate-400'>Memuat...</td></tr>";
  const db = window._aDb;
  try {
    let snap;
    try { snap = await getDocs(query(collection(db, "attempts"), orderBy("createdAt", "desc"), limit(100))); }
    catch (e) { snap = await getDocs(query(collection(db, "attempts"), limit(100))); }
    let rows = [];
    snap.forEach(d => { const v = d.data() || {};
      if (em && !(v.email || "").toLowerCase().includes(em.toLowerCase())) return;
      let t = "-";
      try { t = v.createdAt && v.createdAt.toDate ? v.createdAt.toDate().toLocaleString("id-ID") : (v.at ? new Date(v.at).toLocaleString("id-ID") : "-"); } catch (e) {}
      rows.push("<tr class='border-b'><td class='py-2 pr-2'>" + t + "</td><td class='pr-2'>" + (v.name || "") + "</td><td class='pr-2'>" + (v.email || "") + "</td><td class='pr-2 font-bold'>" + (v.slug || "") + "</td><td class='pr-2'>" + (v.benar || 0) + "/" + (v.total || 0) + "</td><td class='pr-2 font-bold'>" + (v.skor || 0) + "</td><td><button data-del='" + d.id + "' class='text-rose-600'>hapus</button></td></tr>");
    });
    $("qRows").innerHTML = rows.join("") || "<tr><td class='py-4 text-slate-400'>Kosong.</td></tr>";
    $("qCount").textContent = rows.length + " baris";
    $("qRows").querySelectorAll("[data-del]").forEach(b => b.onclick = async () => {
      if (!confirm("Hapus?")) return;
      await deleteDoc(doc(db, "attempts", b.dataset.del)); window._aLoadNilai();
    });
  } catch (e) { $("qRows").innerHTML = "<tr><td class='text-rose-600'>Gagal: " + (e.message || e.code) + "</td></tr>"; }
};
window._aInitSoal = function () {
  $("sPack").innerHTML = PACKS.map(p => "<option>" + p + "</option>").join("");
  $("qGo").onclick = window._aLoadNilai;
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
