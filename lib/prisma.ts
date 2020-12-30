import { PrismaClient } from "@prisma/client";

let prisma

if ( process.env.NODE_ENV === "production" ) {
  // spin-up a Prisma client always on the production copy.
  prisma = new PrismaClient()
  
} else {
   // to prevent Prisma spinning-up too many clients in a development environment, check to see if one is already running
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  
  prisma = global.prisma
}

export default prisma
