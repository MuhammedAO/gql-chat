import express from "express";
import { ApolloServer } from "apollo-server-express";



const port = process.env.PORT || 4018; // set by GAE on Cloud

async function startApolloServer() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const server = new ApolloServer({
    // typeDefs,
    // resolvers,
    context: ({ req: Request, res: Response }) => ({
      req: Request,
      res: Response,
    }),
  });
  await server.start();

  server.applyMiddleware({
    app,
    cors: {
      methods: ["HEAD", "GET", "PUT", "PATCH", "POST", "DELETE"],
      origin: "*",
      optionsSuccessStatus: 200,
    },
    path: "/",
  });

  await new Promise<void>((resolve) =>
    // eslint-disable-next-line
    app.listen({ port }, (): void => resolve())
  );
  console.log(`
  🚀 GraphQLServer ready at http://localhost:${port}${server.graphqlPath}
  `);
  return { server, app };
}

startApolloServer();