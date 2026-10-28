require('dotenv').config(); // Load isi file .env
const express = require('express');
app.use(express.json());
const multer = require('multer');
const cors = require('cors');

const app = express();
app.use(cors());

// Simpan file di memory sebentar sebelum dikirim ke GitHub
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/upload-to-github', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Tidak ada file' });

    const fileName = req.body.fileName; // Contoh: soal_1.jpg
    const folderPath = req.body.folderPath || 'public/basu3-quiz/images/';
    const filePath = `${folderPath}${fileName}`;
    const base64Content = req.file.buffer.toString('base64');

    const url = `https://api.github.com/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${filePath}`;

    // Cek SHA jika file sudah ada di GitHub
    let sha = null;
    const checkFile = await fetch(url, {
      headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` }
    });
    if (checkFile.ok) {
      const fileData = await checkFile.json();
      sha = fileData.sha;
    }

    // Body request commit ke GitHub
    const bodyData = {
      message: `upload asset: ${fileName} via Admin UI`,
      content: base64Content,
      branch: process.env.GITHUB_BRANCH || 'main'
    };
    if (sha) bodyData.sha = sha;

    // Upload ke GitHub API
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
// upload URL to GitHub
app.post('/api/upload-url-to-github', async (req, res) => {
  const { imageUrl, fileName, folderPath } = req.body || {};
  if (!imageUrl || !fileName || !folderPath) return res.status(400).json({ success: false, error: 'missing params' });
  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(500).json({ success: false, error: 'GITHUB_TOKEN not set' });
  try {
    const r = await fetch(imageUrl);
    const buf = Buffer.from(await r.arrayBuffer());
    const content = buf.toString('base64');
    const repo = process.env.GITHUB_REPO || 'mswaluyo/sinaujepang';
    const branch = process.env.GITHUB_BRANCH || 'main';
    const filePath = (folderPath.replace(/^public\//, '') + fileName);
    const apiPath = 'https://api.github.com/repos/' + repo + '/contents/' + filePath;
    let sha = null;
    try {
      const getRes = await fetch(apiPath + '?ref=' + branch, { headers: { Authorization: 'token ' + token } });
      if (getRes.ok) { const j = await getRes.json(); sha = j.sha; }
    } catch (e) {}
    const body = { message: 'upload ' + fileName, content, branch };
    if (sha) body.sha = sha;
    const putRes = await fetch(apiPath, {
      method: 'PUT',
      headers: { Authorization: 'token ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!putRes.ok) {
      const txt = await putRes.text();
      return res.status(500).json({ success: false, error: txt });
    }
    res.json({ success: true, path: filePath });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

const https = require('https');

// Proxy gambar cross-origin agar bisa diunduh dengan nama kustom
app.get('/api/proxy-image', (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) return res.status(400).send('URL gambar tidak disertakan');
  https.get(imageUrl, (externalRes) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', externalRes.headers['content-type'] || 'image/jpeg');
    externalRes.pipe(res);
  }).on('error', (err) => {
    console.error('Gagal mengambil gambar:', err);
    res.status(500).send('Gagal mengambil gambar dari server asal');
  });
});


// git pull
app.post('/api/git-pull', (req, res) => {
  exec('git pull', { cwd: process.cwd() }, (err, stdout, stderr) => {
    if (err) return res.status(500).json({ success: false, error: stderr || err.message });
    res.json({ success: true, output: stdout });
  });
});

        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    });

    if (response.ok) {
      console.log(`✅ Berhasil di-commit ke GitHub: ${filePath}`);
      res.json({ success: true, path: filePath });
    } else {
      const err = await response.json();
      res.status(500).json({ success: false, message: err.message });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(3000, () => {
  console.log('🚀 Server Upload GitHub aktif di http://localhost:3000');
});