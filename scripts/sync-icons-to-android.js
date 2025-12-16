const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const iconsDir = path.join(root, 'public', 'assets', 'icons');
const androidRes = path.join(root, 'android', 'app', 'src', 'main', 'res');

const map = [
  { size: 48, dir: 'mipmap-mdpi' },
  { size: 72, dir: 'mipmap-hdpi' },
  { size: 96, dir: 'mipmap-xhdpi' },
  { size: 144, dir: 'mipmap-xxhdpi' },
  { size: 192, dir: 'mipmap-xxxhdpi' }
];

if (!fs.existsSync(iconsDir)) {
  console.error('Icons not found. Run `npm run generate:icons` first.');
  process.exit(1);
}

if (!fs.existsSync(androidRes)) {
  console.warn('Android project not found. Run `npm run cap:add:android` first.');
  process.exit(0);
}

map.forEach(({ size, dir }) => {
  const src = path.join(iconsDir, `icon-${size}x${size}.png`);
  const destDir = path.join(androidRes, dir);
  if (!fs.existsSync(src)) return console.warn('Missing', src);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  // Copy as ic_launcher.png (simple fallback)
  const dest = path.join(destDir, 'ic_launcher.png');
  fs.copyFileSync(src, dest);
  console.log(`Copied ${src} -> ${dest}`);
});

console.log('Icon sync complete. You may need to update adaptive icon xml in Android project.');
