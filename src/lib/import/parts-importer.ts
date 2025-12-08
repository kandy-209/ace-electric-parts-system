/**
 * Parts Bulk Import Service
 * Handles importing parts from multiple sources into the database
 */

import { createSupabaseAdmin } from '@/lib/database/supabase-client';
import { PartsTable } from '@/lib/database/types';
import { logger } from '@/lib/monitoring/logger';
import { createAuditLog, auditActions, resourceTypes } from '@/lib/security/audit-log';

export interface ImportPart {
  part_number: string;
  manufacturer_part_number?: string;
  description: string;
  category?: string;
  subcategory?: string;
  manufacturer?: string;
  oem_equivalents?: string[];
  technical_specs?: Record<string, any>;
  motor_compatibility?: Record<string, any>;
  pump_compatibility?: string[];
  images?: string[];
  technical_drawings?: string[];
  datasheet_url?: string;
  certifications?: string[];
  unit_cost?: number;
  current_stock?: number;
  min_stock_level?: number;
  preferred_vendors?: string[];
  supplier_skus?: Record<string, string>;
  seo_keywords?: string[];
  data_source?: 'import' | 'scraping' | 'manual';
}

export interface ImportResult {
  success: boolean;
  total: number;
  inserted: number;
  updated: number;
  skipped: number;
  errors: Array<{ part_number: string; error: string }>;
  duration: number;
}

/**
 * Import parts from array
 */
export async function importParts(
  parts: ImportPart[],
  options: {
    updateExisting?: boolean;
    skipDuplicates?: boolean;
    userId?: string;
  } = {}
): Promise<ImportResult> {
  const startTime = Date.now();
  const {
    updateExisting = true,
    skipDuplicates = true,
    userId,
  } = options;

  const result: ImportResult = {
    success: true,
    total: parts.length,
    inserted: 0,
    updated: 0,
    skipped: 0,
    errors: [],
    duration: 0,
  };

  const supabase = createSupabaseAdmin();

  try {
    // Process in batches of 100 for better performance
    const batchSize = 100;
    for (let i = 0; i < parts.length; i += batchSize) {
      const batch = parts.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (part) => {
          try {
            // Check if part already exists
            const { data: existing } = await supabase
              .from('parts')
              .select('part_id, part_number')
              .eq('part_number', part.part_number)
              .single();

            if (existing) {
              if (updateExisting) {
                // Update existing part
                const { error: updateError } = await supabase
                  .from('parts')
                  .update({
                    ...part,
                    data_source: part.data_source || 'import',
                    updated_at: new Date().toISOString(),
                  })
                  .eq('part_number', part.part_number);

                if (updateError) {
                  throw updateError;
                }

                result.updated++;
              } else if (skipDuplicates) {
                result.skipped++;
              } else {
                throw new Error('Part already exists');
              }
            } else {
              // Insert new part
              const { error: insertError } = await supabase
                .from('parts')
                .insert({
                  ...part,
                  data_source: part.data_source || 'import',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                });

              if (insertError) {
                throw insertError;
              }

              result.inserted++;
            }
          } catch (error: any) {
            result.errors.push({
              part_number: part.part_number,
              error: error.message,
            });
            logger.error('Import part error', error, { part_number: part.part_number });
          }
        })
      );
    }

    result.duration = Date.now() - startTime;

    // Log audit
    await createAuditLog({
      action: auditActions.dataImport,
      resource_type: resourceTypes.part,
      user_id: userId,
      status: result.errors.length === 0 ? 'success' : 'failure',
      metadata: {
        total: result.total,
        inserted: result.inserted,
        updated: result.updated,
        skipped: result.skipped,
        errors: result.errors.length,
      },
      severity: result.errors.length > result.total * 0.1 ? 'high' : 'low',
    });

    logger.info('Parts import completed', {
      total: result.total,
      inserted: result.inserted,
      updated: result.updated,
      skipped: result.skipped,
      errors: result.errors.length,
      duration: result.duration,
    });

    return result;
  } catch (error: any) {
    logger.error('Bulk import error', error);
    result.success = false;
    result.duration = Date.now() - startTime;
    return result;
  }
}

/**
 * Map Excel/CSV row to ImportPart
 */
export function mapRowToPart(row: Record<string, any>): ImportPart {
  return {
    part_number: String(row.part_number || row['Part Number'] || row['PART_NUMBER'] || '').trim(),
    manufacturer_part_number: row.manufacturer_part_number || row['Manufacturer Part Number'] || row['MPN'] || undefined,
    description: String(row.description || row['Description'] || row['DESCRIPTION'] || '').trim(),
    category: row.category || row['Category'] || row['CATEGORY'] || undefined,
    subcategory: row.subcategory || row['Subcategory'] || row['SUBCATEGORY'] || undefined,
    manufacturer: row.manufacturer || row['Manufacturer'] || row['MANUFACTURER'] || undefined,
    oem_equivalents: typeof row.oem_equivalents === 'string' 
      ? row.oem_equivalents.split(',').map((s: string) => s.trim())
      : row.oem_equivalents || undefined,
    technical_specs: typeof row.technical_specs === 'string'
      ? JSON.parse(row.technical_specs)
      : row.technical_specs || undefined,
    motor_compatibility: typeof row.motor_compatibility === 'string'
      ? JSON.parse(row.motor_compatibility)
      : row.motor_compatibility || undefined,
    pump_compatibility: typeof row.pump_compatibility === 'string'
      ? row.pump_compatibility.split(',').map((s: string) => s.trim())
      : row.pump_compatibility || undefined,
    unit_cost: row.unit_cost || row['Unit Cost'] || row['Price'] || row['COST'] ? parseFloat(row.unit_cost || row['Unit Cost'] || row['Price'] || row['COST']) : undefined,
    current_stock: row.current_stock || row['Current Stock'] || row['STOCK'] ? parseInt(row.current_stock || row['Current Stock'] || row['STOCK']) : undefined,
    min_stock_level: row.min_stock_level || row['Min Stock'] || row['MIN_STOCK'] ? parseInt(row.min_stock_level || row['Min Stock'] || row['MIN_STOCK']) : undefined,
    data_source: 'import',
    seo_keywords: typeof row.seo_keywords === 'string'
      ? row.seo_keywords.split(',').map((s: string) => s.trim())
      : row.seo_keywords || undefined,
  };
}

/**
 * Validate part data before import
 */
export function validatePart(part: ImportPart): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!part.part_number || part.part_number.trim() === '') {
    errors.push('Part number is required');
  }

  if (!part.description || part.description.trim() === '') {
    errors.push('Description is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

