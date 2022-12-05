import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import express from "express";
import cors from "cors";

import { schema } from "./schema";
import { context } from "./context";

async function startApolloServer() {
  const app = express();

  app.use(cors());
  const server = new ApolloServer({
    schema,
    context,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    introspection: true,
    csrfPrevention: true,
  });

  await server.start();

  server.applyMiddleware({ app, path: "/api/graphql" });

  app.listen(8080, () => {
    console.log("server started");
  });
  return { server, app };
}

startApolloServer();
