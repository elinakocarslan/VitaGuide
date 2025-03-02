// Script to generate placeholder images for vitamins and supplements
// Run with: node scripts/generate-placeholders.js

const fs = require('fs');
const path = require('path');

// List of vitamins and supplements that need placeholder images
const items = [
  'vitamin-b12',
  'vitamin-d',
  'vitamin-c',
  'zinc',
  'magnesium',
  'beta-carotene',
  'lutein',
  'zeaxanthin',
  'b-complex',
  'folate',
  'calcium',
  'vitamin-k2',
  'multivitamin',
  'omega-3',
  'probiotics',
  'antioxidants'
];

// Create the directory if it doesn't exist
const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Generate a simple HTML file for each item that can be used to create screenshots
items.forEach(item => {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>${item} Placeholder</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
      font-family: Arial, sans-serif;
    }
    .placeholder {
      width: 300px;
      height: 300px;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 20px;
      box-sizing: border-box;
      text-align: center;
    }
    .icon {
      font-size: 60px;
      margin-bottom: 20px;
    }
    .title {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      margin-bottom: 10px;
      text-transform: capitalize;
    }
    .subtitle {
      font-size: 16px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="placeholder">
    <div class="icon">💊</div>
    <div class="title">${item.replace(/-/g, ' ')}</div>
    <div class="subtitle">Placeholder Image</div>
  </div>
</body>
</html>
  `;

  const htmlFilePath = path.join(imagesDir, `${item}-placeholder.html`);
  fs.writeFileSync(htmlFilePath, htmlContent);
  
  console.log(`Created placeholder HTML for ${item} at ${htmlFilePath}`);
});

console.log('\nInstructions:');
console.log('1. Open each HTML file in a browser');
console.log('2. Take a screenshot of the placeholder');
console.log('3. Save the screenshot as [item-name].jpg or .png in the public/images directory');
console.log('4. Delete the HTML files after creating all images'); 