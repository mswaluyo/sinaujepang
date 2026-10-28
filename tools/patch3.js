const fs=require('fs');
const p='public/assets/js/admin-data.js';
let a=fs.readFileSync(p,'utf8').split('\n');
const rep=[
"       const noSoal = (window._sIdx != null ? window._sIdx + 1 : 1);",
"       const targetFileName = (q && q.img) ? q.img.split('/').pop() : ('soal_' + noSoal + '.jpg');",
"       const folderPath = 'public/basu3-quiz/images/';",
"       const fullPath = folderPath + targetFileName;",
"       const token = prompt('Masukkan GitHub Personal Access Token (repo scope):');",
"       if (!token) { alert('Token diperlukan.'); return; }",
"       btnUploadUrl.disabled = true;",
"       btnUploadUrl.textContent = 'Mengunggah...';",
"       try {",
"         const imgRes = await fetch(imgUrl, { mode: 'cors' });",
"         if (!imgRes.ok) throw new Error('Gagal fetch gambar: ' + imgRes.status);",
"         const blob = await imgRes.blob();",
"         const base64 = await new Promise((resolve, reject) => {",
"           const reader = new FileReader();",
"           reader.onloadend = () => resolve(reader.result.split(',')[1]);",
"           reader.onerror = reject;",
"           reader.readAsDataURL(blob);",
"         });",
"         const putRes = await fetch('https://api.github.com/repos/mswaluyo/sinaujepang/contents/' + fullPath, {",
"           method: 'PUT',",
"           headers: { 'Authorization': 'token ' + token, 'Content-Type': 'application/json' },",
"           body: JSON.stringify({ message: 'Upload image ' + targetFileName, content: base64 })",
"         });",
"         const putJson = await putRes.json();",
"         if (putRes.ok) alert('Berhasil upload ke GitHub: ' + (putJson.content && putJson.content.path));",
"         else alert('Gagal: ' + (putJson.message || putRes.status));",
"       } catch (e) {",
"         alert('Gagal: ' + (e.message || e));",
"       } finally {",
"         btnUploadUrl.disabled = false;",
"         btnUploadUrl.textContent = 'Upload dari Link ke GitHub';",
"       }"
];
a.splice(926,19,...rep);
fs.writeFileSync(p,a.join('\n'));
console.log('done');
