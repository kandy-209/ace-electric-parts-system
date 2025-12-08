/**
 * Parts Bulk Import API
 * POST: Import parts from Excel/CSV or JSON
 */

import { NextRequest, NextResponse } from 'next/server';
import { parseExcelFile, parseCSVFile } from '@/lib/import/excel-parser';
import { importParts, mapRowToPart, validatePart, ImportPart } from '@/lib/import/parts-importer';
import { withRateLimit, rateLimiters } from '@/lib/security/rate-limiter';
import { extractRequestMetadata } from '@/lib/security/audit-log';
import { logger } from '@/lib/monitoring/logger';
import { captureException } from '@/lib/monitoring/sentry';

export async function POST(request: NextRequest) {
  return withRateLimit(
    request,
    rateLimiters.upload, // Stricter limit for uploads
    async () => {
      const metadata = extractRequestMetadata(request);
      const startTime = Date.now();

      try {
        const contentType = request.headers.get('content-type') || '';

        let parts: ImportPart[] = [];

        // Handle file upload (Excel/CSV)
        if (contentType.includes('multipart/form-data')) {
          const formData = await request.formData();
          const file = formData.get('file') as File;
          const updateExisting = formData.get('updateExisting') === 'true';
          const skipDuplicates = formData.get('skipDuplicates') !== 'false';

          if (!file) {
            return NextResponse.json(
              { error: 'No file provided' },
              { status: 400 }
            );
          }

          const fileType = file.name.split('.').pop()?.toLowerCase();
          let parseResult;

          if (fileType === 'csv') {
            parseResult = await parseCSVFile(file);
          } else if (fileType === 'xlsx' || fileType === 'xls') {
            parseResult = await parseExcelFile(file);
          } else {
            return NextResponse.json(
              { error: 'Unsupported file type. Please upload CSV or Excel files.' },
              { status: 400 }
            );
          }

          // Map rows to parts
          parts = parseResult.rows
            .map(mapRowToPart)
            .filter((part) => {
              const validation = validatePart(part);
              if (!validation.valid) {
                logger.warn('Invalid part skipped', { 
                  part_number: part.part_number, 
                  errors: validation.errors 
                });
              }
              return validation.valid;
            });

          if (parts.length === 0) {
            return NextResponse.json(
              { error: 'No valid parts found in file' },
              { status: 400 }
            );
          }

          // Import parts
          const result = await importParts(parts, {
            updateExisting,
            skipDuplicates,
          });

          logger.performance('parts_import', Date.now() - startTime, {
            total: result.total,
            inserted: result.inserted,
            updated: result.updated,
          });

          return NextResponse.json({
            success: true,
            message: `Imported ${result.inserted} new parts, updated ${result.updated} existing parts`,
            result,
          });
        }

        // Handle JSON upload
        if (contentType.includes('application/json')) {
          const body = await request.json();
          
          if (Array.isArray(body.parts)) {
            parts = body.parts;
          } else if (Array.isArray(body)) {
            parts = body;
          } else {
            return NextResponse.json(
              { error: 'Invalid JSON format. Expected array of parts or object with parts array.' },
              { status: 400 }
            );
          }

          // Validate all parts
          const validParts = parts.filter((part) => {
            const validation = validatePart(part);
            return validation.valid;
          });

          if (validParts.length === 0) {
            return NextResponse.json(
              { error: 'No valid parts provided' },
              { status: 400 }
            );
          }

          const result = await importParts(validParts, {
            updateExisting: body.updateExisting !== false,
            skipDuplicates: body.skipDuplicates !== false,
          });

          return NextResponse.json({
            success: true,
            message: `Imported ${result.inserted} new parts, updated ${result.updated} existing parts`,
            result,
          });
        }

        return NextResponse.json(
          { error: 'Unsupported content type' },
          { status: 400 }
        );
      } catch (error: any) {
        logger.error('Parts import API error', error, {
          endpoint: '/api/parts/import',
          ...metadata,
        });

        captureException(error as Error, {
          endpoint: '/api/parts/import',
          method: 'POST',
        });

        return NextResponse.json(
          { error: 'Failed to import parts', details: error.message },
          { status: 500 }
        );
      }
    }
  );
}

