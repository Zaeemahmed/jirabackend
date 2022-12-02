import { objectType, extendType, nonNull, stringArg, nullable, booleanArg } from "nexus";

export const Issue = objectType({
  name: "Issue",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("status");
    t.nonNull.string("description");
    t.nonNull.string("creatorId");
    t.nullable.string("reporterId");
    t.nullable.string("assigneeId");
    t.nonNull.boolean("isBackLogTask");
    t.nonNull.string("projectId");
    t.nonNull.string("sprintId");
    t.nonNull.field("createdBy", {
      type: "User",
      resolve: (parent, _, ctx) => {
        return ctx.prisma.user.findUnique({
          where: { id: parent.creatorId },
        });
      },
    });
    t.nonNull.field("reporter", {
      type: "User",
      resolve: (parent, _, ctx) => {
        return ctx.prisma.user.findUnique({
          where: { id: parent.reporterId },
        });
      },
    });
    t.nullable.field("assignee", {
      type: "User",
      resolve: (parent, _, ctx) => {
        return ctx.prisma.user.findUnique({
          where: { id: parent.assigneeId },
        });
      },
    });
    t.nonNull.field("sprint", {
      type: "Sprint",
      resolve: (parent, _, ctx) => {
        return ctx.prisma.sprint.findUnique({
          where: { id: parent.sprintId },
        });
      },
    });
  },
});

export const IssueQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("issues", {
      type: "Issue",
      resolve(parent, args, context) {
        return context.prisma.issue.findMany();
      },
    });
  },
});

export const IssueMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("issueCreate", {
      type: "Issue",
      args: {
        description: nonNull(stringArg()),
        status: nonNull(stringArg()),
        assigneeId: nullable(stringArg()),
        reporterId: nullable(stringArg()),
        sprintId: nonNull(stringArg()),
        projectId: nonNull(stringArg()),
        isBackLogTask: nonNull(booleanArg()),
      },
      async resolve(parent, args, context) {
        const {
          description,
          status,
          assigneeId,
          reporterId,
          sprintId,
          projectId,
          isBackLogTask,
        } = args;
        const { userId } = context;

        if (!userId) {
          throw Error("User must be logged in!");
        }

        if (assigneeId) {
          const assignee = await context.prisma.user.findUnique({
            where: { id: assigneeId },
          });

          if (!assignee) {
            throw Error("Assignee doesn't exists !");
          }
        }

        const issue = await context.prisma.issue.create({
          data: {
            description,
            status,
            creatorId: userId,
            assigneeId,
            reporterId,
            projectId,
            sprintId,
            isBackLogTask,
          },
        });

        return {
          ...issue,
        };
      },
    });
  },
});
