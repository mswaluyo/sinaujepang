const fs = require('fs');
const p = 'D:\\soal-jft\\_arsip\\basu_tes\\BASU (OKTOBER-NOVEMBER).mhtml';
const d = fs.readFileSync(p,'utf8');
const m = d.match(/boundary="([^"]+)"/);
const parts = d.split('--'+m[1]);
let htmlParts = [];
parts.forEach((pp,i)=>{
  if(pp.includes('<!DOCTYPE')||pp.includes('<html')){
    const he = pp.indexOf('\n\n');
    const body = he>0?pp.substring(he+2):pp;
    htmlParts.push({i,body});
    fs.writeFileSync('D:\\soal-jft\\extracted_html_'+i+'.html', body);
  }
});
console.log('html parts', htmlParts.length, htmlParts.map(h=>h.i));
