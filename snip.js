const fs=require('fs');
const h=fs.readFileSync('D:\\soal-jft\\decoded_html_1.html','utf8');
const i=h.indexOf('freebirdFormviewerViewItemsItemItem');
const snippet=h.substring(Math.max(0,i-100), i+1200);
fs.writeFileSync('D:\\soal-jft\\snippet.txt', snippet);
console.log('written', snippet.length);
