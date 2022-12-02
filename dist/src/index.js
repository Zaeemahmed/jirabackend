"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const apollo_server_1 = require("apollo-server");
const apollo_server_core_1 = require("apollo-server-core");
// 1
const schema_1 = require("./schema");
const context_1 = require("./context");
exports.server = new apollo_server_1.ApolloServer({
    schema: schema_1.schema,
    context: context_1.context,
    plugins: [apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground()],
});
const port = 4000;
exports.server.listen({ port }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
//# sourceMappingURL=index.js.map