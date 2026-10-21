import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
const $ = id => document.getElementById(id);
window.$a = $;

// 🔧 FIX: Cek elemen ada dulu sebelum set onclick
(function initAuthButtons() {
  const $aLogin = $("#aLogin");
  if ($aLogin) {
    $aLogin.onclick = async () => {
      $("#aMsg").textContent = "";
      try { await signInWithPopup(window._aAuth, new GoogleAuthProvider()); }
      catch (e) { $("#aMsg").textContent = "Gagal: " + (e.message || e.code); }
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
  if (!u) { showGate(); return; }
  const $aUser = $("#aUser");
  if ($aUser) {
    $aUser.textContent = "Hi, " + (u.displayName || u.email);
    $aUser.classList.remove("hidden");
  }

  const o = $("#aOut"); o.classList.remove("hidden"); o.classList.add("flex");
  runCheck(u).catch(() => {});
});

// Cek keanggotaan admin: custom claim Firebase admin: true ATAU dokumen Firestore admins/{uid}.
async function verifyAdmin(user) {
  // Coba cek custom claim (refresh token dulu)
  try {
    const tok = await user.getIdTokenResult(true);
    if (tok.claims && tok.claims.admin === true) return true;
  } catch (e) { /* lanjut pengechekan dokumen */ }

  // Cek Firestore admins/{uid}
  try {
    const doc = await getDoc(doc(window._aDb, "admins", user.uid));
    return doc.exists();
  } catch (e) {
    return false;
  }
}

// Tampilkan gate, panel, atau pesan sesuai status sesi.
function showGate() { $("#gate").classList.remove("hidden"); $("#panel").classList.add("hidden"); $("#aMsg").textContent = ""; }
function hideGateAndPanel() { $("#gate").classList.add("hidden"); $("#panel").classList.add("hidden"); }
function showPanel() {
  hideGateAndPanel();
  $("#panel").classList.remove("hidden");
  try { window._aShowTab((location.hash || "").replace("#", "") || "nilai", false); } catch (e) {}
  if (window._aInitNilaiBar) window._aInitNilaiBar();
  window._aLoadNilai(true); window._aInitSoal(); window._aLoadAdmins(); if (window._aInitUsers) window._aInitUsers();
}
function setMsg(html) { $("#aMsg").innerHTML = html; }

// Sesi login tapi belum lolos pengechekan admin.
function showNonAdmin(user) {
  hideGateAndPanel();
  const $aUser = $("#aUser");
  if ($aUser) {
    $aUser.textContent = "Hi, " + (user.displayName || user.email);
    $aUser.classList.remove("hidden");
  }
  $("#aOut").classList.remove("hidden"); $("#aOut").classList.add("flex");
  setMsg("&#x26D4; " + (user.email || "akun ini") + " bukan admin. <a href='/' id='aHomeLink'>&#x2190; Kembali ke Beranda</a>");
  const link = $("#aHomeLink");
  if (link) link.onclick = () => location.replace("/");
}

// Jalankan pengechekan per role; kesalahan tetap memberi tombol coba lagi.
async function runCheck(user) {
  try {
    setMsg("Memeriksa izin akses...");
    if (await verifyAdmin(user)) { showPanel(); return true; }
    showNonAdmin(user);
    return false;
  } catch (e) {
    setMsg("Gagal verifikasi: " + (e.message || e.code) + ' <button id="aRetry">Coba lagi</button>');
    const btn = $("#aRetry");
    if (btn) btn.onclick = () => runCheck(user);
    return false;
  }
}
