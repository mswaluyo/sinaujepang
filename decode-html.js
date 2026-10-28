const fs = require('fs');
function qpDecode(s){return s.replace(/=\r?\n/g,'').replace(/=([0-9A-F]{2})/g,(_,h)=>String.fromCharCode(parseInt(h,16))); }
for(const i of [1,52]){
  const raw=fs.readFileSync('D:\\soal-jft\\extracted_html_'+i+'.html','utf8');
  const he=raw.indexOf('\n\n');
  const body=he>0?raw.substring(he+2):raw;
  const dec=qpDecode(body);
  fs.writeFileSync('D:\\soal-jft\\decoded_html_'+i+'.html', dec);
  console.log(i, dec.length);
}
