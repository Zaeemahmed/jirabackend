import { objectType, extendType, nonNull, stringArg, nullable } from "nexus";

export const Sprint = objectType({
  name: "Sprint",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.int("number");
    t.nonNull.string("status");
    t.nonNull.string("startDate");
    t.nonNull.string("endDate");
    t.nonNull.string("projectId");
    t.nullable.list.field("issues", {
      type: "Issue",
      resolve: (parent, _, ctx) => {
        return ctx.prisma.issue.findMany({
          where: { projectId: parent.projectId, isBackLogTask: false },
        });
      },
    });
    t.nonNull.field("project", {
      type: "Project",
      resolve: (parent, _, ctx) => {
        return ctx.prisma.project.findUnique({
          where: { id: parent.projectId },
        });
      },
    });
  },
});

export const SprintQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("sprints", {
      type: "Sprint",
      args: {
        projectId: nonNull(stringArg()),
      },
      resolve(parent, args, context) {
        return context.prisma.sprint.findMany({
          where: { projectId: args.projectId },
        });
      },
    });
  },
});

export const SprintMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createSprint", {
      type: "Sprint",
      args: {
        startDate: nonNull(stringArg()),
        endDate: nonNull(stringArg()),
        projectId: nullable(stringArg()),
      },
      async resolve(parent, args, context) {
        const { startDate, endDate, projectId } = args;
        const { userId } = context;

        if (!userId) {
          throw Error("User must be logged in!");
        }

        let project = await context.prisma.project.findUnique({
          where: { id: projectId },
        });

        if (!project) {
          throw Error("An error occurred");
        }
        const sprint = await context.prisma.sprint.create({
          data: { startDate, endDate, projectId, status: "active" },
        });

        return {
          ...sprint,
        };
      },
    });
  },
});
