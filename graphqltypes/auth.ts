import { objectType, extendType, nonNull, stringArg } from "nexus";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

export const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.string("token");
    t.field("user", {
      type: "User",
    });
    t.string("error");
  },
});

export const AuthMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("signup", {
      type: "AuthPayload",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        fullName: nonNull(stringArg()),
        profileImage: stringArg(),
        site: nonNull(stringArg()),
      },
      async resolve(parent, args, context) {
        const { email, password, fullName, profileImage, site } = args;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await context.prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            fullName,
            profileImage,
            site,
          },
        });

        const token = jwt.sign(
          { userId: user.id },
          process.env.JWT_SECRET as string
        );

        return {
          token,
          user,
        };
      },
    });

    t.nonNull.field("login", {
      type: "AuthPayload",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(parent, args, context) {
        const user = await context.prisma.user.findUnique({
          where: { email: args.email },
        });
        if (!user) {
          throw new Error("No such user found");
        }

        const valid = await bcrypt.compare(args.password, user.password);
        if (!valid) {
          throw new Error("Invalid password");
        }

        const token = jwt.sign(
          { userId: user.id },
          process.env.JWT_SECRET as string
        );

        return {
          token,
          user,
        };
      },
    });
  },
});
