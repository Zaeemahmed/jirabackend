import { ApolloServer } from "apollo-server-express";
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

  server.applyMiddleware({ app, path: "/" });

  await new Promise((resolve) => app.listen(8080, () => {}));
  return { server, app };
}

startApolloServer();
