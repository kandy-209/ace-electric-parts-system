/**
 * Parts Importer Tests
 */

import { mapRowToPart, validatePart, ImportPart } from '../parts-importer';

describe('Parts Importer', () => {
  describe('mapRowToPart', () => {
    it('should map standard CSV row to part', () => {
      const row = {
        part_number: 'MTR-001',
        description: 'Test Bearing',
        category: 'bearings',
        manufacturer: 'Baldor',
        unit_cost: '45.99',
        current_stock: '25',
      };

      const part = mapRowToPart(row);

      expect(part.part_number).toBe('MTR-001');
      expect(part.description).toBe('Test Bearing');
      expect(part.category).toBe('bearings');
      expect(part.manufacturer).toBe('Baldor');
      expect(part.unit_cost).toBe(45.99);
      expect(part.current_stock).toBe(25);
    });

    it('should handle different column name formats', () => {
      const row = {
        'Part Number': 'MTR-002',
        'Description': 'Test Shaft',
        'Category': 'shafts',
        'Manufacturer': 'Leeson',
        'Unit Cost': '125.50',
      };

      const part = mapRowToPart(row);

      expect(part.part_number).toBe('MTR-002');
      expect(part.description).toBe('Test Shaft');
      expect(part.category).toBe('shafts');
      expect(part.manufacturer).toBe('Leeson');
      expect(part.unit_cost).toBe(125.50);
    });

    it('should parse comma-separated arrays', () => {
      const row = {
        part_number: 'MTR-003',
        description: 'Test Part',
        oem_equivalents: 'PART-A, PART-B, PART-C',
        pump_compatibility: 'PUMP-1, PUMP-2',
        seo_keywords: 'bearing, motor, electric',
      };

      const part = mapRowToPart(row);

      expect(part.oem_equivalents).toEqual(['PART-A', 'PART-B', 'PART-C']);
      expect(part.pump_compatibility).toEqual(['PUMP-1', 'PUMP-2']);
      expect(part.seo_keywords).toEqual(['bearing', 'motor', 'electric']);
    });

    it('should parse JSON fields', () => {
      const row = {
        part_number: 'MTR-004',
        description: 'Test Part',
        technical_specs: '{"diameter": "1.5", "material": "steel"}',
        motor_compatibility: '{"frame_sizes": ["143T", "145T"]}',
      };

      const part = mapRowToPart(row);

      expect(part.technical_specs).toEqual({ diameter: '1.5', material: 'steel' });
      expect(part.motor_compatibility).toEqual({ frame_sizes: ['143T', '145T'] });
    });

    it('should handle missing optional fields', () => {
      const row = {
        part_number: 'MTR-005',
        description: 'Minimal Part',
      };

      const part = mapRowToPart(row);

      expect(part.part_number).toBe('MTR-005');
      expect(part.description).toBe('Minimal Part');
      expect(part.manufacturer).toBeUndefined();
      expect(part.unit_cost).toBeUndefined();
    });
  });

  describe('validatePart', () => {
    it('should validate valid part', () => {
      const part: ImportPart = {
        part_number: 'MTR-001',
        description: 'Test Bearing',
      };

      const result = validatePart(part);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject part without part_number', () => {
      const part: ImportPart = {
        part_number: '',
        description: 'Test Bearing',
      };

      const result = validatePart(part);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Part number is required');
    });

    it('should reject part without description', () => {
      const part: ImportPart = {
        part_number: 'MTR-001',
        description: '',
      };

      const result = validatePart(part);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Description is required');
    });

    it('should reject part with whitespace-only part_number', () => {
      const part: ImportPart = {
        part_number: '   ',
        description: 'Test Bearing',
      };

      const result = validatePart(part);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Part number is required');
    });
  });
});

