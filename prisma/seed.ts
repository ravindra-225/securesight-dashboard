console.log('Seed script started execution!');
import { PrismaClient } from '@prisma/client';
import { IncidentType } from '@/types';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const camera1 = await prisma.camera.upsert({
    where: { name: 'Main Entrance' },
    update: {},
    create: {
      name: 'Main Entrance',
      location: 'Ground Floor, North Wing',
    },
  });

  const camera2 = await prisma.camera.upsert({
    where: { name: 'Vault Area' },
    update: {},
    create: {
      name: 'Vault Area',
      location: 'Basement, Secure Zone',
    },
  });

  const camera3 = await prisma.camera.upsert({
    where: { name: 'Server Room' },
    update: {},
    create: {
      name: 'Server Room',
      location: 'Second Floor, Data Center',
    },
  });

  const camera4 = await prisma.camera.upsert({
    where: { name: 'Loading Dock' },
    update: {},
    create: {
      name: 'Loading Dock',
      location: 'Rear Building Access',
    },
  });

  console.log('Cameras created:', { camera1, camera2, camera3, camera4 });

  
  // Generate timestamps for the last 24 hours
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

  const incidentsData = [
    // Threat Type 1: Unauthorized Access
    {
      camerald: camera1.id,
      type: 'Unauthorized Access',
      tsStart: new Date(oneDayAgo.getTime() + Math.random() * (now.getTime() - oneDayAgo.getTime())),
      tsEnd: new Date(oneDayAgo.getTime() + Math.random() * (now.getTime() - oneDayAgo.getTime()) + 5 * 60 * 1000), // 5 min duration approx
      thumbnailUrl: '/images/incident_unauthorized1.jpg', // Placeholder thumbnail
      resolved: false,
    },
    {
      camerald: camera1.id,
      type: 'Unauthorized Access',
      tsStart: new Date(oneDayAgo.getTime() + Math.random() * (now.getTime() - oneDayAgo.getTime())),
      tsEnd: new Date(oneDayAgo.getTime() + Math.random() * (now.getTime() - oneDayAgo.getTime()) + 3 * 60 * 1000),
      thumbnailUrl: '/images/incident_unauthorized2.jpg',
      resolved: false,
    },
    {
      camerald: camera2.id,
      type: 'Unauthorized Access',
      tsStart: new Date(oneDayAgo.getTime() + Math.random() * (now.getTime() - oneDayAgo.getTime())),
      tsEnd: new Date(oneDayAgo.getTime() + Math.random() * (now.getTime() - oneDayAgo.getTime()) + 7 * 60 * 1000),
      thumbnailUrl: '/images/incident_unauthorized3.jpg',
      resolved: true, // Example of a resolved incident
    },

    // Threat Type 2: Gun Threat
    {
      camerald: camera3.id,
      type: 'Gun Threat',
      tsStart: new Date(oneDayAgo.getTime() + Math.random() * (now.getTime() - oneDayAgo.getTime())),
      tsEnd: new Date(oneDayAgo.getTime() + Math.random() * (now.getTime() - oneDayAgo.getTime()) + 2 * 60 * 1000),
      thumbnailUrl: '/images/incident_gun1.jpg',
      resolved: false,
    },
    {
      camerald: camera4.id,
      type: 'Gun Threat',
      tsStart: new Date(oneDayAgo.getTime() + Math.random() * (now.getTime() - oneDayAgo.getTime())),
      tsEnd: new Date(oneDayAgo.getTime() + Math.random() * (now.getTime() - oneDayAgo.getTime()) + 4 * 60 * 1000),
      thumbnailUrl: '/images/incident_gun2.jpg',
      resolved: false,
    },

    // Threat Type 3: Face Recognized (e.g., suspected person)
    {
      camerald: camera1.id,
      type: 'Face Recognized',
      tsStart: new Date(oneDayAgo.getTime() + Math.random() * (now.getTime() - oneDayAgo.getTime())),
      tsEnd: new Date(oneDayAgo.getTime() + Math.random() * (now.getTime() - oneDayAgo.getTime()) + 1 * 60 * 1000),
      thumbnailUrl: '/images/incident_face1.jpg',
      resolved: false,
    },
    {
      camerald: camera2.id,
      type: 'Face Recognized',
      tsStart: new Date(oneDayAgo.getTime() + Math.random() * (now.getTime() - oneDayAgo.getTime())),
      tsEnd: new Date(oneDayAgo.getTime() + Math.random() * (now.getTime() - oneDayAgo.getTime()) + 2 * 60 * 1000),
      thumbnailUrl: '/images/incident_face2.jpg',
      resolved: true,
    },

    
    // Threat Type 4 (new): Suspicious Activity
    {
      camerald: camera3.id,
      type: 'Suspicious Activity',
      tsStart: new Date(oneDayAgo.getTime() + Math.random() * (now.getTime() - oneDayAgo.getTime())),
      tsEnd: new Date(oneDayAgo.getTime() + Math.random() * (now.getTime() - oneDayAgo.getTime()) + 6 * 60 * 1000),
      thumbnailUrl: '/images/incident_suspicious1.jpg',
      resolved: false,
    },
    {
      camerald: camera4.id,
      type: 'Suspicious Activity',
      tsStart: new Date(oneDayAgo.getTime() + Math.random() * (now.getTime() - oneDayAgo.getTime())),
      tsEnd: new Date(oneDayAgo.getTime() + Math.random() * (now.getTime() - oneDayAgo.getTime()) + 8 * 60 * 1000),
      thumbnailUrl: '/images/incident_suspicious2.jpg',
      resolved: false,
    },
    {
      camerald: camera1.id,
      type: 'Suspicious Activity',
      tsStart: new Date(oneDayAgo.getTime() + Math.random() * (now.getTime() - oneDayAgo.getTime())),
      tsEnd: new Date(oneDayAgo.getTime() + Math.random() * (now.getTime() - oneDayAgo.getTime()) + 3 * 60 * 1000),
      thumbnailUrl: '/images/incident_suspicious3.jpg',
      resolved: false,
    },

    // Threat Type 5 (new): Vandalism
    {
      camerald: camera2.id,
      type: 'Vandalism',
      tsStart: new Date(oneDayAgo.getTime() + Math.random() * (now.getTime() - oneDayAgo.getTime())),
      tsEnd: new Date(oneDayAgo.getTime() + Math.random() * (now.getTime() - oneDayAgo.getTime()) + 10 * 60 * 1000),
      thumbnailUrl: '/images/incident_vandalism1.jpg',
      resolved: false,
    },
    {
      camerald: camera3.id,
      type: 'Vandalism',
      tsStart: new Date(oneDayAgo.getTime() + Math.random() * (now.getTime() - oneDayAgo.getTime())),
      tsEnd: new Date(oneDayAgo.getTime() + Math.random() * (now.getTime() - oneDayAgo.getTime()) + 5 * 60 * 1000),
      thumbnailUrl: '/images/incident_vandalism2.jpg',
      resolved: true,
    },
    {
      camerald: camera4.id,
      type: 'Vandalism',
      tsStart: new Date(oneDayAgo.getTime() + Math.random() * (now.getTime() - oneDayAgo.getTime())),
      tsEnd: new Date(oneDayAgo.getTime() + Math.random() * (now.getTime() - oneDayAgo.getTime()) + 7 * 60 * 1000),
      thumbnailUrl: '/images/incident_vandalism3.jpg',
      resolved: false,
    },
  ];

  for (const incidentData of incidentsData) {
    await prisma.incident.create({
      data: incidentData,
    });
  }
  console.log(`Created ${incidentsData.length} incidents.`);

  console.log('Seeding incidents...');
  // Example of an incident with additional thumbnails
  await prisma.incident.upsert({
    where: { id: 'incident-with-extra-views' },
    update: {},
    create: {
      id: 'incident-with-extra-views',
      type: 'Unauthorized Access',
      tsStart: new Date('2025-07-25T14:00:00Z'),
      tsEnd: new Date('2025-07-25T14:10:00Z'),
      thumbnailUrl: '/thumbnails/incident_gun1.jpg',
      videoUrl: '/videos/incident-video.mp4',
      resolved: false,
      camera: { connect: { id: camera1.id } }, // Connect to existing camera
      additionalThumbnail1Url: '/images/incident_vandalism3.jpg',
      additionalCamera1Name: 'Side Entrance Cam',
      additionalThumbnail2Url: '/images/incident_vandalism1.jpg',
      additionalCamera2Name: 'Rear Alley Cam',
    },
  });

  // Add or modify other incidents with these fields as desired
  // ...

  console.log('Seeding complete.');
}
main()
  .catch((e) => {
    console.error('Seed script failed', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Prisma client disconected');
  });