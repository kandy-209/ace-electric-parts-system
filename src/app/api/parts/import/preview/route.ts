/**
 * Parts Import Preview API
 * GET: Preview import changes before actually importing
 */

import { NextRequest, NextResponse } from 'next/server';
import { parseExcelFile, parseCSVFile } from '@/lib/import/excel-parser';
import { mapRowToPart } from '@/lib/import/parts-importer';
import { previewImport } from '@/lib/import/import-preview';
import { withRateLimit, rateLimiters } from '@/lib/security/rate-limiter';
import { logger } from '@/lib/monitoring/logger';

export async function POST(request: NextRequest) {
  return withRateLimit(
    request,
    rateLimiters.standard,
    async () => {
      try {
        const contentType = request.headers.get('content-type') || '';
        let parts: any[] = [];

        // Handle file upload
        if (contentType.includes('multipart/form-data')) {
          const formData = await request.formData();
          const file = formData.get('file') as File;

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
              { error: 'Unsupported file type' },
              { status: 400 }
            );
          }

          parts = parseResult.rows.map(mapRowToPart);
        } else if (contentType.includes('application/json')) {
          const body = await request.json();
          parts = Array.isArray(body.parts) ? body.parts : (Array.isArray(body) ? body : []);
        } else {
          return NextResponse.json(
            { error: 'Unsupported content type' },
            { status: 400 }
          );
        }

        if (parts.length === 0) {
          return NextResponse.json(
            { error: 'No parts provided' },
            { status: 400 }
          );
        }

        const body = contentType.includes('multipart/form-data')
          ? {}
          : await request.json();

        const preview = await previewImport(parts, {
          updateExisting: body.updateExisting !== false,
          skipDuplicates: body.skipDuplicates !== false,
        });

        logger.info('Import preview generated', {
          total: parts.length,
          new: preview.new.length,
          updates: preview.updates.length,
          duplicates: preview.duplicates.length,
          invalid: preview.invalid.length,
        });

        return NextResponse.json({
          success: true,
          preview,
          summary: {
            total: parts.length,
            new: preview.new.length,
            updates: preview.updates.length,
            duplicates: preview.duplicates.length,
            invalid: preview.invalid.length,
          },
        });
      } catch (error: any) {
        logger.error('Import preview error', error);
        return NextResponse.json(
          { error: 'Failed to generate preview', details: error.message },
          { status: 500 }
        );
      }
    }
  );
}

