import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

// Initialize Prisma with better error handling for production
function initializePrisma() {
  if (!prisma) {
    try {
      prisma = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        datasources: {
          db: {
            url: process.env.DATABASE_URL
          }
        }
      });
    } catch (error) {
      console.error('Failed to initialize Prisma:', error);
      throw new Error('Database initialization failed');
    }
  }
  return prisma;
}

// Test database connection
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const client = initializePrisma();
    await client.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Get Prisma client with connection verification
export async function getPrismaClient(): Promise<PrismaClient> {
  const client = initializePrisma();
  
  // Test connection on first use
  try {
    await client.$queryRaw`SELECT 1`;
    return client;
  } catch (error) {
    console.error('Database connection test failed:', error);
    throw new Error('Database unavailable');
  }
}

export { prisma };