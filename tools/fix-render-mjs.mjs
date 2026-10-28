import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const file = path.join(ROOT, 'public/assets/js/kanji-tree-render-main.js');

let c = fs.readFileSync(file, 'utf8');

// Split into lines
const lines = c.split('\r\n');

// We need to fix the nesting in the ks.forEach section (around lines 38-58)
// Current problematic structure:
// Line 38: parts.push('</div>'); // close .grid (for radikal card)
// Line 39: parts.push('<div class="branch">'); // open .branch for kanji
// ...
// Line 51: parts.push('</div></div>'); // close .node and .grid for each kanji
// ...
// Line 57: parts.push('</div></div>'); // THIS closes .branch too early!

// The fix: line 57 should close the kanji .node and .branch should stay open

// Let's find and fix the specific lines
const newLines = lines.map((line, idx) => {
  const lineNum = idx + 1;
  
  // Line 51: Fix to close grid properly and add branch close comment
  if (lineNum === 51) {
    return "        parts.push('</div>'); // close .grid for kanji card";
  }
  
  // Line 52: Fix to properly open branch
  if (lineNum === 52) {
    return "        parts.push('<div class=\"branch\">'); // open .branch for jukugo/kotoba level";
  }
  
  // Line 53: This is fine
  if (lineNum === 53) {
    return "        parts = parts.concat(renderJukugoLevel(vs, k, rad));";
  }
  
  // Line 54: Fix to close branch and node separately
  if (lineNum === 54) {
    return "        parts.push('</div>'); // close .branch for jukugo/kotoba";
  }
  
  // Line 55: This will be closing the node
  if (lineNum === 55) {
    return "        parts.push('</div>'); // close .node for kanji tunggal";
  }
  
  // Insert a new line after line 55 to close the node
  if (lineNum === 56) {
    return "      });";
  }
  
  // Line 57 in original was closing branch too early - now we add proper closing
  if (lineNum === 57) {
    return "      parts.push('</div>'); // close .branch for all kanji under this radical";
  }
  
  if (lineNum === 58) {
    return "      parts.push('</div></div>'); // close .node for radical";
  }
  
  if (lineNum === 59) {
    return "    });";
  }
  
  if (lineNum === 60) {
    return "    container.innerHTML = parts.join('');";
  }
  
  if (lineNum === 61) {
    return "  }";
  }
  
  return line;
});

const result = newLines.join('\r\n');
fs.writeFileSync(file, result, 'utf8');
console.log('File updated successfully!');
console.log('New file length:', result.length);