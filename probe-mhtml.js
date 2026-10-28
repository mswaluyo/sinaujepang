const fs = require('fs');
const p = 'D:\\soal-jft\\_arsip\\basu_tes\\BASU (OKTOBER-NOVEMBER).mhtml';
const d = fs.readFileSync(p);
const m = d.toString('utf8').match(/boundary="([^"]+)"/);
const b = m[1];
const parts = d.toString('utf8').split('--' + b);
console.log('parts', parts.length);
let html=0,img=0,aud=0;
parts.forEach(pp=>{
  const ct = pp.match(/Content-Type:\s*([^\r\n]+)/);
  if(ct){ if(ct[1].includes('image/'))img++; if(ct[1].includes('audio/'))aud++; }
  if(pp.includes('<!DOCTYPE')||pp.includes('<html'))html++;
});
console.log('html',html,'img',img,'aud',aud);
fs.writeFileSync('D:\\soal-jft\\mhtml-summary.txt','parts '+parts.length+' html '+html+' img '+img+' aud '+aud+'\n');
