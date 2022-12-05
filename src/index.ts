import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import cors from "cors";

import { schema } from "./schema";
import { context } from "./context";

export const server = new ApolloServer({
  schema,
  context,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  introspection: true,
  csrfPrevention: true,
  cors: { origin: "https://jirabackend.vercel.app/", credentials: true },
});

const port = 4000;

server.listen({ port }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
