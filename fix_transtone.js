const fs = require('fs');
const path = require('path');

const directories = [
  path.join(__dirname, 'client', 'src'),
  path.join(__dirname, 'admin', 'src')
];

const extensions = ['.jsx', '.js', '.css'];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (extensions.includes(path.extname(fullPath))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('transtone')) {
        let newContent = content.replace(/transtone/g, 'translate');
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Fixed: ${fullPath}`);
      }
    }
  }
}

for (const dir of directories) {
  if (fs.existsSync(dir)) {
    processDirectory(dir);
  }
}

console.log("Done fixing transtone.");
