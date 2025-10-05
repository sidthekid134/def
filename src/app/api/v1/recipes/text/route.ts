import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // This route will handle recipe ingestion from text
  // Implementation will be done in future stories
  
  return NextResponse.json({ message: 'Text ingestion endpoint' }, { status: 200 })
}