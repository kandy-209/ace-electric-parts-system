/**
 * Import Progress Tracking
 * Track progress of large imports with real-time updates
 */

import { cache, cacheKey } from '@/lib/cache/redis';

export interface ImportProgress {
  importId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  total: number;
  processed: number;
  inserted: number;
  updated: number;
  skipped: number;
  errors: number;
  startedAt: string;
  completedAt?: string;
  error?: string;
}

/**
 * Create import progress tracker
 */
export async function createImportProgress(total: number): Promise<string> {
  const importId = `import_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  
  const progress: ImportProgress = {
    importId,
    status: 'pending',
    total,
    processed: 0,
    inserted: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
    startedAt: new Date().toISOString(),
  };

  await cache.set(cacheKey('import', importId), progress, 3600); // 1 hour TTL
  return importId;
}

/**
 * Update import progress
 */
export async function updateImportProgress(
  importId: string,
  updates: Partial<ImportProgress>
): Promise<void> {
  const key = cacheKey('import', importId);
  const existing = await cache.get<ImportProgress>(key);

  if (!existing) {
    throw new Error(`Import progress not found: ${importId}`);
  }

  const updated: ImportProgress = {
    ...existing,
    ...updates,
  };

  await cache.set(key, updated, 3600);
}

/**
 * Get import progress
 */
export async function getImportProgress(importId: string): Promise<ImportProgress | null> {
  return await cache.get<ImportProgress>(cacheKey('import', importId));
}

/**
 * Mark import as completed
 */
export async function completeImportProgress(
  importId: string,
  result: {
    inserted: number;
    updated: number;
    skipped: number;
    errors: number;
  }
): Promise<void> {
  await updateImportProgress(importId, {
    status: 'completed',
    processed: result.inserted + result.updated + result.skipped + result.errors,
    inserted: result.inserted,
    updated: result.updated,
    skipped: result.skipped,
    errors: result.errors,
    completedAt: new Date().toISOString(),
  });
}

/**
 * Mark import as failed
 */
export async function failImportProgress(importId: string, error: string): Promise<void> {
  await updateImportProgress(importId, {
    status: 'failed',
    error,
    completedAt: new Date().toISOString(),
  });
}

