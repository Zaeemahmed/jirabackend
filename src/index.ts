import { ApolloServer, CorsOptions } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import express from "express";
import cors from "cors";

import { schema } from "./schema";
import { context } from "./context";

const app = express();
app.use(cors());
app.use(express.json());

async function startApolloServer() {
  const app = express();
  const server = new ApolloServer({
    schema,
    context,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    introspection: true,
    csrfPrevention: true,
  });

  await server.start();

  server.applyMiddleware({ app });

  await new Promise((resolve) => app.listen({ port: 4000 }, () => {}));
  return { server, app };
}

startApolloServer();
