import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

// 1
import { schema } from "./schema";
import { context } from "./context";

export const server = new ApolloServer({
  schema,
  context,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

const port = 4000;

server.listen({ port }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
