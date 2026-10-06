

const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const TEMPLATE_FILE = path.join(ROOT_DIR, 'partials', 'header.html');

// Map HTML files to navigation identifier
const NAV_MAP = {
  'index.html': 'home',
  'about.html': 'about',
  'director.html': 'about',
  'departments.html': 'departments',
  'orthopedics.html': 'departments',
  'neurology.html': 'departments',
  'internal-medicine.html': 'departments',
  'ent.html': 'departments',
  'pulmonology.html': 'departments',
  'cardiology.html': 'departments',
  'doctors.html': 'doctors',
  'gallery.html': 'gallery',
  'appointment.html': 'appointment',
  'blog.html': 'blog',
  'contact.html': 'contact',
  'services.html': 'departments',
  'faqs.html': 'about'
};

function main() {
  if (!fs.existsSync(TEMPLATE_FILE)) {
    console.error(`Error: Master header template not found at: ${TEMPLATE_FILE}`);
    process.exit(1);
  }

  const templateContent = fs.readFileSync(TEMPLATE_FILE, 'utf-8').trim();
  console.log(`\n======================================================`);
  console.log(`  Parth Hospital - Header Synchronizer`);
  console.log(`======================================================`);
  console.log(`Master Template: partials/header.html\n`);

  const files = fs.readdirSync(ROOT_DIR).filter(file => {
    return file.endsWith('.html') && !file.startsWith('.') && fs.statSync(path.join(ROOT_DIR, file)).isFile();
  });

  let updatedCount = 0;

  files.forEach(fileName => {
    const filePath = path.join(ROOT_DIR, fileName);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Generate page-specific header with active nav link
    const targetNav = NAV_MAP[fileName] || '';
    let pageHeader = templateContent;

    // Reset any active class first from all nav links
    pageHeader = pageHeader.replace(/(<a\b[^>]*\bclass=["'])([^"']*)(["'][^>]*>)/gi, (match, prefix, classList, suffix) => {
      const cleanClasses = classList.split(/\s+/).filter(c => c && c !== 'active').join(' ');
      return `${prefix}${cleanClasses}${suffix}`;
    });

    // Add active class to corresponding link using targetNav
    if (targetNav) {
      const tagRegex = new RegExp(`(<a\\b[^>]*\\bdata-nav=["']${targetNav}["'][^>]*>)`, 'i');
      if (tagRegex.test(pageHeader)) {
        pageHeader = pageHeader.replace(tagRegex, (fullTag) => {
          return fullTag.replace(/class=["']([^"']*)["']/, (m, cls) => {
            const classes = cls.split(/\s+/).filter(c => c && c !== 'active');
            classes.push('active');
            return `class="${classes.join(' ')}"`;
          });
        });
      }
    }

    const wrappedHeader = `<!-- START: SITE HEADER (Source: partials/header.html) -->\n${pageHeader}\n<!-- END: SITE HEADER -->`;

    let replaced = false;

    // 1. Check if boundary markers exist
    const boundaryRegex = /<!-- START: SITE HEADER[\s\S]*?-->[\s\S]*?<!-- END: SITE HEADER -->/;
    if (boundaryRegex.test(content)) {
      content = content.replace(boundaryRegex, wrappedHeader);
      replaced = true;
    } else {
      // 2. Otherwise find <header ...> ... </header> tag
      const headerTagRegex = /<header\b[^>]*>[\s\S]*?<\/header>/i;
      if (headerTagRegex.test(content)) {
        content = content.replace(headerTagRegex, wrappedHeader);
        replaced = true;
      }
    }

    if (replaced) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(` [OK] Updated: ${fileName.padEnd(25)} (Active nav: ${targetNav || 'none'})`);
      updatedCount++;
    } else {
      console.warn(` [SKIP] No <header> tag found in: ${fileName}`);
    }
  });

  console.log(`\n======================================================`);
  console.log(`  Done! Successfully synced header in ${updatedCount} pages.`);
  console.log(`======================================================\n`);
}

main();
