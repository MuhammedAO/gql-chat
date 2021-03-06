const express =  require("express")
const { ApolloServer } = require("apollo-server-express")
const {sequelize} = require('./models/')
const resolvers = require('./resolvers')
const typeDefs = require('./typeDefs')

const contextMiddleware = require('./util/contextMiddleware')


const port = process.env.PORT || 4007; // set by GAE on Cloud

async function startApolloServer() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: contextMiddleware,
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

  await new Promise((resolve) =>
    // eslint-disable-next-line
    app.listen({ port }, () => resolve())
  );
  console.log(`
  🚀 GraphQLServer ready at http://localhost:${port}${server.graphqlPath}
  `);
  await sequelize.authenticate()
  console.log('Database Connected!')
  return { server, app };
}

startApolloServer();