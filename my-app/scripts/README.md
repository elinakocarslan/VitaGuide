# Image Generation Scripts

This directory contains scripts to help generate placeholder images for vitamins and supplements in the VitaGuide application.

## Option 1: Generate HTML Templates for Screenshots

The `generate-placeholders.js` script creates HTML files that you can open in a browser and take screenshots of to use as placeholder images.

### Usage:

```bash
node scripts/generate-placeholders.js
```

This will create HTML files in the `public/images` directory. Open each file in a browser, take a screenshot, and save it with the appropriate name.

## Option 2: Generate Images Directly (Recommended)

The `generate-image-placeholders.js` script uses the Node.js Canvas API to generate placeholder images directly.

### Prerequisites:

Install the required dependencies:

```bash
npm install canvas
```

### Usage:

```bash
node scripts/generate-image-placeholders.js
```

This will generate PNG images for all the vitamins and supplements in the `public/images` directory.

## Updating Image Paths

After generating the images, make sure the image paths in your code match the generated filenames. The image paths are defined in the `recommendationMap` object in `src/app/results/page.js`.

For example, if you generated an image named `vitamin-b12.png`, the corresponding path in the code should be `/images/vitamin-b12.png`. 