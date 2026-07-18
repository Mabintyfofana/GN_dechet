const fs = require('fs');
const path = require('path');
const dir = 'src/screens';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
files.forEach(file => {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');
  if (content.match(/[^\x00-\x7F]/)) {
    console.log(file);
    let match = content.match(/[^\x00-\x7F]+/g);
    let unique = Array.from(new Set(match));
    console.log("   Contains: ", unique.join(' '));
  }
});
