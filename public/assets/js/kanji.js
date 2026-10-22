// kanji.js — Kanji Explorer Multi-Layer (Gaya Android / nihongo-course-baru)
// Sumber data tunggal: window.EXPLORER_DATA (explorer-data.js) + /assets/data/kanji-picfilo.json
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // 12 Kategori Android Resmi (Persis seperti di nihongo-course-baru)
  const CATEGORIES = [
    { id: "tubuh_anatomi", title: "Tubuh & Anatomi", icon: "👤", items: ["目", "耳", "口", "鼻", "首", "身", "心", "手", "足", "歯", "自", "尸", "面", "爪", "血", "舌", "骨", "皮", "毛", "肉", "力", "又", "頁"] },
    { id: "manusia_relasi", title: "Manusia & Relasi", icon: "👥", items: ["人", "女", "子", "父", "氏", "大", "小", "老", "臣"] },
    { id: "alam_elemen", title: "Alam & Elemen", icon: "🌿", items: ["日", "月", "夕", "風", "雨", "気", "气", "木", "水", "火", "土", "石", "山", "川", "玄", "冫"] },
    { id: "hewan", title: "Hewan", icon: "🐾", items: ["犬", "牛", "馬", "鳥", "魚", "羊", "虫", "角", "羽", "貝", "豕", "隹"] },
    { id: "tumbuhan", title: "Tumbuhan & Makanan", icon: "🌾", items: ["艸", "禾", "米", "竹", "瓜", "麦", "食"] },
    { id: "bangunan_transportasi", title: "Bangunan & Tempat", icon: "🏠", items: ["門", "宀", "戸", "穴", "里", "邑", "谷", "厂", "广", "囗", "田"] },
    { id: "alat", title: "Alat & Benda", icon: "⚔️", items: ["刀", "金", "糸", "衣", "巾", "斤", "缶", "皿", "矢", "玉", "弓", "斗", "片", "瓦", "革", "韋", "車", "舟", "王", "辰", "匕", "凵", "匚", "弋", "戈"] },
    { id: "aksi", title: "Aksi & Gerak", icon: "🏃", items: ["用", "行", "走", "辵", "辶", "止", "欠", "方", "入", "立", "彳"] },
    { id: "garis", title: "Garis Dasar", icon: "〰️", items: ["一", "丶", "丿", "亅", "丨", "二", "八", "十"] },
    { id: "bentuk", title: "Bentuk & Bingkai", icon: "🔷", items: ["亠", "冂", "厶", "曰", "乙", "攴", "攵", "冖", "凵"] },
    { id: "sifat_keadaan", title: "Sifat & Keadaan", icon: "✨", items: ["見", "飛", "高", "白", "音", "干", "黒", "青", "色", "西", "甘", "香", "文", "言", "寸", "彡", "示"] },
    { id: "semua", title: "Semua Radikal", icon: "🌐", items: [] }
  ];

  // Peta Radikal -> Kategori
  const RAD_TO_CAT = {};
  CATEGORIES.forEach(c => {
    c.items.forEach(r => { RAD_TO_CAT[r] = c.id; });
  });

  // State Aplikasi
  let activeCatId = null;
  let activeRadical = null;
  let activeKanji = null;
  let allKanjiMap = {}; // ch -> { ch, bacaan, arti, vocab, radical }
  let picfiloMap = {};

  // Muat data picfilo secara asinkron
  fetch("/assets/data/kanji-picfilo.json")
    .then(r => r.json())
    .then(list => {
      (list || []).forEach(item => {
        if (item && item.kanji) picfiloMap[item.kanji] = item;
      });
      // Jika saat ini ada kanji aktif yang sedang terbuka, refresh panel penjelasannya
      if (activeKanji) renderPicfilo(activeKanji);
    })
    .catch(() => {});

  // Transisi Navigasi Multi-layer (1, 2, 3)
  function showLayer(layerNum, direction) {
    const layers = [
      $("layer-menu"),
      $("layer-radical"),
      $("layer-kanji")
    ];

    layers.forEach((l, idx) => {
      if (idx + 1 === layerNum) {
        l.classList.remove("hidden", "slide-in", "slide-back");
        l.classList.add("on", direction === "back" ? "slide-back" : "slide-in");
      } else {
        l.classList.remove("on", "slide-in", "slide-back");
        l.classList.add("hidden");
      }
    });

    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {}
  }

  window._jBack = function (targetLayer) {
    if (targetLayer === 1) {
      activeCatId = null;
      activeRadical = null;
      activeKanji = null;
      showLayer(1, "back");
    } else if (targetLayer === 2) {
      activeKanji = null;
      showLayer(2, "back");
    }
  };

  // Helper Kategori Radikal
  function getCategoryOfRadical(rad) {
    if (RAD_TO_CAT[rad]) return RAD_TO_CAT[rad];
    // Fallback pencocokan karakter varian
    if (rad === "辶") return "aksi";
    if (rad === "艹") return "tumbuhan";
    if (rad === "氵") return "alam_elemen";
    if (rad === "扌") return "tubuh_anatomi";
    if (rad === "亻") return "manusia_relasi";
    if (rad === "宀") return "bangunan_transportasi";
    if (rad === "言") return "sifat_keadaan";
    return "semua";
  }

  // LAYER 1: Render Menu Kategori
  function renderCategories() {
    const expData = window.EXPLORER_DATA || {};
    const totalRadicals = Object.keys(expData).length;
    $("jCount").textContent = totalRadicals + " radikal";

    const catCounts = {};
    Object.keys(expData).forEach(rad => {
      const cat = getCategoryOfRadical(rad);
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    });

    const catsContainer = $("jCats");
    catsContainer.innerHTML = CATEGORIES.map(cat => {
      const count = cat.id === "semua" ? totalRadicals : (catCounts[cat.id] || 0);
      if (cat.id !== "semua" && count === 0) return "";

      return `<button data-cat="${cat.id}" class="rad-cat-card">
        <span class="text-2xl">${cat.icon}</span>
        <div class="flex-1 min-w-0">
          <span class="rad-cat-title">${cat.title}</span>
          <span class="rad-cat-count">${count} radikal</span>
        </div>
        <i class="fa-solid fa-chevron-right text-slate-300 text-xs"></i>
      </button>`;
    }).join("");

    catsContainer.querySelectorAll("[data-cat]").forEach(btn => {
      btn.onclick = () => openCategory(btn.getAttribute("data-cat"));
    });
  }

  // LAYER 2: Buka Kategori & Render Pill Radikal
  function openCategory(catId) {
    activeCatId = catId;
    activeRadical = null;
    activeKanji = null;

    const cat = CATEGORIES.find(c => c.id === catId) || { title: "Radikal", icon: "🧩" };
    $("jCatTitle").innerHTML = `${cat.icon} <span>${cat.title}</span>`;

    const expData = window.EXPLORER_DATA || {};
    let radList = [];

    if (catId === "semua") {
      radList = Object.keys(expData).sort((a, b) => a.localeCompare(b, "ja"));
    } else {
      // Prioritaskan urutan items pada kategori
      const wanted = new Set(cat.items || []);
      const matched = Object.keys(expData).filter(r => wanted.has(r) || getCategoryOfRadical(r) === catId);
      radList = matched.sort((a, b) => {
        const ia = cat.items.indexOf(a);
        const ib = cat.items.indexOf(b);
        if (ia !== -1 && ib !== -1) return ia - ib;
        if (ia !== -1) return -1;
        if (ib !== -1) return 1;
        return a.localeCompare(b, "ja");
      });
    }

    $("jRadCount").textContent = `${radList.length} radikal`;

    const radContainer = $("jRads");
    if (!radList.length) {
      radContainer.innerHTML = "<p class='col-span-full text-center text-slate-400 py-8 text-xs'>Tidak ada radikal dalam kategori ini.</p>";
    } else {
      radContainer.innerHTML = radList.map(r => {
        const d = expData[r] || { kana: "", romaji: "", arti: "", kanji: [] };
        const kCount = (d.kanji || []).length;

        return `<button type="button" class="rad-pill" data-rad="${esc(r)}">
          <span class="rad-count">${kCount}</span>
          <span class="rad-ch">${esc(r)}</span>
          <span class="rad-kana">${esc(d.kana || "—")}</span>
          <span class="rad-romaji">${esc(d.romaji || "—")}</span>
          <span class="rad-arti" title="${esc(d.arti || "")}">${esc(d.arti || "&nbsp;")}</span>
        </button>`;
      }).join("");

      radContainer.querySelectorAll("[data-rad]").forEach(btn => {
        btn.onclick = () => openRadical(btn.getAttribute("data-rad"));
      });
    }

    showLayer(2, "forward");
  }

  // LAYER 3: Buka Radikal & Render Detail Kanji
  function openRadical(rad) {
    activeRadical = rad;
    const expData = window.EXPLORER_DATA || {};
    const d = expData[rad] || { kana: "", romaji: "", arti: "", kanji: [] };

    $("jBackRadLabel").textContent = `${rad} (${d.arti || "Radikal"})`;
    $("jRadBadge").textContent = `Radikal ${rad} · ${d.arti || ""}`;

    const kanjiList = (d.kanji || []);
    $("jTurunanCount").textContent = `${kanjiList.length} kanji turunan`;

    // Render Chip Grid Kanji
    const gridContainer = $("kanji-grid");
    if (!kanjiList.length) {
      gridContainer.innerHTML = "<span class='text-xs text-slate-400'>Belum ada kanji terdaftar.</span>";
    } else {
      gridContainer.innerHTML = kanjiList.map(k => {
        return `<button type="button" class="kanji-chip" data-k="${esc(k.ch)}" title="${esc(k.arti || "")}">
          ${esc(k.ch)}
        </button>`;
      }).join("");

      gridContainer.querySelectorAll("[data-k]").forEach(btn => {
        btn.onclick = () => selectKanji(btn.getAttribute("data-k"));
      });
    }

    // Buka kanji pertama secara otomatis jika ada
    if (kanjiList.length > 0) {
      selectKanji(kanjiList[0].ch);
    } else {
      activeKanji = null;
      $("kanji-display").textContent = rad;
      $("meaning-display").textContent = d.arti || "—";
      $("picfilo-content").innerHTML = "<p class='text-slate-400 text-xs'>Tidak ada data kanji.</p>";
      $("vocab-list").innerHTML = "";
    }

    showLayer(3, "forward");
  }

  // Pilih & Tampilkan Detail Kanji
  function selectKanji(ch) {
    activeKanji = ch;

    // Update active state pada chip grid
    document.querySelectorAll("#kanji-grid .kanji-chip").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-k") === ch);
    });

    const expData = window.EXPLORER_DATA || {};
    let kanjiObj = null;

    // Cari di radikal aktif terlebih dahulu
    if (activeRadical && expData[activeRadical]) {
      kanjiObj = (expData[activeRadical].kanji || []).find(k => k.ch === ch);
    }
    // Jika belum ketemu, cari di seluruh database
    if (!kanjiObj) {
      kanjiObj = allKanjiMap[ch] || { ch, bacaan: "", arti: "", vocab: [] };
    }

    $("kanji-display").textContent = ch;
    $("meaning-display").innerHTML = `${esc(kanjiObj.arti || "—")}${kanjiObj.bacaan ? ` <span class="font-normal text-xs text-slate-500">(${esc(kanjiObj.bacaan)})</span>` : ""}`;

    // Render Piktograf & Filosofi
    renderPicfilo(ch);

    // Render Kosakata Terkait
    renderVocab(kanjiObj.vocab || [], ch);
  }

  // Render Piktograf & Filosofi dari kanji-picfilo.json
  function renderPicfilo(ch) {
    const info = picfiloMap[ch];
    const box = $("picfilo-content");
    if (!info || (!info.pic && !info.filo)) {
      box.innerHTML = `<p class="text-slate-500 text-xs italic">Karakter dasar atau piktograf filosofi belum tercatat untuk kanji ${esc(ch)}.</p>`;
      return;
    }

    box.innerHTML = `
      <div class="space-y-1.5">
        ${info.pic ? `<p><strong class="text-emerald-800">Bentuk Piktograf:</strong> ${esc(info.pic)}</p>` : ""}
        ${info.filo ? `<p><strong class="text-emerald-800">Filosofi / Logika:</strong> ${esc(info.filo)}</p>` : ""}
      </div>
    `;
  }

  // Render Daftar Kosakata dengan Pewarnaan Kanji
  function renderVocab(vocabList, currentCh) {
    const container = $("vocab-list");
    $("vocab-count").textContent = `${vocabList.length} kata`;

    if (!vocabList || !vocabList.length) {
      container.innerHTML = "<p class='text-slate-400 text-xs py-2'>Belum ada kosakata tertaut pada materi latihan.</p>";
      return;
    }

    container.innerHTML = vocabList.map(item => {
      // Pewarnaan token kanji:
      // k-target (biru): kanji yang sedang aktif
      // k-other (oranye): kanji lain yang ada dalam bank database
      // normal: hiragana/katakana/simbol
      let coloredWord = "";
      const rawWord = String(item.k || "");

      for (let i = 0; i < rawWord.length; i++) {
        const c = rawWord[i];
        if (c === currentCh) {
          coloredWord += `<span class="k-target">${esc(c)}</span>`;
        } else if (/[一-鿿々〆]/.test(c)) {
          const isKnown = allKanjiMap[c] != null;
          coloredWord += `<span class="${isKnown ? "k-other" : "k-out"}">${esc(c)}</span>`;
        } else {
          coloredWord += esc(c);
        }
      }

      return `<div class="bg-white border border-slate-200 rounded-xl p-3 shadow-xs hover:border-fuji-300 transition-all flex flex-wrap items-baseline gap-x-2">
        <span class="font-bold text-slate-800 text-base">${coloredWord}</span>
        <span class="text-xs font-bold text-fuji-600">${esc(item.kana || "")}</span>
        <span class="text-xs text-slate-400 italic">(${esc(item.rom || "")})</span>
        <span class="text-xs text-slate-700 font-medium">= ${esc(item.a || "")}</span>
        ${item.asal ? `<span class="text-[10px] text-slate-400 w-full mt-0.5"><i class="fa-solid fa-tag text-[9px] mr-1"></i>${esc(item.asal)}</span>` : ""}
      </div>`;
    }).join("");
  }

  // Toggle Piktograf saat klik kanji besar
  $("kanji-display").onclick = () => {
    const panel = $("panel-kanji");
    if (panel) {
      panel.classList.toggle("hidden");
    }
  };

  // Pencarian Cepat Kanji
  $("jCari").oninput = () => {
    clearTimeout(window._searchTimer);
    window._searchTimer = setTimeout(() => {
      const q = $("jCari").value.trim().toLowerCase();
      const searchGrid = $("jSearchGrid");
      if (!q) {
        searchGrid.classList.add("hidden");
        searchGrid.innerHTML = "";
        return;
      }

      const results = Object.values(allKanjiMap).filter(k => {
        const chMatch = k.ch.toLowerCase().includes(q);
        const readMatch = (k.bacaan || "").toLowerCase().includes(q);
        const meanMatch = (k.arti || "").toLowerCase().includes(q);
        const vocabMatch = (k.vocab || []).some(v => (v.k || "").includes(q) || (v.kana || "").includes(q) || (v.a || "").toLowerCase().includes(q));
        return chMatch || readMatch || meanMatch || vocabMatch;
      }).slice(0, 32);

      searchGrid.classList.remove("hidden");
      if (!results.length) {
        searchGrid.innerHTML = "<p class='col-span-full text-center text-slate-400 text-xs py-2'>Tidak ada kanji yang cocok.</p>";
      } else {
        searchGrid.innerHTML = results.map(k => {
          return `<button type="button" class="kanji-chip" data-search-k="${esc(k.ch)}" title="${esc(k.arti || "")}">
            ${esc(k.ch)}
          </button>`;
        }).join("");

        searchGrid.querySelectorAll("[data-search-k]").forEach(btn => {
          btn.onclick = () => {
            const ch = btn.getAttribute("data-search-k");
            const info = allKanjiMap[ch];
            if (info && info.radical) {
              activeRadical = info.radical;
              openRadical(info.radical);
              selectKanji(ch);
            }
          };
        });
      }
    }, 250);
  };

  // Inisialisasi: Indeks Semua Kanji dari EXPLORER_DATA
  function init() {
    const expData = window.EXPLORER_DATA || {};
    allKanjiMap = {};

    Object.entries(expData).forEach(([rad, rObj]) => {
      (rObj.kanji || []).forEach(k => {
        allKanjiMap[k.ch] = {
          ch: k.ch,
          bacaan: k.bacaan || "",
          arti: k.arti || "",
          vocab: k.vocab || [],
          radical: rad
        };
      });
    });

    renderCategories();
    showLayer(1);
  }

  // Jalankan saat DOM siap
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
