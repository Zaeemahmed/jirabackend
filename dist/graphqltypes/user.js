"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserQuery = exports.User = void 0;
const nexus_1 = require("nexus");
exports.User = nexus_1.objectType({
    name: "User",
    definition(t) {
        t.nonNull.string("id");
        t.nonNull.string("fullName");
        t.nullable.string("profileImage");
        t.nonNull.string("email");
        t.nonNull.string("site");
        t.nonNull.string("password");
        t.nullable.list.nullable.field("issues", {
            type: "Issue",
            resolve: (parent, _, ctx) => {
                return ctx.prisma.issue.findMany({
                    where: { creatorId: parent.id },
                });
            },
        });
        t.nullable.list.nullable.field("assignee", {
            type: "Issue",
            resolve: (parent, _, ctx) => {
                return ctx.prisma.issue.findMany({
                    where: { assigneeId: parent.id },
                });
            },
        });
        t.nullable.list.nullable.field("reporter", {
            type: "Issue",
            resolve: (parent, _, ctx) => {
                return ctx.prisma.issue.findMany({
                    where: { reporterId: parent.id },
                });
            },
        });
        t.nullable.list.nullable.field("projects", {
            type: "Project",
            resolve: (parent, _, ctx) => {
                return ctx.prisma.project.findMany({
                    where: { ownerId: parent.id },
                });
            },
        });
        t.nullable.list.nullable.field("projectLead", {
            type: "Project",
            resolve: (parent, _, ctx) => {
                return ctx.prisma.project.findMany({
                    where: { projectLeadId: parent.id },
                });
            },
        });
    },
});
exports.UserQuery = nexus_1.extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("users", {
            type: "User",
            resolve(parent, args, context) {
                return context.prisma.user.findMany();
            },
        });
    },
});
//# sourceMappingURL=user.js.map