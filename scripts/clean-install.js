#!/usr/bin/env node
/*
  Cross-platform clean install helper:
  - Deletes node_modules and package-lock.json
  - Runs `npm cache clean --force`
  - Reinstalls dependencies via npm
*/
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function rm(p) {
  if (fs.existsSync(p)) {
    try {
      fs.rmSync(p, { recursive: true, force: true });
    } catch (e) {
      // Fallback for older Node versions
      try { require('rimraf')(p, () => {}); } catch {}
    }
  }
}

const projectRoot = path.resolve(__dirname, '..');
const nodeModules = path.join(projectRoot, 'node_modules');
const lockFile = path.join(projectRoot, 'package-lock.json');

console.log('Cleaning installation artifacts...');
rm(nodeModules);
rm(lockFile);

console.log('Running npm cache clean --force');
try { execSync('npm cache clean --force', { stdio: 'inherit' }); } catch (e) { console.warn('npm cache clean failed', e); }

console.log('Installing dependencies (npm)');
execSync('npm install', { stdio: 'inherit' });
console.log('Done.');
