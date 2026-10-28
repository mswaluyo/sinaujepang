const fs = require('fs');

const mhtmlPath = 'd:\\soal-jft\\_arsip\\basu2\\BASU (OKTOBER-NOVEMBER).mhtml';

// Read the file
const data = fs.readFileSync(mhtmlPath);

// Find the multipart boundary
const boundaryMatch = data.toString('utf8').match(/boundary="([^"]+)"/);
if (!boundaryMatch) {
  console.log('No boundary found');
  process.exit(0);
}

const boundary = boundaryMatch[1];
console.log('Boundary:', boundary);

// Split the content by boundary
const parts = data.toString('utf8').split('--' + boundary);

// Analyze each part
const attachments = [];
const htmlParts = [];
let imageCount = 0;
let audioCount = 0;
let cssCount = 0;

parts.forEach((part, index) => {
  if (part.trim().length < 5) return;
  
  // Find content-location
  const contentLocationMatch = part.match(/Content-Location:\s*([^\r\n]+)/);
  const contentTypeMatch = part.match(/Content-Type:\s*([^\r\n]+)/);
  
  // Find the actual content (skip headers)
  const headerEnd = part.indexOf('\n\n');
  const body = headerEnd > 0 ? part.substring(headerEnd + 2).trim() : part;
  
  const info = {
    index: index,
    contentLocation: contentLocationMatch ? contentLocationMatch[1].trim() : null,
    contentType: contentTypeMatch ? contentTypeMatch[1].trim() : null,
    bodyLength: body.length,
    body: body
  };
  
  // Classify the part
  if (info.contentType && (info.contentType.includes('image/') || info.contentType.includes('audio/'))) {
    attachments.push(info);
    if (info.contentType.includes('image/')) imageCount++;
    if (info.contentType.includes('audio/')) audioCount++;
  } else if (info.contentType && info.contentType.includes('text/css')) {
    cssCount++;
  } else if (body.match(/^data:image\//)) {
    attachments.push(info);
    imageCount++;
  } else if (body.match(/^data:audio\//)) {
    attachments.push(info);
    audioCount++;
  } else if (body.startsWith('<!DOCTYPE') || body.startsWith('<html')) {
    htmlParts.push(info);
  }
});

console.log('\n=== Summary ===');
console.log('Total parts:', parts.length);
console.log('Attachments (images/audio):', attachments.length);
console.log('  - Images:', imageCount);
console.log('  - Audio:', audioCount);
console.log('CSS parts:', cssCount);
console.log('HTML parts:', htmlParts.length);

// Save attachments
console.log('\n=== Saving attachments ===');
attachments.forEach((att, index) => {
  // Determine file extension based on content type
  let ext = '';
  if (att.body.match(/^data:image\//)) {
    ext = '.png';
  } else if (att.body.match(/^data:audio\//)) {
    ext = '.m4a';
  } else if (att.contentType) {
    ext = '.' + att.contentType.split('/')[1];
  }
  
  // Get filename from contentLocation
  let filename = 'part_' + att.index;
  if (att.contentLocation) {
    const fileNameMatch = att.contentLocation.match(/[^\/]+$/);
    if (fileNameMatch) {
      filename = fileNameMatch[0];
    }
  }
  
  const safeFilename = filename.replace(/[^\w\-._]/g, '_') + ext;
  const safePath = 'd:\\soal-jft\\extracted_' + safeFilename;
  
  try {
    fs.writeFileSync(safePath, att.body);
    console.log(`  Saved: ${safeFilename} (${att.bodyLength} bytes)`);
  } catch (err) {
    console.log(`  Error: ${err.message}`);
  }
});

// List unique content locations
const locations = attachments.map(a => a.contentLocation || 'unknown').filter((v, i, a) => a.indexOf(v) === i);
console.log('\n=== Unique content locations ===');
locations.forEach(f => console.log('  -', f));
