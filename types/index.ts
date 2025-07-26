// types.ts
export interface Camera {
  id: string;
  name: string;
  location: string;
}

export interface Incident {
  id: string;
  type: IncidentType; // Use IncidentType here
  tsStart: string; // ISO string date
  tsEnd: string | null; // ISO string date or null
  thumbnailUrl: string;
  videoUrl: string | null;
  resolved: boolean;
  cameraId: string;
  camera: Camera; // Prisma relation includes camera object
  additionalThumbnail1Url?: string | null;
  additionalCamera1Name?: string | null;
  additionalThumbnail2Url?: string | null;
  additionalCamera2Name?: string | null;
}

export type IncidentType =
  // For filter option
  | 'Unauthorized Access'
  | 'Gun Threat'
  | 'Face Recognized'
   |  'Suspicious Activity' // <--- ADD THIS LINE
  | 'Vandalism';  // Add other types from your seed data