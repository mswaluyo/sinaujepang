import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
const $ = id => document.getElementById(id);
window.$a = $;
$("aLogin").onclick = async () => { $("aMsg").textContent = "";
  try { await signInWithPopup(window._aAuth, new GoogleAuthProvider()); }
  catch (e) { $("aMsg").textContent = "Gagal: " + (e.message || e.code); } };
$("aOut").onclick = () => signOut(window._aAuth).then(() => location.reload());
function styleTab(active, idle) {
  active.className = "tabBtn bg-fuji-600 hover:bg-fuji-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md transition-all";
  idle.forEach(x => { x.className = "tabBtn bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-full text-sm font-bold transition-all"; });
}
document.querySelectorAll(".tabBtn").forEach(b => b.onclick = () => {
  const all = Array.from(document.querySelectorAll(".tabBtn"));
  styleTab(b, all.filter(x => x !== b));
  ["nilai","soal","admins"].forEach(t => $("tab-" + t).classList.toggle("hidden", t !== b.dataset.tab));
});
onAuthStateChanged(window._aAuth, async (u) => {
  if (!u) return;
  $("aUser").textContent = "Hi, " + (u.displayName || u.email); $("aUser").classList.remove("hidden");
  const o = $("aOut"); o.classList.remove("hidden"); o.classList.add("flex");
  try {
    const tok = await u.getIdTokenResult(true);
    let ok = tok.claims && tok.claims.admin === true;
    if (!ok) { try { ok = (await getDoc(doc(window._aDb, "admins", u.uid))).exists(); } catch(e){} }
    if (!ok) { $("aMsg").textContent = "⛔ " + u.email + " bukan admin."; await signOut(window._aAuth); return; }
    $("gate").classList.add("hidden"); $("panel").classList.remove("hidden");
    if (window._aInitNilaiBar) window._aInitNilaiBar();
    window._aLoadNilai(true); window._aInitSoal(); window._aLoadAdmins();
  } catch(e) { $("aMsg").textContent = "Gagal verifikasi: " + (e.message||e.code); }
});
