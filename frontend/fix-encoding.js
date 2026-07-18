const fs = require('fs');
const path = require('path');
const dir = 'src/screens';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

// These mappings cover the corrupted character sequences found in the project.
const replacements = {
  'ÃƒÆ’Ã‚Â©': 'e',
  'ÃƒÆ’Ã‚Â¨': 'e',
  'ÃƒÆ’Ã‚Â ': 'a',
  'ÃƒÆ’Ã¢â‚¬Â°': 'E',
  'ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦': '✅',
  'ÃƒÂ¢Ã¢â‚¬Â Ã‚Â': '<',
  'ÃƒÂ¢Ã…Â¡Ã¢â€žÂ¢ÃƒÂ¯Ã‚Â¸Ã‚Â': '⚙️',
  'ÃƒÂ°Ã…Â¸Ã¢â‚¬â„¢Ã‚Â¾': '💾',
  'ðŸ  ': '🏠',
  'ðŸ“ ': '📍',
  'ðŸ“ž': '📞',
  'â˜Žï¸ ': '☎️',
  'ðŸ› ï¸ ': '🛍️',
  'ðŸ—‘ï¸ ': '🗑️',
  'ðŸ“¦': '📦',
  'â™»ï¸ ': '♻️',
  'â ³': '⏳',
  'ðŸšª': '🚪',
  'ðŸ‘¨‍ðŸ’¼': '👨‍💼',
  'ðŸ“ˆ': '📈',
  'ðŸ‘¥': '👥',
  'ðŸ“„': '📄',
  'ðŸšš': '🚚',
  'ðŸ’°': '💰',
  'âœ…': '✅',
  'ðŸ“·': '📷',
  'ðŸ ƒ‍â™‚ï¸ ': '🏃‍♂️',
  'ðŸ“¢': '📢',
  '🏁': '✅',
  '💬': '💬',
  '🏃‍♂️': '👷',
  'Ã©': 'e',
  'Ã¨': 'e',
  'Ã ': 'a',
  'â€™': "'",
  'ðŸ‘·': '👷',
  'Ã°Å¸Â Â¢': '🏢',
  'Ã°Å¸â€œÅ¾': '📞',
  'Ã¢Å¡â„¢Ã¯Â¸Â ': '⚙️',
  'Ã°Å¸â€˜Â¥': '👥',
  'Ã°Å¸â€˜Â·': '👷',
  'Ã¢Å“â€¦': '✅',
  'Ã¢Â Å’': '❌',
  'Ã°Å¸Å¡Âª': '🚪',
  'ÃƒÂ©': 'e',
  'ÃƒÂ¨': 'e',
  'ÃƒÂ ': 'a',
  'ÃƒÂ¢': 'a',
  'ÃƒÂ´': 'o',
  'ÃƒÂ®': 'i',
  'ÃƒÂ»': 'u',
  'ÃƒÂ§': 'c',
  'ÃƒÂ¯': 'i',
  'ÃƒÂ«': 'e',
  'Ã¢â‚¬â„¢': "'",
  'â† ': '<',
  'â€¢': '•',
  'ðŸš¨': '🚨',
  'ðŸ—‘': '🗑️',
  'âš™ï¸ ': '⚙️',
  'â Œ': '❌',
  'âš ï¸ ': '⚠️',
  'ðŸ—“ï¸ ': '📅',
  // Handling the newly discovered ones from the grep:
  'ǟ\'\'s': 'é',
  'ǟ\'\'': 'é',
  'ǟǽ?s\'': 'e',
  'ǟ.ǽ\'"?': '📍',
  'ǟ.ǽ\'".': '📞',
  'ǟ.ǽ\'oǽ\'': '👋',
  'ǟǽ\'\'ǟ\'\'?': 'ℹ️'
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
    console.log('Fixed', file);
  }
});
