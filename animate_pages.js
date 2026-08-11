const fs = require('fs');
const path = require('path');

const filesToAnimate = [
  'Menu.jsx',
  'MenuItemDetails.jsx',
  'Contact.jsx',
  'Login.jsx',
  'Register.jsx',
  'Checkout.jsx',
  'MyOrders.jsx',
];

filesToAnimate.forEach(file => {
  const filePath = path.join(__dirname, 'client', 'src', 'pages', file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Skip if already animated
  if (content.includes('PageTransition')) return;

  // 1. Add imports
  content = content.replace(
    "import React",
    "import React, { useEffect } from 'react';\nimport PageTransition from '../components/PageTransition';"
  );
  
  if (!content.includes('framer-motion')) {
    content = content.replace(
      "import PageTransition",
      "import PageTransition from '../components/PageTransition';\nimport { motion } from 'framer-motion';"
    );
  }

  // 2. Wrap return statement with <PageTransition>
  // Find the main return statement of the component
  const returnRegex = /return\s*\(\s*(<div[^>]*>)/;
  const match = content.match(returnRegex);
  
  if (match) {
    content = content.replace(
      returnRegex,
      'return (\n    <PageTransition>\n    $1'
    );

    // Add closing </PageTransition> at the end
    content = content.replace(
      /(\s*)\);\s*};\s*export default/g,
      '$1    </PageTransition>\n$1  );\n};\n\nexport default'
    );
  }

  fs.writeFileSync(filePath, content);
  console.log(`Animated: ${file}`);
});
