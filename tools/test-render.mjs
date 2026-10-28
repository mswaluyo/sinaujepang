// Test: render kana + romaji layout
const kana = 'ぎゅうにく';
const rom = 'gyuuniku';

const html = `
  <td class="py-3 px-4">
    <div class="font-semibold text-sky-700 jp-font">${kana}</div>
    <div class="text-xs text-slate-400 leading-relaxed whitespace-pre-line">${rom}</div>
  </td>
`;

console.log(html);
