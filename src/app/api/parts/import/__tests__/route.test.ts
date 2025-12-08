/**
 * Parts Import API Tests
 */

import { POST } from '../route';
import { NextRequest } from 'next/server';

// Mock dependencies
jest.mock('@/lib/import/excel-parser');
jest.mock('@/lib/import/parts-importer');
jest.mock('@/lib/security/rate-limiter');
jest.mock('@/lib/monitoring/logger');
jest.mock('@/lib/monitoring/sentry');

describe('POST /api/parts/import', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should import parts from CSV file', async () => {
    const { parseCSVFile } = require('@/lib/import/excel-parser');
    const { importParts, mapRowToPart, validatePart } = require('@/lib/import/parts-importer');

    parseCSVFile.mockResolvedValue({
      rows: [
        { part_number: 'MTR-001', description: 'Test Bearing' },
        { part_number: 'MTR-002', description: 'Test Shaft' },
      ],
      headers: ['part_number', 'description'],
      totalRows: 2,
    });

    mapRowToPart.mockImplementation((row) => row);
    validatePart.mockReturnValue({ valid: true, errors: [] });
    importParts.mockResolvedValue({
      success: true,
      total: 2,
      inserted: 2,
      updated: 0,
      skipped: 0,
      errors: [],
      duration: 100,
    });

    const formData = new FormData();
    const blob = new Blob(['test'], { type: 'text/csv' });
    const file = new File([blob], 'test.csv', { type: 'text/csv' });
    formData.append('file', file);
    formData.append('updateExisting', 'true');
    formData.append('skipDuplicates', 'true');

    const request = new NextRequest('http://localhost:3000/api/parts/import', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(parseCSVFile).toHaveBeenCalled();
    expect(importParts).toHaveBeenCalled();
  });

  it('should import parts from JSON', async () => {
    const { importParts } = require('@/lib/import/parts-importer');

    importParts.mockResolvedValue({
      success: true,
      total: 2,
      inserted: 2,
      updated: 0,
      skipped: 0,
      errors: [],
      duration: 100,
    });

    const request = new NextRequest('http://localhost:3000/api/parts/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parts: [
          { part_number: 'MTR-001', description: 'Test Bearing' },
          { part_number: 'MTR-002', description: 'Test Shaft' },
        ],
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(importParts).toHaveBeenCalled();
  });

  it('should reject invalid file type', async () => {
    const formData = new FormData();
    const blob = new Blob(['test'], { type: 'text/plain' });
    const file = new File([blob], 'test.txt', { type: 'text/plain' });
    formData.append('file', file);

    const request = new NextRequest('http://localhost:3000/api/parts/import', {
      method: 'POST',
      body: formData,
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Unsupported file type');
  });

  it('should handle import errors', async () => {
    const { importParts } = require('@/lib/import/parts-importer');

    importParts.mockRejectedValue(new Error('Database connection failed'));

    const request = new NextRequest('http://localhost:3000/api/parts/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parts: [{ part_number: 'MTR-001', description: 'Test' }],
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to import parts');
  });
});

