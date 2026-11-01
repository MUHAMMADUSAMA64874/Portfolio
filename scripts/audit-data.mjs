/**
 * Data audit for the portfolio.
 *
 * Fails loudly if a project points at a file that does not exist, carries an
 * unknown status/category, or reuses an id. Run before publishing:
 *
 *   node scripts/audit-data.mjs
 */

import { projects, statusMeta, categories, projectStats } from '../js/data.js';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
process.chdir(ROOT);

const thumbFor = (project) => {
  if (project.thumb) return project.thumb;
  const clean = String(project.image || '').replace(/^\.\//, '');
  if (!clean) return '';
  const base = clean.split('/').pop().replace(/\.[^.]+$/, '');
  return `assets/images/thumbs/${base}.webp`;
};

const missingFiles = [];
const badStatus = [];
const duplicateIds = new Set();
const seen = new Set();

for (const project of projects) {
  if (seen.has(project.id)) duplicateIds.add(project.id);
  seen.add(project.id);

  if (!project.status) badStatus.push(`${project.id}: no status`);
  else if (!statusMeta[project.status]) badStatus.push(`${project.id}: unknown status "${project.status}"`);

  if (!categories.includes(project.category)) badStatus.push(`${project.id}: unknown category "${project.category}"`);

  const files = [thumbFor(project), project.image, ...(project.gallery || []).map(shot => shot.src)].filter(Boolean);
  for (const file of files) {
    if (!fs.existsSync(file)) missingFiles.push(`${project.id} :: ${file}`);
  }
}

const usedAssets = new Set();
for (const project of projects) {
  usedAssets.add(thumbFor(project));
  usedAssets.add(project.image);
  for (const shot of project.gallery || []) usedAssets.add(shot.src);
}
const unusedThumbs = fs.readdirSync('assets/images/thumbs')
  .map(file => `assets/images/thumbs/${file}`)
  .filter(file => !usedAssets.has(file) && !file.includes('banner'));

console.log(`projects: ${projectStats.total}`);
console.log(`featured: ${projects.filter(p => p.featured).length}`);
console.log(`stats: ${JSON.stringify(projectStats)}`);
console.log(`duplicate ids: ${duplicateIds.size ? [...duplicateIds].join(', ') : 'none'}`);
console.log(`status/category problems: ${badStatus.length ? '\n  ' + badStatus.join('\n  ') : 'none'}`);
console.log(`missing files: ${missingFiles.length ? '\n  ' + missingFiles.join('\n  ') : 'none'}`);
console.log(`unused thumbnails: ${unusedThumbs.length ? unusedThumbs.length : 'none'}`);

const failed = duplicateIds.size || badStatus.length || missingFiles.length;
if (failed) process.exitCode = 1;
