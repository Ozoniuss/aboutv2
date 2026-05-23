// Scans all .html files under src/ and ensures every external link has
// target="_blank" and rel="noopener noreferrer". Pass --dry-run to preview
// which links would be changed without modifying any files.
//
// node fix-links.js [--dry-run]

const fs = require('fs');
const path = require('path');

function findHtmlFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== '.git') {
      console.log(entry.name)
      files.push(...findHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

function processFile(content) {
  const report = [];
  let modified = false;

  const result = content.replace(/<a\s([^>]*)>/gi, (match, attrs) => {
    const hrefMatch = attrs.match(/href\s*=\s*["']([^"']*)["']/i);
    if (!hrefMatch) return match;

    const href = hrefMatch[1];
    if (!href.startsWith('http://') && !href.startsWith('https://')) return match;

    const hasTarget = /target\s*=\s*["']_blank["']/i.test(attrs);
    const hasRel = /rel\s*=\s*["'][^"']*noopener[^"']*["']/i.test(attrs) &&
      /rel\s*=\s*["'][^"']*noreferrer[^"']*["']/i.test(attrs);

    if (hasTarget && hasRel) return match;

    let newAttrs = attrs.trimEnd();

    if (!hasTarget && !hasRel) {
      newAttrs += ' target="_blank" rel="noopener noreferrer"';
      report.push({ href, missing: 'target="_blank" rel="noopener noreferrer"' });
    } else if (!hasTarget) {
      newAttrs += ' target="_blank"';
      report.push({ href, missing: 'target="_blank"' });
    } else {
      newAttrs += ' rel="noopener noreferrer"';
      report.push({ href, missing: 'rel="noopener noreferrer"' });
    }

    modified = true;
    return `<a ${newAttrs}>`;
  });

  return { result, modified, report };
}

const srcDir = path.join(__dirname, 'src');
const htmlFiles = findHtmlFiles(srcDir);

let totalFixed = 0;
const dryRun = process.argv.includes('--dry-run');

if (dryRun) {
  console.log('Dry run — no files will be modified.\n');
}

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const { result, modified, report } = processFile(content);

  if (modified) {
    const relPath = path.relative(__dirname, file);
    console.log(`${relPath}:`);
    for (const { href, missing } of report) {
      console.log(`  + ${missing}`);
      console.log(`    ${href}`);
    }
    console.log();

    if (!dryRun) {
      fs.writeFileSync(file, result, 'utf8');
    }

    totalFixed += report.length;
  }
}

if (totalFixed === 0) {
  console.log('All external links already have the required attributes.');
} else {
  console.log(`${dryRun ? 'Would fix' : 'Fixed'} ${totalFixed} link(s) across ${htmlFiles.filter(f => {
    const c = fs.readFileSync(f, 'utf8');
    return processFile(c).modified;
  }).length} file(s).`);
}
