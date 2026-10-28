import fs from 'fs';
import path from 'path';

// 6 Paket dalam grup kategori LOLOSYUK
const LOLOSYUK_PACKETS = [
  'gakusei-quiz',
  'hare-quiz',
  'magarimasu-quiz',
  'orimasu-quiz',
  'tomemasu-quiz',
  'konpyuutaa-quiz'
];

// Deteksi opsi pengecoh / salah eja / bukan kata baku
function isPengecoh(od) {
  const arti = (od.arti || '').trim().toLowerCase();
  const alasan = (od.alasan || '').toLowerCase();
  const regexPengecoh = /(salah eja|bukan kata baku|salah baca|bukan penulisan yang benar|keliru|bentuk salah|salah di sini|tidak baku|bukan bacaan|salah ketik|^salah$)/i;
  
  if (regexPengecoh.test(arti) || regexPengecoh.test(alasan)) {
    return true;
  }
  // Cek jika arti hanya tanda hubung '-' (tidak memiliki arti kosakata valid)
  if (arti === '-' || arti === '') {
    return true;
  }
  return false;
}

// Deteksi kalimat panjang atau opsi deskriptif gambar (misal "Gambar A", atau mengandung tanda baca kalimat)
function isKalimatAtauDeskripsi(text, arti) {
  if (!text) return true;
  if (/^gambar\s+[a-z0-9]/i.test(text.trim())) return true;
  if (/[。？！?!]/.test(text)) return true;
  if (text.length > 20) return true; // Kotoba satuan tidak lebih dari 20 huruf
  return false;
}

export function extractLolosyukKotoba() {
  const kotobaMap = new Map();
  let totalOpsiDiproses = 0;
  let totalPengecohDibuang = 0;

  LOLOSYUK_PACKETS.forEach(pkt => {
    const filePath = path.join('public', pkt, 'quiz-data.json');
    if (!fs.existsSync(filePath)) {
      console.warn(`File tidak ditemukan: ${filePath}`);
      return;
    }

    const quizData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    quizData.forEach(q => {
      // Fokus pada SESI 1 : MOJIGOI (murni kotoba kata benda, kerja, sifat)
      if (q.section && q.section.includes('MOJIGOI') && Array.isArray(q.opt_detail)) {
        q.opt_detail.forEach((od, idx) => {
          totalOpsiDiproses++;

          // 1. Filter Pengecoh & Salah Eja
          if (isPengecoh(od)) {
            totalPengecohDibuang++;
            return;
          }

          // Dapatkan teks tulisan (Kanji atau Kana asli opsi)
          const textOpsi = q.options && q.options[idx] ? q.options[idx].text : od.kana;

          // 2. Filter Kalimat / Teks tidak valid
          if (isKalimatAtauDeskripsi(textOpsi, od.arti)) {
            return;
          }

          // Pemilahan Kana dan Kanji jika ada format tanda kurung seperti あるいたり (歩いたり)
          let cleanKana = (od.kana || '').trim();
          let cleanKanji = (textOpsi || cleanKana).trim();

          const hasKanjiChar = (str) => /[\u4E00-\u9FAF]/.test(str);

          // Cek pola kurung pada textOpsi atau kana: misal "あるいたり (歩いたり)"
          const matchKurung = (cleanKanji.match(/^([^(（]+)[\s]*[(（]([^)）]+)[)）]$/) || 
                               cleanKana.match(/^([^(（]+)[\s]*[(（]([^)）]+)[)）]$/));

          if (matchKurung) {
            const part1 = matchKurung[1].trim();
            const part2 = matchKurung[2].trim();

            if (hasKanjiChar(part2)) {
              // Contoh: "あるいたり (歩いたり)" -> part1 = kana, part2 = kanji
              cleanKana = part1;
              cleanKanji = part2;
            } else if (hasKanjiChar(part1)) {
              // Contoh: "歩いたり (あるいたり)" -> part1 = kanji, part2 = kana
              cleanKanji = part1;
              cleanKana = part2;
            } else {
              // Jika dua-duanya kana
              cleanKana = part1;
              cleanKanji = part1;
            }
          }

          // Bersihkan sisa-sisa kurung pada kana jika masih ada
          cleanKana = cleanKana.replace(/[\s]*[(（].*?[)）]/g, '').trim();

          const rom = (od.rom || '').trim();
          const arti = (od.arti || '').trim();

          if (!cleanKana) return;

          // Deduplikasi berdasarkan kunci unik: kombinasi (cleanKana + cleanKanji)
          const key = `${cleanKana}__${cleanKanji}`;

          if (!kotobaMap.has(key)) {
            kotobaMap.set(key, {
              kanji: cleanKanji !== '-' ? cleanKanji : cleanKana,
              kana: cleanKana,
              rom: rom !== '-' ? rom : '',
              arti: arti,
              paket: [pkt]
            });
          } else {
            const existing = kotobaMap.get(key);
            if (!existing.paket.includes(pkt)) {
              existing.paket.push(pkt);
            }
          }
        });
      }
    });
  });

  const hasilKotoba = Array.from(kotobaMap.values()).sort((a, b) => a.kana.localeCompare(b.kana, 'ja'));

  // Simpan dalam format JSON
  const outputPathJson = path.join('public', 'kotoba-lolosyuk.json');
  fs.writeFileSync(outputPathJson, JSON.stringify(hasilKotoba, null, 2), 'utf8');

  // Simpan juga versi ringkas text tab-separated (TSV / TXT) untuk mudah dibaca / review
  const outputPathTxt = path.join('public', 'kotoba-lolosyuk.txt');
  const txtContent = hasilKotoba.map(k => `${k.kanji}\t${k.kana}\t${k.rom}\t${k.arti}\t(${k.paket.join(', ')})`).join('\n');
  fs.writeFileSync(outputPathTxt, txtContent, 'utf8');

  console.log('=== HASIL EKSTRAKSI KOTOBA LOLOSYUK ===');
  console.log(`Total Opsi Terbaca       : ${totalOpsiDiproses}`);
  console.log(`Pengecoh/Salah Eja Dibuang: ${totalPengecohDibuang}`);
  console.log(`Kotoba Bersih & Unik     : ${hasilKotoba.length}`);
  console.log(`Disimpan ke:`);
  console.log(` - ${outputPathJson}`);
  console.log(` - ${outputPathTxt}`);
}

extractLolosyukKotoba();
