// src/actions/incidents.ts
// --- LATEST STATE (after Step 6) ---
'use server'; // Marks this file as a Server Action file

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma'; // Ensure this path is correct

export async function resolveIncident(incidentId: string) {
  try {
    const updatedIncident = await prisma.incident.update({
      where: {
        id: incidentId,
      },
      data: {
        resolved: true,
      },
      include: {
        camera: true
      }
    });

    console.log(`Incident ${incidentId} resolved successfully.`);
    revalidatePath('/dashboard'); // Revalidates the data for the dashboard page

    return updatedIncident;

  } catch (error) {
    console.error(`Error resolving incident ${incidentId}:`, error);
    if (error instanceof Error && error.message.includes('Record not found')) {
      throw new Error('Incident not found');
    }
    throw new Error(`Failed to resolve incident: ${error instanceof Error ? error.message : String(error)}`);
  }
}