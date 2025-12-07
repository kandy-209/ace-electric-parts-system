// Excel/CSV Parser - Parse Excel and CSV files

import XLSX from 'xlsx';

export interface ParsedRow {
  [key: string]: any;
}

export interface ParseResult {
  rows: ParsedRow[];
  headers: string[];
  totalRows: number;
}

export async function parseExcelFile(file: File | Buffer): Promise<ParseResult> {
  try {
    const buffer = file instanceof File ? await file.arrayBuffer() : file;
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    
    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
    
    if (data.length === 0) {
      throw new Error('Excel file is empty');
    }
    
    // First row is headers
    const headers = data[0] as string[];
    const rows = data.slice(1).map(row => {
      const obj: ParsedRow = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || null;
      });
      return obj;
    });
    
    return {
      rows,
      headers,
      totalRows: rows.length,
    };
  } catch (error: any) {
    throw new Error(`Failed to parse Excel file: ${error.message}`);
  }
}

export async function parseCSVFile(file: File | string): Promise<ParseResult> {
  try {
    const csvText = typeof file === 'string' ? file : await file.text();
    const lines = csvText.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      throw new Error('CSV file is empty');
    }
    
    // Parse headers
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Parse rows
    const rows = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj: ParsedRow = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || null;
      });
      return obj;
    });
    
    return {
      rows,
      headers,
      totalRows: rows.length,
    };
  } catch (error: any) {
    throw new Error(`Failed to parse CSV file: ${error.message}`);
  }
}

