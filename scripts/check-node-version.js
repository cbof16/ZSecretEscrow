#!/usr/bin/env node

const semver = require('semver');
const { engines } = require('../package.json');
const version = engines.node;

if (!semver.satisfies(process.version, version)) {
  console.error(`Required node version ${version} not satisfied with current version ${process.version}.`);
  console.error('Please use Node.js 18.x LTS (Hydrogen) for this project.');
  console.error('We recommend using nvm to manage Node.js versions:');
  console.error('  1. Install nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash');
  console.error('  2. Install Node.js 18: nvm install lts/hydrogen');
  console.error('  3. Use Node.js 18: nvm use lts/hydrogen');
  process.exit(1);
}
