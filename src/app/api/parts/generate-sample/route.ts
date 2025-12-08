/**
 * Generate Sample Parts API
 * POST: Generate and import sample parts data for testing
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateCompleteSampleDatabase, generateSampleParts } from '@/lib/import/sample-parts-generator';
import { importParts } from '@/lib/import/parts-importer';
import { withRateLimit, rateLimiters } from '@/lib/security/rate-limiter';
import { logger } from '@/lib/monitoring/logger';

export async function POST(request: NextRequest) {
  return withRateLimit(
    request,
    rateLimiters.standard,
    async () => {
      try {
        const body = await request.json().catch(() => ({}));
        const category = body.category;
        const count = body.count || 50;

        let parts;
        if (category) {
          parts = generateSampleParts(category, count);
        } else {
          parts = generateCompleteSampleDatabase();
        }

        // Import generated parts
        const result = await importParts(parts, {
          updateExisting: false,
          skipDuplicates: true,
        });

        logger.info('Sample parts generated', {
          total: result.total,
          inserted: result.inserted,
          category: category || 'all',
        });

        return NextResponse.json({
          success: true,
          message: `Generated and imported ${result.inserted} sample parts`,
          result,
          parts: parts.slice(0, 10), // Return first 10 as preview
        });
      } catch (error: any) {
        logger.error('Generate sample parts error', error);
        return NextResponse.json(
          { error: 'Failed to generate sample parts', details: error.message },
          { status: 500 }
        );
      }
    }
  );
}

