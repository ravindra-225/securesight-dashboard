// app/api/incidents/[id]/resolve/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Make sure this path is correct for your singleton Prisma client

// PATCH handler to mark an incident as resolved
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } } // Get the incident ID from URL parameters
) {
  const incidentId = params.id; // Extract the incident ID from the URL

  try {
    // Find the incident by ID and update its 'resolved' status to true
    const updatedIncident = await prisma.incident.update({
      where: {
        id: incidentId, // Use the extracted ID here
      },
      data: {
        resolved: true, // Set resolved to true
      },
      include: { // Optionally include camera details in the response
        camera: true
      }
    });

    // Return the updated incident details
    return NextResponse.json(updatedIncident, { status: 200 });

  } catch (error) {
    console.error(`Error resolving incident ${incidentId}:`, error);

    // Handle specific errors, e.g., if the incident ID doesn't exist
    if (error instanceof Error && error.message.includes('Record not found')) {
      return NextResponse.json({ message: 'Incident not found' }, { status: 404 });
    }

    // Generic error response for other issues
    return NextResponse.json(
      { message: 'Internal Server Error', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}