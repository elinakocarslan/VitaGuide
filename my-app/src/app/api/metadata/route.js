import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'backend/data/GDD_Metadata.csv');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    return NextResponse.json(records);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
} 