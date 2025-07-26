// app/api/incidents/route.ts
// --- LATEST STATE (after Step 8) ---
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const resolvedParam = searchParams.get('resolved');
  const typeParam = searchParams.get('type');

  let resolvedCondition: boolean | undefined;
  if (resolvedParam === 'false') {
    resolvedCondition = false;
  } else if (resolvedParam === 'true') {
    resolvedCondition = true;
  } else {
    resolvedCondition = undefined; // No filter by resolved status
  }

  const typeCondition = typeParam ? typeParam : undefined; // Filter by type if provided

  try {
    const incidents = await prisma.incident.findMany({
      where: {
        resolved: resolvedCondition,
        type: typeCondition,
      },
      include: {
        camera: true, // Include camera details
      },
      orderBy: {
        tsStart: 'desc', // Order by newest first
      },
    });

    return NextResponse.json(incidents, { status: 200 });
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}