/**
 * Import Preview
 * Preview changes before importing
 */

import { ImportPart, validatePart } from './parts-importer';
import { createSupabaseAdmin } from '@/lib/database/supabase-client';

export interface ImportPreview {
  new: ImportPart[];
  updates: Array<{ existing: any; new: ImportPart }>;
  duplicates: ImportPart[];
  invalid: Array<{ part: ImportPart; errors: string[] }>;
}

/**
 * Preview import changes
 */
export async function previewImport(
  parts: ImportPart[],
  options: {
    updateExisting?: boolean;
    skipDuplicates?: boolean;
  } = {}
): Promise<ImportPreview> {
  const { updateExisting = true, skipDuplicates = true } = options;

  const preview: ImportPreview = {
    new: [],
    updates: [],
    duplicates: [],
    invalid: [],
  };

  const supabase = createSupabaseAdmin();
  const partNumbers = parts.map((p) => p.part_number);

  // Check existing parts
  const { data: existing } = await supabase
    .from('parts')
    .select('part_id, part_number, description, manufacturer, category')
    .in('part_number', partNumbers);

  const existingMap = new Map(existing?.map((p) => [p.part_number, p]) || []);

  // Categorize parts
  for (const part of parts) {
    const validation = validatePart(part);

    if (!validation.valid) {
      preview.invalid.push({
        part,
        errors: validation.errors,
      });
      continue;
    }

    const existingPart = existingMap.get(part.part_number);

    if (existingPart) {
      if (updateExisting) {
        preview.updates.push({
          existing: existingPart,
          new: part,
        });
      } else if (skipDuplicates) {
        preview.duplicates.push(part);
      } else {
        preview.invalid.push({
          part,
          errors: ['Part already exists'],
        });
      }
    } else {
      preview.new.push(part);
    }
  }

  return preview;
}

