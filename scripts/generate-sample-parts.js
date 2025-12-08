#!/usr/bin/env node

/**
 * Generate Sample Parts Data
 * Creates a CSV file with sample parts for import
 */

const fs = require('fs');
const path = require('path');

const categories = {
  bearings: ['Bearing', 'Ball Bearing', 'Roller Bearing'],
  windings: ['Wire', 'Magnet Wire', 'Winding Wire'],
  seals: ['Shaft Seal', 'Oil Seal', 'Mechanical Seal'],
  shafts: ['Motor Shaft', 'Shaft Extension'],
  fans: ['Cooling Fan', 'Fan Blade'],
  capacitors: ['Start Capacitor', 'Run Capacitor'],
  switches: ['Pressure Switch', 'Float Switch'],
  pumps: ['Impeller', 'Pump Housing', 'Wear Ring'],
  couplings: ['Flexible Coupling', 'Rigid Coupling'],
  mechanical: ['Bracket', 'Mount', 'Base Plate'],
};

const manufacturers = [
  'Baldor', 'Leeson', 'Marathon', 'Siemens', 'ABB', 'Toshiba',
  'GE', 'WEG', 'Franklin Electric', 'Grundfos', 'ITT', 'Goulds',
];

function generateParts(category, count = 30) {
  const parts = [];
  const subcategories = categories[category];

  for (let i = 0; i < count; i++) {
    const manufacturer = manufacturers[Math.floor(Math.random() * manufacturers.length)];
    const subcategory = subcategories[Math.floor(Math.random() * subcategories.length)];
    const partNum = `${category.substring(0, 3).toUpperCase()}-${manufacturer.substring(0, 3).toUpperCase()}-${String(i + 1).padStart(4, '0')}`;

    parts.push({
      part_number: partNum,
      manufacturer_part_number: `${manufacturer}-${subcategory.replace(/\s/g, '')}-${i + 1}`,
      description: `${manufacturer} ${subcategory}`,
      category: category,
      subcategory: subcategory,
      manufacturer: manufacturer,
      unit_cost: (Math.random() * 500 + 10).toFixed(2),
      current_stock: Math.floor(Math.random() * 100),
      min_stock_level: Math.floor(Math.random() * 20) + 5,
    });
  }

  return parts;
}

function generateCSV() {
  const headers = [
    'part_number',
    'manufacturer_part_number',
    'description',
    'category',
    'subcategory',
    'manufacturer',
    'unit_cost',
    'current_stock',
    'min_stock_level',
  ];

  const allParts = [];
  Object.keys(categories).forEach((category) => {
    allParts.push(...generateParts(category, 30));
  });

  const csvRows = [
    headers.join(','),
    ...allParts.map((part) =>
      headers.map((header) => {
        const value = part[header] || '';
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    ),
  ];

  return csvRows.join('\n');
}

// Generate and save CSV
const csvContent = generateCSV();
const outputPath = path.join(__dirname, '..', 'data', 'sample-parts.csv');

// Create data directory if it doesn't exist
const dataDir = path.dirname(outputPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(outputPath, csvContent, 'utf8');

console.log(`✅ Generated ${csvContent.split('\n').length - 1} sample parts`);
console.log(`📁 Saved to: ${outputPath}`);
console.log(`\n📋 Import with:`);
console.log(`   npm run import:parts data/sample-parts.csv`);
console.log(`   OR`);
console.log(`   curl -X POST -F "file=@${outputPath}" http://localhost:3000/api/parts/import`);

