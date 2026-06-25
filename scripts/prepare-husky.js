const { existsSync } = require('node:fs');
const { join } = require('node:path');
const { spawnSync } = require('node:child_process');

const isProduction = process.env.NODE_ENV === 'production';
const isCi = process.env.CI === 'true';
const gitDir = join(__dirname, '..', '.git');
const huskyBin = join(__dirname, '..', 'node_modules', '.bin', process.platform === 'win32' ? 'husky.cmd' : 'husky');

if (isProduction || isCi || !existsSync(gitDir) || !existsSync(huskyBin)) {
  process.exit(0);
}

const result = spawnSync(huskyBin, {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

process.exit(result.status ?? 0);
