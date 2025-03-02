// Script to update image paths in the code to match the generated filenames
// Run with: node scripts/update-image-paths.js

const fs = require('fs');
const path = require('path');

// Path to the results page component
const resultsPagePath = path.join(__dirname, '../src/app/results/page.js');

// Read the file
let content = fs.readFileSync(resultsPagePath, 'utf8');

// Define the mapping of old paths to new paths
const pathMapping = {
  '/images/vitamin-a.jpg': '/images/vitamin_a.png',
  '/images/beta-carotene.jpg': '/images/beta-carotene.png',
  '/images/lutein.jpg': '/images/lutein.png',
  '/images/zeaxanthin.jpg': '/images/zeaxanthin.png',
  '/images/vitamin-b12.jpg': '/images/vitamin-b12.png',
  '/images/b-complex.jpg': '/images/b-complex.png',
  '/images/folate.jpg': '/images/folate.png',
  '/images/iron.jpg': '/images/iron.png',
  '/images/vitamin-d.jpg': '/images/vitamin-d.png',
  '/images/calcium.jpg': '/images/calcium.png',
  '/images/magnesium.jpg': '/images/magnesium.png',
  '/images/vitamin-k2.jpg': '/images/vitamin-k2.png',
  '/images/zinc.jpg': '/images/zinc.png',
  '/images/multivitamin.jpg': '/images/multivitamin.png',
  '/images/omega-3.jpg': '/images/omega-3.png',
  '/images/probiotics.jpg': '/images/probiotics.png',
  '/images/antioxidants.jpg': '/images/antioxidants.png',
  '/images/placeholder.jpg': '/images/vitamin.jpg'
};

// Replace all occurrences of old paths with new paths
Object.entries(pathMapping).forEach(([oldPath, newPath]) => {
  content = content.replace(new RegExp(oldPath.replace(/\//g, '\\/').replace(/\./g, '\\.'), 'g'), newPath);
});

// Write the updated content back to the file
fs.writeFileSync(resultsPagePath, content);

console.log('Updated image paths in', resultsPagePath);
console.log('The following mappings were applied:');
Object.entries(pathMapping).forEach(([oldPath, newPath]) => {
  console.log(`  ${oldPath} -> ${newPath}`);
}); 