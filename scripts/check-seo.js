#!/usr/bin/env node

/**
 * SEO Check Script
 * Validates SEO implementation and provides recommendations
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 SEO Check Script\n');
console.log('='.repeat(50));

const checks = [];
const errors = [];
const warnings = [];

// Check 1: Verify sitemap exists
try {
  const sitemapPath = path.join(process.cwd(), 'src/app/sitemap.ts');
  if (fs.existsSync(sitemapPath)) {
    checks.push({ name: 'Sitemap file exists', status: '✅' });
  } else {
    errors.push('Sitemap file not found');
  }
} catch (e) {
  errors.push(`Error checking sitemap: ${e.message}`);
}

// Check 2: Verify robots.txt exists
try {
  const robotsPath = path.join(process.cwd(), 'src/app/robots.ts');
  if (fs.existsSync(robotsPath)) {
    checks.push({ name: 'Robots.txt file exists', status: '✅' });
  } else {
    errors.push('Robots.txt file not found');
  }
} catch (e) {
  errors.push(`Error checking robots.txt: ${e.message}`);
}

// Check 3: Verify SEO utility file
try {
  const seoPath = path.join(process.cwd(), 'src/lib/seo.ts');
  if (fs.existsSync(seoPath)) {
    checks.push({ name: 'SEO utility functions exist', status: '✅' });
  } else {
    errors.push('SEO utility file not found');
  }
} catch (e) {
  errors.push(`Error checking SEO utilities: ${e.message}`);
}

// Check 4: Verify structured data in layout
try {
  const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  
  if (layoutContent.includes('application/ld+json')) {
    checks.push({ name: 'Structured data (Schema.org) implemented', status: '✅' });
  } else {
    warnings.push('No structured data found in layout');
  }
  
  if (layoutContent.includes('generateLocalBusinessSchema')) {
    checks.push({ name: 'LocalBusiness schema included', status: '✅' });
  }
} catch (e) {
  errors.push(`Error checking layout: ${e.message}`);
}

// Check 5: Verify metadata in pages
try {
  const pagePath = path.join(process.cwd(), 'src/app/page.tsx');
  const pageContent = fs.readFileSync(pagePath, 'utf8');
  
  if (pageContent.includes('generatePageMetadata')) {
    checks.push({ name: 'Page metadata implemented', status: '✅' });
  } else {
    warnings.push('Page metadata not using SEO utilities');
  }
} catch (e) {
  errors.push(`Error checking homepage: ${e.message}`);
}

// Check 6: Verify Web Vitals component
try {
  const webVitalsPath = path.join(process.cwd(), 'src/components/WebVitals.tsx');
  if (fs.existsSync(webVitalsPath)) {
    checks.push({ name: 'Web Vitals tracking component exists', status: '✅' });
  } else {
    warnings.push('Web Vitals tracking not found');
  }
} catch (e) {
  warnings.push(`Web Vitals component not found`);
}

// Check 7: Verify next.config optimization
try {
  const configPath = path.join(process.cwd(), 'next.config.ts');
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  if (configContent.includes('compress: true')) {
    checks.push({ name: 'Compression enabled', status: '✅' });
  }
  
  if (configContent.includes('image/avif')) {
    checks.push({ name: 'Image optimization configured', status: '✅' });
  }
  
  if (configContent.includes('Cache-Control')) {
    checks.push({ name: 'Cache headers configured', status: '✅' });
  }
} catch (e) {
  warnings.push(`Could not verify next.config.ts`);
}

// Display results
console.log('\n✅ Passed Checks:');
checks.forEach(check => {
  console.log(`   ${check.status} ${check.name}`);
});

if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  warnings.forEach(warning => {
    console.log(`   ⚠️  ${warning}`);
  });
}

if (errors.length > 0) {
  console.log('\n❌ Errors:');
  errors.forEach(error => {
    console.log(`   ❌ ${error}`);
  });
}

console.log('\n' + '='.repeat(50));
console.log(`\nSummary: ${checks.length} checks passed`);
if (warnings.length > 0) console.log(`          ${warnings.length} warnings`);
if (errors.length > 0) console.log(`          ${errors.length} errors`);

// Recommendations
console.log('\n📋 Recommendations:');
console.log('   1. Submit sitemap to Google Search Console');
console.log('   2. Create Google Business Profile');
console.log('   3. Add Google Analytics tracking');
console.log('   4. Test structured data: https://search.google.com/test/rich-results');
console.log('   5. Run Lighthouse audit: Chrome DevTools > Lighthouse');
console.log('   6. Check Core Web Vitals: https://pagespeed.web.dev/');

if (errors.length === 0 && warnings.length === 0) {
  console.log('\n🎉 All SEO checks passed!');
  process.exit(0);
} else {
  console.log('\n⚠️  Please address warnings and errors above');
  process.exit(1);
}

