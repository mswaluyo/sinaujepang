const fs=require('fs');
const h=fs.readFileSync('D:\\soal-jft\\decoded_html_1.html','utf8');
const re=/<div[^>]*role="listitem"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g;
let m; let count=0; let out=[];
while((m=re.exec(h))!==null && count<3){ out.push('===BLOCK '+count+'===\n'+m[0].substring(0,1500)); count++; }
fs.writeFileSync('D:\\soal-jft\\blocks.txt', out.join('\n\n'));
console.log('blocks',count);
