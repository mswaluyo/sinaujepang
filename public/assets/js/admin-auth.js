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
// Sembunyikan tab Pengaturan di hosting (hanya localhost)
if (!['localhost','127.0.0.1'].includes(location.hostname)) {
  document.querySelector('.tabBtn[data-tab="pengaturan"]')?.remove();
  document.getElementById('tab-pengaturan')?.remove();
const TABS = ["nilai", "soal", "import", "users", "admins", "pengaturan"];
}
window._aShowTab = function (name, push) {
  if (!TABS.includes(name)) name = "nilai";
  const all = Array.from(document.querySelectorAll(".tabBtn"));
  const btn = document.querySelector('.tabBtn[data-tab="' + name + '"]');
  if (btn) styleTab(btn, all.filter(x => x !== btn));
  
  TABS.forEach(t => { 
    const s = document.getElementById("tab-" + t); 
    if (s) {
      if (t === name) {
        s.classList.remove("hidden");
        s.style.display = "block";
      } else {
        s.classList.add("hidden");
        s.style.display = "none";
      }
    }
  });

  // Panggil loader data sesuai tab yang dipilih
  try {
    if (name === "nilai" && window._aLoadNilai) window._aLoadNilai();
    else if (name === "soal" && window._aInitSoal) window._aInitSoal();
    else if (name === "users" && window._aInitUsers) window._aInitUsers();
    else if (name === "admins" && window._aLoadAdmins) window._aLoadAdmins();
  } catch (e) {
    console.error("Tab load error:", e);
  }

  try { if (push === false) history.replaceState(null, "", "#" + name); else location.hash = name; } catch (e) {}
  return name;
};

// Event delegation agar klik tombol tab PASTI terdeteksi
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".tabBtn");
  if (btn && btn.dataset && btn.dataset.tab) {
    e.preventDefault();
    if (btn.dataset.tab === "import") {
      // Halaman import adalah single-page terpisah (parser MHTML client-side)
      window.open("/import.html", "_blank");
      return;
    }
    console.log("[Tab Clicked]:", btn.dataset.tab);
    window._aShowTab(btn.dataset.tab);
  }
});

window.addEventListener("hashchange", () => { 
  try { 
    const h = (location.hash || "").replace("#", "");
    if (h) window._aShowTab(h, false); 
  } catch (e) {} 
});
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
    const adminSnap = await getDoc(doc(window._aDb, "admins", user.uid));
    console.log("Firestore admin doc:", adminSnap.exists() ? "found" : "not found");
    return adminSnap.exists();
  } catch (e) {
    console.error("Firestore admin check failed:", e.message);
    return false;
  }
}

function hideGateAndPanel() { 
  const g = $("#gate"); if (g) g.classList.add("hidden"); 
}
function showPanel() {
  hideGateAndPanel();
  const p = $("#panel"); 
  if (p) p.classList.remove("hidden");
  
  const initialTab = (location.hash || "").replace("#", "") || "nilai";
  try { window._aShowTab(initialTab, false); } catch (e) { console.error("Tab error:", e); }
}

// Jalankan pengechekan per role; kesalahan tetap memberi tombol coba lagi.
async function runCheck(user) {
  let isAdmin = false;
  try {
    isAdmin = await verifyAdmin(user);
  } catch (e) {
    console.error("verifyAdmin threw error:", e);
  }

  if (isAdmin) { 
    try {
      showPanel(); 
    } catch (e) {
      console.error("showPanel threw error:", e);
    }
    return true; 
  }

  console.warn("User bukan admin, mengarahkan ke login...");
  alert("Akun Anda (" + (user.email || user.uid) + ") belum terverifikasi sebagai Admin.");
  window.location.href = "/login.html?redirect=admin";
  return false;
}
