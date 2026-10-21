import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
const $ = id => document.getElementById(id);
window.$a = $;

// 🔧 FIX: Cek elemen ada dulu sebelum set onclick
(function initAuthButtons() {
  const $aLogin = $("#aLogin");
  if ($aLogin) {
    $aLogin.onclick = async () => {
      try { await signInWithPopup(window._aAuth, new GoogleAuthProvider()); }
      catch (e) { /* error handled by redirect */ }
    };
  }

  const $aOut = $("#aOut");
  if ($aOut) {
    $aOut.onclick = () => signOut(window._aAuth).then(() => location.reload());
  }

  const $aHomeLink = $("#aHomeLink");
  if ($aHomeLink) {
    $aHomeLink.onclick = () => location.replace("/");
  }
})();

function styleTab(active, idle) { active.className = "tabBtn bg-fuji-600 hover:bg-fuji-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md transition-all"; idle.forEach(x => { x.className = "tabBtn bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-full text-sm font-bold transition-all"; }); }
// Navigasi tab via hash URL (#nilai #soal #users #admins) agar tahan reload & bisa dibagikan.
const TABS = ["nilai", "soal", "users", "admins"];
window._aShowTab = function (name, push) {
  if (!TABS.includes(name)) name = "nilai";
  const all = Array.from(document.querySelectorAll(".tabBtn"));
  const btn = document.querySelector('.tabBtn[data-tab="' + name + '"]');
  if (btn) styleTab(btn, all.filter(x => x !== btn));
  TABS.forEach(t => { const s = $("#tab-" + t); if (s) s.classList.toggle("hidden", t !== name); });
  try { if (push === false) history.replaceState(null, "", "#" + name); else location.hash = name; } catch (e) {}
  return name;
};
document.querySelectorAll(".tabBtn").forEach(b => b.onclick = () => window._aShowTab(b.dataset.tab));
window.addEventListener("hashchange", () => { try { window._aShowTab((location.hash || "").replace("#", ""), false); } catch (e) {} });
onAuthStateChanged(window._aAuth, async (u) => {
  console.log("onAuthStateChanged:", u ? "user found" : "no user", new Date().toISOString());
  if (!u) { 
    window.location.href = "/login.html?redirect=admin";
    return;
  }
  const $aUser = $("#aUser");
  if ($aUser) {
    $aUser.textContent = "Hi, " + (u.displayName || u.email);
    $aUser.classList.remove("hidden");
  }

  const o = $("#aOut");
  if (o) {
    o.classList.remove("hidden"); 
    o.classList.add("flex");
  }
  console.log("runCheck started");
  const result = await runCheck(u);
  console.log("runCheck finished:", result);
});

// Cek keanggotaan admin: custom claim Firebase admin: true ATAU dokumen Firestore admins/{uid}.
async function verifyAdmin(user) {
  // Coba cek custom claim (force refresh token dulu)
  try {
    const tok = await user.getIdTokenResult(true);
    console.log("Custom claim check:", tok.claims);
    if (tok.claims && tok.claims.admin === true) return true;
    else console.warn("Custom claim admin: false. Refresh token...");

    // Coba refresh token sekali lagi
    const tok2 = await user.getIdTokenResult(true);
    if (tok2.claims && tok2.claims.admin === true) return true;
  } catch (e) {
    console.warn("Custom claim check failed:", e.message);
  }

  // Cek Firestore admins/{uid}
  try {
    const doc = await getDoc(doc(window._aDb, "admins", user.uid));
    console.log("Firestore admin doc:", doc.exists() ? "found" : "not found");
    return doc.exists();
  } catch (e) {
    console.error("Firestore admin check failed:", e.message);
    return false;
  }
}

function hideGateAndPanel() { $("#gate").classList.add("hidden"); $("#panel").classList.add("hidden"); }
function showPanel() {
  hideGateAndPanel();
  $("#panel").classList.remove("hidden");
  try { window._aShowTab((location.hash || "").replace("#", "") || "nilai", false); } catch (e) {}
  if (window._aInitNilaiBar) window._aInitNilaiBar();
  window._aLoadNilai(true); window._aInitSoal(); window._aLoadAdmins(); if (window._aInitUsers) window._aInitUsers();
}

// Jalankan pengechekan per role; kesalahan tetap memberi tombol coba lagi.
async function runCheck(user) {
  try {
    if (await verifyAdmin(user)) { showPanel(); return true; }
    window.location.href = "/login.html?redirect=admin";
    return false;
  } catch (e) {
    window.location.href = "/login.html?redirect=admin";
    return false;
  }
}
