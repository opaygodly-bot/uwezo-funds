#!/usr/bin/env node
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const cwd = process.cwd();
const input = path.resolve(cwd, 'src', 'assets', 'logo.svg');
const publicDir = path.resolve(cwd, 'public');

const targets = [
  { size: 192, name: 'logo-192.png' },
  { size: 512, name: 'logo-512.png' }
];

async function run() {
  if (!fs.existsSync(input)) {
    console.error(`Input SVG not found: ${input}`);
    process.exit(2);
  }

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  try {
    for (const t of targets) {
      const out = path.resolve(publicDir, t.name);
      await sharp(input)
        .resize({ width: t.size, height: t.size, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png({ quality: 90 })
        .toFile(out);
      console.log(`Exported ${out} (${t.size}px)`);
    }
  } catch (err) {
    console.error('Failed to export favicons:', err);
    process.exit(1);
  }
}

run();
