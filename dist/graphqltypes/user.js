"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMutation = exports.UserQuery = exports.User = void 0;
const nexus_1 = require("nexus");
exports.User = nexus_1.objectType({
    name: "User",
    definition(t) {
        t.nonNull.string("id");
        t.nonNull.string("fullName");
        t.nullable.string("profileImage");
        t.nonNull.string("email");
        t.nullable.string("site");
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
        t.nullable.field("getUser", {
            type: "User",
            args: { email: nexus_1.nonNull(nexus_1.stringArg()) },
            resolve(parent, args, context) {
                return context.prisma.user.findUnique({ where: { email: args.email } });
            },
        });
    },
});
exports.UserMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.nullable.field("setUserSite", {
            type: "User",
            args: { email: nexus_1.nonNull(nexus_1.stringArg()), site: nexus_1.nonNull(nexus_1.stringArg()) },
            async resolve(parent, args, context) {
                const existingUser = await context.prisma.user.findFirst({
                    where: { site: args.site },
                });
                if (existingUser) {
                    throw Error("Site name already taken");
                }
                try {
                    return context.prisma.user.update({
                        where: { email: args.email },
                        data: { site: args.site },
                    });
                }
                catch (err) {
                    return { error: err };
                }
            },
        });
    },
});
//# sourceMappingURL=user.js.map