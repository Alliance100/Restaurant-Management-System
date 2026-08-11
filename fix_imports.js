const fs = require('fs');
const path = require('path');

const filesToFix = [
  'MenuItemDetails.jsx',
  'Contact.jsx',
  'Login.jsx',
  'Register.jsx',
  'Checkout.jsx',
  'MyOrders.jsx',
];

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, 'client', 'src', 'pages', file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Fix the mangled import line
  const mangledRegex = /import\s+\{\s*motion\s*\}\s*from\s+'framer-motion';\s*from\s+'\.\.\/components\/PageTransition';,\s*(.*)from\s+'react';/;
  
  if (content.match(mangledRegex)) {
    content = content.replace(mangledRegex, (match, p1) => {
        // If p1 is just `{ useState } `, we change it to `import { useState } from 'react';`
        return `import { motion } from 'framer-motion';\nimport ${p1}from 'react';`;
    });
  }

  // Also fix Home.jsx and Menu.jsx if they have this issue, just in case
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed imports in ${file}`);
});
