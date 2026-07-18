const fs = require('fs');
const path = require('path');
const dir = 'src/screens';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const exactReplacements = {
  '\\u00c3\\u0192\\u00c6\\u2019\\u00c3\\u201a\\u00c2\\u00b4': "'",
  '\\u00c3\\u0192\\u00c2\\u00b0\\u00c3\\u2026\\u00c2\\u00b8\\u00c3\\u00a2\\u00e2\\u201a\\u00ac\\u00cb\\u0153\\u00c3\\u201a\\u00c2\\u00a5': '👥',
  '\\u00c3\\u0192\\u00c2\\u00b0\\u00c3\\u2026\\u00c2\\u00b8\\u00c3\\u00a2\\u00e2\\u201a\\u00ac\\u00e2\\u20ac\\u009d\\u00c3\\u201a\\u00c2\\u00ba': '🏢',
  '\\u00c3\\u201a\\u00c2\\u00b8\\u00c3\\u201a\\u00c2\\u008f': '⚙️',
  '\\u00c3\\u0192\\u00c6\\u2019\\u00c3\\u00a2\\u00e2\\u20ac\\u0161\\u00c2\\u00ac': '✅',
  '\\u00c3\\u2026\\u00c2\\u00a1\\u00c3\\u201a\\u00c2\\u00a0': '❌',
  '\\u00e2\\u2122\\u00bb\\u00ef\\u00b8\\u008f': '♻️',
  '\\ud83d\\ufe0f\\u00ef\\u00b8\\u008f': '🗑️',
  '\\ud83d': ' ', // Strip high surrogates without low surrogate
  '\\u00e2\\u0161\\u2122\\u00ef\\u00b8\\u008f': '⚙️',
  '\\u00f0\\u0178\\u008f\\u00a0': '🏠',
  '\\u00f0\\u0178\\u2019\\u00ac': '💬',
  '\\u2705': '✅',
  '\\u00f0\\u0178\\u201c\\u008d': '📍',
  '\\u00e2\\u02dc\\u017d\\u00ef\\u00b8\\u008f': '☎️',
  '\\u00f0\\u0178\\u203a\\u008d\\u00ef\\u00b8\\u008f': '🛍️',
  '\\u00e2\\u008f\\u00b3': '⏳',
  '\\u00f0\\u0178\\u00a4\\u009d': '🤝',
  '\\u00f0\\u0178\\u008f\\u00a2': '🏢',
  '\\u00e2\\u009d\\u0152': '❌',
  '\\u00c3\\u0192\\u00c6\\u2019\\u00c3\\u201a\\u00c2\\u00a0': 'a',
  '\\u00c3\\u00a2\\u00e2\\u201e\\u00a2\\u00c2\\u00bb\\u00c3\\u00af\\u00c2\\u00b8\\u00c2\\u008f': '♻️',
  '\\u00c3\\u0192\\u00c2\\u00a0': 'a',
  '\\u00c3\\u0192\\u00c2\\u00aa': 'e',
  '\\u00c3\\u0192\\u00e2\\u20ac\\u00b0': 'ð',
  '\\u00c3\\u00b0\\u00c5\\u00b8\\u00e2\\u20ac\\u0153\\u00c2\\u008d': '📍',
  '\\u00c3\\u00b0\\u00c5\\u00b8': 'ð',
  '\\u00c3\\u00a2\\u00e2\\u20ac\\u00a0': 'a',
  '\\u00c3\\u00b0\\u00c5\\u00b8\\u00c2\\u008f\\u00e2\\u20ac\\u201d\\u00c3\\u00af\\u00c2\\u00b8\\u00c2\\u008f': '🏃‍♂️',
  '\\u2699\\ufe0f': '⚙️',
  '\\u00c3\\u0192\\u00c2\\u00b0\\u00c3\\u2026\\u00c2\\u00b8\\u00c3\\u201a\\u00c2\\u008f\\u00c3\\u201a\\u00c2\\u00a0': '🏠',
  '\\u00c3\\u0192\\u00c2\\u00b0\\u00c3\\u2026\\u00c2\\u00b8\\u00c3\\u201a\\u00c2\\u008f\\u00c3\\u2020': '👨‍💼',
  '\\u00c3\\u00a2\\u00e2\\u20ac\\u0161\\u00c2\\u00ac\\u00c3\\u201a\\u00c2\\u008d': '📍',
  '\\u00c3\\u00a2\\u00e2\\u20ac\\u017e\\u00c2\\u00a2\\u00c3\\u00a2\\u00e2\\u201a\\u00ac\\u00c5\\u00a1': '💬',
  '\\u00c3\\u00a2\\u00e2\\u201a\\u00ac\\u00c5\\u00be\\u00c3\\u201a\\u00c2\\u00b9': '📈',
  '\\u00c3\\u0192\\u00c2\\u00b0\\u00c3\\u2026\\u00c2\\u00b8\\u00c3\\u00a2\\u00e2\\u201a\\u00ac\\u00c5\\u201c\\u00c3\\u201a\\u00c2\\u008d': '📄',
  '\\u00c3\\u0192\\u00c2\\u00b0\\u00c3\\u2026\\u00c2\\u00b8\\u00c3\\u00a2\\u00e2\\u201a\\u00ac\\u00c5\\u201c\\u00c3\\u2026\\u00c2\\u00be': '🚚',
  '\\u00c3\\u0192\\u00c2\\u00b0\\u00c3\\u2026\\u00c2\\u00b8\\u00c3\\u2026\\u00c2\\u00a1\\u00c3\\u201a\\u00c2\\u00a8': '💰',
  '\\u00c3\\u0192\\u00c2\\u00b0\\u00c3\\u2026\\u00c2\\u00b8\\u00c3\\u00a2\\u00e2\\u201a\\u00ac\\u00e2\\u20ac\\u009d\\u00c3\\u00a2\\u00e2\\u201a\\u00ac\\u00cb\\u0153': '📷',
  '\\u00c3\\u00a2\\u00e2\\u20ac\\u0161\\u00c2\\u00ac\\u00c3\\u201a\\u00c2\\u00a2': '📢',
  '\\u00c3\\u00b0\\u00c5\\u00b8\\u00c5\\u2019\\u00c2\\u00bf': '👷'
};

const mapExact = new Map();
Object.keys(exactReplacements).forEach(k => {
   let actualString = k.split('\\u').filter(x => x).map(x => String.fromCharCode(parseInt(x, 16))).join('');
   mapExact.set(actualString, exactReplacements[k]);
});

files.forEach(file => {
  let filepath = path.join(dir, file);
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;
  
  for (const [bad, good] of mapExact.entries()) {
    content = content.split(bad).join(good);
  }
  
  // Clean empty emoji braces: {' '} or {''}
  content = content.replace(/{' '}/g, '');
  content = content.replace(/{''}/g, '');

  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('Fixed exact unicode escapes in', file);
  }
});
