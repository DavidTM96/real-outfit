import { PrismaClient } from "@prisma/client";
import sampleData from "./sample-data";

// We run 'tsx ./db/seed' to seed the database, then we can reload Prisma Studio to see the data in the database.

async function main() {
  const prisma = new PrismaClient();
  await prisma.product.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  await prisma.product.createMany({
    data: sampleData.products,
  });
  await prisma.user.createMany({
    data: sampleData.users,
  });

  console.log("Data seeded successfully");
}
main();
