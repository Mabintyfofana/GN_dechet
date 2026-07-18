const fs = require('fs');
const path = require('path');
const dir = 'src/screens';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const replacements = {
  '\ufffd': '', // replacement char
  '\ufffd️ï¸ ': '',
  'ð Â°': '',
  'ðÂ': '',
  'â€”Ã¯Â¸Â ': '🗑️',
  'ðÅ’Â¿': '🌿',
  '': '',
  '️ï¸ ': '🗑️',
  '🗑️ï¸ ': '🗑️'
};

files.forEach(file => {
  let filepath = path.join(dir, file);
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;
  
  for (const [bad, good] of Object.entries(replacements)) {
    content = content.split(bad).join(good);
  }
  
  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log('Fixed stragglers in', file);
  }
});
