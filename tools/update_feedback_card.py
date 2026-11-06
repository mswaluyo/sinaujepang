import sys

with open('public/assets/js/ssw-quiz.js', 'r', encoding='utf-8') as f:
    content = f.read()

helper_func = '''  function renderExplanationCard(q, isCorrect) {
    var fullT = (q.title || '').trim();
    var trans = q.trans || (q.trans_id || '');
    var transR = q.trans_rom || '';
    var cleanAna = String(q.analisis || q.penjelasan || '').replace(/\\s*Kunci\\s*:\\s*[a-dA-D][.\\s]*/g, ' ').replace(/\\s{2,}/g, ' ').trim();
    
    // Header Banner (Sesuai Layout JFT)
    var h = '';
    if (isCorrect) {
      h += '<div class="fb-box mt-6 rounded-2xl p-5 sm:p-6 border border-emerald-200 bg-emerald-50/60 text-sm space-y-4 shadow-sm" style="scroll-margin-top:140px">';
      h += '  <div class="flex items-center gap-2.5 border-b border-emerald-200/80 pb-3">';
      h += '    <span class="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold shrink-0"><i class="fa-solid fa-check"></i></span>';
      h += '    <h3 class="text-emerald-900 font-bold text-base tracking-wide uppercase">Jawaban Benar!</h3>';
      h += '  </div>';
    } else {
      h += '<div class="fb-box mt-6 rounded-2xl p-5 sm:p-6 border border-rose-200 bg-rose-50/60 text-sm space-y-4 shadow-sm" style="scroll-margin-top:140px">';
      h += '  <div class="flex items-center gap-2.5 border-b border-rose-200/80 pb-3">';
      h += '    <span class="flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-white text-xs font-bold shrink-0"><i class="fa-solid fa-xmark"></i></span>';
      h += '    <h3 class="text-rose-900 font-bold text-base tracking-wide uppercase">Jawaban Kurang Tepat! (Kunci: ' + letter(q.answer) + ')</h3>';
      h += '  </div>';
    }

    // 1. ANALISIS KALIMAT SOAL
    h += '<div class="bg-white border border-emerald-100 rounded-xl p-4 sm:p-5 space-y-3">';
    h += '  <div class="text-xs font-bold text-emerald-800 uppercase tracking-wider border-b border-slate-100 pb-2">1. Analisis Kalimat Soal</div>';
    h += '  <div class="space-y-2.5">';
    if (fullT && !/^soal\\s*\\d+$/i.test(fullT)) {
      h += '    <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-100">';
      h += '      <span class="text-slate-400 block text-xs font-medium mb-0.5">Teks / Pertanyaan:</span>';
      h += '      <span class="font-bold text-slate-900 text-sm sm:text-base leading-relaxed" style="white-space:pre-line">' + esc(fullT) + '</span>';
      h += '    </div>';
    }
    if (transR && transR !== '-') {
      h += '    <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-100">';
      h += '      <span class="text-slate-400 block text-xs font-medium mb-0.5">Cara Baca (Romaji):</span>';
      h += '      <span class="italic text-slate-700 text-xs sm:text-sm" style="white-space:pre-line">' + esc(transR) + '</span>';
      h += '    </div>';
    }
    if (trans && trans !== '-') {
      h += '    <div class="bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">';
      h += '      <span class="text-emerald-700 block text-xs font-semibold mb-0.5">Terjemahan Utuh:</span>';
      h += '      <span class="font-medium text-emerald-950 text-xs sm:text-sm leading-relaxed" style="white-space:pre-line">' + esc(trans) + '</span>';
      h += '    </div>';
    }
    h += '  </div>';
    h += '</div>';

    // 2. POLA TATA BAHASA & PEMBAHASAN
    h += '<div class="bg-white border border-emerald-100 rounded-xl p-4 sm:p-5 space-y-2">';
    h += '  <div class="text-xs font-bold text-emerald-800 uppercase tracking-wider">2. Pola Tata Bahasa & Pembahasan</div>';
    h += '  <div class="text-slate-700 text-xs sm:text-sm leading-relaxed" style="white-space:pre-line">' + esc(cleanAna) + '</div>';
    h += '</div>';

    // 3. ANALISIS PILIHAN JAWABAN
    h += '<div class="bg-white border border-emerald-100 rounded-xl p-4 sm:p-5 space-y-2">';
    h += '  <div class="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">3. Analisis Pilihan Jawaban</div>';
    h += '  <ul class="space-y-2.5 text-xs sm:text-sm">';
    (q.options || []).forEach(function (opt, idx) {
      var isOptCorrect = (idx === q.answer);
      var dd = (q.opt_detail && q.opt_detail[idx]) || {};
      var rawKana = dd.kana || opt.text || opt.title || ('Opsi ' + letter(idx));
      var kk = String(rawKana).replace(/^[A-Da-d][.\\s)]+\\s*/, '').trim();
      var rr = dd.rom || '';
      var aa = dd.arti || ((q.opt_note && q.opt_note[idx]) || '');
      aa = String(aa).replace(/^\\([A-Da-d][.\\s)]*\\s*/, '').replace(/\\)$/, '').trim();
      var rawR = String(dd.alasan || '').replace(/^(BENAR|SALAH)[.\\s:-]*/i, '').trim();

      var head = '<strong>' + letter(idx) + '. ' + esc(kk) + (rr ? ' (' + esc(rr) + ')' : '') + ':</strong> ';
      var note = '';
      if (aa && aa !== kk) {
        note += esc(aa);
      }
      if (rawR && rawR !== aa) {
        if (note) note += ' <span class="text-slate-400">—</span> ';
        note += '<span class="' + (isOptCorrect ? 'text-emerald-700/80 font-medium' : 'text-slate-500') + '">' + esc(rawR) + '</span>';
      }
      if (!note) {
        note = isOptCorrect ? '<span class="text-emerald-700/80 font-medium">Tepat sekali. Pilihan jawaban ini sesuai dengan gambar atau situasi keahlian kerja.</span>' : '<span class="text-slate-500">Pilihan jawaban kurang tepat untuk konteks soal ini.</span>';
      }

      if (isOptCorrect) {
        h += '    <li class="flex items-start gap-2.5 text-emerald-900 bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-100">';
        h += '      <i class="fa-solid fa-circle-check text-emerald-500 mt-0.5 text-base shrink-0"></i>';
        h += '      <div>' + head + note + '</div>';
        h += '    </li>';
      } else {
        h += '    <li class="flex items-start gap-2.5 text-slate-700 p-2.5 rounded-lg">';
        h += '      <i class="fa-solid fa-circle-xmark text-rose-500 mt-0.5 text-base shrink-0"></i>';
        h += '      <div>' + head + note + '</div>';
        h += '    </li>';
      }
    });
    h += '  </ul>';
    h += '</div>';

    h += '</div>';
    return h;
  }

  // Render butir soal aktif'''

new_explanation_block = '''    // Penjelasan Analisa Jawaban (Format 3-bagian persis JFT)
    if (isLocked) {
      h += renderExplanationCard(q, pickedAns === q.answer);
    }'''

if '// Render butir soal aktif' in content:
    content = content.replace('  // Render butir soal aktif', helper_func, 1)

old_comment = '// Penjelasan Analisa Jawaban (langsung muncul saat terkunci seperti JFT)'
if old_comment in content:
    idx1 = content.find(old_comment)
    idx2 = content.find('card.innerHTML = h;', idx1)
    content = content[:idx1] + new_explanation_block + '\n\n    ' + content[idx2:]

with open('public/assets/js/ssw-quiz.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Successfully updated ssw-quiz.js')

