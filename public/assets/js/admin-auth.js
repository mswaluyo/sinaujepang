import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
const $ = id => document.getElementById(id);
window.$a = $;
$("aLogin").onclick = async () => { $("aMsg").textContent = "";
  try { await signInWithPopup(window._aAuth, new GoogleAuthProvider()); }
  catch (e) { $("aMsg").textContent = "Gagal: " + (e.message || e.code); } };
$("aOut").onclick = () => signOut(window._aAuth).then(() => location.reload());
document.querySelectorAll(".tabBtn").forEach(b => b.onclick = () => {
  document.querySelectorAll(".tabBtn").forEach(x => { x.className = "tabBtn bg-white border px-4 py-2 rounded-lg"; });
  b.className = "tabBtn bg-slate-900 text-white px-4 py-2 rounded-lg";
  ["nilai","soal","admins"].forEach(t => $("tab-" + t).classList.toggle("hidden", t !== b.dataset.tab));
});
onAuthStateChanged(window._aAuth, async (u) => {
  if (!u) return;
  $("aUser").textContent = u.email; $("aOut").classList.remove("hidden");
  try {
    const tok = await u.getIdTokenResult(true);
    let ok = tok.claims && tok.claims.admin === true;
    if (!ok) { try { ok = (await getDoc(doc(window._aDb, "admins", u.uid))).exists(); } catch(e){} }
    if (!ok) { $("aMsg").textContent = "⛔ " + u.email + " bukan admin."; await signOut(window._aAuth); return; }
    $("gate").classList.add("hidden"); $("panel").classList.remove("hidden");
    window._aLoadNilai(); window._aInitSoal(); window._aLoadAdmins();
  } catch(e) { $("aMsg").textContent = "Gagal verifikasi: " + (e.message||e.code); }
});
