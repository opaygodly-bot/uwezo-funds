#!/usr/bin/env node
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const cwd = process.cwd();
const input = path.resolve(cwd, 'src', 'assets', 'logo.svg');
const output = path.resolve(cwd, 'src', 'assets', 'logo.png');

const argv = process.argv.slice(2);
const width = argv[0] ? parseInt(argv[0], 10) : 512;

async function run() {
  if (!fs.existsSync(input)) {
    console.error(`Input SVG not found: ${input}`);
    process.exit(2);
  }

  try {
    await sharp(input)
      .resize({ width })
      .png({ quality: 90 })
      .toFile(output);

    console.log(`Exported ${output} (${width}px)`);
  } catch (err) {
    console.error('Failed to export logo:', err);
    process.exit(1);
  }
}

run();
