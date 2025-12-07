// Excel/CSV Import API Endpoint

import { NextRequest, NextResponse } from 'next/server';
import { parseExcelFile, parseCSVFile } from '@/lib/import/excel-parser';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const fileType = file.name.split('.').pop()?.toLowerCase();
    
    let result;
    if (fileType === 'csv') {
      result = await parseCSVFile(file);
    } else if (fileType === 'xlsx' || fileType === 'xls') {
      result = await parseExcelFile(file);
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload CSV or Excel files.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

