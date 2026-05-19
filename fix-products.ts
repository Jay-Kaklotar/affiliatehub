import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const result = await prisma.$executeRaw`UPDATE Product SET name = description WHERE name = '' OR name IS NULL`;
    console.log('Fixed existing products:', result);
  } catch (error) {
    console.error('Error fixing products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
