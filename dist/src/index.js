"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const apollo_server_core_1 = require("apollo-server-core");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const schema_1 = require("./schema");
const context_1 = require("./context");
async function startApolloServer() {
    const app = express_1.default();
    app.use(cors_1.default());
    const server = new apollo_server_express_1.ApolloServer({
        schema: schema_1.schema,
        context: context_1.context,
        plugins: [apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground()],
        introspection: true,
        csrfPrevention: true,
    });
    await server.start();
    server.applyMiddleware({ app, path: "/api/graphql" });
    await new Promise((resolve) => app.listen(8080, () => { }));
    return { server, app };
}
startApolloServer();
//# sourceMappingURL=index.js.map