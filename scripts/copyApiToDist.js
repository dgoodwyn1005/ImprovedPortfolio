#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

async function copyDir(src, dest) {
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  const repoRoot = path.resolve(__dirname, '..');
  const src = path.join(repoRoot, 'api');
  const dest = path.join(repoRoot, 'dist', 'api');

  try {
    const stat = await fs.promises.stat(src);
    if (!stat.isDirectory()) {
      console.warn('No api directory found to copy.');
      process.exit(0);
    }
  } catch (err) {
    console.warn('No api directory found to copy.');
    process.exit(0);
  }

  try {
    console.log(`Copying ${src} -> ${dest}`);
    await copyDir(src, dest);
    console.log('API files copied to dist/api');
  } catch (err) {
    console.error('Failed to copy api directory:', err);
    process.exit(2);
  }
}

main();
