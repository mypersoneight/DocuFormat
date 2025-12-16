const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const svgPath = path.resolve(__dirname, '../public/assets/icon.svg');
const outDir = path.resolve(__dirname, '../public/assets/icons');
const sizes = [48, 72, 96, 144, 192, 256, 384, 512];

async function main() {
  if (!fs.existsSync(svgPath)) {
    console.error('SVG source not found at', svgPath);
    process.exit(1);
  }

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const svgBuffer = fs.readFileSync(svgPath);

  await Promise.all(sizes.map(async (s) => {
    const out = path.join(outDir, `icon-${s}x${s}.png`);
    await sharp(svgBuffer).resize(s, s).png().toFile(out);
    console.log('wrote', out);
  }));

  // create an adaptive icon foreground (512x512) and a background
  const fg = path.join(outDir, 'ic_foreground.png');
  const bg = path.join(outDir, 'ic_background.png');

  await sharp(svgBuffer).resize(432, 432).png().toFile(fg);
  console.log('wrote', fg);

  // simple background: solid color PNG
  const bgBuffer = Buffer.from(`<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="432" height="432">\n  <rect width="100%" height="100%" fill="#06B6D4"/>\n</svg>`);
  await sharp(bgBuffer).png().toFile(bg);
  console.log('wrote', bg);

  console.log('All icons generated in public/assets/icons');
}

main().catch((err) => { console.error(err); process.exit(1); });
