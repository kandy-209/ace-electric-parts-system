/**
 * Sample Parts Generator
 * Generates realistic sample parts data for testing and initial population
 */

import { ImportPart } from './parts-importer';

// Common electric motor parts categories
const categories = {
  bearings: ['Bearing', 'Ball Bearing', 'Roller Bearing', 'Sleeve Bearing'],
  windings: ['Wire', 'Magnet Wire', 'Winding Wire', 'Copper Wire'],
  seals: ['Shaft Seal', 'Oil Seal', 'Lip Seal', 'Mechanical Seal'],
  shafts: ['Motor Shaft', 'Shaft Extension', 'Keyed Shaft', 'Tapered Shaft'],
  fans: ['Cooling Fan', 'Fan Blade', 'Fan Housing'],
  capacitors: ['Start Capacitor', 'Run Capacitor', 'Dual Capacitor'],
  switches: ['Pressure Switch', 'Float Switch', 'Thermal Switch'],
  pumps: ['Impeller', 'Pump Housing', 'Wear Ring', 'Seal Plate'],
  couplings: ['Flexible Coupling', 'Rigid Coupling', 'Chain Coupling'],
  mechanical: ['Bracket', 'Mount', 'Base Plate', 'Pulley'],
};

// NEMA frame sizes
const nemaFrames = ['143T', '145T', '182T', '184T', '213T', '215T', '254T', '256T', '284T', '324T', '326T', '364T', '404T', '405T', '449T'];

// Horsepower ranges
const hpRanges = ['0.5-1', '1-2', '2-5', '5-10', '10-25', '25-50', '50-100', '100+'];

// Common manufacturers
const manufacturers = [
  'Baldor', 'Leeson', 'Marathon', 'Siemens', 'ABB', 'Toshiba', 'GE', 'WEG',
  'Franklin Electric', 'Grundfos', 'ITT', 'Goulds', 'Flowserve', 'Ebara',
];

/**
 * Generate sample parts for a category
 */
export function generateSampleParts(
  category: keyof typeof categories,
  count: number = 50
): ImportPart[] {
  const parts: ImportPart[] = [];
  const subcategories = categories[category];

  for (let i = 0; i < count; i++) {
    const manufacturer = manufacturers[Math.floor(Math.random() * manufacturers.length)];
    const subcategory = subcategories[Math.floor(Math.random() * subcategories.length)];
    const partNum = `${category.toUpperCase().substring(0, 3)}-${manufacturer.substring(0, 3).toUpperCase()}-${String(i + 1).padStart(4, '0')}`;
    
    const part: ImportPart = {
      part_number: partNum,
      manufacturer_part_number: `${manufacturer}-${subcategory.replace(/\s/g, '')}-${i + 1}`,
      description: `${manufacturer} ${subcategory} - ${getCategoryDescription(category)}`,
      category: category,
      subcategory: subcategory,
      manufacturer: manufacturer,
      unit_cost: Math.round((Math.random() * 500 + 10) * 100) / 100,
      current_stock: Math.floor(Math.random() * 100),
      min_stock_level: Math.floor(Math.random() * 20) + 5,
      data_source: 'import',
      seo_keywords: [
        category,
        subcategory.toLowerCase(),
        manufacturer.toLowerCase(),
        getCategoryDescription(category).toLowerCase(),
      ],
    };

    // Add category-specific technical specs
    if (category === 'bearings') {
      part.technical_specs = {
        inner_diameter: `${Math.floor(Math.random() * 50) + 10}mm`,
        outer_diameter: `${Math.floor(Math.random() * 100) + 30}mm`,
        type: ['Ball', 'Roller', 'Needle'][Math.floor(Math.random() * 3)],
      };
    } else if (category === 'windings') {
      part.technical_specs = {
        gauge: `${Math.floor(Math.random() * 20) + 10} AWG`,
        material: 'Copper',
        insulation: 'Class F',
      };
    } else if (category === 'shafts') {
      const frame = nemaFrames[Math.floor(Math.random() * nemaFrames.length)];
      part.technical_specs = {
        diameter: `${Math.floor(Math.random() * 5) + 1} inches`,
        length: `${Math.floor(Math.random() * 20) + 5} inches`,
        material: 'Steel',
      };
      part.motor_compatibility = {
        frame_sizes: [frame],
        hp_ranges: hpRanges[Math.floor(Math.random() * hpRanges.length)],
      };
    } else if (category === 'capacitors') {
      part.technical_specs = {
        capacitance: `${Math.floor(Math.random() * 500) + 50} µF`,
        voltage: `${Math.floor(Math.random() * 300) + 110} V`,
        type: ['Start', 'Run', 'Dual'][Math.floor(Math.random() * 3)],
      };
    }

    parts.push(part);
  }

  return parts;
}

function getCategoryDescription(category: keyof typeof categories): string {
  const descriptions: Record<string, string> = {
    bearings: 'Precision bearing for electric motor applications',
    windings: 'High-quality magnet wire for motor windings',
    seals: 'Reliable sealing solution for motor shafts',
    shafts: 'Precision-machined motor shaft component',
    fans: 'Efficient cooling fan assembly',
    capacitors: 'Motor start/run capacitor',
    switches: 'Motor protection and control switch',
    pumps: 'Industrial pump component',
    couplings: 'Motor-to-pump coupling assembly',
    mechanical: 'Motor mounting and support component',
  };
  return descriptions[category] || 'Electric motor component';
}

/**
 * Generate comprehensive sample parts database
 */
export function generateCompleteSampleDatabase(): ImportPart[] {
  const allParts: ImportPart[] = [];

  // Generate parts for each category
  Object.keys(categories).forEach((category) => {
    const categoryParts = generateSampleParts(category as keyof typeof categories, 30);
    allParts.push(...categoryParts);
  });

  return allParts;
}

