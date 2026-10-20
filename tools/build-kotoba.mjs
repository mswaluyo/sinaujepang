// tools/build-kotoba.mjs — saring kotoba DASAR dari kosakata.json -> public/assets/js/kotoba-data.js
// Kotoba dasar = 1 kata (tanpa spasi) + frasa pendek <= 3 kata tanpa pola kalimat
// (tanpa です/ます/ください/ましょう/ desu/masu/kudasai, tanpa angka, tanpa tanda baca kalimat).
// Jalankan: node tools/build-kotoba.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, "..");
const src = JSON.parse(fs.readFileSync(path.join(ROOT, "public", "kosakata.json"), "utf8"));
const KALIMAT = /(です|ます|ください|ましょう|ませんか|たいです|ほしい|なくて|なくちゃ|なさい|しなさい|[。、？！?.!])/;
let buangKalimat = 0, buangAngka = 0;
const out = [];
const KAL = /(です|ください|ましょう|ませんか|たいです|ほしい|なくて|なくちゃ|なさい|しなさい|[。、？！?.!])/;
const isMasuKana = k => /(ます|ません|ましょう)$/.test(k);
const isMashitaKana = k => /(ました|ませんでした)$/.test(k);
// CATATAN: bentuk -te/-de tidak lagi dihitung verba (aturan akhiran で terlalu longgar,
// menangkap sapaan & frasa). Hanya -masu kini + -mashita lampau.
const isAdjIKana = k => /い$/.test(k) && k.length >= 3 && !/(ます|です|さい|かいもの|でんき|びょうき|くすり|はし|かみ|つき|やま|かわ|うみ|さかな|たまご|こども|おとこ|おんな|ともだち|せんせい|がくせい|かいしゃ|でんしゃ|くるま|じてんしゃ|ひこうき|とけい|かぎ|かさ|くつ|ぼうし|しゃしん|てがみ|しんぶん|ざっし|ほん|かばん|つくえ|いす|ドア|まど|へや|トイレ|シャワー|エレベーター|エスカレーター|テレビ|ラジオ|パソコン|カメラ|ビデオ|プール|コート|グラウンド|レストラン|ホテル|デパート|コンビニ|スーパー|ぎんこう|びょういん|ゆうびんきょく|としょかん|こうえん|どうぶつえん|がっこう|だいがく|きょうかい|じんじゃ|おてら|いえ|えき|きかい)$/.test(k);
const isAdjNaKana = k => /(てき|ゆうめい|べんり|しずか|にぎやか|ひま|じょうぶ|あんぜん|かんたん|しんせつ|げんき|ゆうき|きれい|すてき|べんきょう|そうじ|せんたく|りょうり|しょくじ|さんぽ|うんどう|しごと|やすみ|びょうき|けが|じこ|じしん|たいふう|こうずい)$/.test(k) || /な$/.test(k);
for (const e of (src.data || [])) {
  const kata = (e.kanji || e.kana || "").trim();
  const kana = (e.kana || "").trim();
  const arti = (e.arti || "").trim();
  if (!kata || !arti) continue;
  if (!/^[぀-ヿ一-鿿々〆]/.test(kata)) { buangKalimat++; continue; }
  if (/salah eja|bukan kata baku|pengecoh|keliru|bentuk salah|bunyi keliru/i.test(arti)) { buangKalimat++; continue; }
  // Wajib murni Jepang: kata & kana tanpa huruf latin/angka (buang "pictures", "gambar 2", dsb)
  if (/[a-zA-Z0-9]/.test(kata)) { buangKalimat++; continue; }
  if (/[a-zA-Z0-9]/.test(kana)) { buangKalimat++; continue; }
  if (/pictures|gambar|photo|image/i.test(arti + " " + kana)) { buangKalimat++; continue; }
  const nKata = kata.split(/\s+/).filter(Boolean).length;
  // Verba -masu/-masen/-mashou (kini) + -mashita (lampau): IZINKAN
  const vMasu = isMasuKana(kana) || isMasuKana(kata);
  const vPast = !vMasu && (isMashitaKana(kana) || isMashitaKana(kata));
  // Verba bentuk kamus: akhiran -ru khas verba DAN arti berupa kerja (me-/ber-/men-)
  // — agar あかい/あたたかい (sifat) dan あたま (benda) tidak ikut
  const vDict = !vMasu && !vPast && /(える|いる|うる|おる|きる|ぎる|しる|じる|ちる|にる|ひる|びる|みる|ける|げる|せる|ぜる|てる|でる|ねる|へる|べる|める|れる)$/.test(kana)
    && /^(me|ber|men|di|ter)[a-z]/i.test(arti);
  // Adjektiva-i: IZINKAN walau 1 kata berakhiran い (kecuali kata benda umum)
  const aI = !vMasu && !vPast && !vDict && (isAdjIKana(kana) || isAdjIKana(kata));
  const aNa = !vMasu && !vPast && !vDict && !aI && (isAdjNaKana(kana) || isAdjNaKana(kata));
  const isWord = vMasu || vPast || vDict || aI || aNa;
  // Selain kata kerja/sifat: buang kalimat, angka/waktu, frasa panjang.
  // Nomina 2 kata (mis. "3 年", "ホテル さくら") DIIZINKAN masuk agar bisa dipecah
  // jadi kata tunggal di bawah; frasa 3-4 kata tetap dibuang.
  if (!isWord) {
    if (KAL.test(kata) || KAL.test(kana)) { buangKalimat++; continue; }
    if (nKata > 2) { buangKalimat++; continue; }
    if (/[0-9０-９]/.test(kata) && /[時分月日曜火水木金土円枚回番線歳才週時間分じふんがつにちさい]/.test(kata)) { buangAngka++; continue; }
    if (/16歳|と8歳|歳と/.test(kata)) { buangAngka++; continue; }
  } else {
    // Verba/adjektiva: tetap buang yg kepanjangan (>2 kata) atau mengandung です/ください
    if (nKata > 2) { buangKalimat++; continue; }
    if (/(です|ください)/.test(kana)) { buangKalimat++; continue; }
  }
  const jenis = (vMasu || vPast || vDict) ? "V" : "A";
  // Nomina ditentukan di bawah (bukan kata kerja/sifat)
  out.push({ k: kata, kana, r: e.rom || "", a: arti, p: (e.paket || []).map(p => p.replace("-quiz", "")), j: isWord ? jenis : "N" });
  // --- Pecah gabungan jadi kata tunggal untuk hafalan ---
  // Mis. "えいがを みました" -> [えいが, みました]; "3 年" -> [年] (angka dibuang).
  // Tiap token valid jadi entri sendiri; kana+arti diwarisi dari induk + penanda asal.
  // Induk gabungan TIDAK disimpan (diganti hasil pecahannya).
  // Pemisah: spasi, ・, 、, ・, (), （）, koma JP — token kurung dibersihkan dulu.
  if (nKata > 1 || /[・、\(\)（）、，]/.test(kata)) {
    const bersih = kata.replace(/[\(\)（）]/g, " ").replace(/[・、，]/g, " ");
    const toks = bersih.split(/\s+/).filter(Boolean);
    const kanaToks = kana.replace(/[\(\)（）]/g, " ").replace(/[・、，]/g, " ").split(/\s+/).filter(Boolean);
    let pecahOk = false;
    toks.forEach((tk, ti) => {
      if (!/[一-鿿々〆぀-ヿ]/.test(tk)) return; // buang angka/partikel latin murni
      if (/^[をのにはがでとへやかねよぞもだけしかきり]+$/.test(tk)) return; // partikel lepas
      if (/^[0-9０-９:：／\/\.時分月日円枚回番線歳才週]+$/.test(tk)) return; // angka/waktu murni
      if (tk.length < 1 || tk.length > 8) return; // kata tunggal wajar maks 8 karakter
      if ((tk.match(/[一-鿿々〆]/g) || []).length > 3) return; // maks 3 kanji per kata
      const kanaTk = kanaToks[ti] || kanaToks[0] || "";
      out.push({ k: tk, kana: kanaTk, r: e.rom || "", a: arti + " ◁ " + kata, p: (e.paket || []).map(p => p.replace("-quiz", "")), j: "N", pecah: kata });
      pecahOk = true;
    });
    if (pecahOk) { out.splice(out.findIndex(o => o.k === kata && !o.pecah), 1); }
  }
}
out.sort((a, b) => a.k.localeCompare(b.k, "ja"));
// --- Normalisasi verba ke bentuk -masu POSITIF saja ---
// Aturan: -masen -> -masu, -mashita -> -masu, bentuk kamus -ru -> -masu.
// Bila hasil konversi ganda (mis. あいません -> あいます yg sudah ada),
// gabung paketnya, simpan 1 entri. Gagal konversi = dibuang.
function toMasu(kana) {
  let k = kana;
  if (/ませんでした$/.test(k)) return k.replace(/ませんでした$/, "ます");
  if (/ました$/.test(k)) return k.replace(/ました$/, "ます");
  if (/ません$/.test(k)) return k.replace(/ません$/, "ます");
  if (/ましょう$/.test(k)) return k.replace(/ましょう$/, "ます");
  const map = {
    // godan: a-row -> i-row + ます (urutan: pola panjang dulu!)
    "う": "います", "く": "きます", "ぐ": "ぎます", "す": "します", "つ": "ちます",
    "ぬ": "にます", "ぶ": "びます", "む": "みます", "る": "ります",
    // ichidan & khusus: potong る -> ます
    "える": "えます", "ける": "けます", "げる": "げます", "せる": "せます",
    "てる": "てます", "ねる": "ねます", "へる": "へます", "める": "めます",
    "れる": "れます", "いる": "います", "きる": "きます", "ぎる": "ぎます",
    "しる": "します", "じる": "じます", "ちる": "ちます", "にる": "にます",
    "ひる": "ひます", "びる": "びます", "みる": "みます",
    "する": "します", "くる": "きます", "いく": "いきます", "ゆく": "ゆきます",
    "ある": "あります", "わかる": "わかります",
  };
  const keys = Object.keys(map).sort((a, b) => b.length - a.length); // pola panjang dulu
  for (const akhir of keys) {
    const ganti = map[akhir];
    if (k.endsWith(akhir) && k.length > akhir.length) return k.slice(0, -akhir.length) + ganti;
  }
  return null;
}
const verbsRaw = out.filter(e => e.j === "V");
const vSeen = new Map();
let buangVerba = 0;
for (const e of verbsRaw) {
  const kana = e.kana || e.k;
  let m = null, rr = e.r || "", kk = e.k;
  if (/(ます)$/.test(kana)) { m = kana; }
  else { m = toMasu(kana); if (!m) { buangVerba++; continue; }
    if (e.k === kana) kk = m;
    rr = rr.replace(/(mashita|mashou|masen ?deshita|masen|ta|ru)$/i, "masu").replace(/masumasu$/i, "masu");
  }
  const key = (kk + "|" + m).toLowerCase();
  if (vSeen.has(key)) {
    const p = vSeen.get(key);
    e.p.forEach(x => { if (!p.p.includes(x)) p.p.push(x); });
  } else vSeen.set(key, { ...e, k: kk, kana: m, r: rr });
}
const verbs = [...vSeen.values()];
console.log(`  verba normalisasi: ${verbsRaw.length} -> ${verbs.length} bentuk-masu positif (buang: ${buangVerba}, ganda digabung)`);
const adjs = out.filter(e => e.j === "A");
const nouns = out.filter(e => e.j === "N");
console.log(`  verba-masu: ${verbs.length}, adjektiva: ${adjs.length}, nomina: ${nouns.length}`);
const pack = o => [o.k, o.kana, o.r, o.a, o.p.join(","), o.pecah || ""];
const head = (n, j) => "// " + n + " — hasil saring otomatis (jangan edit manual).\n// Dibuat: " + new Date().toISOString() + " | jumlah: " + j.length + "\n// Regenerasi: node tools/build-kotoba.mjs\n";
fs.writeFileSync(path.join(ROOT, "public", "assets", "js", "kotoba-verb.js"),
  head("kotoba-verb.js", verbs) + "window.KOTOBA_VERB = " + JSON.stringify(verbs.map(pack)) + ";\n// [kata, kana, romaji, arti, \"paket1,paket2\", asalGabungan?]");
fs.writeFileSync(path.join(ROOT, "public", "assets", "js", "kotoba-adj.js"),
  head("kotoba-adj.js", adjs) + "window.KOTOBA_ADJ = " + JSON.stringify(adjs.map(pack)) + ";\n");
fs.writeFileSync(path.join(ROOT, "public", "assets", "js", "kotoba-noun.js"),
  head("kotoba-noun.js", nouns) + "window.KOTOBA_NOUN = " + JSON.stringify(nouns.map(pack)) + ";\n");
const js = "// kotoba-data.js — KOTOBA DASAR hasil saring otomatis dari soal (jangan edit manual).\n"
  + "// Dibuat: " + new Date().toISOString() + " | jumlah: " + out.length + "\n"
  + "// Regenerasi: node tools/build-kotoba.mjs (baca: public/kosakata.json)\n"
  + "window.KOTOBA_DASAR = "
  + JSON.stringify(out.map(o => [o.k, o.kana, o.r, o.a, o.p.join(",")])) + ";\n"
  + "// Format per entri: [kata, kana, romaji, arti, \"paket1,paket2\"]\n";
fs.writeFileSync(path.join(ROOT, "public", "assets", "js", "kotoba-data.js"), js);
console.log(`kosakata: ${src.jumlah} -> kotoba dasar: ${out.length} (buang kalimat: ${buangKalimat}, angka: ${buangAngka})`);
