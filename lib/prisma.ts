import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

// https://pris.ly/help
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
