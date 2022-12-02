"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bson_1 = require("bson");
const prisma = new client_1.PrismaClient();
async function main() {
    const id = new bson_1.ObjectId().toString();
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
//# sourceMappingURL=script.js.map