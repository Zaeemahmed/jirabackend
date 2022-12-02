"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMutation = exports.AuthPayload = void 0;
const nexus_1 = require("nexus");
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
exports.AuthPayload = nexus_1.objectType({
    name: "AuthPayload",
    definition(t) {
        t.string("token");
        t.field("user", {
            type: "User",
        });
        t.string("error");
    },
});
exports.AuthMutation = nexus_1.extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("signup", {
            type: "AuthPayload",
            args: {
                email: nexus_1.nonNull(nexus_1.stringArg()),
                password: nexus_1.nonNull(nexus_1.stringArg()),
                firstName: nexus_1.nonNull(nexus_1.stringArg()),
                lastName: nexus_1.nonNull(nexus_1.stringArg()),
                profileImage: nexus_1.stringArg(),
            },
            async resolve(parent, args, context) {
                const { email, password, firstName, lastName, profileImage } = args;
                const hashedPassword = await bcrypt.hash(password, 10);
                const user = await context.prisma.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                        firstName,
                        lastName,
                        profileImage,
                    },
                });
                const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
                return {
                    token,
                    user,
                };
            },
        });
        t.nonNull.field("login", {
            type: "AuthPayload",
            args: {
                email: nexus_1.nonNull(nexus_1.stringArg()),
                password: nexus_1.nonNull(nexus_1.stringArg()),
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
                const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
                return {
                    token,
                    user,
                };
            },
        });
    },
});
//# sourceMappingURL=auth.js.map