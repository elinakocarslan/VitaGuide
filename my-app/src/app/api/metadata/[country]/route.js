import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';

export async function GET(request, { params }) {
  try {
    const { country } = params;
    const filePath = path.join(process.cwd(), 'backend/data/GDD_Metadata.csv');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      cast: (value, context) => {
        // Convert Year to number
        if (context.column === 'Year') {
          return value ? parseInt(value) : null;
        }
        // Convert Sample size to number
        if (context.column === 'Sample size') {
          return value ? parseInt(value) : null;
        }
        return value;
      }
    });

    // Filter records for the specified country and ensure they have dietary data
    const countryData = records.filter(record => 
      record.ISO3 === country && 
      record['Available dietary factors']
    );
    
    if (countryData.length === 0) {
      return NextResponse.json({ 
        error: 'No dietary data available for this country' 
      }, { status: 404 });
    }
    
    return NextResponse.json(countryData);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: 'Failed to load data' 
    }, { status: 500 });
  }
} 