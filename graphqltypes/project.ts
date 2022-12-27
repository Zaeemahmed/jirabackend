import { objectType, extendType, nonNull, stringArg } from "nexus";

export const Project = objectType({
  name: "Project",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("ownerId");
    t.nonNull.string("name");
    t.nonNull.string("key");

    t.nonNull.field("owner", {
      type: "User",
      resolve: (parent, _, ctx) => {
        return ctx.prisma.user.findUnique({
          where: { id: parent.ownerId },
        });
      },
    });
    t.nullable.string("projectLeadId");
    t.nullable.field("projectLead", {
      type: "User",
      resolve: (parent, _, ctx) => {
        if (!parent.projectLeadId) {
          return null;
        }
        return ctx.prisma.user.findUnique({
          where: { id: parent.projectLeadId },
        });
      },
    });
    t.nullable.list.field("sprints", {
      type: "Sprint",
      resolve: (parent, _, ctx) => {
        return ctx.prisma.sprint.findMany({
          where: { projectId: parent.id },
        });
      },
    });
    t.nullable.list.field("backlog", {
      type: "Issue",
      resolve: (parent, _, ctx) => {
        return ctx.prisma.issue.findMany({
          where: { projectId: parent.id, isBackLogTask: true },
        });
      },
    });
  },
});

export const ProjectQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("projects", {
      type: "Project",
      resolve(parent, args, context) {
        const { userId } = context;
        return context.prisma.project.findMany({ where: { ownerId: userId } });
      },
    });
  },
});

export const ProjectMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createProject", {
      type: "Project",
      args: { name: nonNull(stringArg()), key: nonNull(stringArg()) },
      async resolve(parent, args, context) {
        const { userId } = context;
        const { key, name } = args;

        if (!userId) {
          throw Error("User must be logged in!");
        }

        const project = await context.prisma.project.create({
          data: {
            ownerId: userId,
            name,
            key,
            projectLeadId: userId,
          },
        });

        return {
          ...project,
        };
      },
    });
  },
});
