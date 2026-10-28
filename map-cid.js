const fs=require('fs');
const mhtml=fs.readFileSync('D:\\soal-jft\\_arsip\\basu_tes\\BASU (OKTOBER-NOVEMBER).mhtml','utf8');
const b=mhtml.match(/boundary="([^"]+)"/)[1];
const parts=mhtml.split('--'+b);
// map content-id -> filename/content-location
const cidMap={};
parts.forEach((p,i)=>{
  const cid=p.match(/Content-ID:\s*<([^>]+)>/);
  const cl=p.match(/Content-Location:\s*([^\r\n]+)/);
  if(cid){ cidMap[cid[1].trim()] = {index:i, location: cl?cl[1].trim():null, part:p}; }
});
// decode html
function qp(s){return s.replace(/=\r?\n/g,'').replace(/=([0-9A-F]{2})/g,(_,h)=>String.fromCharCode(parseInt(h,16)));}
const raw=fs.readFileSync('D:\\soal-jft\\decoded_html_1.html','utf8');
// split into listitem blocks by finding <div ... role="listitem" ...> ... next listitem
const re=/<div[^>]*role="listitem"[^>]*>/g;
let matches=[...raw.matchAll(re)];
let blocks=[];
for(let i=0;i<matches.length;i++){
  const start=matches[i].index;
  const end=i+1<matches.length?matches[i+1].index:raw.length;
  blocks.push(raw.substring(start,end));
}
// for each block find cid: refs
const out=blocks.map((blk,idx)=>{
  const cids=[...blk.matchAll(/cid:([^"'>\s]+)/g)].map(m=>m[1]);
  return {block:idx, cids};
});
fs.writeFileSync('D:\\soal-jft\\cidmap.json', JSON.stringify({cidMap:Object.keys(cidMap), mapping:out},null,2));
console.log('blocks',blocks.length);
console.log('sample mapping', JSON.stringify(out.slice(0,5)));
// print cid->location
Object.keys(cidMap).forEach(k=>console.log(k, '=>', cidMap[k].location));
