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
// Navigasi tab via hash URL (#nilai #soal #users #admins) agar tahan reload & bisa dibagikan.
const TABS = ["nilai", "soal", "users", "admins"];
window._aShowTab = function (name, push) {
  if (!TABS.includes(name)) name = "nilai";
  const all = Array.from(document.querySelectorAll(".tabBtn"));
  const btn = document.querySelector('.tabBtn[data-tab="' + name + '"]');
  if (btn) styleTab(btn, all.filter(x => x !== btn));
  TABS.forEach(t => { const s = $("tab-" + t); if (s) s.classList.toggle("hidden", t !== name); });
  try { if (push === false) history.replaceState(null, "", "#" + name); else location.hash = name; } catch (e) {}
  return name;
};
document.querySelectorAll(".tabBtn").forEach(b => b.onclick = () => window._aShowTab(b.dataset.tab));
window.addEventListener("hashchange", () => { try { window._aShowTab((location.hash || "").replace("#", ""), false); } catch (e) {} });
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
    try { window._aShowTab((location.hash || "").replace("#", "") || "nilai", false); } catch (e) {}
    if (window._aInitNilaiBar) window._aInitNilaiBar();
    window._aLoadNilai(true); window._aInitSoal(); window._aLoadAdmins(); if (window._aInitUsers) window._aInitUsers();
  } catch(e) { $("aMsg").textContent = "Gagal verifikasi: " + (e.message||e.code); }
});
