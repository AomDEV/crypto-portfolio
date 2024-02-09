import { PrismaClient } from '@prisma/client';
import pagination from 'prisma-extension-pagination';
export * from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Ensure the prisma instance is re-used during hot-reloading
  // Otherwise, a new client will be created on every reload
  globalThis['prisma'] = globalThis['prisma'] || new PrismaClient();
  prisma = globalThis['prisma'];
}

export { prisma };

export const paginate = prisma.$extends(
  pagination({
    pages: {
      limit: 10, // set default limit to 10
      includePageCount: true, // include counters by default
    },
  }),
);
