import { objectType, extendType } from "nexus";

export const User = objectType({
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

export const UserQuery = extendType({
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
