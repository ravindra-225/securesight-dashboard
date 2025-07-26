// lib/prisma.ts
// --- LATEST STATE (should be unchanged from initial setup) ---
import { PrismaClient } from '@prisma/client';

// Add prisma to the NodeJS global type to prevent multiple instances in dev
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export default prisma;