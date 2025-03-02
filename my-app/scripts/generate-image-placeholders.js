// Script to generate placeholder images for vitamins and supplements
// First install dependencies: npm install canvas
// Then run: node scripts/generate-image-placeholders.js

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// List of vitamins and supplements that need placeholder images
const items = [
  { name: 'vitamin-b12', emoji: '💊', color: '#FF9AA2' },
  { name: 'vitamin-d', emoji: '☀️', color: '#FFB347' },
  { name: 'vitamin-c', emoji: '🍊', color: '#FFD8B1' },
  { name: 'zinc', emoji: '🛡️', color: '#A0C4FF' },
  { name: 'magnesium', emoji: '💪', color: '#9BF6FF' },
  { name: 'beta-carotene', emoji: '🥕', color: '#FDCB6E' },
  { name: 'lutein', emoji: '👁️', color: '#55EFC4' },
  { name: 'zeaxanthin', emoji: '👁️', color: '#81ECEC' },
  { name: 'b-complex', emoji: '🔋', color: '#74B9FF' },
  { name: 'folate', emoji: '🌱', color: '#A0B96F' },
  { name: 'calcium', emoji: '🦴', color: '#DFE6E9' },
  { name: 'vitamin-k2', emoji: '🩸', color: '#FF7675' },
  { name: 'multivitamin', emoji: '💊', color: '#FFEAA7' },
  { name: 'omega-3', emoji: '🐟', color: '#7FDBDA' },
  { name: 'probiotics', emoji: '🦠', color: '#B8E994' },
  { name: 'antioxidants', emoji: '🍇', color: '#D6A2E8' }
];

// Create the directory if it doesn't exist
const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Function to create a placeholder image
function createPlaceholderImage(item) {
  const width = 300;
  const height = 300;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = item.color;
  ctx.fillRect(0, 0, width, height);

  // Add a subtle pattern
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  for (let i = 0; i < width; i += 20) {
    for (let j = 0; j < height; j += 20) {
      ctx.fillRect(i, j, 10, 10);
    }
  }

  // Add emoji
  ctx.font = '80px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(item.emoji, width / 2, height / 2 - 40);

  // Add name
  ctx.font = 'bold 24px Arial';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillText(item.name.replace(/-/g, ' ').toUpperCase(), width / 2, height / 2 + 40);

  // Add a border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 10;
  ctx.strokeRect(10, 10, width - 20, height - 20);

  // Save the image
  const buffer = canvas.toBuffer('image/png');
  const filePath = path.join(imagesDir, `${item.name}.png`);
  fs.writeFileSync(filePath, buffer);
  
  console.log(`Created placeholder image for ${item.name} at ${filePath}`);
}

// Generate images for each item
items.forEach(item => {
  try {
    createPlaceholderImage(item);
  } catch (error) {
    console.error(`Error creating image for ${item.name}:`, error);
  }
});

console.log('\nPlaceholder images have been generated in the public/images directory.');
console.log('To use these images, make sure the paths in your code match the generated filenames.'); 