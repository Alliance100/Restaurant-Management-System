const fs = require('fs');
const path = require('path');

const directories = [
  path.join(__dirname, 'client', 'src'),
  path.join(__dirname, 'admin', 'src')
];

const extensions = ['.jsx', '.js', '.css'];

const replacements = [
  // Colors
  { regex: /indigo/g, replace: 'orange' },
  { regex: /slate/g, replace: 'stone' },
  { regex: /violet/g, replace: 'amber' }, // Just to get rid of any purple/violet
  
  // Shapes
  { regex: /rounded-2xl/g, replace: 'rounded-none border border-stone-200 dark:border-stone-800' },
  { regex: /rounded-xl/g, replace: 'rounded-sm' },
  { regex: /rounded-full/g, replace: 'rounded-sm' }, // Optional: badges and buttons

  // Shadows
  { regex: /shadow-sm/g, replace: '' },
  { regex: /shadow-xl/g, replace: 'shadow-2xl' },
  { regex: /shadow-2xl/g, replace: 'shadow-2xl' },
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (extensions.includes(path.extname(fullPath))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const r of replacements) {
        content = content.replace(r.regex, r.replace);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

for (const dir of directories) {
  if (fs.existsSync(dir)) {
    processDirectory(dir);
  }
}

console.log("Done updating theme classes.");
