import "dotenv/config";
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

import pgPkg from 'pg';
const { Pool } = pgPkg;

import { PrismaPg } from '@prisma/adapter-pg';

const prismaOptions = {
  log: ['query', 'warn', 'error'],
};

// Create a pg pool and adapter if DATABASE_URL is available
let adapter;
if (process.env.DATABASE_URL) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  adapter = new PrismaPg(pool);
}

// Prisma 7 requires passing a fully constructed Driver Adapter 
const clientConfig = adapter
  ? { adapter, ...prismaOptions }
  : prismaOptions;

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient(clientConfig);
} else {
  // Prevent instantiating multiple PrismaClient instances in development
  if (!global.prisma) {
    global.prisma = new PrismaClient(clientConfig);
  }
  prisma = global.prisma;
}

export default prisma;
