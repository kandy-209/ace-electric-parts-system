/**
 * Import Progress API
 * GET: Get import progress status
 */

import { NextRequest, NextResponse } from 'next/server';
import { getImportProgress } from '@/lib/import/import-progress';
import { withRateLimit, rateLimiters } from '@/lib/security/rate-limiter';

export async function GET(
  request: NextRequest,
  { params }: { params: { importId: string } }
) {
  return withRateLimit(
    request,
    rateLimiters.standard,
    async () => {
      try {
        const { importId } = params;
        const progress = await getImportProgress(importId);

        if (!progress) {
          return NextResponse.json(
            { error: 'Import progress not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          progress,
        });
      } catch (error: any) {
        return NextResponse.json(
          { error: 'Failed to get progress', details: error.message },
          { status: 500 }
        );
      }
    }
  );
}

