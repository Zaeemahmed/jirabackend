import { PrismaClient } from "@prisma/client";
import { ObjectId } from "bson";

const prisma = new PrismaClient();

async function main() {
  const id = new ObjectId().toString();
  const newLink = await prisma.issue.create({
    data: {
      id,
      creatorId: "63790c25f9cc9c720530f5c5",
      description: "test",
      // status: "dasdasd",
    },
  });
  // const allLinks = await prisma.user.findMany();
  // console.log(allLinks);
}

// 4
main()
  .catch((e) => {
    throw e;
  })
  // 5
  .finally(async () => {
    await prisma.$disconnect();
  });
